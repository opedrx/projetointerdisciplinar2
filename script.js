document.addEventListener('DOMContentLoaded', () => {

    handleThemeToggle();

    // Lógica da 'index.html' (Idioma e Login)
    handleIndexPage();

    // Lógica da 'quiz.html'
    handleQuizPage();

    // Lógica da 'trilhas.html'
    handleTrilhasPage();

    // Lógica da 'upload.html'
    handleUploadPage();

    handleLoginPage();
});

function handleThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    if (!themeToggle || !themeIcon) {
        return;
    }

    const updateThemeIcon = () => {
        if (body.classList.contains('dark-mode')) {
            themeIcon.className = 'bi bi-brightness-high'; // Sol
        } else {
            themeIcon.className = 'bi bi-moon-stars'; // Lua
        }
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        updateThemeIcon();
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}


function handleIndexPage() {

    const langToggle = document.getElementById('lang-toggle');
    const langOptions = document.getElementById('lang-options');
    const dropdownContainer = document.getElementById('lang-dropdown-container');
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const ctaButton = document.getElementById('cta-button');
    const loginButtonElement = document.getElementById('login-button');

    if (!langToggle || !heroTitle || !loginButtonElement) {
        return;
    }


    const dictionary = {
        'pt': {
            title: "Organize seus estudos em um só lugar.",
            subtitle: "Nossa plataforma inteligente ajuda você a focar, aprender e alcançar seus objetivos acadêmicos com mais eficiência.",
            cta: "Comece agora gratuitamente",
            login: "Login",
        },
        'en': {
            title: "Organize your studies in one place.",
            subtitle: "Our smart platform helps you focus, learn, and achieve your academic goals more efficiently.",
            cta: "Get started for free",
            login: "Login",
        },
        'es': {
            title: "Organice sus estudios en un solo lugar.",
            subtitle: "Nuestra plataforma inteligente le ayuda a concentrarse, aprender y alcanzar sus objetivos académicos de forma más eficiente.",
            cta: "Empiece ahora gratis",
            login: "Iniciar Sesión",
        }
    };

    let currentLang = 'pt';

    const applyTranslation = (lang) => {
        const texts = dictionary[lang];
        if (texts) {
            heroTitle.textContent = texts.title;
            heroSubtitle.textContent = texts.subtitle;
            ctaButton.textContent = texts.cta;
            loginButtonElement.textContent = texts.login;
            currentLang = lang;
            localStorage.setItem('language', lang);
        }
    };

    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langOptions.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!dropdownContainer.contains(e.target) && langOptions.classList.contains('show')) {
            langOptions.classList.remove('show');
        }
    });

    langOptions.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'A') {
            e.preventDefault();
            const newLang = target.getAttribute('data-lang');
            applyTranslation(newLang);
            langOptions.classList.remove('show');
        }
    });

    const savedLang = localStorage.getItem('language') || 'pt';
    applyTranslation(savedLang);

}


function handleQuizPage() {
    const quizContainer = document.getElementById('quiz-container');
    const nextBtn = document.getElementById('next-btn');

    if (!quizContainer || !nextBtn) {
        return;
    }

    const quizData = [
        {
            pergunta: "O que é uma variável em programação?",
            opcoes: [
                "Um valor fixo que nunca muda",
                "Um espaço na memória para armazenar valores",
                "Um tipo de dado específico",
                "Um operador lógico"
            ],
            correta: 1
        },
        {
            pergunta: "O que significa HTML?",
            opcoes: [
                "Hyper Text Markup Language",
                "Home Tool Markup Language",
                "Hyperlinks Text Made Logic",
                "High Transfer Machine Language"
            ],
            correta: 0
        }
    ];

    let quizIndex = 0;
    let respostaSelecionada = false;

    function carregarPergunta() {
        respostaSelecionada = false;
        const q = quizData[quizIndex];
        quizContainer.innerHTML = `
            <h3>${q.pergunta}</h3>
            <div class="opcoes-container">
                ${q.opcoes.map((op, i) =>
                    `<button class="btn opcao" data-index="${i}">${op}</button>`
                ).join('')}
            </div>
        `;
    }

    function responder(indiceSelecionado) {
        if (respostaSelecionada) return;
        respostaSelecionada = true;

        const q = quizData[quizIndex];
        const botoes = quizContainer.querySelectorAll('.opcao');

        if (indiceSelecionado === q.correta) {
            botoes[indiceSelecionado].classList.add('correta');
        } else {
            botoes[indiceSelecionado].classList.add('errada');
            botoes[q.correta].classList.add('correta');
        }
    }

    quizContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('opcao')) {
            const i = parseInt(e.target.dataset.index, 10);
            responder(i);
        }
    });

    nextBtn.addEventListener('click', () => {
        quizIndex = (quizIndex + 1) % quizData.length;
        carregarPergunta();
    });

    carregarPergunta();
}



function handleTrilhasPage() {
    const lista = document.getElementById('lista-trilhas');
    const novaBtn = document.getElementById('nova-trilha');

    if (!lista || !novaBtn) {
        return;
    }

    const trilhas = [];

    function renderTrilhas() {
        if (trilhas.length === 0) {
            lista.innerHTML = '<p>Nenhuma trilha criada ainda.</p>';
            return;
        }

        lista.innerHTML = trilhas.map(t => `
            <div class="trilha-card">
                <h3>${t}</h3>
                <button class="btn btn-login">Abrir</button>
            </div>
        `).join('');
    }

    novaBtn.addEventListener('click', () => {
        const nome = prompt("Nome da trilha:");
        if (nome && nome.trim() !== "") {
            trilhas.push(nome.trim());
            renderTrilhas();
        }
    });

    renderTrilhas();
}


function handleUploadPage() {
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');


    if (!uploadBtn || !fileInput || !fileName) {
        return;
    }

    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            fileName.textContent = `Arquivo selecionado: ${file.name}`;
        } else {
            fileName.textContent = '';
        }
    });
}

function handleLoginPage() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        if (errorMessage) {
            errorMessage.textContent = '';
        }

        console.log('Tentativa de login com:', email, senha);
        alert('Lógica de login com Firebase ainda não implementada.');
    });

    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            console.log('Tentativa de login com Google');
            alert('Lógica de login com Google (Firebase) ainda não implementada.');
        });
    }
}