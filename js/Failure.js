document.addEventListener('DOMContentLoaded', () => {
    const results = JSON.parse(localStorage.getItem('examResults'));
    
    if (results) {
        document.getElementById('correct').textContent = results.correctAnswers;
        document.getElementById('total').textContent = results.totalQuestions;
        
        const minutes = Math.floor(results.timeSpent / 60);
        const seconds = results.timeSpent % 60;
        document.getElementById('timeSpent').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('scorePercent').textContent = results.score;
        
        const failureMessage = document.getElementById('failureMessage');
        if (results.score >= 50) {
            failureMessage.textContent = "So close! You were just " + (70 - results.score) + "% away from passing. Try again!";
        } else if (results.score >= 30) {
            failureMessage.textContent = "Keep studying! You're making progress but need more cosmic knowledge.";
        } else {
            failureMessage.textContent = "The black hole of knowledge awaits! Review the material and try again.";
        }
        
        document.getElementById('reviewBtn').addEventListener('click', () => {
            localStorage.setItem('showReview', 'true');
            window.location.href = 'Review.html';
        });
    }
});
