const questions = [
    { text: "Я получаю энергию находясь в одиночестве", category: "IE" },
    { text: "Мне легче общаться с небольшим кругом людей", category: "IE" },
    { text: "Я предпочитаю слушать больше говорить", category: "IE" },
    { text: "Я думаю перед тем как действовать", category: "IE" },
    { text: "Мне нужно время чтобы собраться с мыслями", category: "IE" },
    
    { text: "Я доверяю фактам больше чем интуиции", category: "SN" },
    { text: "Мне важны конкретные детали", category: "SN" },
    { text: "Я учусь на собственном опыте", category: "SN" },
    { text: "Я предпочитаю проверенные методы", category: "SN" },
    { text: "Я замечаю мелкие детали", category: "SN" },
    
    { text: "Я принимаю решения логически", category: "TF" },
    { text: "Мне важна справедливость", category: "TF" },
    { text: "Я объективен в оценках", category: "TF" },
    { text: "Я ценю правду выше комфорта", category: "TF" },
    { text: "Я полагаюсь на анализ", category: "TF" },
    
    { text: "Я люблю иметь план действий", category: "JP" },
    { text: "Я организованный человек", category: "JP" },
    { text: "Мне важно соблюдать сроки", category: "JP" },
    { text: "Я довожу дела до конца", category: "JP" },
    { text: "Я придерживаюсь правил", category: "JP" },
    
    { text: "Я открыт для новых идей", category: "SN" },
    { text: "Мне нравится экспериментировать", category: "SN" },
    { text: "Я верю в возможности", category: "SN" },
    { text: "Я иногда действую импульсивно", category: "JP" },
    { text: "Мне нравится гибкость", category: "JP" }
];

const questionsPerPage = 5;
let currentPage = 0;
let answers = {};

function renderQuestions() {
    const container = document.getElementById('testPage');
    container.innerHTML = '';
    
    const startIdx = currentPage * questionsPerPage;
    const endIdx = Math.min(startIdx + questionsPerPage, questions.length);
    
    for (let i = startIdx; i < endIdx; i++) {
        const q = questions[i];
        const isFirst = i === 0;
        const isLast = i === questions.length - 1;
        const isPageFirst = i === startIdx;
        const isPageLast = i === endIdx - 1;
        
        const selectedValue = answers[i] || null;
        const canAnswer = i === 0 || answers[i-1] !== undefined;
        
        const block = document.createElement('div');
        block.className = `question-block ${isPageFirst ? 'question-first' : ''} ${isPageLast ? 'question-last' : ''} ${!canAnswer ? 'locked' : ''}`;
        
        block.innerHTML = `
            <div class="question-inner">
                <div class="question-text-wrap">
                    <div class="question-text">${q.text}</div>
                </div>
                <div class="scale-labels">
                    <span>Не согласен</span>
                    <span>Согласен</span>
                </div>
                <div class="scale-options ${!canAnswer ? 'disabled' : ''}" data-question="${i}">
                    ${[1,2,3,4,5].map(n => `
                        <div class="scale-btn ${selectedValue === n ? 'selected' : ''}" data-value="${n}" ${!canAnswer ? 'style="opacity:0.3"' : ''}>${n}</div>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.appendChild(block);
    }
    
    setupScaleListeners();
    updatePageNumbers();
    
    // Auto scroll to first visible question on page
    const firstBlock = document.querySelector('.question-block');
    if (firstBlock) {
        setTimeout(() => {
            firstBlock.scrollIntoView({ behavior: 'auto', block: 'start' });
        }, 50);
    }
}

function setupScaleListeners() {
    document.querySelectorAll('.scale-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.style.opacity === '0.3') return;
            
            const questionIdx = parseInt(this.parentElement.dataset.question);
            const value = parseInt(this.dataset.value);
            
            answers[questionIdx] = value;
            
            this.parentElement.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            
            if (questionIdx < questions.length - 1) {
                setTimeout(() => {
                    const blocks = document.querySelectorAll('.question-block');
                    const nextIdx = questionIdx - (currentPage * questionsPerPage) + 1;
                    const nextBlock = blocks[nextIdx];
                    
                    if (nextBlock) {
                        nextBlock.classList.remove('locked');
                        nextBlock.querySelector('.scale-options').classList.remove('disabled');
                        nextBlock.querySelectorAll('.scale-btn').forEach(b => b.style.opacity = '1');
                        
                        nextBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    
                    if ((questionIdx + 1) % questionsPerPage === 0 && questionIdx < questions.length - 1) {
                        setTimeout(() => {
                            currentPage++;
                            renderQuestions();
                        }, 350);
                    }
                }, 250);
            }
            
            // Auto redirect after last question
            if (questionIdx === questions.length - 1) {
                setTimeout(() => {
                    showResult();
                }, 500);
            }
        });
    });
}

function updatePageNumbers() {
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const container = document.getElementById('pageNumbers');
    container.innerHTML = '';
    
    for (let i = 0; i < totalPages; i++) {
        const span = document.createElement('span');
        span.className = `page-num ${i === currentPage ? 'current' : ''}`;
        span.textContent = i + 1;
        span.onclick = () => goToPage(i);
        container.appendChild(span);
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        renderQuestions();
    }
}

function nextPage() {
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    if (currentPage < totalPages - 1) {
        currentPage++;
        renderQuestions();
    } else {
        showResult();
    }
}

function goToPage(page) {
    currentPage = page;
    renderQuestions();
}

function showResult() {
    const type = calculateResult();
    window.location.href = `result.html?type=${type}`;
}

function calculateResult() {
    let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    const categories = { IE: 0, SN: 1, TF: 2, JP: 3 };
    
    for (let key in answers) {
        const q = questions[key];
        const catIdx = categories[q.category];
        const val = answers[key];
        
        if (catIdx === 0) {
            if (val < 3) scores['I'] += 3 - val;
            else if (val > 3) scores['E'] += val - 2;
        } else if (catIdx === 1) {
            if (val < 3) scores['S'] += 3 - val;
            else if (val > 3) scores['N'] += val - 2;
        } else if (catIdx === 2) {
            if (val < 3) scores['T'] += 3 - val;
            else if (val > 3) scores['F'] += val - 2;
        } else if (catIdx === 3) {
            if (val < 3) scores['J'] += 3 - val;
            else if (val > 3) scores['P'] += val - 2;
        }
    }
    
    const type = 
        (scores.I >= scores.E ? 'I' : 'E') +
        (scores.S >= scores.N ? 'S' : 'N') +
        (scores.T >= scores.F ? 'T' : 'F') +
        (scores.J >= scores.P ? 'J' : 'P');
    
    return type;
}

document.addEventListener('DOMContentLoaded', renderQuestions);