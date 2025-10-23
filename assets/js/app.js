// === BIẾN TOÀN CỤC ===
let isFirstLoad = true;
let deferredPrompt;

// === PWA INSTALL HANDLERS ===
function showInstallPrompt() {
  if (!localStorage.getItem('appInstalled') && !isIOS()) {
    setTimeout(() => {
      const prompt = document.getElementById('installPrompt');
      if (prompt) {
        prompt.style.display = 'block';
        
        setTimeout(() => {
          if (prompt.style.display !== 'none') {
            closeInstallPrompt();
          }
        }, 15000);
      }
    }, 4000);
  }
}

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('🎉 Người dùng đã cài đặt ứng dụng');
        localStorage.setItem('appInstalled', 'true');
        showInstallSuccess();
      }
      closeInstallPrompt();
    });
  } else {
    alert('📱 Mở menu trình duyệt và chọn "Thêm vào màn hình chính"');
    closeInstallPrompt();
  }
}

function closeInstallPrompt() {
  const prompt = document.getElementById('installPrompt');
  if (prompt) prompt.style.display = 'none';
  localStorage.setItem('lastPromptTime', new Date().getTime());
}

// === PAGE NAVIGATION ===
function showPage(page) {
  document.getElementById('home').style.display = 'none';
  document.getElementById('tkb').style.display = 'none';
  document.getElementById(page).style.display = 'block';
}

function setFromInternal() {
  sessionStorage.setItem('fromInternal', 'true');
}

// === IOS SUPPORT ===
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function showIOSInstallGuide() {
  if (isIOS() && !localStorage.getItem('iosGuideShown')) {
    const iosGuide = `
      <div id="iosGuide" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; padding: 25px; border-radius: 15px; max-width: 300px; text-align: center; margin: 20px;">
          <h5 style="color: #d32f2f; margin-bottom: 15px;">📱 Thêm vào Màn hình chính</h5>
          <p style="margin-bottom: 20px; font-size: 14px;">
            <strong>Bước 1:</strong> Chọn <span style="color: #007AFF">⎋</span> (Share)<br>
            <strong>Bước 2:</strong> Chọn "Thêm vào Màn hình chính"<br>
            <strong>Bước 3:</strong> Nhấn "Thêm"
          </p>
          <button onclick="closeIOSGuide()" style="background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600;">Đã hiểu</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', iosGuide);
    localStorage.setItem('iosGuideShown', 'true');
  }
}

function closeIOSGuide() {
  const guide = document.getElementById('iosGuide');
  if (guide) guide.remove();
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {
  // Popup logic
  if (isFirstLoad && !sessionStorage.getItem('fromInternal')) {
    document.getElementById('popup').style.display = 'flex';
  }
  sessionStorage.removeItem('fromInternal');
  
  // PWA Events
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt();
  });
  
  // iOS Guide
  showIOSInstallGuide();
  
  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
      .then(registration => console.log('SW registered'))
      .catch(error => console.log('SW registration failed'));
  }
  
  // Default page
  showPage('home');
});

// Thêm các functions khác từ code cũ của bạn...