const SUPABASE_URL = 'https://ihhxganuvaujndpznlym.supabase.co';
        const SUPABASE_PUBLIC_KEY = 'sb_publishable_0zOWGBcqJf4x2wzzPjrNqg_wde80mWj';
        const ADMIN_EMAILS = Object.freeze({
            admin1: 'admin1@campuscravings.invalid',
            admin2: 'admin2@campuscravings.invalid',
            admin3: 'admin3@campuscravings.invalid'
        });
        const supabaseClient = window.supabase && !SUPABASE_URL.includes('YOUR_PROJECT_ID') && !SUPABASE_PUBLIC_KEY.includes('YOUR_SUPABASE_')
            ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY)
            : null;

        // Food Menu Dataset
        const categoryOptions = [
            'All',
            'Rice Meals',
            'Hot Beverages',
            'Juices',
            'Soft Drinks',
            'Snacks'
        ];

        let currentCategory = 'All';

        const defaultFoodMenuItems = [
            {
                id: 1,
                name: "Sambar Saadham",
                price: 40,
                category: "South Indian Classic",
                description: "Traditional hot authentic ghee rice cooked with lentils, mixed vegetables, and aromatic spices.",
                image: "https://www.istockphoto.com/photo/sambar-rice-south-indian-food-gm1255857672-367517059?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_bottom&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fsambar-sadham&utm_term=sambar+sadham%3A%3A%3A%3A82f27ec6-4a2b-4b1d-a8ed-2e4ec5fcea67",
                badge: "Bestseller"
            },
            {
                id: 2,
                name: "Veg Biriyani",
                price: 40,
                category: "Rice Specialties",
                description: "Fragrant basmati rice layered with fresh garden vegetables, mint, and signature spices.",
                image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
                badge: "Campus Favorite"
            },
            {
                id: 3,
                name: "Tomato Rice",
                price: 40,
                category: "Quick Meals",
                description: "Tangy and flavorful rice tempered with ripe tomatoes, curry leaves, and crunchy mustard seeds.",
                image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80",
                badge: "Hot & Tangy"
            },
            {
                id: 4,
                name: "Veg Rice",
                price: 40,
                category: "Quick Meals",
                description: "Nutritious mixed vegetable pulav rice tossed with mild herbs and crunchy capsicum.",
                image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80",
                badge: "Healthy Choice"
            },
            {
                id: 5,
                name: "Veg Noodles",
                price: 40,
                category: "Chinese Express",
                description: "Wok-tossed Indo-Chinese noodles loaded with crisp carrots, cabbage, and savory sauces.",
                image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
                badge: "Chef's Special"
            },
            {
                id: 6,
                name: "Tea",
                price: 10,
                category: "Hot Beverages",
                description: "Refreshing hot tea served fresh for a quick energy boost between classes.",
                image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
                badge: "Quick Sip"
            },
            {
                id: 7,
                name: "Coffee",
                price: 20,
                category: "Hot Beverages",
                description: "Aromatic filter coffee prepared fresh to keep you active during long study hours.",
                image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=600&q=80",
                badge: "Comfort Brew"
            },
            {
                id: 8,
                name: "String",
                price: 30,
                category: "Juices",
                description: "Refreshing fruit juice packed with a crisp and vibrant taste.",
                image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80",
                badge: "Fresh"
            },
            {
                id: 9,
                name: "Miranda",
                price: 30,
                category: "Juices",
                description: "Cool and flavorful soft drink for a satisfying break-time refreshment.",
                image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80",
                badge: "Chilled"
            },
            {
                id: 10,
                name: "7UP",
                price: 30,
                category: "Soft Drinks",
                description: "Classic lemon-lime soda with a crisp and bubbly finish.",
                image: "https://images.unsplash.com/photo-1622483767028-3f66f2b7420a?auto=format&fit=crop&w=600&q=80",
                badge: "Fizz"
            },
            {
                id: 11,
                name: "Pepsi",
                price: 30,
                category: "Soft Drinks",
                description: "A popular chilled cola drink that pairs perfectly with quick bites.",
                image: "https://images.unsplash.com/photo-1629203841116-3d4cf136d8c6?auto=format&fit=crop&w=600&q=80",
                badge: "Classic"
            },
            {
                id: 12,
                name: "Coca Cola",
                price: 30,
                category: "Soft Drinks",
                description: "Carbonated soft drink with the signature cola taste students love.",
                image: "https://images.unsplash.com/photo-1622483767028-3f66f2b7420a?auto=format&fit=crop&w=600&q=80",
                badge: "Popular"
            },
            {
                id: 13,
                name: "Mazza",
                price: 30,
                category: "Juices",
                description: "Fruit-flavored juice delight with a sweet and vibrant taste.",
                image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80",
                badge: "Sweet"
            },
            {
                id: 14,
                name: "Slice",
                price: 30,
                category: "Juices",
                description: "Orange-flavored refreshment for a zesty and cooling break-time treat.",
                image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
                badge: "Citrus"
            },
            {
                id: 15,
                name: "Veg Roll",
                price: 30,
                category: "Snacks",
                description: "Fresh vegetables wrapped in soft bread with a savory flavor and light seasoning.",
                image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80",
                badge: "Hot Bite"
            },
            {
                id: 16,
                name: "Veg Puff",
                price: 20,
                category: "Snacks",
                description: "Flaky puff pastry stuffed with delicious vegetable filling and spices.",
                image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
                badge: "Savory"
            },
            {
                id: 17,
                name: "Kalan Puff",
                price: 30,
                category: "Snacks",
                description: "Classic puff with a rich and satisfying filling that delivers hearty flavor.",
                image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80",
                badge: "Classic Treat"
            },
            {
                id: 18,
                name: "Egg Puff",
                price: 30,
                category: "Snacks",
                description: "Flaky pastry with a savory egg stuffing that is perfect on the go.",
                image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=600&q=80",
                badge: "Protein Pick"
            }
        ];

        const MENU_STORAGE_KEY = 'campusCravingsMenu';
        let menuRealtimeChannel = null;
        let orderRealtimeChannel = null;

        function loadMenuItems() {
            try {
                const storedMenu = localStorage.getItem(MENU_STORAGE_KEY) || getCookie(MENU_STORAGE_KEY);
                if (!storedMenu) return defaultFoodMenuItems.map(item => ({ ...item }));
                const parsed = JSON.parse(storedMenu);
                return Array.isArray(parsed) && parsed.length ? parsed : defaultFoodMenuItems.map(item => ({ ...item }));
            } catch (error) {
                return defaultFoodMenuItems.map(item => ({ ...item }));
            }
        }

        function syncMenuAcrossTabs(menuList) {
            try {
                if (window.BroadcastChannel) {
                    const channel = new BroadcastChannel('campusCravingsMenuSync');
                    channel.postMessage({ key: MENU_STORAGE_KEY, menu: menuList });
                    setTimeout(() => channel.close(), 100);
                }
            } catch (error) {
                // BroadcastChannel is optional and may not be available in all browsers.
            }
        }

        function cacheMenuItems(menuList) {
            const menuText = JSON.stringify(menuList);
            localStorage.setItem(MENU_STORAGE_KEY, menuText);
            setCookie(MENU_STORAGE_KEY, menuText, 365);
            syncMenuAcrossTabs(menuList);
        }

        async function loadMenuFromRemote() {
            if (!supabaseClient) return;

            const { data, error } = await supabaseClient
                .from('canteen_menu')
                .select('items')
                .eq('id', true)
                .maybeSingle();

            if (error) {
                console.warn('Shared menu load failed:', error);
                return;
            }

            if (data && Array.isArray(data.items)) {
                foodMenuItems = data.items;
                cacheMenuItems(foodMenuItems);
            }
        }

        async function saveMenuItems(menuList) {
            if (!supabaseClient || !adminUser) {
                throw new Error('Shared menu storage is not configured or you are not signed in as an admin.');
            }

            const { data: userData, error: userError } = await supabaseClient.auth.getUser();
            if (userError || !userData.user) {
                throw new Error('Your admin session has expired. Sign in again to save menu changes.');
            }

            const { error } = await supabaseClient
                .from('canteen_menu')
                .upsert({
                    id: true,
                    items: menuList,
                    updated_at: new Date().toISOString(),
                    updated_by: userData.user.id
                }, { onConflict: 'id' });

            if (error) throw error;

            foodMenuItems = menuList;
            cacheMenuItems(foodMenuItems);
        }

        function startMenuRealtimeSync() {
            if (!supabaseClient || menuRealtimeChannel) return;

            menuRealtimeChannel = supabaseClient
                .channel('campus-cravings-menu')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'canteen_menu'
                }, payload => {
                    if (!payload.new || !Array.isArray(payload.new.items)) return;

                    foodMenuItems = payload.new.items;
                    cacheMenuItems(foodMenuItems);
                    renderMenu();
                    renderMenuEditor();
                    renderAdminOrders();
                })
                .subscribe();
        }

        function mapSharedOrder(row) {
            return {
                id: row.id,
                token: row.token,
                student: row.student,
                items: row.items,
                totalAmount: Number(row.total_amount),
                pickupSlot: row.pickup_slot,
                paymentMode: row.payment_mode,
                timestamp: row.placed_label,
                statusIndex: Number(row.status_index),
                claimedBy: row.claimed_by,
                claimedByName: row.claimed_by_name,
                claimedAt: row.claimed_at
            };
        }

        async function loadSharedOrders() {
            if (!supabaseClient || !adminUser) return;

            const { data, error } = await supabaseClient
                .from('canteen_orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Shared order load failed:', error);
                showToast('Order storage is unavailable. Run the updated setup.sql in Supabase.');
                return;
            }

            const orders = (data || []).map(mapSharedOrder);
            activeOrders = orders.filter(order => order.statusIndex < 4);
            orderHistory = orders.filter(order => order.statusIndex === 4);
            renderActiveOrders();
            renderAdminOrders();
            renderOrderHistory();
        }

        function applySharedOrder(row) {
            const order = mapSharedOrder(row);
            if (order.statusIndex === 4) {
                activeOrders = activeOrders.filter(existing => existing.id !== order.id);
                if (!orderHistory.some(existing => existing.id === order.id)) {
                    orderHistory.unshift(order);
                }
            } else {
                const existingIndex = activeOrders.findIndex(existing => existing.id === order.id);
                if (existingIndex === -1) {
                    activeOrders.unshift(order);
                } else {
                    activeOrders[existingIndex] = order;
                }
            }

            renderActiveOrders();
            renderAdminOrders();
            renderOrderHistory();
        }

        function startOrderRealtimeSync() {
            if (!supabaseClient || !adminUser || orderRealtimeChannel) return;

            orderRealtimeChannel = supabaseClient
                .channel('campus-cravings-orders')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'canteen_orders'
                }, payload => {
                    if (payload.eventType === 'DELETE' && payload.old?.id) {
                        activeOrders = activeOrders.filter(order => order.id !== payload.old.id);
                        renderActiveOrders();
                        renderAdminOrders();
                        return;
                    }

                    if (payload.new?.id) applySharedOrder(payload.new);
                })
                .subscribe(status => {
                    if (status === 'SUBSCRIBED') loadSharedOrders();
                });
        }

        function stopOrderRealtimeSync() {
            if (!supabaseClient || !orderRealtimeChannel) return;
            supabaseClient.removeChannel(orderRealtimeChannel);
            orderRealtimeChannel = null;
        }

        let foodMenuItems = loadMenuItems();

        if (window.BroadcastChannel) {
            const menuChannel = new BroadcastChannel('campusCravingsMenuSync');
            menuChannel.onmessage = (event) => {
                if (event.data && event.data.key === MENU_STORAGE_KEY) {
                    foodMenuItems = Array.isArray(event.data.menu) && event.data.menu.length ? event.data.menu : defaultFoodMenuItems.map(item => ({ ...item }));
                    renderMenu();
                    renderMenuEditor();
                    renderAdminOrders();
                }
            };
        }

        window.addEventListener('storage', (event) => {
            if (event.key === MENU_STORAGE_KEY && event.newValue) {
                try {
                    const parsed = JSON.parse(event.newValue);
                    if (Array.isArray(parsed) && parsed.length) {
                        foodMenuItems = parsed;
                        renderMenu();
                        renderMenuEditor();
                        renderAdminOrders();
                    }
                } catch (error) {
                    console.warn('Menu storage sync failed:', error);
                }
            }
        });

        // Global State Variables
        let currentUser = null;
        let adminUser = null;
        let adminPasswordChangeRequired = false;

        let cart = [];
        let activeOrders = [];
        let orderHistory = [];

        const promoSlides = Array.from(document.querySelectorAll('.promo-slide'));
        const promoDotsContainer = document.getElementById('promoDots');
        let promoIndex = 0;
        let promoTimer = null;

        function initPromoSlider() {
            if (!promoSlides.length || !promoDotsContainer) return;

            promoSlides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = `promo-dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Show offer ${index + 1}`);
                dot.addEventListener('click', () => {
                    promoIndex = index;
                    updatePromoSlider();
                    restartPromoSlider();
                });
                promoDotsContainer.appendChild(dot);
            });

            updatePromoSlider();
            restartPromoSlider();
        }

        function restartPromoSlider() {
            if (promoTimer) clearInterval(promoTimer);
            promoTimer = setInterval(() => {
                promoIndex = (promoIndex + 1) % promoSlides.length;
                updatePromoSlider();
            }, 3500);
        }

        function updatePromoSlider() {
            promoSlides.forEach((slide, index) => {
                slide.classList.toggle('active', index === promoIndex);
            });

            const dots = promoDotsContainer.querySelectorAll('.promo-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === promoIndex);
            });
        }

        function setCookie(name, value, days = 30) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
        }

        function getCookie(name) {
            const cookieString = document.cookie;
            if (!cookieString) return '';
            const match = cookieString.split('; ').find(entry => entry.startsWith(`${name}=`));
            return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : '';
        }

        function saveSessionState() {
            const session = {
                currentUser
            };
            const sessionText = JSON.stringify(session);
            localStorage.setItem('campusCravingsSession', sessionText);
            setCookie('campusCravingsSession', sessionText, 30);
        }

        function clearSessionState() {
            localStorage.removeItem('campusCravingsSession');
            document.cookie = 'campusCravingsSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }

        function loadPersistedSession() {
            const rawSession = localStorage.getItem('campusCravingsSession') || getCookie('campusCravingsSession');
            if (!rawSession) return;

            try {
                const session = JSON.parse(rawSession);
                currentUser = session.currentUser || null;
                adminUser = null;
            } catch (error) {
                currentUser = null;
                adminUser = null;
                clearSessionState();
            }
        }

        async function restoreAdminSession() {
            if (!supabaseClient) return;

            const { data, error } = await supabaseClient.auth.getSession();
            if (error || !data.session) return;

            const username = Object.keys(ADMIN_EMAILS).find(
                adminName => ADMIN_EMAILS[adminName] === data.session.user.email
            );
            if (!username) {
                await supabaseClient.auth.signOut();
                return;
            }

            adminUser = { name: username, username, id: data.session.user.id };
            adminPasswordChangeRequired = data.session.user.user_metadata?.password_changed !== true;
        }

        // INITIALIZATION
        window.addEventListener('DOMContentLoaded', async () => {
            loadPersistedSession();
            await restoreAdminSession();
            await loadMenuFromRemote();
            await loadSharedOrders();
            initPromoSlider();
            renderUserProfile();
            renderAdminAccess();
            renderStudentAppView();
            renderMenu();
            renderCart();
            renderActiveOrders();
            renderAdminOrders();
            renderMenuEditor();
            renderOrderHistory();
            startMenuRealtimeSync();
            startOrderRealtimeSync();
            if (adminUser && adminPasswordChangeRequired) {
                openAdminPasswordModal(true);
            }
        });

        // USER PROFILE & LOGIN MANAGEMENT
        function renderUserProfile() {
            const container = document.getElementById('userProfileSection');
            if (currentUser) {
                const avatarText = (currentUser.name || 'S').charAt(0).toUpperCase();
                const avatarUrl = currentUser.photo || '';
                container.innerHTML = `
                    <div class="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 p-1.5 pr-3 rounded-xl cursor-pointer transition" onclick="openProfileModal()">
                        <div class="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20">
                            ${avatarUrl ? `<img src="${avatarUrl}" alt="Profile" class="w-full h-full object-cover" />` : avatarText}
                        </div>
                        <div class="text-left hidden md:block">
                            <p class="text-xs font-bold text-white leading-tight">${currentUser.name}</p>
                            <p class="text-[10px] font-semibold text-orange-300 tracking-wider uppercase">${currentUser.registerId}</p>
                        </div>
                        <i class="fa-solid fa-chevron-down text-xs text-slate-400 ml-1 hidden md:inline"></i>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <button onclick="openAuthChoiceModal()" class="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow-sm">
                        <i class="fa-solid fa-right-to-bracket mr-1"></i> Student Login
                    </button>
                `;
            }
        }

        function renderAdminAccess() {
            const container = document.getElementById('adminAccessSection');
            if (adminUser) {
                container.innerHTML = `
                    <div class="flex items-center gap-2 bg-emerald-100 border border-emerald-300 text-emerald-800 px-2.5 py-1.5 rounded-xl shadow-sm">
                        <div class="bg-emerald-600 text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px]">A</div>
                        <span class="text-xs font-bold hidden sm:inline">${adminUser.name}</span>
                        <button onclick="logoutAdmin()" class="text-[10px] font-bold underline">Logout</button>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <button onclick="openAuthChoiceModal()" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow-sm">
                        <i class="fa-solid fa-user-shield mr-1"></i> Admin Access
                    </button>
                `;
            }
        }

        function renderStudentAppView() {
            const studentShell = document.getElementById('studentAppShell');
            const adminDashboard = document.getElementById('adminDashboard');

            if (adminUser) {
                studentShell.classList.add('hidden');
                adminDashboard.classList.remove('hidden');
                closeAuthChoiceModal();
                return;
            }

            if (currentUser) {
                studentShell.classList.remove('hidden');
                adminDashboard.classList.add('hidden');
                closeAuthChoiceModal();
                return;
            }

            studentShell.classList.add('hidden');
            adminDashboard.classList.add('hidden');
            openAuthChoiceModal();
        }

        function openAuthChoiceModal() {
            const modal = document.getElementById('authChoiceModal');
            if (modal) modal.classList.remove('hidden');
        }

        function closeAuthChoiceModal() {
            const modal = document.getElementById('authChoiceModal');
            if (modal) modal.classList.add('hidden');
        }

        function openLoginModal() {
            document.getElementById('loginModal').classList.remove('hidden');
            document.getElementById('loginRegisterId').value = currentUser ? currentUser.registerId : '';
            document.getElementById('loginStudentName').value = currentUser ? currentUser.name : '';
            const deptSelect = document.getElementById('loginDept');
            const deptExists = Array.from(deptSelect.options).some(option => option.value === (currentUser ? currentUser.dept : ''));
            if (deptExists) {
                deptSelect.value = currentUser.dept;
            }
        }

        function closeLoginModal() {
            document.getElementById('loginModal').classList.add('hidden');
        }

        function openAdminLoginModal() {
            document.getElementById('adminLoginModal').classList.remove('hidden');
        }

        function closeAdminLoginModal() {
            document.getElementById('adminLoginModal').classList.add('hidden');
        }

        function openProfileModal() {
            if (!currentUser) return;
            const nameField = document.getElementById('profileName');
            const regField = document.getElementById('profileRegisterId');
            const deptField = document.getElementById('profileDept');
            const avatarHolder = document.getElementById('profileAvatarLarge');

            nameField.value = currentUser.name || '';
            regField.value = currentUser.registerId || '';
            deptField.value = currentUser.dept || '';

            const avatarText = (currentUser.name || 'S').charAt(0).toUpperCase();
            if (currentUser.photo) {
                avatarHolder.innerHTML = `<img src="${currentUser.photo}" alt="Profile" class="w-full h-full object-cover rounded-full" />`;
            } else {
                avatarHolder.textContent = avatarText;
                avatarHolder.innerHTML = avatarText;
            }

            document.getElementById('profileModal').classList.remove('hidden');
        }

        function closeProfileModal() {
            document.getElementById('profileModal').classList.add('hidden');
        }

        function uploadProfileImage(event) {
            const file = event.target.files && event.target.files[0];
            if (!file || !currentUser) return;

            const reader = new FileReader();
            reader.onload = () => {
                currentUser.photo = reader.result;
                saveSessionState();
                renderUserProfile();
                openProfileModal();
                showToast('Profile photo updated.');
            };
            reader.readAsDataURL(file);
        }

        function saveProfileChanges() {
            if (!currentUser) return;

            const name = document.getElementById('profileName').value.trim();
            const registerId = document.getElementById('profileRegisterId').value.trim().toUpperCase();
            const dept = document.getElementById('profileDept').value.trim();

            currentUser.name = name || currentUser.name;
            currentUser.registerId = registerId || currentUser.registerId;
            currentUser.dept = dept || currentUser.dept;

            saveSessionState();
            renderUserProfile();
            closeProfileModal();
            showToast('Profile updated successfully.');
        }

        async function handleLogin(e) {
            e.preventDefault();
            const regId = document.getElementById('loginRegisterId').value.trim().toUpperCase();
            const name = document.getElementById('loginStudentName').value.trim();
            const dept = document.getElementById('loginDept').value;

            if (adminUser && supabaseClient) {
                stopOrderRealtimeSync();
                await supabaseClient.auth.signOut();
            }
            adminUser = null;
            currentUser = {
                registerId: regId || "SONA202601",
                name: name || "Student",
                dept: dept,
                photo: currentUser && currentUser.photo ? currentUser.photo : ''
            };

            saveSessionState();
            renderUserProfile();
            renderAdminAccess();
            renderStudentAppView();
            closeLoginModal();
            showToast(`Logged in successfully as ${currentUser.registerId}`);
        }

        async function handleAdminLogin(e) {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value.trim().toLowerCase();
            const password = document.getElementById('adminPassword').value;
            const email = ADMIN_EMAILS[username];

            if (!email) {
                showToast('Use admin1, admin2, or admin3 to sign in.');
                return;
            }

            if (!supabaseClient) {
                showToast('Admin sign-in is not configured yet. See the Supabase setup in README.');
                return;
            }

            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error || !data.user) {
                showToast('Admin login failed. Check the username and password.');
                return;
            }

            currentUser = null;
            adminUser = { name: username, username, id: data.user.id };
            adminPasswordChangeRequired = data.user.user_metadata?.password_changed !== true;
            await loadSharedOrders();
            startOrderRealtimeSync();
            saveSessionState();
            renderAdminAccess();
            renderUserProfile();
            renderStudentAppView();
            closeAdminLoginModal();
            renderAdminOrders();
            renderMenuEditor();
            renderActiveOrders();
            document.getElementById('adminPassword').value = '';
            if (adminPasswordChangeRequired) {
                openAdminPasswordModal(true);
            } else {
                showToast(`Signed in as ${username}.`);
            }
        }

        function openAdminPasswordModal(required) {
            if (!adminUser) return;
            adminPasswordChangeRequired = required || adminPasswordChangeRequired;
            document.getElementById('adminPasswordPrompt').textContent = adminPasswordChangeRequired
                ? 'Change the temporary password to continue using the admin account.'
                : 'Set a new password for your account.';
            document.getElementById('adminPasswordCloseButton').classList.toggle('hidden', adminPasswordChangeRequired);
            document.getElementById('adminPasswordModal').classList.remove('hidden');
        }

        function closeAdminPasswordModal() {
            if (adminPasswordChangeRequired) {
                showToast('Change your temporary password before continuing.');
                return;
            }
            document.getElementById('adminPasswordModal').classList.add('hidden');
        }

        async function handleAdminPasswordChange(event) {
            event.preventDefault();
            if (!supabaseClient || !adminUser) return;

            const newPassword = document.getElementById('newAdminPassword').value;
            const confirmPassword = document.getElementById('confirmAdminPassword').value;
            if (newPassword !== confirmPassword) {
                showToast('The new passwords do not match.');
                return;
            }

            const button = document.getElementById('saveAdminPasswordButton');
            button.disabled = true;
            try {
                const { data: userData } = await supabaseClient.auth.getUser();
                const { error } = await supabaseClient.auth.updateUser({
                    password: newPassword,
                    data: { ...(userData.user?.user_metadata || {}), password_changed: true }
                });
                if (error) throw error;

                adminPasswordChangeRequired = false;
                document.getElementById('newAdminPassword').value = '';
                document.getElementById('confirmAdminPassword').value = '';
                document.getElementById('adminPasswordModal').classList.add('hidden');
                showToast(`Password updated for ${adminUser.username}.`);
            } catch (error) {
                showToast(error.message || 'Could not update the password.');
            } finally {
                button.disabled = false;
            }
        }

        function logoutUser() {
            currentUser = null;
            clearSessionState();
            renderUserProfile();
            renderStudentAppView();
            closeProfileModal();
            showToast('Student logged out successfully.');
        }

        async function logoutAdmin() {
            stopOrderRealtimeSync();
            if (supabaseClient) await supabaseClient.auth.signOut();
            adminUser = null;
            adminPasswordChangeRequired = false;
            clearSessionState();
            renderAdminAccess();
            renderUserProfile();
            renderStudentAppView();
            renderActiveOrders();
            document.getElementById('adminPasswordModal').classList.add('hidden');
            showToast('Admin logged out.');
        }

        // TAB SWITCHING LOGIC
        function switchTab(tabName) {
            document.querySelectorAll('.tab-view').forEach(view => view.classList.add('hidden'));
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('border-orange-500', 'text-orange-600');
                btn.classList.add('border-transparent', 'text-slate-500');
            });

            document.getElementById(`view-${tabName}`).classList.remove('hidden');
            const activeBtn = document.getElementById(`tab-${tabName}`);
            activeBtn.classList.add('border-orange-500', 'text-orange-600');
            activeBtn.classList.remove('border-transparent', 'text-slate-500');
        }

        // MENU RENDER & CART INTERACTIONS
        function renderMenu() {
            const foodGrid = document.getElementById('foodGrid');
            const filterContainer = document.getElementById('categoryFilters');

            filterContainer.innerHTML = categoryOptions.map(category => `
                <button class="category-pill ${currentCategory === category ? 'active' : 'border border-slate-700 text-slate-300'} px-3 py-2 rounded-xl text-xs font-bold transition duration-200 whitespace-nowrap" onclick="setCategory('${category}')">
                    ${category}
                </button>
            `).join('');

            const visibleItems = currentCategory === 'All'
                ? foodMenuItems
                : foodMenuItems.filter(item => item.category === currentCategory || (currentCategory === 'Rice Meals' && ['South Indian Classic', 'Rice Specialties', 'Quick Meals'].includes(item.category)));

            foodGrid.innerHTML = visibleItems.map((item, index) => {
                const cartItem = cart.find(i => i.id === item.id);
                const quantity = cartItem ? cartItem.quantity : 0;

                return `
                    <div class="menu-card bg-slate-900/80 border border-slate-700 rounded-2xl shadow-lg hover:shadow-orange-500/10 transition duration-200 overflow-hidden flex flex-col justify-between group" style="animation-delay: ${index * 80}ms;">
                        <div>
                            <div class="relative h-48 w-full overflow-hidden bg-slate-800">
                                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.src='https://placehold.co/600x400/f97316/ffffff?text=${encodeURIComponent(item.name)}'">
                                <span class="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-slate-700">
                                    ${item.badge}
                                </span>
                                <div class="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md text-orange-300 font-extrabold text-base px-3 py-1 rounded-xl border border-orange-500/20">
                                    ₹${item.price}
                                </div>
                            </div>

                            <div class="p-5 space-y-2">
                                <div class="text-[11px] font-bold uppercase text-orange-300 tracking-wider">${item.category}</div>
                                <h4 class="text-lg font-bold text-white">${item.name}</h4>
                                <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">${item.description}</p>
                            </div>
                        </div>

                        <div class="p-5 pt-0">
                            ${quantity === 0 ? `
                                <button onclick="addToCart(${item.id})" class="w-full bg-slate-800 hover:bg-orange-500 hover:text-slate-950 text-slate-100 font-bold py-2.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 text-sm border border-slate-700 hover:border-orange-400">
                                    <i class="fa-solid fa-plus"></i> Add to Order
                                </button>
                            ` : `
                                <div class="flex items-center justify-between bg-orange-500/10 border border-orange-500/20 rounded-xl p-1">
                                    <button onclick="updateQuantity(${item.id}, -1)" class="w-9 h-9 bg-slate-950 text-orange-300 hover:bg-orange-500 hover:text-slate-950 rounded-lg flex items-center justify-center font-bold shadow-sm transition">
                                        <i class="fa-solid fa-minus text-xs"></i>
                                    </button>
                                    <span class="font-extrabold text-orange-200 text-sm px-2">${quantity} in Tray</span>
                                    <button onclick="updateQuantity(${item.id}, 1)" class="w-9 h-9 bg-slate-950 text-orange-300 hover:bg-orange-500 hover:text-slate-950 rounded-lg flex items-center justify-center font-bold shadow-sm transition">
                                        <i class="fa-solid fa-plus text-xs"></i>
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>
                `;
            }).join('');

            const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const summaryItems = document.getElementById('summaryItems');
            const summarySubtotal = document.getElementById('summarySubtotal');
            if (summaryItems) summaryItems.textContent = itemsCount;
            if (summarySubtotal) summarySubtotal.textContent = `₹${subtotal}`;
        }

        function setCategory(category) {
            currentCategory = category;
            renderMenu();
        }

        function addToCart(itemId) {
            const item = foodMenuItems.find(i => i.id === itemId);
            if (!item) return;

            const existing = cart.find(i => i.id === itemId);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ ...item, quantity: 1 });
            }

            renderMenu();
            renderCart();
            showToast(`Added ${item.name} to order tray`);
        }

        function updateQuantity(itemId, change) {
            const index = cart.findIndex(i => i.id === itemId);
            if (index !== -1) {
                cart[index].quantity += change;
                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }
            }
            renderMenu();
            renderCart();
        }

        function renderCart() {
            const container = document.getElementById('cartItemsContainer');
            const totalBadge = document.getElementById('cartBadgeCount');
            const cartSubtotalEl = document.getElementById('cartSubtotal');
            const cartTotalEl = document.getElementById('cartTotalAmount');

            const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            totalBadge.innerText = totalQuantity;

            if (cart.length === 0) {
                container.innerHTML = `
                    <div class="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3 my-auto">
                        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                            <i class="fa-solid fa-basket-shopping text-3xl"></i>
                        </div>
                        <p class="font-semibold text-slate-600 text-sm">Your order tray is empty</p>
                        <p class="text-xs text-slate-400">Choose meal items priced at ₹40 from the canteen menu.</p>
                    </div>
                `;
                document.getElementById('cartFooter').classList.add('opacity-50', 'pointer-events-none');
            } else {
                document.getElementById('cartFooter').classList.remove('opacity-50', 'pointer-events-none');
                container.innerHTML = cart.map(item => `
                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <img src="${item.image}" class="w-12 h-12 rounded-lg object-cover">
                            <div>
                                <h5 class="text-sm font-bold text-slate-900">${item.name}</h5>
                                <p class="text-xs text-slate-500">₹${item.price} × ${item.quantity}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="flex items-center bg-white border border-slate-200 rounded-lg">
                                <button onclick="updateQuantity(${item.id}, -1)" class="w-7 h-7 text-slate-600 hover:bg-slate-100 rounded-l-lg flex items-center justify-center font-bold text-xs">
                                    <i class="fa-solid fa-minus"></i>
                                </button>
                                <span class="px-2 font-bold text-xs text-slate-800">${item.quantity}</span>
                                <button onclick="updateQuantity(${item.id}, 1)" class="w-7 h-7 text-slate-600 hover:bg-slate-100 rounded-r-lg flex items-center justify-center font-bold text-xs">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <span class="text-sm font-bold text-slate-900 w-12 text-right">₹${item.price * item.quantity}</span>
                        </div>
                    </div>
                `).join('');
            }

            cartSubtotalEl.innerText = `₹${totalAmount}`;
            cartTotalEl.innerText = `₹${totalAmount}`;
        }

        function toggleCartDrawer() {
            const drawer = document.getElementById('cartDrawer');
            drawer.classList.toggle('hidden');
        }

        function formatPickupTime(value) {
            if (!value) return 'Flexible Pickup Time';

            const [hourStr, minute] = value.split(':');
            const hour = Number(hourStr);
            const formatted = new Date();
            formatted.setHours(hour, Number(minute), 0, 0);

            const timeText = new Intl.DateTimeFormat('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).format(formatted);

            return `${timeText} IST`;
        }

        // ORDER PLACEMENT & LIFECYCLE MANAGEMENT
        async function placeOrder() {
            if (cart.length === 0) return;
            if (!currentUser) {
                showToast('Log in as a student before placing an order.');
                return;
            }
            if (!supabaseClient) {
                showToast('Shared order storage is not configured.');
                return;
            }

            const selectedTime = document.getElementById('pickupSlot').value;
            const slot = formatPickupTime(selectedTime);
            const payMode = document.querySelector('input[name="payMode"]:checked').value;
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Random Token Number generation (e.g. SONA-T78)
            const tokenNum = `S-${Math.floor(100 + Math.random() * 900)}`;

            const placedLabel = new Intl.DateTimeFormat('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).format(new Date()) + ' IST';
            const orderStudent = {
                name: currentUser.name,
                registerId: currentUser.registerId,
                dept: currentUser.dept
            };
            const orderItems = cart.map(item => ({
                id: item.id,
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity)
            }));
            const { data: orderId, error } = await supabaseClient.rpc('place_canteen_order', {
                p_order_data: {
                    token: tokenNum,
                    student: orderStudent,
                    items: orderItems,
                    total_amount: total,
                    pickup_slot: slot,
                    payment_mode: payMode,
                    placed_label: placedLabel
                }
            });

            if (error || !orderId) {
                console.error('Order submission failed:', error);
                showToast('Could not place your order. Please try again.');
                return;
            }

            const newOrder = {
                id: orderId,
                token: tokenNum,
                student: orderStudent,
                items: orderItems,
                totalAmount: total,
                pickupSlot: slot,
                paymentMode: payMode,
                timestamp: placedLabel,
                statusIndex: 0,
                claimedBy: null,
                claimedByName: null
            };

            activeOrders.unshift(newOrder);

            // Reset cart
            cart = [];
            renderCart();
            renderMenu();
            toggleCartDrawer();

            // Render live orders & switch tab
            renderActiveOrders();
            switchTab('active-orders');

            showToast(`Order #${newOrder.token} placed successfully!`);
        }

        // ORDER STATUS LIFECYCLE
        const statusSteps = [
            { label: "Order Received", icon: "fa-receipt", color: "bg-blue-500" },
            { label: "Accepted", icon: "fa-check", color: "bg-violet-500" },
            { label: "Preparing", icon: "fa-fire-burner", color: "bg-amber-500" },
            { label: "Ready for Pickup", icon: "fa-bell-concierge", color: "bg-emerald-500" },
            { label: "Collected", icon: "fa-circle-check", color: "bg-slate-400" }
        ];

        function escapeHtml(value) {
            return String(value ?? '').replace(/[&<>"']/g, character => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[character]);
        }

        function renderActiveOrders() {
            const container = document.getElementById('activeOrdersList');
            const badge = document.getElementById('activeOrdersBadge');

            const pendingOrders = activeOrders.filter(o => o.statusIndex < 4);
            if (pendingOrders.length > 0) {
                badge.innerText = pendingOrders.length;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }

            if (activeOrders.length === 0) {
                container.innerHTML = `
                    <div class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
                        <div class="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto text-2xl">
                            <i class="fa-solid fa-clock"></i>
                        </div>
                        <h4 class="text-lg font-bold text-slate-800">No active canteen orders right now</h4>
                        <p class="text-xs text-slate-500 max-w-sm mx-auto">Place your food order from the menu tab and track preparation in real-time here.</p>
                        <button onclick="switchTab('menu')" class="bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-orange-700 transition">
                            Explore Canteen Menu
                        </button>
                    </div>
                `;
                return;
            }

            container.innerHTML = activeOrders.map(order => {
                const isReady = order.statusIndex === 3;
                return `
                    <div class="bg-white rounded-2xl border ${isReady ? 'border-2 border-emerald-500 shadow-lg' : 'border-slate-200'} p-6 space-y-6">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="text-2xl font-black text-slate-900">Token: ${order.token}</span>
                                    ${isReady ? `
                                        <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse flex items-center gap-1">
                                            <i class="fa-solid fa-circle text-[8px]"></i> Ready at Counter
                                        </span>
                                    ` : ''}
                                </div>
                                <p class="text-xs text-slate-500 mt-0.5">Order ID: ${order.id} • Placed at ${order.timestamp}</p>
                            </div>
                            <div class="text-left sm:text-right">
                                <span class="bg-slate-100 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200">
                                    <i class="fa-solid fa-clock text-orange-500 mr-1"></i> ${order.pickupSlot}
                                </span>
                            </div>
                        </div>

                        <div class="py-2">
                            <div class="grid grid-cols-5 gap-2">
                                ${statusSteps.map((step, idx) => {
                                    const isPassed = order.statusIndex >= idx;

                                    return `
                                        <div class="flex flex-col items-center text-center">
                                            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-2 transition duration-300 ${
                                                isPassed ? step.color + ' text-white shadow-md' : 'bg-slate-100 text-slate-400'
                                            }">
                                                <i class="fa-solid ${step.icon}"></i>
                                            </div>
                                            <span class="text-[11px] font-bold ${isPassed ? 'text-slate-900' : 'text-slate-400'}">${step.label}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <div class="bg-slate-50 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div class="space-y-1">
                                <p class="font-bold text-slate-700 uppercase tracking-wider">Student Profile</p>
                                <p class="text-slate-900 font-semibold">${order.student.name} (<span class="text-orange-600">${order.student.registerId}</span>)</p>
                                <p class="text-slate-500">${order.student.dept}</p>
                            </div>
                            <div class="space-y-1">
                                <p class="font-bold text-slate-700 uppercase tracking-wider">Ordered Meal Items</p>
                                <p class="text-slate-800 font-medium">
                                    ${order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                                </p>
                            </div>
                            <div class="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4 w-full sm:w-auto">
                                <p class="text-slate-500">Total Bill</p>
                                <p class="text-lg font-black text-slate-900">₹${order.totalAmount}</p>
                            </div>
                        </div>

                        ${order.statusIndex === 3 ? `
                            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800 font-semibold">
                                <i class="fa-solid fa-bell mr-2"></i> Notification: Your order is ready. Please collect it from the canteen counter.
                            </div>
                        ` : ''}

                        <div class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                            <div class="text-xs font-semibold text-slate-500">
                                ${adminUser ? 'Admin controls active' : 'Login as admin to manage this order'}
                            </div>
                            <div class="flex justify-end gap-3">
                                ${order.statusIndex === 0 ? `
                                    <button onclick="updateOrderStatus('${order.id}', 1)" class="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition">
                                        Accept Order
                                    </button>
                                ` : order.statusIndex === 1 ? `
                                    <button onclick="updateOrderStatus('${order.id}', 2)" class="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition">
                                        Start Preparation
                                    </button>
                                ` : order.statusIndex === 2 ? `
                                    <button onclick="updateOrderStatus('${order.id}', 3)" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition">
                                        Mark Ready & Notify
                                    </button>
                                ` : order.statusIndex === 3 ? `
                                    <button onclick="updateOrderStatus('${order.id}', 4)" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition">
                                        Mark Collected
                                    </button>
                                ` : `
                                    <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                                        <i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i> Order Completed
                                    </span>
                                `}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        async function updateOrderStatus(orderId, nextStatusIndex) {
            if (!adminUser || !supabaseClient) {
                showToast('Admin access required to update order status.');
                return;
            }

            const order = activeOrders.find(o => o.id === orderId);
            if (!order) return;

            if (nextStatusIndex !== order.statusIndex + 1) return;

            const { data, error } = nextStatusIndex === 1
                ? await supabaseClient.rpc('claim_canteen_order', { p_order_id: orderId })
                : await supabaseClient.rpc('advance_canteen_order', {
                    p_order_id: orderId,
                    p_next_status: nextStatusIndex
                });

            if (error) {
                console.error('Order status update failed:', error);
                showToast('Could not update this order. Please try again.');
                return;
            }

            if (!data) {
                showToast(nextStatusIndex === 1
                    ? 'Another admin already took this order.'
                    : 'This order was updated by another admin.');
                await loadSharedOrders();
                return;
            }

            const updatedOrder = activeOrders.find(existing => existing.id === orderId) || order;
            updatedOrder.statusIndex = nextStatusIndex;
            if (nextStatusIndex === 1) {
                updatedOrder.claimedBy = adminUser.id;
                updatedOrder.claimedByName = adminUser.name;
                updatedOrder.claimedAt = new Date().toISOString();
            }

            if (nextStatusIndex === 3) {
                notifyStudentOrderReady(updatedOrder);
                showToast(`Order ${updatedOrder.token} is ready for pickup! Student notified.`);
            } else if (nextStatusIndex === 4) {
                if (!orderHistory.some(existing => existing.id === orderId)) {
                    orderHistory.unshift({ ...updatedOrder });
                }
                renderOrderHistory();
                activeOrders = activeOrders.filter(o => o.id !== orderId);
                showToast(`Order ${updatedOrder.token} has been collected.`);
            } else {
                showToast(`Order ${updatedOrder.token} updated: ${statusSteps[nextStatusIndex].label}`);
            }

            renderAdminOrders();
            renderActiveOrders();
        }

        function notifyStudentOrderReady(order) {
            const message = `Your order ${order.token} is ready. Please collect it from the canteen counter.`;
            if (currentUser && currentUser.registerId === order.student.registerId) {
                showToast(message);
            }
            const readyNotice = order.readyNotice || message;
            order.readyNotice = readyNotice;
        }

        function advanceOrderStatus(orderId) {
            const order = activeOrders.find(o => o.id === orderId);
            if (!order) return;

            if (order.statusIndex < 4) {
                updateOrderStatus(orderId, order.statusIndex + 1);
            }
        }

        function simulateOrderStatusProgression() {
            activeOrders.forEach(order => {
                if (order.statusIndex < 4) {
                    updateOrderStatus(order.id, Math.min(order.statusIndex + 1, 4));
                }
            });
        }

        function renderAdminOrders() {
            const container = document.getElementById('adminOrderList');
            const badge = document.getElementById('adminOrdersBadge');
            const orders = activeOrders.filter(order => order.statusIndex < 4);

            badge.textContent = `${orders.length} Active`;

            if (orders.length === 0) {
                container.innerHTML = `
                    <div class="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center text-slate-500">
                        <i class="fa-solid fa-box-open text-2xl mb-3"></i>
                        <p class="font-bold text-slate-700">No pending orders</p>
                        <p class="text-xs mt-1">New student orders will appear here.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = orders.map(order => {
                const statusText = statusSteps[order.statusIndex]?.label || 'Received';
                const claimedByCurrentAdmin = order.claimedBy === adminUser?.id;
                const claimedByAnotherAdmin = Boolean(order.claimedBy && !claimedByCurrentAdmin);
                return `
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                        <div class="flex flex-col sm:flex-row justify-between gap-3">
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="text-lg font-black text-slate-900">${escapeHtml(order.token)}</span>
                                    <span class="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-full">${statusText}</span>
                                </div>
                                <p class="text-xs text-slate-500 mt-1">${escapeHtml(order.student.name)} • ${escapeHtml(order.student.registerId)}</p>
                                <p class="text-xs font-semibold ${claimedByAnotherAdmin ? 'text-amber-700' : 'text-slate-500'} mt-1">
                                    ${order.claimedByName
                                        ? `Taken by ${escapeHtml(order.claimedByName)}${claimedByCurrentAdmin ? ' (you)' : ''}`
                                        : 'Available to claim'}
                                </p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs text-slate-500">Pickup Slot</p>
                                <p class="font-bold text-slate-800 text-xs">${escapeHtml(order.pickupSlot)}</p>
                            </div>
                        </div>

                        <div class="text-xs text-slate-600">
                            ${order.items.map(item => `${escapeHtml(item.name)} x${Number(item.quantity) || 0}`).join(', ')}
                        </div>

                        <div class="flex justify-between items-center gap-3">
                            <span class="text-sm font-black text-slate-900">₹${order.totalAmount}</span>
                            <div class="flex gap-2 flex-wrap justify-end">
                                ${order.statusIndex === 0 && !order.claimedBy ? `
                                    <button onclick="updateOrderStatus('${order.id}', 1)" class="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-3 py-2 rounded-lg">Take & Accept</button>
                                ` : ''}
                                ${order.statusIndex === 1 && claimedByCurrentAdmin ? `
                                    <button onclick="updateOrderStatus('${order.id}', 2)" class="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-lg">Prepare</button>
                                ` : ''}
                                ${order.statusIndex === 2 && claimedByCurrentAdmin ? `
                                    <button onclick="updateOrderStatus('${order.id}', 3)" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg">Ready</button>
                                ` : ''}
                                ${order.statusIndex === 3 && claimedByCurrentAdmin ? `
                                    <button onclick="updateOrderStatus('${order.id}', 4)" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg">Collected</button>
                                ` : ''}
                                ${claimedByAnotherAdmin ? `
                                    <span class="text-xs font-bold text-amber-700">Already taken</span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        async function addNewMenuItem() {
            const newItem = {
                id: Date.now(),
                name: 'New Menu Item',
                price: 40,
                category: 'Rice Meals',
                description: 'Freshly prepared menu item added by admin.',
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
                badge: 'New'
            };

            try {
                await saveMenuItems([newItem, ...foodMenuItems]);
                renderMenuEditor();
                renderMenu();
                showToast('New menu item created. Update details and save.');
            } catch (error) {
                showToast(error.message || 'Could not save the new menu item.');
            }
        }

        async function removeMenuItem(itemId) {
            const item = foodMenuItems.find(menuItem => menuItem.id === itemId);
            if (!item) return;

            const confirmed = window.confirm(`Remove "${item.name}" from the menu?`);
            if (!confirmed) return;

            try {
                const updatedMenu = foodMenuItems.filter(menuItem => menuItem.id !== itemId);
                await saveMenuItems(updatedMenu);
                renderMenu();
                renderMenuEditor();
                showToast(`${item.name} removed from the menu.`);
            } catch (error) {
                showToast(error.message || 'Could not remove the menu item.');
            }
        }

        async function uploadMenuImage(itemId, event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            if (!supabaseClient || !adminUser) {
                showToast('Shared image storage is not configured or you are not signed in as an admin.');
                return;
            }

            const item = foodMenuItems.find(menuItem => menuItem.id === itemId);
            if (!item) return;

            try {
                const objectPath = `${itemId}/menu-image`;
                const { data, error } = await supabaseClient.storage
                    .from('menu-images')
                    .upload(objectPath, file, { upsert: true, contentType: file.type });
                if (error) throw error;

                const imageUrl = `${supabaseClient.storage.from('menu-images').getPublicUrl(data.path).data.publicUrl}?v=${Date.now()}`;
                const updatedMenu = foodMenuItems.map(menuItem => menuItem.id === itemId
                    ? { ...menuItem, image: imageUrl }
                    : menuItem);
                await saveMenuItems(updatedMenu);

                const imageInput = document.getElementById(`image-${itemId}`);
                if (imageInput) imageInput.value = imageUrl;
                renderMenu();
                renderMenuEditor();
                showToast(`${item.name} image updated.`);
            } catch (error) {
                showToast(error.message || 'Could not upload the menu image.');
            }
        }

        function renderMenuEditor() {
            const container = document.getElementById('menuEditorList');
            container.innerHTML = `
                <div class="mb-4">
                    <button onclick="addNewMenuItem()" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm transition">
                        <i class="fa-solid fa-plus mr-2"></i>Add New Menu Item
                    </button>
                </div>
                ${foodMenuItems.map(item => `
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-3">
                        <div class="flex items-center gap-3">
                            <div class="menu-image-shell">
                                <img src="${item.image}" onerror="this.src='https://placehold.co/600x400/f97316/ffffff?text=${encodeURIComponent(item.name)}'" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-1">
                                <p class="font-bold text-slate-900 text-sm">${item.name}</p>
                                <p class="text-[10px] uppercase tracking-[0.18em] text-slate-500">${item.category}</p>
                            </div>
                        </div>

                        <div class="grid gap-2">
                            <label class="text-[10px] uppercase tracking-[0.18em] text-slate-500">Menu Name</label>
                            <input id="name-${item.id}" value="${item.name}" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800" />

                            <label class="text-[10px] uppercase tracking-[0.18em] text-slate-500">Category</label>
                            <select id="category-${item.id}" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800">
                                ${categoryOptions.filter(c => c !== 'All').map(cat => `
                                    <option value="${cat}" ${item.category === cat ? 'selected' : ''}>${cat}</option>
                                `).join('')}
                            </select>

                            <label class="text-[10px] uppercase tracking-[0.18em] text-slate-500">Price</label>
                            <input id="price-${item.id}" type="number" value="${item.price}" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800" />

                            <label class="text-[10px] uppercase tracking-[0.18em] text-slate-500">Image URL or Local Upload</label>
                            <div class="flex gap-2">
                                <input id="image-${item.id}" value="${item.image}" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800" />
                                <label class="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-2 rounded-xl text-xs cursor-pointer whitespace-nowrap">
                                    Upload
                                    <input type="file" accept="image/*" class="hidden" onchange="uploadMenuImage(${item.id}, event)" />
                                </label>
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <button onclick="saveMenuItem(${item.id})" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition">
                                Save Changes
                            </button>
                            <button onclick="removeMenuItem(${item.id})" class="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-2.5 rounded-xl text-sm transition">
                                Remove
                            </button>
                        </div>
                    </div>
                `).join('')}
            `;
        }

        async function saveMenuItem(itemId) {
            const item = foodMenuItems.find(menuItem => menuItem.id === itemId);
            if (!item) return;

            const name = document.getElementById(`name-${itemId}`).value.trim();
            const category = document.getElementById(`category-${itemId}`).value;
            const price = Number(document.getElementById(`price-${itemId}`).value || 0);
            const image = document.getElementById(`image-${itemId}`).value.trim();

            const updatedItem = {
                ...item,
                name: name || item.name,
                category: category || item.category,
                price: price > 0 ? price : item.price,
                image: image || item.image,
                description: item.description || 'Freshly prepared menu item'
            };

            try {
                const updatedMenu = foodMenuItems.map(menuItem => menuItem.id === itemId ? updatedItem : menuItem);
                await saveMenuItems(updatedMenu);
                renderMenu();
                renderMenuEditor();
                renderAdminOrders();
                showToast(`${updatedItem.name} updated successfully.`);
            } catch (error) {
                showToast(error.message || 'Could not save the menu item.');
            }
        }

        // ORDER HISTORY RENDER
        function renderOrderHistory() {
            const container = document.getElementById('orderHistoryList');

            if (orderHistory.length === 0) {
                container.innerHTML = `
                    <div class="bg-white rounded-2xl p-8 text-center border border-slate-200/80 text-slate-400 text-sm">
                        No previous order history recorded yet.
                    </div>
                `;
                return;
            }

            container.innerHTML = orderHistory.map(order => `
                <div class="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <span class="font-extrabold text-slate-900 text-sm">Token: ${order.token}</span>
                            <span class="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                                ${order.pickupSlot}
                            </span>
                        </div>
                        <p class="text-xs text-slate-500">
                            ${order.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}
                        </p>
                    </div>
                    <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div class="text-right">
                            <span class="text-xs text-slate-400 block">Amount Paid</span>
                            <span class="text-sm font-bold text-slate-900">₹${order.totalAmount}</span>
                        </div>
                        <span class="text-emerald-600 bg-emerald-50 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <i class="fa-solid fa-circle-check"></i> Collected
                        </span>
                    </div>
                </div>
            `).join('');
        }

        // TOAST NOTIFICATIONS
        function showToast(message) {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');

            toastMessage.innerText = message;
            toast.classList.remove('translate-y-20', 'opacity-0');

            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }
