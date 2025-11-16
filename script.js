// Espera o DOM (a página) carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Lógica Global (Roda em TODAS as páginas) ---
    // A lógica do tema é global, pois o botão existe em todas as páginas.
    handleThemeToggle();

    // --- 2. Lógicas Específicas de cada Página ---
    // Cada função verifica se os elementos daquela página existem antes de rodar.

    // Lógica da 'index.html' (Idioma e Login)
    handleIndexPage();

    // Lógica da 'quiz.html'
    handleQuizPage();

    // Lógica da 'trilhas.html'
    handleTrilhasPage();

    // Lógica da 'upload.html'
    handleUploadPage();

    // A 'dashboard.html' não possui scripts interativos no momento.
    handleLoginPage();
});

/**
 * Controla o botão de troca de tema (claro/escuro).
 * Esta função é global e deve funcionar em todas as páginas.
 */
function handleThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Se não encontrar os elementos, para a execução desta função
    if (!themeToggle || !themeIcon) {
        return;
    }

    // Função para atualizar o ícone baseado no tema
    const updateThemeIcon = () => {
        if (body.classList.contains('dark-mode')) {
            themeIcon.className = 'bi bi-brightness-high'; // Sol
        } else {
            themeIcon.className = 'bi bi-moon-stars'; // Lua
        }
    };

    // Verifica se o usuário já tinha um tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    updateThemeIcon(); // Define o ícone correto ao carregar a página

    // Adiciona o evento de clique
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        updateThemeIcon(); // Atualiza o ícone no clique

        // Salva a preferência do usuário no localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

/**
 * Controla a lógica da página principal (index.html),
 * incluindo o dropdown de idiomas e o botão de login.
 */
function handleIndexPage() {
    // Elementos específicos da index.html
    const langToggle = document.getElementById('lang-toggle');
    const langOptions = document.getElementById('lang-options');
    const dropdownContainer = document.getElementById('lang-dropdown-container');
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const ctaButton = document.getElementById('cta-button');
    const loginButtonElement = document.getElementById('login-button');

    // Guard clause: Se não achar os elementos principais da index, para a função.
    if (!langToggle || !heroTitle || !loginButtonElement) {
        return;
    }

    // Dicionário de Textos
    const dictionary = {
        'pt': {
            title: "Organize seus estudos em um só lugar.",
            subtitle: "Nossa plataforma inteligente ajuda você a focar, aprender e alcançar seus objetivos acadêmicos com mais eficiência.",
            cta: "Comece agora gratuitamente",
            login: "Login", // O ID 'login-button' está na index, não nas outras.
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

    // Função para aplicar a tradução
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

    // 1. Alternar a visibilidade do dropdown
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langOptions.classList.toggle('show');
    });

    // 2. Fechar o dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (!dropdownContainer.contains(e.target) && langOptions.classList.contains('show')) {
            langOptions.classList.remove('show');
        }
    });

    // 3. Gerenciar o clique nas opções (links) do dropdown
    langOptions.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'A') {
            e.preventDefault();
            const newLang = target.getAttribute('data-lang');
            applyTranslation(newLang);
            langOptions.classList.remove('show'); // Fecha o menu após a seleção
        }
    });

    // Aplica o idioma salvo ou o padrão na carga da página
    const savedLang = localStorage.getItem('language') || 'pt';
    applyTranslation(savedLang);

    // --- Lógica do Botão de Login (apenas index.html) ---
}

/**
 * Controla a lógica da página de Quiz (quiz.html).
 */
function handleQuizPage() {
    const quizContainer = document.getElementById('quiz-container');
    const nextBtn = document.getElementById('next-btn');

    // Guard clause: Se não for a página de quiz, para a função.
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
                    // Usamos data-attributes para uma forma mais limpa, sem 'onclick='
                    `<button class="btn opcao" data-index="${i}">${op}</button>`
                ).join('')}
            </div>
        `;
    }

    // Função para verificar a resposta
    function responder(indiceSelecionado) {
        if (respostaSelecionada) return; // Impede cliques múltiplos
        respostaSelecionada = true;

        const q = quizData[quizIndex];
        const botoes = quizContainer.querySelectorAll('.opcao');

        if (indiceSelecionado === q.correta) {
            botoes[indiceSelecionado].classList.add('correta');
            // alert("✅ Correto!"); // Alertas pausam a execução, melhor usar feedback visual
        } else {
            botoes[indiceSelecionado].classList.add('errada');
            botoes[q.correta].classList.add('correta');
            // alert(`❌ Errado! Resposta certa: ${q.opcoes[q.correta]}`);
        }
    }

    // Event listener centralizado para as opções
    quizContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('opcao')) {
            const i = parseInt(e.target.dataset.index, 10);
            responder(i);
        }
    });

    // Próxima Pergunta
    nextBtn.addEventListener('click', () => {
        quizIndex = (quizIndex + 1) % quizData.length;
        carregarPergunta();
    });

    // Carregar a primeira pergunta
    carregarPergunta();
}


/**
 * Controla a lógica da página de Trilhas (trilhas.html).
 */
function handleTrilhasPage() {
    const lista = document.getElementById('lista-trilhas');
    const novaBtn = document.getElementById('nova-trilha');

    // Guard clause: Se não for a página de trilhas, para a função.
    if (!lista || !novaBtn) {
        return;
    }

    const trilhas = []; // Simples array para este exemplo

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

    // Renderiza o estado inicial
    renderTrilhas();
}

/**
 * Controla a lógica da página de Upload (upload.html).
 */
function handleUploadPage() {
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');

    // Guard clause: Se não for a página de upload, para a função.
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

/**
 * Controla a lógica da página de Login (login.html).
 */
function handleLoginPage() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    // Guard clause: Se não encontrar o formulário principal, para a função.
    if (!loginForm) {
        return;
    }

    // --- Lógica para Login com Email e Senha ---
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o recarregamento da página
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        // Limpa erros antigos
        if (errorMessage) {
            errorMessage.textContent = '';
        }

        // TODO: AQUI ENTRARÁ A LÓGICA DO FIREBASE
        // (signInWithEmailAndPassword)
        
        console.log('Tentativa de login com:', email, senha);
        alert('Lógica de login com Firebase ainda não implementada.');

        // Exemplo de como mostrar um erro:
        // if (errorMessage) {
        //    errorMessage.textContent = 'Email ou senha inválidos.';
        // }
        
        // Exemplo de sucesso (redirecionar):
        // window.location.href = 'dashboard.html';
    });

    // --- Lógica para Login com Google (Verificação segura) ---
    // Isso agora é opcional. O código acima funcionará mesmo sem este botão.
    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            // TODO: AQUI ENTRARÁ A LÓGICA DO FIREBASE
            // (signInWithPopup e GoogleAuthProvider)

            console.log('Tentativa de login com Google');
            alert('Lógica de login com Google (Firebase) ainda não implementada.');
        });
    }
}