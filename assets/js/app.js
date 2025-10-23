// app.js - 12AT1 Application
console.log('🚀 12AT1 App.js loaded');

// Biến toàn cục
let deferredPrompt;
let currentPage = 'home';

// Khởi tạo ứng dụng khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 12AT1 App Initializing...');
    
    // Khởi tạo các chức năng
    initApp();
    registerServiceWorker();
    setupEventListeners();
    checkNewContent();
    
    // Kiểm tra nếu cần hiển thị TKB từ trang chủ
    if (localStorage.getItem('showTKB') === 'true') {
        showPage('tkb');
        localStorage.removeItem('showTKB');
    }
});

// Khởi tạo ứng dụng
function initApp() {
    console.log('🎯 Initializing app...');
    
    // Hiển thị trang mặc định
    showPage('home');
    
    // Hiển thị popup thông báo sau 2 giây
    setTimeout(showPopup, 2000);
    
    // Khởi tạo hiệu ứng hoa rơi
    initFlowerEffect();
    
    console.log('✅ App initialized successfully');
}

// Đăng ký Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('✅ Service Worker registered with scope:', registration.scope);
            })
            .catch(function(error) {
                console.log('❌ Service Worker registration failed:', error);
            });
    } else {
        console.log('❌ Service Worker not supported');
    }
}

// Thiết lập event listeners
function setupEventListeners() {
    // Lắng nghe sự kiện beforeinstallprompt cho PWA
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('🚀 beforeinstallprompt event fired');
        e.preventDefault();
        deferredPrompt = e;
        
        // Hiển thị prompt cài đặt sau 5 giây
        setTimeout(showInstallPrompt, 5000);
    });

    // Lắng nghe sự kiện app installed
    window.addEventListener('appinstalled', (evt) => {
        console.log('✅ PWA was installed successfully');
        hideInstallPrompt();
    });

    // Kiểm tra nếu app đã chạy ở chế độ standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('📱 App running in standalone mode');
        hideInstallPrompt();
    }
}

// Hiển thị prompt cài đặt PWA
function showInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt && deferredPrompt) {
        installPrompt.style.display = 'block';
        console.log('📱 Showing install prompt');
    }
}

// Ẩn prompt cài đặt
function hideInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
        installPrompt.style.display = 'none';
    }
}

// Cài đặt ứng dụng
function installApp() {
    if (!deferredPrompt) {
        console.log('❌ No deferred prompt available');
        return;
    }

    console.log('📱 Installing app...');
    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('✅ User accepted the install prompt');
        } else {
            console.log('❌ User dismissed the install prompt');
        }
        deferredPrompt = null;
        hideInstallPrompt();
    });
}

// Đóng prompt cài đặt
function closeInstallPrompt() {
    console.log('📱 Install prompt closed');
    hideInstallPrompt();
}

// Hiển thị popup thông báo
function showPopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'flex';
        console.log('💡 Showing info popup');
    }
}

// Đóng popup thông báo
function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'none';
        console.log('💡 Info popup closed');
    }
}

// Kiểm tra nội dung mới
function checkNewContent() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = new Date().getTime();
    const newContentBadge = document.getElementById('newBadge');
    
    if (!lastVisit || (now - lastVisit) > 6 * 60 * 60 * 1000) { // 6 giờ
        showNewContentNotification();
        if (newContentBadge) {
            newContentBadge.style.display = 'inline';
        }
    }
    
    localStorage.setItem('lastVisit', now);
}

// Hiển thị thông báo nội dung mới
function showNewContentNotification() {
    const notification = document.getElementById('newContentNotification');
    const subjectsList = document.getElementById('newSubjectsList');
    
    if (notification && subjectsList) {
        subjectsList.textContent = 'Có bài tập mới các môn: Địa lý, Vật lý, Hóa học';
        notification.style.display = 'block';
        console.log('📢 Showing new content notification');
    }
}

// Đóng thông báo nội dung mới
function closeNewNotification() {
    const notification = document.getElementById('newContentNotification');
    if (notification) {
        notification.style.display = 'none';
        console.log('📢 New content notification closed');
    }
}

// Chuyển trang
function showPage(page) {
    console.log('🔄 Switching to page:', page);
    
    // Ẩn tất cả các trang
    const homePage = document.getElementById('home');
    const tkbPage = document.getElementById('tkb');
    
    if (homePage) homePage.style.display = 'none';
    if (tkbPage) tkbPage.style.display = 'none';
    
    // Cập nhật menu active
    updateActiveMenu(page);
    
    // Hiển thị trang được chọn
    switch(page) {
        case 'home':
            if (homePage) homePage.style.display = 'block';
            currentPage = 'home';
            break;
        case 'tkb':
            if (tkbPage) tkbPage.style.display = 'block';
            currentPage = 'tkb';
            break;
        default:
            if (homePage) homePage.style.display = 'block';
            currentPage = 'home';
    }
    
    console.log('✅ Page switched to:', page);
}

// Cập nhật menu active
function updateActiveMenu(activePage) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (activePage === 'home' && link.textContent === 'Bài Tập') {
            link.classList.add('active');
        } else if (activePage === 'tkb' && link.textContent === 'Thời Khóa Biểu') {
            link.classList.add('active');
        } else if (activePage === 'kiemtra' && link.getAttribute('href') === 'kiemtra.html') {
            link.classList.add('active');
        }
    });
}

// Chuyển đến trang TKB từ menu
function goToTKB() {
    console.log('📅 Redirecting to schedule page');
    localStorage.setItem('showTKB', 'true');
}

// Đánh dấu chuyển trang nội bộ
function setFromInternal() {
    sessionStorage.setItem('fromInternal', 'true');
    console.log('🔗 Internal navigation marked');
}

// Khởi tạo hiệu ứng hoa rơi
function initFlowerEffect() {
    console.log('🌸 Initializing flower effect');
    // Hiệu ứng hoa sẽ được tạo tự động bởi setInterval
}

// Tạo hiệu ứng hoa rơi
function createFlower() {
    const flower = document.createElement('div');
    const flowers = ['🌸', '🌺', '💮', '🏵️', '🌼', '🌻'];
    flower.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];
    flower.classList.add('falling-flower');
    
    const left = Math.random() * 100;
    flower.style.left = left + 'vw';
    
    const size = Math.random() * 20 + 15;
    flower.style.fontSize = size + 'px';
    
    const duration = Math.random() * 10 + 5;
    flower.style.animationDuration = duration + 's';
    
    const flowersContainer = document.getElementById('flowers-container');
    if (flowersContainer) {
        flowersContainer.appendChild(flower);
        
        setTimeout(() => {
            if (flower.parentNode) {
                flower.remove();
            }
        }, duration * 1000);
    }
}

// Tạo hoa liên tục
setInterval(createFlower, 500);

// Xử lý lỗi toàn cục
window.addEventListener('error', function(e) {
    console.error('🚨 Global error:', e.error);
});

// Debug info
function debugInfo() {
    const debugData = {
        currentPage: currentPage,
        deferredPrompt: !!deferredPrompt,
        serviceWorker: 'serviceWorker' in navigator,
        standalone: window.matchMedia('(display-mode: standalone)').matches,
        userAgent: navigator.userAgent
    };
    console.log('🔍 Debug Info:', debugData);
    return debugData;
}

// Export functions for global use (nếu cần)
window.app = {
    showPage,
    installApp,
    closeInstallPrompt,
    debugInfo
};

console.log('✅ app.js loaded completely');