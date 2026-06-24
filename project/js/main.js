// ============================================
// 1. ДАННЫЕ (Initial Data)
// ============================================

const INITIAL_DATA = {
    users: [
        {
            id: 'admin',
            login: 'Admin26',
            password: 'Demo20',
            fullName: 'Администратор',
            phone: '+7 (999) 999-99-99',
            email: 'admin@uchus.ru',
            isAdmin: true
        },
        {
            id: 'user1',
            login: 'ivanov',
            password: 'password123',
            fullName: 'Иванов Иван Иванович',
            phone: '+7 (912) 345-67-89',
            email: 'ivanov@mail.ru',
            isAdmin: false
        },
        {
            id: 'user2',
            login: 'petrov',
            password: 'password456',
            fullName: 'Петров Петр Петрович',
            phone: '+7 (923) 456-78-90',
            email: 'petrov@mail.ru',
            isAdmin: false
        }
    ],
    requests: [
        {
            id: '1',
            userId: 'user1',
            course: 'Курсы повышения квалификации',
            startDate: '2026-06-01',
            paymentMethod: 'Банковской картой',
            status: 'Новая',
            createdAt: '2026-05-15T10:30:00'
        },
        {
            id: '2',
            userId: 'user1',
            course: 'Курсы по охране труда',
            startDate: '2026-05-15',
            paymentMethod: 'По счету',
            status: 'Идет обучение',
            createdAt: '2026-04-20T14:20:00'
        },
        {
            id: '3',
            userId: 'user2',
            course: 'Курсы переподготовки',
            startDate: '2026-04-01',
            paymentMethod: 'ЮMoney',
            status: 'Обучение завершено',
            createdAt: '2026-03-01T09:15:00'
        },
        {
            id: '4',
            userId: 'user2',
            course: 'Курсы повышения квалификации',
            startDate: '2026-07-01',
            paymentMethod: 'Банковской картой',
            status: 'Новая',
            createdAt: '2026-06-10T16:45:00'
        },
        {
            id: '5',
            userId: 'user1',
            course: 'Курсы переподготовки',
            startDate: '2026-03-15',
            paymentMethod: 'Банковской картой',
            status: 'Обучение завершено',
            createdAt: '2026-02-15T11:00:00'
        }
    ],
    reviews: [
        {
            id: '1',
            requestId: '3',
            userId: 'user2',
            text: 'Отличный курс! Преподаватели профессионалы, материал подается доступно. Рекомендую!',
            createdAt: '2026-05-01T12:00:00'
        },
        {
            id: '2',
            requestId: '5',
            userId: 'user1',
            text: 'Хороший курс, но хотелось бы больше практических заданий.',
            createdAt: '2026-05-20T15:30:00'
        }
    ]
};

// ============================================
// 2. РАБОТА С LOCALSTORAGE
// ============================================

function loadData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error loading data:', e);
        return null;
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving data:', e);
        return false;
    }
}

function initData() {
    if (!loadData('users')) {
        saveData('users', INITIAL_DATA.users);
        saveData('requests', INITIAL_DATA.requests);
        saveData('reviews', INITIAL_DATA.reviews);
        console.log('✅ Данные инициализированы');
    }
}

function getUsers() {
    return loadData('users') || [];
}

function getRequests() {
    return loadData('requests') || [];
}

function getReviews() {
    return loadData('reviews') || [];
}

function getCurrentUser() {
    return loadData('currentUser');
}

function saveCurrentUser(user) {
    saveData('currentUser', user);
}

function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

// ============================================
// 3. ОБЩИЕ УТИЛИТЫ
// ============================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    
    // Если уже в формате ДД.ММ.ГГГГ
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
        return dateStr;
    }
    
    // Пытаемся распарсить ISO дату
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return dateStr;
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    } catch (e) {
        return dateStr;
    }
}

function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return formatDate(dateStr) + ' ' + String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
}

function getStatusBadgeClass(status) {
    const map = {
        'Новая': 'badge-new',
        'Идет обучение': 'badge-progress',
        'Обучение завершено': 'badge-completed'
    };
    return map[status] || 'badge-new';
}

function getUserById(userId) {
    const users = getUsers();
    return users.find(u => u.id === userId);
}

function getRequestById(requestId) {
    const requests = getRequests();
    return requests.find(r => r.id === requestId);
}

// ============================================
// 4. ТОСТЫ (УВЕДОМЛЕНИЯ)
// ============================================

function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container') || (() => {
        const div = document.createElement('div');
        div.className = 'toast-container';
        document.body.appendChild(div);
        return div;
    })();

    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${iconMap[type] || iconMap.info}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    const close = () => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', close);

    setTimeout(close, 4000);
}

// ============================================
// 5. МОДАЛЬНОЕ ОКНО
// ============================================

let modalResolve = null;

function showModal(content, onConfirm = null) {
    return new Promise((resolve) => {
        let overlay = document.querySelector('.modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${content.title || 'Действие'}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content.body || ''}
                </div>
                ${content.buttons ? `
                    <div class="modal-footer" style="margin-top:1.5rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
                        ${content.buttons}
                    </div>
                ` : ''}
            </div>
        `;

        overlay.classList.add('active');

        const closeModal = () => {
            overlay.classList.remove('active');
            resolve(false);
        };

        overlay.querySelector('.modal-close').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        if (content.buttons) {
            overlay.querySelectorAll('.modal-btn-confirm').forEach(btn => {
                btn.addEventListener('click', () => {
                    overlay.classList.remove('active');
                    resolve(true);
                });
            });
            overlay.querySelectorAll('.modal-btn-cancel').forEach(btn => {
                btn.addEventListener('click', closeModal);
            });
        }
    });
}

function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ============================================
// 6. АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ
// ============================================

function registerUser(userData) {
    const users = getUsers();
    
    // Проверка уникальности логина
    if (users.some(u => u.login === userData.login)) {
        showToast('Пользователь с таким логином уже существует', 'error');
        return false;
    }

    // Валидация
    if (userData.login.length < 6) {
        showToast('Логин должен содержать минимум 6 символов', 'error');
        return false;
    }

    if (!/^[a-zA-Z0-9]+$/.test(userData.login)) {
        showToast('Логин может содержать только латиницу и цифры', 'error');
        return false;
    }

    if (userData.password.length < 8) {
        showToast('Пароль должен содержать минимум 8 символов', 'error');
        return false;
    }

    const newUser = {
        id: generateId(),
        login: userData.login,
        password: userData.password,
        fullName: userData.fullName,
        phone: userData.phone,
        email: userData.email,
        isAdmin: false
    };

    users.push(newUser);
    saveData('users', users);
    
    // Автоматический вход
    saveCurrentUser(newUser);
    showToast('Регистрация успешна!', 'success');
    return true;
}

function loginUser(login, password) {
    const users = getUsers();
    const user = users.find(u => u.login === login && u.password === password);
    
    if (user) {
        saveCurrentUser(user);
        showToast(`Добро пожаловать, ${user.fullName}!`, 'success');
        return true;
    }
    
    showToast('Неверный логин или пароль', 'error');
    return false;
}

function logoutUser() {
    clearCurrentUser();
    showToast('Вы вышли из системы', 'info');
    window.location.href = 'login.html';
}

function checkAuth(redirect = true) {
    const user = getCurrentUser();
    if (!user && redirect) {
        window.location.href = 'login.html';
        return false;
    }
    return !!user;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.isAdmin === true;
}

// ============================================
// 7. РАБОТА С ЗАЯВКАМИ
// ============================================

function createRequest(requestData) {
    const requests = getRequests();
    const newRequest = {
        id: generateId(),
        ...requestData,
        status: 'Новая',
        createdAt: new Date().toISOString()
    };
    requests.push(newRequest);
    saveData('requests', requests);
    return newRequest;
}

function getRequestsByUser(userId) {
    const requests = getRequests();
    return requests.filter(r => r.userId === userId);
}

function getAllRequests() {
    return getRequests();
}

function updateRequestStatus(requestId, newStatus) {
    const requests = getRequests();
    const request = requests.find(r => r.id === requestId);
    if (request) {
        request.status = newStatus;
        saveData('requests', requests);
        showToast(`Статус заявки #${requestId} изменен на "${newStatus}"`, 'success');
        return true;
    }
    showToast('Заявка не найдена', 'error');
    return false;
}

function getFilteredRequests(status, search) {
    let requests = getRequests();
    
    if (status && status !== 'Все') {
        requests = requests.filter(r => r.status === status);
    }
    
    if (search) {
        const searchLower = search.toLowerCase();
        requests = requests.filter(r => 
            r.course.toLowerCase().includes(searchLower)
        );
    }
    
    return requests;
}

function deleteRequest(requestId) {
    let requests = getRequests();
    requests = requests.filter(r => r.id !== requestId);
    saveData('requests', requests);
    showToast(`Заявка #${requestId} удалена`, 'info');
}

// ============================================
// 8. РАБОТА С ОТЗЫВАМИ
// ============================================

function addReview(reviewData) {
    const reviews = getReviews();
    const newReview = {
        id: generateId(),
        ...reviewData,
        createdAt: new Date().toISOString()
    };
    reviews.push(newReview);
    saveData('reviews', reviews);
    showToast('Отзыв успешно добавлен!', 'success');
    return newReview;
}

function getReviewsByUser(userId) {
    const reviews = getReviews();
    return reviews.filter(r => r.userId === userId);
}

function getReviewsByRequest(requestId) {
    const reviews = getReviews();
    return reviews.filter(r => r.requestId === requestId);
}

// ============================================
// 9. СЛАЙДЕР
// ============================================

let sliderInterval = null;
let currentSlide = 0;

function initSlider() {
    const track = document.querySelector('.slider-track');
    const dots = document.querySelectorAll('.slider-dot');
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    if (!track || totalSlides === 0) return;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Кнопки
    document.querySelector('.slider-btn.next')?.addEventListener('click', () => {
        nextSlide();
        resetSliderInterval();
    });

    document.querySelector('.slider-btn.prev')?.addEventListener('click', () => {
        prevSlide();
        resetSliderInterval();
    });

    // Точки
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetSliderInterval();
        });
    });

    // Автопрокрутка
    function startSliderInterval() {
        if (sliderInterval) clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 3000);
    }

    function resetSliderInterval() {
        if (sliderInterval) clearInterval(sliderInterval);
        startSliderInterval();
    }

    startSliderInterval();

    // Пауза при наведении
    const container = document.querySelector('.slider-container');
    container?.addEventListener('mouseenter', () => {
        if (sliderInterval) clearInterval(sliderInterval);
    });
    container?.addEventListener('mouseleave', startSliderInterval);

    // Инициализация
    goToSlide(0);
}

// ============================================
// 10. ГАМБУРГЕР-МЕНЮ
// ============================================

function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('open');
        });
    }
}

// ============================================
// 11. ОБНОВЛЕНИЕ НАВИГАЦИИ
// ============================================

function updateNavigation() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const user = getCurrentUser();
    const isAdminUser = isAdmin();

    let navHTML = '';

    if (user) {
        navHTML += `<a href="profile.html">👤 Личный кабинет</a>`;
        navHTML += `<a href="new-request.html">📝 Новая заявка</a>`;
        if (isAdminUser) {
            navHTML += `<a href="admin-panel.html">⚙️ Админ-панель</a>`;
        }
        navHTML += `<a href="#" onclick="logoutUser(); return false;">🚪 Выйти</a>`;
    } else {
        navHTML += `<a href="login.html">🔑 Вход/Регистрация</a>`;
    }

    nav.innerHTML = navHTML;
    initHamburger();
}

// ============================================
// 12. ИНИЦИАЛИЗАЦИЯ СТРАНИЦ
// ============================================

// Имитация коммитов
const commits = [
    '✨ feat: Добавлена структура проекта',
    '🎨 style: Настроены базовые стили и цветовая схема',
    '📝 docs: Создана документация по API',
    '🔧 config: Настроен eslint и prettier',
    '✨ feat: Реализована авторизация и регистрация',
    '✨ feat: Добавлен личный кабинет',
    '✨ feat: Создана форма новой заявки',
    '✨ feat: Добавлена панель администратора',
    '📱 responsive: Адаптив под мобильные устройства',
    '🐛 fix: Исправлена валидация форм',
    '✨ feat: Добавлены тосты и модальные окна',
    '✨ feat: Реализован слайдер на главной',
    '♻️ refactor: Оптимизирован код работы с localStorage',
    '📦 release: Версия 1.0.0'
];

function logCommits() {
    console.log('📋 История коммитов проекта:');
    commits.forEach((commit, index) => {
        console.log(`  ${String(index + 1).padStart(2, '0')}. ${commit}`);
    });
}

// ============================================
// 13. СТРАНИЦЫ
// ============================================

// ---------- index.html ----------
function initIndex() {
    if (getCurrentUser()) {
        window.location.href = 'profile.html';
    } else {
        window.location.href = 'login.html';
    }
}

// ---------- login.html ----------
function initLogin() {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginContent = document.getElementById('login-content');
    const registerContent = document.getElementById('register-content');

    function switchTab(tab) {
        loginTab.classList.toggle('active', tab === 'login');
        registerTab.classList.toggle('active', tab === 'register');
        loginContent.classList.toggle('active', tab === 'login');
        registerContent.classList.toggle('active', tab === 'register');
    }

    loginTab?.addEventListener('click', () => switchTab('login'));
    registerTab?.addEventListener('click', () => switchTab('register'));

    // Вход
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const login = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (loginUser(login, password)) {
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 500);
        }
    });

    // Регистрация
    document.getElementById('register-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userData = {
            login: document.getElementById('reg-login').value,
            password: document.getElementById('reg-password').value,
            fullName: document.getElementById('reg-fullname').value,
            phone: document.getElementById('reg-phone').value,
            email: document.getElementById('reg-email').value
        };

        if (registerUser(userData)) {
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 500);
        }
    });

    // Валидация в реальном времени
    document.getElementById('reg-login')?.addEventListener('input', function() {
        const help = this.parentElement.querySelector('.help-text');
        if (this.value.length < 6) {
            this.classList.add('error');
            this.classList.remove('success');
            help.textContent = 'Минимум 6 символов, только латиница и цифры';
            help.className = 'help-text error';
        } else if (!/^[a-zA-Z0-9]+$/.test(this.value)) {
            this.classList.add('error');
            this.classList.remove('success');
            help.textContent = 'Только латиница и цифры';
            help.className = 'help-text error';
        } else {
            this.classList.remove('error');
            this.classList.add('success');
            help.textContent = '✓ Валидный логин';
            help.className = 'help-text success';
        }
    });

    document.getElementById('reg-password')?.addEventListener('input', function() {
        const help = this.parentElement.querySelector('.help-text');
        if (this.value.length < 8) {
            this.classList.add('error');
            this.classList.remove('success');
            help.textContent = 'Минимум 8 символов';
            help.className = 'help-text error';
        } else {
            this.classList.remove('error');
            this.classList.add('success');
            help.textContent = '✓ Надежный пароль';
            help.className = 'help-text success';
        }
    });

    // Валидация телефона
    document.getElementById('reg-phone')?.addEventListener('input', function() {
        const help = this.parentElement.querySelector('.help-text');
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(this.value) && this.value.length > 0) {
            this.classList.add('error');
            this.classList.remove('success');
            help.textContent = 'Формат: +7 (XXX) XXX-XX-XX';
            help.className = 'help-text error';
        } else if (this.value.length > 0) {
            this.classList.remove('error');
            this.classList.add('success');
            help.textContent = '✓ Корректный номер';
            help.className = 'help-text success';
        }
    });

    // Валидация email
    document.getElementById('reg-email')?.addEventListener('input', function() {
        const help = this.parentElement.querySelector('.help-text');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value) && this.value.length > 0) {
            this.classList.add('error');
            this.classList.remove('success');
            help.textContent = 'Введите корректный email';
            help.className = 'help-text error';
        } else if (this.value.length > 0) {
            this.classList.remove('error');
            this.classList.add('success');
            help.textContent = '✓ Корректный email';
            help.className = 'help-text success';
        }
    });

    // Маска телефона
    document.getElementById('reg-phone')?.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 0) {
            let formatted = '+7 (';
            if (value.length > 1) formatted += value.slice(1, 4);
            if (value.length > 4) formatted += ') ' + value.slice(4, 7);
            if (value.length > 7) formatted += '-' + value.slice(7, 9);
            if (value.length > 9) formatted += '-' + value.slice(9, 11);
            this.value = formatted;
        }
    });
}

// ---------- profile.html ----------
function initProfile() {
    if (!checkAuth()) return;

    const user = getCurrentUser();
    if (!user) return;

    // Приветствие
    const welcome = document.getElementById('welcome-message');
    if (welcome) {
        welcome.textContent = `Здравствуйте, ${user.fullName}!`;
    }

    // Слайдер
    if (document.querySelector('.slider-container')) {
        initSlider();
    }

    // Заявки
    renderUserRequests(user.id);

    // Отзывы
    renderUserReviews(user.id);
}

function renderUserRequests(userId) {
    const container = document.getElementById('user-requests');
    if (!container) return;

    const requests = getRequestsByUser(userId);
    const reviews = getReviews();

    if (requests.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted" style="padding: 2rem;">
                <p style="font-size: 1.1rem;">📭 У вас пока нет заявок</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">
                    Перейдите в раздел <a href="new-request.html" style="color: var(--primary); font-weight: 500;">Новая заявка</a>, чтобы записаться на курс
                </p>
            </div>
        `;
        return;
    }

    // Сортируем по дате создания (новые сверху)
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    container.innerHTML = requests.map(request => {
        const requestReviews = reviews.filter(r => r.requestId === request.id);
        const hasReview = requestReviews.length > 0;
        const isCompleted = request.status === 'Обучение завершено';

        return `
            <div class="request-item" data-id="${request.id}">
                <div class="request-header">
                    <span class="request-course">${request.course}</span>
                    <span class="badge ${getStatusBadgeClass(request.status)}">${request.status}</span>
                </div>
                <div class="request-meta">
                    <span>📅 Начало: ${formatDate(request.startDate)}</span>
                    <span>💳 ${request.paymentMethod}</span>
                    <span>📝 Создана: ${formatDateTime(request.createdAt)}</span>
                </div>
                <div class="request-actions">
                    ${isCompleted && !hasReview ? `
                        <button class="btn btn-primary btn-sm" onclick="openReviewModal('${request.id}')">
                            📝 Оставить отзыв
                        </button>
                    ` : ''}
                    ${hasReview ? `
                        <span style="color: var(--success); font-size: 0.85rem;">✅ Отзыв оставлен</span>
                    ` : ''}
                </div>
                ${hasReview ? `
                    <div style="margin-top: 0.75rem;">
                        ${requestReviews.map(review => `
                            <div class="review-item">
                                <div class="review-text">${review.text}</div>
                                <div class="review-meta">${formatDateTime(review.createdAt)}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function renderUserReviews(userId) {
    const container = document.getElementById('user-reviews');
    if (!container) return;

    const reviews = getReviewsByUser(userId);
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted" style="padding: 1rem;">
                <p>У вас пока нет отзывов</p>
            </div>
        `;
        return;
    }

    container.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-text">${review.text}</div>
            <div class="review-meta">${formatDateTime(review.createdAt)}</div>
        </div>
    `).join('');
}

async function openReviewModal(requestId) {
    const result = await showModal({
        title: '✍️ Оставить отзыв',
        body: `
            <div class="form-group">
                <label for="review-text">Ваш отзыв о курсе</label>
                <textarea id="review-text" class="form-control" rows="4" placeholder="Поделитесь впечатлениями о курсе..." style="width:100%;padding:0.75rem;border:2px solid var(--gray-light);border-radius:8px;font-family:inherit;"></textarea>
            </div>
        `,
        buttons: `
            <button class="btn btn-success modal-btn-confirm">✅ Отправить</button>
            <button class="btn btn-outline modal-btn-cancel">Отмена</button>
        `
    });

    if (result) {
        const textarea = document.getElementById('review-text');
        const text = textarea?.value.trim();
        
        if (!text) {
            showToast('Пожалуйста, напишите отзыв', 'error');
            return;
        }

        const user = getCurrentUser();
        addReview({
            requestId: requestId,
            userId: user.id,
            text: text
        });

        renderUserRequests(user.id);
        renderUserReviews(user.id);
    }
}

// ---------- new-request.html ----------
function initNewRequest() {
    if (!checkAuth()) return;

    const form = document.getElementById('new-request-form');
    if (!form) return;

    // Заполнение выпадающих списков
    const courseSelect = document.getElementById('request-course');
    const paymentSelect = document.getElementById('request-payment');

    const courses = [
        'Курсы повышения квалификации',
        'Курсы переподготовки',
        'Курсы по охране труда'
    ];

    const payments = [
        'Банковской картой',
        'По счету',
        'ЮMoney'
    ];

    if (courseSelect) {
        courseSelect.innerHTML = courses.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    if (paymentSelect) {
        paymentSelect.innerHTML = payments.map(p => `<option value="${p}">${p}</option>`).join('');
    }

    // Валидация даты
    const dateInput = document.getElementById('request-date');
    if (dateInput) {
        dateInput.addEventListener('input', function() {
            const help = this.parentElement.querySelector('.help-text');
            const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
            if (!dateRegex.test(this.value) && this.value.length > 0) {
                this.classList.add('error');
                this.classList.remove('success');
                help.textContent = 'Формат: ДД.ММ.ГГГГ';
                help.className = 'help-text error';
            } else if (this.value.length > 0) {
                const parts = this.value.split('.');
                if (parts.length === 3) {
                    const day = parseInt(parts[0]);
                    const month = parseInt(parts[1]) - 1;
                    const year = parseInt(parts[2]);
                    const date = new Date(year, month, day);
                    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
                        this.classList.remove('error');
                        this.classList.add('success');
                        help.textContent = '✓ Корректная дата';
                        help.className = 'help-text success';
                    } else {
                        this.classList.add('error');
                        this.classList.remove('success');
                        help.textContent = 'Некорректная дата';
                        help.className = 'help-text error';
                    }
                }
            }
        });

        // Маска даты
        dateInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);
            if (value.length > 4) {
                value = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4);
            } else if (value.length > 2) {
                value = value.slice(0, 2) + '.' + value.slice(2);
            }
            this.value = value;
        });
    }

    // Отправка формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const course = document.getElementById('request-course').value;
        const startDate = document.getElementById('request-date').value;
        const paymentMethod = document.getElementById('request-payment').value;

        if (!course || !startDate || !paymentMethod) {
            showToast('Пожалуйста, заполните все поля', 'error');
            return;
        }

        // 🔧 ПРЕОБРАЗОВАНИЕ ДАТЫ В ISO ФОРМАТ
        const dateParts = startDate.split('.');
        const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        const user = getCurrentUser();
        const request = createRequest({
            userId: user.id,
            course: course,
            startDate: isoDate, // Сохраняем в ISO формате
            paymentMethod: paymentMethod
        });

        showToast('✅ Заявка успешно отправлена на согласование!', 'success');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1000);
    });
}

// ---------- admin-panel.html ----------
function initAdminPanel() {
    // Проверка на админа
    if (!isAdmin()) {
        showToast('Доступ запрещен. Требуются права администратора.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return;
    }

    // Показываем панель
    document.getElementById('admin-content').style.display = 'block';
    document.getElementById('admin-login-form').style.display = 'none';

    renderAdminPanel();
}

function renderAdminPanel() {
    const requests = getRequests();
    const users = getUsers();

    // Статистика
    const stats = {
        new: requests.filter(r => r.status === 'Новая').length,
        progress: requests.filter(r => r.status === 'Идет обучение').length,
        completed: requests.filter(r => r.status === 'Обучение завершено').length
    };

    document.getElementById('stat-new').textContent = stats.new;
    document.getElementById('stat-progress').textContent = stats.progress;
    document.getElementById('stat-completed').textContent = stats.completed;

    // Фильтры и пагинация
    let currentPage = 1;
    const itemsPerPage = 3;
    let filteredRequests = [...requests];

    function applyFilters() {
        const status = document.getElementById('filter-status').value;
        const search = document.getElementById('filter-search').value.toLowerCase();
        
        filteredRequests = requests.filter(r => {
            const matchStatus = status === 'Все' || r.status === status;
            const matchSearch = r.course.toLowerCase().includes(search);
            return matchStatus && matchSearch;
        });

        // Сортировка по дате (новые сверху)
        filteredRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        currentPage = 1;
        renderTable();
    }

    function renderTable() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = filteredRequests.slice(start, end);
        const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

        const tbody = document.querySelector('#requests-table tbody');
        if (!tbody) return;

        if (pageItems.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted" style="padding:2rem;">
                        Заявки не найдены
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = pageItems.map(request => {
                const user = getUserById(request.userId);
                return `
                    <tr>
                        <td><strong>#${request.id}</strong></td>
                        <td>${user ? user.fullName : 'Неизвестный'}</td>
                        <td>${request.course}</td>
                        <td>${formatDate(request.startDate)}</td>
                        <td><span class="badge ${getStatusBadgeClass(request.status)}">${request.status}</span></td>
                        <td>
                            <select class="status-change" data-id="${request.id}" style="padding:0.3rem 0.5rem;border:2px solid var(--gray-light);border-radius:6px;font-size:0.85rem;">
                                <option value="Новая" ${request.status === 'Новая' ? 'selected' : ''}>Новая</option>
                                <option value="Идет обучение" ${request.status === 'Идет обучение' ? 'selected' : ''}>Идет обучение</option>
                                <option value="Обучение завершено" ${request.status === 'Обучение завершено' ? 'selected' : ''}>Обучение завершено</option>
                            </select>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Обработчики изменения статуса
        document.querySelectorAll('.status-change').forEach(select => {
            select.addEventListener('change', function() {
                const requestId = this.dataset.id;
                const newStatus = this.value;
                updateRequestStatus(requestId, newStatus);
                renderAdminPanel();
            });
        });

        // Пагинация
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.innerHTML = `
                <button class="btn btn-sm btn-outline" onclick="changePage(-1)" ${currentPage <= 1 ? 'disabled' : ''}>
                    ← Назад
                </button>
                <span class="page-info">Страница ${currentPage} из ${totalPages}</span>
                <button class="btn btn-sm btn-outline" onclick="changePage(1)" ${currentPage >= totalPages ? 'disabled' : ''}>
                    Далее →
                </button>
            `;
        }
    }

    // Функция для пагинации (глобальная)
    window.changePage = function(delta) {
        const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
        currentPage = Math.max(1, Math.min(currentPage + delta, totalPages));
        renderTable();
    };

    // Обработчики фильтров
    document.getElementById('filter-status')?.addEventListener('change', applyFilters);
    document.getElementById('filter-search')?.addEventListener('input', applyFilters);

    // Первичный рендер
    applyFilters();
}

// ============================================
// 14. ИНИЦИАЛИЗАЦИЯ
// ============================================

function initPage() {
    // Инициализация данных
    initData();

    // Логирование коммитов
    logCommits();

    // Обновление навигации
    updateNavigation();

    // Определение страницы
    const page = window.location.pathname.split('/').pop() || 'index.html';

    switch(page) {
        case 'index.html':
            initIndex();
            break;
        case 'login.html':
            initLogin();
            break;
        case 'profile.html':
            initProfile();
            break;
        case 'new-request.html':
            initNewRequest();
            break;
        case 'admin-panel.html':
            initAdminPanel();
            break;
        default:
            break;
    }
}

// ============================================
// 15. ЗАПУСК
// ============================================

document.addEventListener('DOMContentLoaded', initPage);

// Экспорт для глобального использования
window.showToast = showToast;
window.showModal = showModal;
window.closeModal = closeModal;
window.logoutUser = logoutUser;
window.openReviewModal = openReviewModal;
window.changePage = window.changePage;