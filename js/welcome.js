document.addEventListener('DOMContentLoaded', function() {
    const ufoContainer = document.querySelector('.ufo-container');
    const beam = document.querySelector('.ufo-beam');
    const welcomeMsg = document.querySelector('.ufo-welcome');

    let particleInterval = null;

    function createBeamParticles() {
        if (particleInterval) return;

        for (let i = 0; i < 15; i++) {
            createSingleParticle();
        }

        particleInterval = setInterval(() => {
            createSingleParticle();
            if (beam.classList.contains('full') && Math.random() > 0.3) {
                createSingleParticle();
            }
        }, 100);
    }

    function createSingleParticle() {
        const particle = document.createElement('div');
        particle.className = 'beam-particle';

        const size = Math.random() * 6 + 2;
        const beamWidth = beam.classList.contains('full') ? 350 : 180;
        const yPos = Math.random();
        const topWidth = beamWidth * 0.2;
        const widthAtY = topWidth + (beamWidth - topWidth) * yPos;

        let xDistribution = Math.random();
        if (Math.random() > 0.6) {
            xDistribution = Math.random() > 0.5 ? Math.random() * 0.3 : 1 - Math.random() * 0.3;
        }

        const offsetX = (xDistribution - 0.5) * widthAtY;
        const beamHeight = 400;

        const edgeFactor = Math.abs(offsetX / 180) * 2;
        const duration = (Math.random() * 1.5 + 1) / (1 + edgeFactor);

        const endX = offsetX + (Math.random() - 0.5) * 100 * edgeFactor;
        const endY = Math.random() * 100 + 50;

        const animName = `particle-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes ${animName} {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: ${Math.random() * 0.4 + 0.6};
                }
                ${Math.random() * 20 + 40}% {
                    opacity: ${Math.random() * 0.3 + 0.5};
                }
                100% {
                    transform: translate(${endX}px, ${endY}px) scale(${Math.random() * 0.3 + 0.1});
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleElement);

        Object.assign(particle.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: '50%',
            top: '0',
            transform: `translate(calc(-50% + ${offsetX}px), ${yPos * beamHeight}px)`,
            opacity: '0',
            animation: `${animName} ${duration}s ease-out forwards`,
        });

        beam.appendChild(particle);

        setTimeout(() => {
            particle.remove();
            styleElement.remove();
        }, duration * 1000 + 500);
    }

    function startSequence() {
        setTimeout(() => {
            beam.classList.add('extended');
        }, 400);
    
        setTimeout(() => {
            beam.classList.add('wide');
        }, 900);
    
        setTimeout(() => {
            beam.classList.add('full');
            createBeamParticles();
    
            setTimeout(() => {
                welcomeMsg.classList.add('visible');
    
                setTimeout(() => {
                    welcomeMsg.classList.add('float');
    
                    document.querySelectorAll('.welcome-button').forEach(button => {
                        button.addEventListener('mouseover', () => {
                            button.style.transform = 'translateY(-3px)';
                            button.style.boxShadow = '0 8px 20px var(--rocket-silver)';
                        });
                        button.addEventListener('mouseout', () => {
                            button.style.transform = '';
                            button.style.boxShadow = '';
                        });
                    });
    
                }, 300); 
    
            }, 2000); 
    
        }, 1700);
    }    

    setTimeout(startSequence, 3500);
});

// document.querySelector(".primary").addEventListener("click" , function(){
//     window.location.replace("html/Signup.html"); 
// });
// document.querySelector(".secondary").addEventListener("click" , function(){
//     window.location.replace("html/login.html"); 
// });