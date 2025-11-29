// app.js - Đảm bảo hàm showPage hoạt động
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
}