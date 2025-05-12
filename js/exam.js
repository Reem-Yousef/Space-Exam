document.addEventListener('DOMContentLoaded', async () => {
    const elements = {
        questionTitle: document.getElementById('question-title'),
        questionText: document.getElementById('question-text'),
        questionContainer: document.querySelector('.question-container'),
        answersContainer: document.getElementById('answers-container'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        submitBtn: document.getElementById('submitBtn'),
        markBtn: document.getElementById('markBtn'),
        markedList: document.getElementById('markedList'),
        questionNumbers: document.querySelectorAll('.question-number'),
        timerElement: document.querySelector('.timer'),
        showMarkedBtn: document.getElementById('showMarkedBtn'),
        showUnansweredBtn: document.getElementById('showUnansweredBtn'),
        markedPopup: document.getElementById('markedPopup'),
        unansweredPopup: document.getElementById('unansweredPopup'),
        closeBtns: document.querySelectorAll('.close-btn'),
        unansweredList: document.getElementById('unansweredList')
    };

    const state = {
        originalQuestions: [],
        questions: [],
        currentQuestionIndex: 0,
        userAnswers: new Map(),
        markedQuestions: [],
        timeLeft: 120,
        timerInterval: null,
        shakeInterval: null,
        isShaking: false
    };

    const handlePreviousQuestion = () => {
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            loadQuestion(state.currentQuestionIndex);
        }
    };

    const handleNextQuestion = () => {
        if (state.currentQuestionIndex < state.questions.length - 1) {
            state.currentQuestionIndex++;
            loadQuestion(state.currentQuestionIndex);
        }
    };

    const toggleQuestionMark = () => {
        const index = state.currentQuestionIndex;
        if (state.markedQuestions.includes(index)) {
            state.markedQuestions = state.markedQuestions.filter(i => i !== index);
        } else {
            state.markedQuestions.push(index);
        }
        updateQuestionNumbers();
        updateMarkedButton();
    };

    const handleSubmit = () => {
        trySubmitTest();
    };

    const navigateToQuestion = (index) => {
        state.currentQuestionIndex = index;
        loadQuestion(state.currentQuestionIndex);
    };

    const handleClosePopup = function() {
        const popup = this.closest('.popup');
        closePopup(popup.id);
    };

    const handleWindowClick = (event) => {
        if (event.target.classList.contains('popup')) {
            closePopup(event.target.id);
        }
    };

    const handlePopState = (event) => {
        window.history.pushState(null, null, window.location.href);
        alert("الرجاء عدم استخدام زر الرجوع خلال الاختبار!");
    };

    const setupEventListeners = () => {
        elements.prevBtn.addEventListener('click', handlePreviousQuestion);
        elements.nextBtn.addEventListener('click', handleNextQuestion);
        elements.markBtn.addEventListener('click', toggleQuestionMark);
        elements.submitBtn.addEventListener('click', handleSubmit);
        elements.showMarkedBtn.addEventListener('click', () => openPopup('markedPopup'));
        elements.showUnansweredBtn.addEventListener('click', () => openPopup('unansweredPopup'));
        
        elements.questionNumbers.forEach((number, index) => {
            number.addEventListener('click', () => navigateToQuestion(index));
        });

        elements.closeBtns.forEach(btn => {
            btn.addEventListener('click', handleClosePopup);
        });

    };

    const shuffle = (array) => {
        let currentIndex = array.length;
        while (currentIndex > 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    const prepareExam = () => {
        state.questions = JSON.parse(JSON.stringify(state.originalQuestions));
        
        shuffle(state.questions);
        
        state.questions.forEach((q, index) => {
            q.uniqueId = index;
            
            const correctAnswerText = q.correctAnswer;
            const answers = [
                { text: q.answer1, isCorrect: q.answer1 === correctAnswerText },
                { text: q.answer2, isCorrect: q.answer2 === correctAnswerText },
                { text: q.answer3, isCorrect: q.answer3 === correctAnswerText },
                { text: q.answer4, isCorrect: q.answer4 === correctAnswerText }
            ];
            
            shuffle(answers);
            
            q.answer1 = answers[0].text;
            q.answer2 = answers[1].text;
            q.answer3 = answers[2].text;
            q.answer4 = answers[3].text;
            q.correctAnswer = answers.find(a => a.isCorrect).text;
            q.originalCorrectAnswer = correctAnswerText;
            q.shuffledAnswers = answers.map(a => a.text);
        });
    };

    const loadQuestions = async () => {
        try {
            const response = await fetch('questions.json');
            state.originalQuestions = await response.json();
            prepareExam();
            startTimer();
            loadQuestion(state.currentQuestionIndex);
            updateUI();
        } catch (error) {
            console.error('Error loading questions:', error);
            elements.questionText.textContent = 'Error loading questions. Please try again later.';
        }
    };

    const loadQuestion = (index) => {
        if (!state.questions.length) return;

        const question = state.questions[index];
        elements.questionTitle.textContent = `Question ${index + 1}`;
        elements.questionText.textContent = question.title;
        
        const fragment = document.createDocumentFragment();
        
        question.shuffledAnswers.forEach((answer, i) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            
            answerDiv.addEventListener('click', (e) => {
                const radioInput = answerDiv.querySelector('input[type="radio"]');
                
                if (e.target !== radioInput) {
                    radioInput.checked = true;
                    
                    const changeEvent = new Event('change');
                    radioInput.dispatchEvent(changeEvent);
                }
            });

            const input = document.createElement('input');
            input.type = 'radio';
            input.id = `answer${i}`;
            input.name = 'question';
            input.value = answer;
            input.checked = state.userAnswers.get(index) === answer;

            input.addEventListener('change', () => {
                state.userAnswers.set(index, answer);
                updateUI();
            });

            const label = document.createElement('label');
            label.htmlFor = `answer${i}`;
            label.textContent = answer;

            answerDiv.appendChild(input);
            answerDiv.appendChild(label);
            fragment.appendChild(answerDiv);
        });
        
        elements.answersContainer.innerHTML = '';
        elements.answersContainer.appendChild(fragment);
        
        updateUI();
    };

    const updateUI = () => {
        updateNavigationButtons();
        updateQuestionNumbers();
        updateMarkedButton();
        updateSubmitButton();
        updateUnansweredList();
    };

    const updateNavigationButtons = () => {
        elements.prevBtn.style.display = state.currentQuestionIndex === 0 ? 'none' : 'block';
        elements.nextBtn.style.display = state.currentQuestionIndex === state.questions.length - 1 ? 'none' : 'block';
        elements.submitBtn.style.display = state.currentQuestionIndex === state.questions.length - 1 ? 'block' : 'none';
    };

    const updateQuestionNumbers = () => {
        elements.questionNumbers.forEach((num, i) => {
            const classesToAdd = [];
            const classesToRemove = ['active', 'answered', 'marked'];
            
            if (i === state.currentQuestionIndex) classesToAdd.push('active');
            if (state.userAnswers.has(i)) classesToAdd.push('answered');
            if (state.markedQuestions.includes(i)) classesToAdd.push('marked');
            
            num.classList.remove(...classesToRemove);
            if (classesToAdd.length) num.classList.add(...classesToAdd);
        });
    };

    const getUnansweredQuestions = () => {
        return Array.from({ length: state.questions.length }, (_, i) => i)
            .filter(i => !state.userAnswers.has(i));
    };

    const updateUnansweredList = () => {
        const unansweredQuestions = getUnansweredQuestions();
        elements.showUnansweredBtn.textContent = `Unanswered Questions (${unansweredQuestions.length})`;
        
        if (elements.unansweredPopup.style.display === 'flex') {
            renderUnansweredList(unansweredQuestions);
        }
    };
    
    const renderUnansweredList = (unansweredQuestions) => {
        const fragment = document.createDocumentFragment();
        
        if (unansweredQuestions.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'All questions answered';
            fragment.appendChild(li);
        } else {
            unansweredQuestions.forEach(index => {
                const li = document.createElement('li');
                const div = document.createElement('div');
                div.className = 'unanswered-question-text';
                div.textContent = `Question ${index + 1}`;
                
                li.appendChild(div);
                li.addEventListener('click', () => {
                    state.currentQuestionIndex = index;
                    loadQuestion(state.currentQuestionIndex);
                    closePopup('unansweredPopup');
                });
                
                fragment.appendChild(li);
            });
        }
        
        elements.unansweredList.innerHTML = '';
        elements.unansweredList.appendChild(fragment);
    };

    const updateSubmitButton = () => {
        const unansweredCount = getUnansweredQuestions().length;
        
        elements.submitBtn.title = unansweredCount > 0 
            ? `Click to go to first unanswered question (${unansweredCount} questions remaining)` 
            : 'Submit your exam';
        
        elements.submitBtn.classList.toggle('highlight-button', unansweredCount > 0);
        elements.submitBtn.classList.toggle('ready-submit', unansweredCount === 0);
    };

    const updateMarkedList = () => {
        elements.showMarkedBtn.textContent = `Marked Questions (${state.markedQuestions.length})`;
        
        if (elements.markedPopup.style.display === 'flex') {
            renderMarkedList();
        }
    };
    
    const renderMarkedList = () => {
        const fragment = document.createDocumentFragment();
        
        if (state.markedQuestions.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No marked questions';
            fragment.appendChild(li);
        } else {
            state.markedQuestions.forEach(index => {
                const li = document.createElement('li');
                
                const textDiv = document.createElement('div');
                textDiv.className = 'marked-question-text';
                textDiv.textContent = `Question ${index + 1}`;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-mark-btn';
                removeBtn.textContent = '×';
                removeBtn.dataset.index = index;
                
                li.appendChild(textDiv);
                li.appendChild(removeBtn);
                
                li.addEventListener('click', (e) => {
                    if (e.target === removeBtn) {
                        e.stopPropagation();
                        const indexToRemove = parseInt(removeBtn.dataset.index);
                        state.markedQuestions = state.markedQuestions.filter(i => i !== indexToRemove);
                        updateMarkedButton();
                        updateQuestionNumbers();
                        renderMarkedList(); // Re-render after removal
                    } else {
                        state.currentQuestionIndex = index;
                        loadQuestion(state.currentQuestionIndex);
                        closePopup('markedPopup');
                    }
                });
                
                fragment.appendChild(li);
            });
        }
        
        elements.markedList.innerHTML = '';
        elements.markedList.appendChild(fragment);
    };

    const updateMarkedButton = () => {
        elements.showMarkedBtn.textContent = `Marked Questions (${state.markedQuestions.length})`;
    };

    const startTimer = () => {
        clearInterval(state.timerInterval);
        updateTimerDisplay();
        state.timerInterval = setInterval(() => {
            state.timeLeft--;
            updateTimerDisplay();
            if (state.timeLeft <= 0) handleTimeOut();
        }, 1000);
    };
const updateTimerDisplay = () => {
    const minutes = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
    const seconds = (state.timeLeft % 60).toString().padStart(2, '0');
    const clockIcon = document.querySelector('.clock-icon');

    elements.timerElement.innerHTML = `
        <img src="../images/download (1).png" class="clock-icon">
        <p class="time-display">${minutes}:${seconds}</p>
    `;
    
    const isWarning = state.timeLeft <= 30;
    elements.timerElement.classList.toggle('warning', isWarning);
    
    if (isWarning) {
        elements.timerElement.style.animation = 'pulse-warning 1s infinite alternate';
        
        if (!state.isShaking) {
            state.isShaking = true;
            state.shakeInterval = setInterval(() => {
                const clockIcon = document.querySelector('.clock-icon');
                if (clockIcon) {
                    clockIcon.classList.add('shake');
                    setTimeout(() => {
                        clockIcon.classList.remove('shake');
                    }, 500);
                }
            }, 3000);
        }
    } 
    else {
        elements.timerElement.style.animation = '';
        
        if (state.shakeInterval) {
            clearInterval(state.shakeInterval);
            state.isShaking = false;
            const clockIcon = document.querySelector('.clock-icon');
            if (clockIcon) {
                clockIcon.classList.remove('shake');
            }
        }
    }
};

    const handleTimeOut = () => {
        clearInterval(state.timerInterval);

        localStorage.setItem('answered', state.userAnswers.size);
        localStorage.setItem('total', state.questions.length);
        localStorage.setItem('examResults', JSON.stringify({
            score: 'Time Out',
            details: []
        }));

        window.location.href = 'TimeIsOut.html';
    };

    const trySubmitTest = () => {
        const unansweredQuestions = getUnansweredQuestions();
        
        if (unansweredQuestions.length > 0) {
            state.currentQuestionIndex = unansweredQuestions[0];
            loadQuestion(state.currentQuestionIndex);
            return;
        }
        
        submitTest();
    };

    const submitTest = () => {
        clearInterval(state.timerInterval);
        const timeSpent = 120 - state.timeLeft;
        let correctAnswers = 0;
        
        const results = state.questions.map((question, index) => {
            const isCorrect = state.userAnswers.get(index) === question.correctAnswer;
            if (isCorrect) correctAnswers++;
            return { isCorrect };
        });

        const score = Math.round((correctAnswers / state.questions.length) * 100);

        localStorage.setItem('examResults', JSON.stringify({
            correctAnswers,
            totalQuestions: state.questions.length,
            timeSpent,
            score,
            details: results
        }));

        window.location.href = score >= 60 ? 'Success.html' : 'Failure.html';
    };

    const openPopup = (id) => {
        const popup = document.getElementById(id);
        popup.style.display = 'flex';
        
        if (id === 'markedPopup') renderMarkedList();
        if (id === 'unansweredPopup') renderUnansweredList(getUnansweredQuestions());
    };

    const closePopup = (id) => {
        document.getElementById(id).style.display = 'none';
    };

    const addButtonStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .highlight-button {
                animation: pulse 1.5s infinite;
                background-color: #ffcc00 !important;
                border: 2px solid #ff9900 !important;
            }
            
            .ready-submit {
                background-color: #4CAF50 !important;
                border: 2px solid #45a049 !important;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(255, 204, 0, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0); }
            }
        `;
        document.head.appendChild(style);
    };

    const init = () => {
        setupEventListeners();
        addButtonStyles();
        loadQuestions();
    };

    init();
});