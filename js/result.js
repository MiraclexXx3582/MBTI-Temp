const mbtiTypes = {
    "INTJ": { name: "Архитектор", category: "Analysts", desc: "Стратеги с аналитическим складом ума. Любят сложные системы и эффективные решения." },
    "INTP": { name: "Логик", category: "Analysts", desc: "Мыслители, которые ищут понимание и логику во всём." },
    "ENTJ": { name: "Командующий", category: "Analysts", desc: "Прирождённые лидеры с сильным характером и стратегическим мышлением." },
    "ENTP": { name: "Полемист", category: "Analysts", desc: "Изобретательные мыслители, любящие новые идеи и дискуссии." },
    "INFJ": { name: "Активист", category: "Diplomats", desc: "Редкие идеалисты с глубокой интуицией и сильным чувством справедливости." },
    "INFP": { name: "Посредник", category: "Diplomats", desc: "Тихие мечтатели, ищущие смысл и гармонию в жизни." },
    "ENFJ": { name: "Главный герой", category: "Diplomats", desc: "Харизматичные лидеры, вдохновляющие других на лучшие версии себя." },
    "ENFP": { name: "Коммунатор", category: "Diplomats", desc: "Энтузиасты с неиссякаемой энергией и креативностью." },
    "ISTJ": { name: "Логист", category: "Sentinels", desc: "Надёжные и ответственные, ценят традиции и порядок." },
    "ISFJ": { name: "Защитник", category: "Sentinels", desc: "Тихие хранители, заботящиеся о близких и предпочитающие стабильность." },
    "ESTJ": { name: "Администратор", category: "Sentinels", desc: "Организованные лидеры, которые любят структуру и эффективность." },
    "ESFJ": { name: "Консультант", category: "Sentinels", desc: "Заботливые организаторы, создающие гармонию в социальных группах." },
    "ISTP": { name: "Виртуоз", category: "Explorers", desc: "Мастера с ловкими руками и аналитическим умом." },
    "ISFP": { name: "Приключенец", category: "Explorers", desc: "Гибкие и спонтанные искатели приключений." },
    "ESTP": { name: "Делец", category: "Explorers", desc: "Энергичные и практичные, любящие риск и действие." },
    "ESFP": { name: "Развлекатель", category: "Explorers", desc: "Жизнелюбы, приносящие энергию и веселье в любую компанию." }
};

function getResult() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') || "INFP";
    return mbtiTypes[type] || mbtiTypes["INFP"];
}

const result = getResult();

document.querySelector('.result-page').innerHTML = `
    <div class="result-card">
        <div class="result-inner">
            <div class="result-type">${window.location.search.split('=')[1] || 'INFP'}</div>
            <div class="result-title">${result.name}</div>
            <div class="result-desc">${result.desc}</div>
        </div>
    </div>
    <a href="index.html" class="home-btn">На главную</a>
    <button class="share-btn" onclick="shareResult()">Поделиться</button>
`;

function shareResult() {
    const type = window.location.search.split('=')[1] || 'INFP';
    if (navigator.share) {
        navigator.share({
            title: 'MBTI Test',
            text: `Мой тип личности: ${type} - ${result.name}`,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(`Мой тип личности: ${type} - ${result.name}`);
        alert('Скопировано в буфер обмена!');
    }
}