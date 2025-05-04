// Constantes e variáveis globais
const precoIngresso = 30;  // Preço fixo do ingresso
let quantidade = 1;  // Quantidade inicial de ingressos

// Função para selecionar um filme
function selecionarFilme(filme) {
  localStorage.setItem("filme", filme);  // Salva o filme no localStorage
  window.location.href = "sessao.html";  // Redireciona para a página de sessão
}

// Função para alterar a quantidade de ingressos
function alterarQuantidade(valor) {
  quantidade += valor;  // Incrementa ou decrementa a quantidade
  
  // Validações
  if (quantidade < 1) quantidade = 1;  // Mínimo de 1 ingresso
  if (quantidade > 8) {  // Máximo de 8 ingressos
    quantidade = 8;
    alert("Você só pode comprar no máximo 8 ingressos por vez.");
  }

  // Atualiza a exibição
  const qtdSpan = document.getElementById("qtdIngressos");
  const subtotalSpan = document.getElementById("subtotal");
  if (qtdSpan && subtotalSpan) {
    qtdSpan.textContent = quantidade;  // Atualiza a quantidade
    subtotalSpan.textContent = quantidade * precoIngresso;  // Atualiza o subtotal
  }

  // Salva no localStorage
  localStorage.setItem("quantidade", quantidade);
  localStorage.setItem("subtotal", quantidade * precoIngresso);
}

// Função para confirmar a sessão
function confirmarSessao() {
  // Obtém assentos selecionados
  const assentosSelecionados = Array.from(document.querySelectorAll(".assento.selecionado")).map(el => el.dataset.id);
  const horarioSelecionado = localStorage.getItem("horario");

  // Validações
  if (assentosSelecionados.length !== quantidade) {
    alert("Escolha exatamente " + quantidade + " assento(s).");
    return;
  }

  if (!horarioSelecionado) {
    alert("Selecione um horário.");
    return;
  }

  // Salva no localStorage e redireciona
  localStorage.setItem("assentos", JSON.stringify(assentosSelecionados));
  localStorage.setItem("quantidade", quantidade);
  window.location.href = "confirmacao.html";
}

// Função para processar o pagamento
function processarPagamento(event) {
  event.preventDefault();  // Previne o comportamento padrão do formulário
  
  // Obtém os dados do formulário e do localStorage
  const nome = document.getElementById("nome").value;
  const filme = localStorage.getItem("filme");
  const horario = localStorage.getItem("horario");
  const assentos = JSON.parse(localStorage.getItem("assentos"));
  const quantidade = localStorage.getItem("quantidade");
  const subtotal = localStorage.getItem("subtotal");

  // Gera o conteúdo da nota fiscal
  const conteudoNota = `
🎟️ NOTA FISCAL - CINEMA ARTEMIS 🎟️

Nome: ${nome}
Filme: ${filme}
Horário: ${horario}
Assentos: ${assentos.join(", ")}
Quantidade de ingressos: ${quantidade}
Valor unitário: R$30,00
Valor total: R$${parseInt(subtotal)},00

Obrigado pela preferência!
`;

  // Cria e faz download da nota fiscal
  const blob = new Blob([conteudoNota], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "nota-fiscal.txt";
  link.click();

  // Mostra mensagem de sucesso
  alert("Pagamento aprovado! 🎉 Sua nota fiscal foi baixada.");
}

// Função executada quando a página carrega
window.onload = function () {
  // Atualiza o filme escolhido
  const filme = localStorage.getItem("filme");
  const filmeSpan = document.getElementById("filmeEscolhido");
  if (filmeSpan) filmeSpan.textContent = "Filme escolhido: " + filme;

  // Atualiza o resumo na página de confirmação
  const resumo = document.getElementById("resumo");
  if (resumo) {
    const horario = localStorage.getItem("horario");
    const assentos = JSON.parse(localStorage.getItem("assentos") || "[]");
    resumo.textContent = `Filme: ${filme}, Horário: ${horario}, Assentos: ${assentos.join(", ")}`;
  }

  // Atualiza o subtotal na página de confirmação
  const subtotal = localStorage.getItem("subtotal");
  const subtotalConfirm = document.getElementById("subtotalConfirmacao");
  if (subtotalConfirm && subtotal) {
    subtotalConfirm.textContent = subtotal;
  }

  // Atualiza a quantidade ao entrar na página
  const qtdSalva = parseInt(localStorage.getItem("quantidade")) || 1;
  quantidade = qtdSalva;
  alterarQuantidade(0);  // Força a atualização

  // Configura eventos dos botões de horário
  const botoesHorario = document.querySelectorAll(".horarios button");
  botoesHorario.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove a seleção de todos os botões
      botoesHorario.forEach(b => b.classList.remove("selecionado"));
      // Adiciona seleção ao botão clicado
      btn.classList.add("selecionado");
      // Salva o horário no localStorage
      localStorage.setItem("horario", btn.dataset.hora);
    });
  });

  // Configura eventos dos assentos
  const assentos = document.querySelectorAll(".assento");
  assentos.forEach(el => {
    el.addEventListener("click", () => {
      const selecionados = document.querySelectorAll(".assento.selecionado").length;
      if (el.classList.contains("selecionado")) {
        // Remove a seleção se já estiver selecionado
        el.classList.remove("selecionado");
      } else if (selecionados < quantidade) {
        // Adiciona seleção se ainda não atingiu o limite
        el.classList.add("selecionado");
      } else {
        // Avisa sobre o limite de assentos
        alert("Você só pode escolher " + quantidade + " assento(s).");
      }
    });
  });
};

