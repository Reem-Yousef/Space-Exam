document.addEventListener('DOMContentLoaded', () => {
    const starsContainer = document.querySelector('.stars');
       
    const successContainer = document.getElementById('success');
    
    function createParticles() {
        if (successContainer.style.display === 'none') return;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                const x = Math.random() * successContainer.offsetWidth;
                const y = Math.random() * successContainer.offsetHeight;
                
                const colors = ['#ff36a3', '#ffadd2', '#ff00ff', '#b5338a', '#ffffff'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                Object.assign(particle.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                    backgroundColor: color,
                    animation: `float-up ${1 + Math.random() * 2}s linear forwards`,
                    animationDelay: `${Math.random() * 0.5}s`
                });
                
                successContainer.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 3000);
            }, i * 100);
        }
    }

    setInterval(createParticles, 500);

    const results = JSON.parse(localStorage.getItem('examResults'));
    
    if (results) {
        document.getElementById('correct').textContent = results.correctAnswers;
        document.getElementById('total').textContent = results.totalQuestions;
        
        const minutes = Math.floor(results.timeSpent / 60);
        const seconds = results.timeSpent % 60;
        document.getElementById('timeSpent').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('scorePercent').textContent = results.score;
        
        const messageElement = document.querySelector('.result-message');
        if (results.score >= 90) {
            messageElement.textContent = "Outstanding performance! You're a cosmic genius!";
        } else if (results.score >= 70) {
            messageElement.textContent = "Great job! You've demonstrated excellent knowledge.";
        } else {
            messageElement.textContent = "Good effort! Keep exploring the cosmic knowledge.";
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
  
});
