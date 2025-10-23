// TOÀN BỘ JAVASCRIPT CỦA BẠN ĐƯỢC CHUYỂN VÀO ĐÂY

let isFirstLoad = true;
let deferredPrompt;

document.addEventListener('DOMContentLoaded', function() {
  if (isFirstLoad && !sessionStorage.getItem('fromInternal')) {
    document.getElementById('popup').style.display = 'flex';
  }
  sessionStorage.removeItem('fromInternal');
  checkAndShowTKB();
  checkNewContent();
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt();
  });

  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('Ứng dụng đang chạy ở chế độ standalone');
    localStorage.setItem('appInstalled', 'true');
  }
  
  // Thêm iOS support
  showIOSInstallGuide();
});

function setFromInternal() {
  sessionStorage.setItem('fromInternal', 'true');
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
  isFirstLoad = false;
}

function checkAndShowTKB() {
  if (localStorage.getItem('showTKB') === 'true') {
    showPage('tkb');
    localStorage.removeItem('showTKB');
  }
}

function showPage(page) {
  document.getElementById('home').style.display = 'none';
  document.getElementById('tkb').style.display = 'none';
  document.getElementById(page).style.display = 'block';
}

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
  
  document.getElementById('flowers-container').appendChild(flower);
  
  setTimeout(() => {
    flower.remove();
  }, duration * 1000);
}

setInterval(createFlower, 500);
showPage('home');

function checkNewContent() {
  const lastVisit = localStorage.getItem('lastVisit');
  const currentTime = new Date().getTime();
  
  const newSubjects = [
    'HÓA FULL',
    'HÓA TRẮC NGHIỆM', 
    'HÓA ĐÚNG SAI',
    'SỬ TRẮC NGHIỆM',
    'SỬ ĐÚNG SAI'
  ];
  
  if (!lastVisit || (currentTime - lastVisit) > 24 * 60 * 60 * 1000) {
    if (newSubjects.length > 0) {
      showNewContentNotification(newSubjects);
    }
  }
  
  localStorage.setItem('lastVisit', currentTime);
}

function showNewContentNotification(subjects) {
  const notification = document.getElementById('newContentNotification');
  const badge = document.getElementById('newBadge');
  const subjectsList = document.getElementById('newSubjectsList');
  
  subjectsList.textContent = `Môn mới: ${subjects.slice(0, 3).join(', ')}${subjects.length > 3 ? '...' : ''}`;
  notification.style.display = 'block';
  badge.style.display = 'inline-flex';
  
  setTimeout(() => {
    if (notification.style.display !== 'none') {
      closeNewNotification();
    }
  }, 10000);
}

function closeNewNotification() {
  document.getElementById('newContentNotification').style.display = 'none';
  document.getElementById('newBadge').style.display = 'none';
}

// PWA INSTALL PROMPT MỚI
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

function showInstallSuccess() {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #4CAF50;
      color: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      z-index: 10000;
      text-align: center;
      animation: fadeIn 0.5s;
    ">
      <div style="font-size: 2rem; margin-bottom: 10px;">🎉</div>
      <strong>Cài đặt Thành công!</strong><br>
      <small>Ứng dụng đã được thêm vào màn hình chính</small>
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// IOS SUPPORT
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function showIOSInstallGuide() {
  if (isIOS() && !localStorage.getItem('iosGuideShown')) {
    const iosGuide = `
      <div id="iosGuide" style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); z-index: 10000; 
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="
          background: white; padding: 25px; border-radius: 15px; 
          max-width: 300px; text-align: center; margin: 20px;
        ">
          <h5 style="color: #d32f2f; margin-bottom: 15px;">📱 Thêm vào Màn hình chính</h5>
          <p style="margin-bottom: 20px; font-size: 14px;">
            <strong>Bước 1:</strong> Chọn <span style="color: #007AFF">⎋</span> (Share)<br>
            <strong>Bước 2:</strong> Chọn "Thêm vào Màn hình chính"<br>
            <strong>Bước 3:</strong> Nhấn "Thêm"
          </p>
          <button onclick="closeIOSGuide()" style="
            background: #d32f2f; color: white; border: none; 
            padding: 10px 20px; border-radius: 20px; font-weight: 600;
          ">Đã hiểu</button>
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

// SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js')
      .then(function(registration) {
        console.log('✅ Service Worker registered: ', registration);
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch(function(error) {
        console.log('❌ Service Worker failed: ', error);
      });
  });
}

window.addEventListener('appinstalled', (evt) => {
  console.log('Ứng dụng đã được cài đặt thành công');
  localStorage.setItem('appInstalled', 'true');
});