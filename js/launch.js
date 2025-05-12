const rocketContainer = document.querySelector('.rocket-container');
const exhaust = document.querySelector('.exhaust-flame');
const countdown = document.querySelector('.countdown');

rocketContainer.style.animation = 'rocketIdle 2s infinite ease-in-out';

setTimeout(startLaunchSequence, 1000);

function startLaunchSequence() {
    countdown.style.opacity = '1';
    let count = 3;
    countdown.textContent = count;

    const countInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdown.textContent = count;
        } else if (count === 0) {
            countdown.textContent = 'LAUNCH!';
        } else {
            clearInterval(countInterval);
            countdown.style.opacity = '0';
            launchRocket();
        }
    }, 1000);
}

function launchRocket() {
    rocketContainer.style.animation = 'none';

    exhaust.style.height = '40px';
    exhaust.style.opacity = '1';
    exhaust.style.animation = 'flameFlicker 0.2s infinite';

    setTimeout(() => {
        rocketContainer.style.animation = 'rocketLaunch 3s forwards ease-in-out';

        setTimeout(() => {
            startButton.style.opacity = '1';
            startButton.style.transform = 'translateY(0)';
        }, 2000);
    }, 500);
}

const startButton = document.querySelector('.start-button');
const gidePopup = document.querySelector('.Quiz-gide');
const main = document.querySelector('.main');

startButton.onclick = () => {
    gidePopup.classList.add('active');
    main.classList.add('active');
}

document.addEventListener('click', function(event) {
    const isClickInsidePopup = gidePopup.contains(event.target);
    const isStartButton = startButton.contains(event.target);

    if (!isClickInsidePopup && !isStartButton && gidePopup.classList.contains('active')) {
        gidePopup.classList.remove('active');
        main.classList.remove('active');
    }

    

});

document.getElementById("startExamBtn").addEventListener("click" , function(){
    location.replace("Exam.html"); 
});
