// script.js
// === BRO SCHOOL - ОПТИМИЗИРОВАННЫЙ SCRIPT.JS ===

// === КОНФИГУРАЦИЯ (ВРЕМЕННО - ВЫНЕСТИ В BACKEND) ===
const CONFIG = {
    telegram: {
        // ⚠️ ВРЕМЕННО - вынести в backend при развертывании
        token: '8518433056:AAH5lcjmpbrCX7WswspN1gOXbAuktbthvWE',
        chatId: '436225628'
    },
    validation: {
        phoneLength: 11,
        minNameLength: 2
    },
    ui: {
        notificationTimeout: 5000
    }
};

// === ОСНОВНЫЕ ЭЛЕМЕНТЫ ===
const elements = {
    mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
    navMenu: document.querySelector('.nav-menu'),
    header: document.querySelector('.header')
};

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initPhoneMask();
    initForms();
    initAnimations();
    initHeaderScroll();
    
    console.log('Bro School - все системы инициализированы');
});

// === ШАПКА ПРИ СКРОЛЛЕ ===
function initHeaderScroll() {
    if (!elements.header) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = elements.header;
        
        if (scrolled > 50) {
            header.style.backgroundColor = 'rgba(44, 62, 80, 0.8)'; // 20% прозрачности
        } else {
            header.style.backgroundColor = 'var(--dark-bg)'; // Полная непрозрачность
        }
    });
}

// === МОБИЛЬНОЕ МЕНЮ ===
function initMobileMenu() {
    if (!elements.mobileMenuBtn || !elements.navMenu) return;
    
    elements.mobileMenuBtn.addEventListener('click', function() {
        elements.navMenu.classList.toggle('active');
        this.textContent = elements.navMenu.classList.contains('active') ? '✕' : '☰';
    });
}

// === ПЛАВНАЯ ПРОКРУТКА ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Закрытие мобильного меню
            if (elements.navMenu) {
                elements.navMenu.classList.remove('active');
            }
            if (elements.mobileMenuBtn) {
                elements.mobileMenuBtn.textContent = '☰';
            }
        });
    });
}

// === TELEGRAM ОТПРАВКА С ОБРАБОТКОЙ ОШИБОК ===
async function sendToTelegram(formData) {
    const { token, chatId } = CONFIG.telegram;
    
    // Проверка конфигурации
    if (!token || token.includes('YOUR') || !chatId || chatId.includes('YOUR')) {
        console.error('Telegram не настроен. Проверьте конфигурацию.');
        return { success: false, error: 'Telegram не настроен' };
    }

    const message = `
🎯 *НОВАЯ ЗАЯВКА С САЙТА BRO SCHOOL!*

👤 *Имя:* ${formData.name}
📞 *Телефон:* ${formData.phone}
🎯 *Направление:* ${formData.direction}
💬 *Сообщение:* ${formData.message}

🌐 *Страница:* ${formData.page}
📅 *Время:* ${new Date().toLocaleString('ru-RU')}
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        // Обработка сетевых ошибок
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.ok) {
            console.log('✅ Сообщение отправлено в Telegram');
            return { success: true };
        } else {
            console.error('❌ Ошибка Telegram API:', data);
            return { success: false, error: data.description || 'Неизвестная ошибка Telegram' };
        }
    } catch (error) {
        console.error('❌ Ошибка отправки в Telegram:', error);
        return { 
            success: false, 
            error: error.message || 'Сетевая ошибка' 
        };
    }
}

// === СИСТЕМА УВЕДОМЛЕНИЙ ===
function showNotification(message, type = 'success') {
    // Удаляем существующие уведомления
    document.querySelectorAll('.notification').forEach(notification => {
        notification.remove();
    });

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-text">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Закрытие по клику
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });

    // Автоматическое закрытие
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, CONFIG.ui.notificationTimeout);
}

// === УЛУЧШЕННАЯ ВАЛИДАЦИЯ ===
function isValidPhone(phone) {
    // Удаляем все нецифровые символы, кроме плюса
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Проверяем российские форматы
    const ruFormats = [
        /^\+7\d{10}$/,      // +79123456789
        /^8\d{10}$/,        // 89123456789
        /^7\d{10}$/,        // 79123456789
        /^\+?[78]?9\d{9}$/  // 9123456789 (без кода страны)
    ];
    
    return ruFormats.some(format => format.test(cleanPhone));
}

function isValidName(name) {
    return name && name.trim().length >= CONFIG.validation.minNameLength;
}

// === УЛУЧШЕННАЯ МАСКА ТЕЛЕФОНА ===
function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.placeholder = '+7 (999) 123-45-67 или 89991234567';
        
        input.addEventListener('input', function(e) {
            const cursorPosition = this.selectionStart;
            const originalValue = this.value;
            
            // Сохраняем только цифры, плюс, скобки, дефисы и пробелы
            let newValue = this.value.replace(/[^\d+\-()\s]/g, '');
            
            // Автоматическое форматирование
            if (newValue.replace(/\D/g, '').length > 1) {
                newValue = formatPhoneNumber(newValue);
            }
            
            this.value = newValue;
            
            // Корректируем позицию курсора
            if (this.value !== originalValue) {
                const diff = newValue.length - originalValue.length;
                const newCursorPosition = Math.max(0, cursorPosition + diff);
                this.setSelectionRange(newCursorPosition, newCursorPosition);
            }
        });
        
        // Валидация при потере фокуса
        input.addEventListener('blur', function() {
            if (this.value && !isValidPhone(this.value)) {
                this.style.borderColor = '#e74c3c';
                this.style.backgroundColor = '#ffeaea';
                showNotification('📞 Введите корректный номер телефона (российский формат)', 'error');
            } else {
                this.style.borderColor = '';
                this.style.backgroundColor = '';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = '';
            this.style.backgroundColor = '';
        });
    });
}

// Функция форматирования номера телефона
function formatPhoneNumber(phone) {
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    
    let formatted = '';
    
    if (digits.startsWith('7') || digits.startsWith('8')) {
        // Российский формат
        const match = digits.match(/^[78]?(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        if (match) {
            const groups = match.slice(1).filter(Boolean);
            if (groups.length > 0) {
                formatted = '+7';
                if (groups[0]) formatted += ` (${groups[0]}`;
                if (groups[1]) formatted += `) ${groups[1]}`;
                if (groups[2]) formatted += `-${groups[2]}`;
                if (groups[3]) formatted += `-${groups[3]}`;
            }
        }
    } else {
        // Международный формат (базовый)
        formatted = `+${digits}`;
    }
    
    return formatted;
}

// === ОБРАБОТКА ФОРМ ===
function initForms() {
    // Основные формы
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // Кнопки "Записаться" вне форм
    initSignupButtons();
    
    // Кнопка "Смотреть видео"
    initVideoButton();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Сбор данных формы
    const formData = {
        name: form.querySelector('input[type="text"]')?.value || 'Не указано',
        phone: form.querySelector('input[type="tel"]')?.value || 'Не указано',
        direction: form.querySelector('select')?.value || 'Не указано',
        message: form.querySelector('textarea')?.value || 'Не указано',
        page: window.location.href
    };
    
    // Валидация
    if (!isValidName(formData.name)) {
        showNotification('👤 Пожалуйста, введите ваше имя (минимум 2 буквы)', 'error');
        form.querySelector('input[type="text"]').focus();
        return;
    }
    
    const phoneInput = form.querySelector('input[type="tel"]');
    const phoneValue = phoneInput.value;
    
    if (!phoneValue) {
        showNotification('📞 Пожалуйста, введите номер телефона', 'error');
        phoneInput.focus();
        return;
    }
    
    if (!isValidPhone(phoneValue)) {
        showNotification('📞 Введите корректный номер телефона (российский формат)', 'error');
        phoneInput.focus();
        return;
    }
    
    // Показываем загрузку
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        const result = await sendToTelegram(formData);
        
        if (result.success) {
            showNotification('✅ Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
            form.reset();
        } else {
            throw new Error(result.error || 'Ошибка отправки в Telegram');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        
        // Детализированные сообщения об ошибках
        let errorMessage = '❌ Ошибка отправки. ';
        
        if (error.message.includes('network') || error.message.includes('Network')) {
            errorMessage += 'Проверьте подключение к интернету.';
        } else if (error.message.includes('Telegram')) {
            errorMessage += 'Проблема с сервисом уведомлений.';
        } else {
            errorMessage += 'Пожалуйста, позвоните нам: +7 (966) 177-51-33';
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function initSignupButtons() {
    document.querySelectorAll('.btn-primary, .signup-btn').forEach(btn => {
        if (btn.textContent.includes('Записаться') && !btn.closest('form')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const contactsSection = document.querySelector('#contacts-preview') || 
                                      document.querySelector('#contacts') || 
                                      document.querySelector('.contacts-page');
                if (contactsSection) {
                    contactsSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
}

function initVideoButton() {
    document.querySelector('.btn-secondary')?.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('🎬 Видео с тренировками скоро появится на нашем сайте!', 'success');
    });
}

// === АНИМАЦИИ ===
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Анимируем карточки
    const animatedElements = document.querySelectorAll('.advantage-card, .coach-card, .price-card, .direction-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ КАРТ ===
function openInYandexMaps() {
    const address = "Москва, улица Ибрагимова, 30";
    const url = `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
}

function buildRoute() {
    const address = "Москва, улица Ибрагимова, 30";
    const url = `https://yandex.ru/maps/?rtext=~${encodeURIComponent(address)}`;
    window.open(url, '_blank');
}