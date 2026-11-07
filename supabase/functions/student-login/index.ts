import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

async function hashConfirmationToken(token: string) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async request => {
    if (request.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed.' }, 405);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
        return jsonResponse({ error: 'Student login is not configured.' }, 500);
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return jsonResponse({ error: 'Invalid login details.' }, 400);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    if (body.action === 'confirmation-status') {
        const userId = typeof body.userId === 'string' ? body.userId : '';
        const token = typeof body.token === 'string' ? body.token : '';
        if (!/^[0-9a-f-]{36}$/i.test(userId) || !/^[a-f0-9]{64}$/.test(token)) {
            return jsonResponse({ error: 'Confirmation check unavailable.' }, 400);
        }

        const { data, error } = await serviceClient.auth.admin.getUserById(userId);
        const user = data?.user;
        const tokenHash = await hashConfirmationToken(token);
        if (error || !user || user.user_metadata?.confirmation_wait_hash !== tokenHash) {
            return jsonResponse({ error: 'Confirmation check unavailable.' }, 404);
        }

        if (!user.email_confirmed_at) return jsonResponse({ confirmed: false });

        const { confirmation_wait_hash: _confirmationWaitHash, ...userMetadata } = user.user_metadata || {};
        await serviceClient.auth.admin.updateUserById(user.id, { user_metadata: userMetadata });
        return jsonResponse({ confirmed: true });
    }

    const identifier = typeof body.identifier === 'string' ? body.identifier.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!identifier || !password || password.length > 256 || identifier.length > 256) {
        return jsonResponse({ error: 'Invalid login details.' }, 400);
    }

    let accountEmail = '';

    if (identifier.includes('@')) {
        const { data } = await serviceClient
            .from('student_profiles')
            .select('email')
            .eq('email', identifier.toLowerCase())
            .maybeSingle();
        accountEmail = data?.email || '';
    } else {
        const { data: registerMatch } = await serviceClient
            .from('student_profiles')
            .select('email')
            .eq('register_no', identifier.toUpperCase())
            .maybeSingle();
        accountEmail = registerMatch?.email || '';
    }

    const authClient = createClient(supabaseUrl, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
    const { data, error } = await authClient.auth.signInWithPassword({
        email: accountEmail || 'invalid-student-account@invalid.example',
        password
    });

    if (
        error
        || !data.session
        || !data.user?.email_confirmed_at
    ) {
        await authClient.auth.signOut({ scope: 'local' });
        return jsonResponse({ error: 'Account details or password are incorrect.' }, 401);
    }

    return jsonResponse({
        session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
        }
    });
});
