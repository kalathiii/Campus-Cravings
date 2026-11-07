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

    let identifier = '';
    let password = '';
    try {
        const body = await request.json();
        identifier = typeof body.identifier === 'string' ? body.identifier.trim() : '';
        password = typeof body.password === 'string' ? body.password : '';
    } catch {
        return jsonResponse({ error: 'Invalid login details.' }, 400);
    }

    if (!identifier || !password || password.length > 256 || identifier.length > 256) {
        return jsonResponse({ error: 'Invalid login details.' }, 400);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
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
