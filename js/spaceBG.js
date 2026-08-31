document.addEventListener('DOMContentLoaded', () => {

const starsContainer = document.querySelector('.stars');

Array.from({ length: 400 }).forEach(() => {
    const star = document.createElement('div');
    star.classList.add('star');

    if (Math.random() > 0.3) {
        star.classList.add('star-white');
    } else {
        star.classList.add('star-pink');
    }

    const size = `${Math.random() * 2 + 1}px`;
    Object.assign(star.style, {
        width: size,
        height: size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`
    });

    starsContainer.appendChild(star);
});


const createMeteor = () => {
    const template = document.querySelector('.meteor');

    const meteor = template.cloneNode(true);
    meteor.style.display = 'block';

    const left = Math.random() * window.innerWidth * 0.7;
    const top = Math.random() * window.innerHeight * 0.4;

    meteor.style.position = 'absolute';
    meteor.style.left = `${left}px`;
    meteor.style.top = `${top}px`;

    document.body.appendChild(meteor);

    setTimeout(() => meteor.remove(), 1000);
};

setInterval(() => {
    if (Math.random() < 0.8) createMeteor();
}, 2000);


});
