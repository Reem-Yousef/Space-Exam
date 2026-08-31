document.addEventListener('DOMContentLoaded', () => {
    const answered = localStorage.getItem('answered') || "0";
    const total = localStorage.getItem('total') || "5";
    
    const answeredElement = document.getElementById('answered');
    const totalElement = document.getElementById('total');
    
    if (answeredElement && totalElement) {
        answeredElement.textContent = answered;
        totalElement.textContent = total;
    }
    
    // تنظيف localStorage إذا لزم الأمر
    // localStorage.removeItem('answered');
    // localStorage.removeItem('total');
});