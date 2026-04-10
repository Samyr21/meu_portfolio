// VARIÁVEIS GLOBAIS
let saldo = 1500000;
let divida = 0;
let historico = [];

// FUNÇÃO DE LOGIN
function login() {
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');
    
    loginScreen.innerHTML = "<h2>CONECTANDO À REDE SEGURA...</h2>";
    
    setTimeout(() => {
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        atualizarTela();
    }, 1500);
}

// ATUALIZA O SALDO NA TELA
function atualizarTela() {
    const balanceElement = document.getElementById('balance');
    balanceElement.innerText = `$ ${saldo.toLocaleString('en-US')}`;
    
    // Log de dívida no console para controle do dev
    if (divida > 0) console.log("Dívida atual: $" + divida);
}

// REGISTRA NO HISTÓRICO
function registrarTransacao(tipo, valor) {
    const agora = new Date();
    const dataFormatada = agora.toLocaleTimeString('pt-BR');
    historico.unshift({ tipo, valor, data: dataFormatada });
}

// FUNÇÃO DE DEPÓSITO (COM PAGAMENTO DE DÍVIDA AUTOMÁTICO)
function depositar() {
    const valor = parseFloat(prompt("VALOR DO DEPÓSITO:"));
    
    if (isNaN(valor) || valor <= 0) {
        alert("VALOR INVÁLIDO.");
        return;
    }

    let valorParaSaldo = valor;

    if (divida > 0) {
        alert("MAZE BANK: Detectamos uma dívida. O valor será abatido.");
        if (valor >= divida) {
            valorParaSaldo = valor - divida;
            divida = 0;
            alert("DÍVIDA QUITADA!");
        } else {
            divida -= valor;
            valorParaSaldo = 0;
            alert(`RESTANTE DA DÍVIDA: $${divida.toLocaleString('en-US')}`);
        }
    }

    saldo += valorParaSaldo;
    registrarTransacao("DEPÓSITO", valor);
    atualizarTela();
}

// FUNÇÃO DE SAQUE
function sacar() {
    const valor = parseFloat(prompt("VALOR DO SAQUE:"));
    
    if (isNaN(valor) || valor <= 0 || valor > saldo) {
        alert("SALDO INSUFICIENTE OU VALOR INVÁLIDO.");
        return;
    }

    saldo -= valor;
    registrarTransacao("SAQUE", valor);
    atualizarTela();
}

// FUNÇÃO DE EMPRÉSTIMO (LIMITE DE 50% DO SALDO)
function fazerEmprestimo() {
    const limite = saldo * 0.5;
    const valor = parseFloat(prompt(`LIMITE: $${limite.toLocaleString('en-US')}\nQuanto deseja (Juros de 20%)?`));

    if (isNaN(valor) || valor <= 0 || valor > limite) {
        alert("CRÉDITO NEGADO: Valor inválido ou acima do limite.");
        return;
    }

    saldo += valor;
    divida += valor * 1.2; // 20% de juros
    registrarTransacao("EMPRÉSTIMO", valor);
    atualizarTela();
    alert("CRÉDITO LIBERADO!");
}

// EXIBE O HISTÓRICO
function verTransacoes() {
    document.querySelector('.menu-grid').classList.add('hidden');
    document.getElementById('transactions-section').classList.remove('hidden');

    const lista = document.getElementById('transactions-list');
    lista.innerHTML = "";

    if (historico.length === 0) {
        lista.innerHTML = "<li style='color: #666;'>Sem movimentações.</li>";
    } else {
        historico.forEach(t => {
            const li = document.createElement('li');
            const cor = (t.tipo === "SAQUE") ? "#E31B23" : "#2ecc71";
            li.style.padding = "8px";
            li.style.borderBottom = "1px solid #ddd";
            li.innerHTML = `<strong style="color: ${cor}">${t.tipo}</strong>: $${t.valor.toLocaleString('en-US')} <br> <small>${t.data}</small>`;
            lista.appendChild(li);
        });
    }
}

// VOLTA PARA OS BOTÕES
function voltarAoMenu() {
    document.getElementById('transactions-section').classList.add('hidden');
    document.querySelector('.menu-grid').classList.remove('hidden');
}

// Credenciais padrão
const USUARIO_CORRETO = "Admin";
const SENHA_CORRETA = "1234";

function validaLogin() {
    const user = document.getElementById('user-id').value;
    const pass = document.getElementById('user-pass').value;
    const errorMsg = document.getElementById('login-error');
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');

    // Verifica se as credenciais batem
    if (user === USUARIO_CORRETO && pass === SENHA_CORRETA) {
        errorMsg.classList.add('hidden');
        
        // Efeito de carregamento
        loginScreen.innerHTML = "<h2>Criptografando Conexão, Aguarde...</h2>";
        
        setTimeout(() => {
            loginScreen.classList.add('hidden');
            dashboard.classList.remove('hidden');
            atualizarTela();
        }, 1500);
    } else {
        // Se errar, mostra a mensagem de erro
        errorMsg.classList.remove('hidden');
        
        // Limpa os campos para tentar de novo
        document.getElementById('user-id').value = "";
        document.getElementById('user-pass').value = "";
    }
}

function sair() {
    // Exibe um aviso rápido antes de sair (opcional, bem estilo GTA)
    const confirmacao = confirm("DESEJA ENCERRAR SUA SESSÃO NO MAZE BANK?");
    
    if (confirmacao) {
        window.location.reload();
    }
}