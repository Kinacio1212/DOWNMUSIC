// ======= INDEX =======
function carregarMusicas(filtro = "") {
  const container = document.getElementById("musicas-container");
  if (!container) return;

  const musicas = JSON.parse(localStorage.getItem("musicas")) || [];
  container.innerHTML = "";

  const filtradas = musicas.filter(m => 
    m.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  if (filtradas.length === 0) {
    container.innerHTML = "<p>Nenhuma música encontrada 🎵</p>";
    return;
  }

  filtradas.forEach((m, i) => {
    const div = document.createElement("div");
    div.classList.add("musica");
    div.innerHTML = `
      <img src="${m.capa || 'img/capa-padrao.png'}" alt="Capa">
      <div style="flex:1">
        <h3>${m.nome}</h3>
        <audio controls>
          <source src="${m.link}" type="audio/mpeg">
        </audio>
        <a href="${m.link}" download class="botao-download" onclick="contarDownload(${i})">
          ⬇️ Baixar (${m.downloads || 0})
        </a>
      </div>
    `;
    container.appendChild(div);
  });
}

function contarDownload(index) {
  const musicas = JSON.parse(localStorage.getItem("musicas")) || [];
  if (musicas[index]) {
    musicas[index].downloads = (musicas[index].downloads || 0) + 1;
    localStorage.setItem("musicas", JSON.stringify(musicas));
    carregarMusicas(document.getElementById("campoBusca")?.value || "");
  }
}

// ======= PAINEL =======
function iniciarPainel() {
  const botao = document.getElementById("adicionarMusica");
  const nome = document.getElementById("nomeMusica");
  const link = document.getElementById("linkMusica");
  const capa = document.getElementById("linkCapa");
  const listaAdmin = document.getElementById("listaAdmin");
  const msg = document.getElementById("mensagem");

  if (!botao) return;

  function atualizarLista() {
    const musicas = JSON.parse(localStorage.getItem("musicas")) || [];
    listaAdmin.innerHTML = "";
    musicas.forEach((m, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${i + 1}. ${m.nome}
        <button onclick="editarMusica(${i})">✏️</button>
        <button onclick="excluirMusica(${i})">🗑️</button>
      `;
      listaAdmin.appendChild(li);
    });
  }

  atualizarLista();

  botao.addEventListener("click", () => {
    if (!nome.value || !link.value) {
      msg.textContent = "⚠️ Preencha o nome e o link da música.";
      return;
    }

    const musicas = JSON.parse(localStorage.getItem("musicas")) || [];
    musicas.push({
      nome: nome.value,
      link: link.value,
      capa: capa.value || "",
      downloads: 0
    });
    localStorage.setItem("musicas", JSON.stringify(musicas));

    msg.textContent = "✅ Música adicionada!";
    nome.value = "";
    link.value = "";
    capa.value = "";
    atualizarLista();
  });
}

function editarMusica(i) {
  const musicas = JSON.parse(localStorage.getItem("musicas")) || [];
  const nova = prompt("Novo nome da música:", musicas[i].nome);
  if (nova) {
    musicas[i].nome = nova;
    localStorage.setItem("musicas", JSON.stringify(musicas));
    location.reload();
  }
}

function excluirMusica(i) {
  const musicas = JSON.parse(localStorage.getItem("musicas")) || [];
  if (confirm(`Tem certeza que deseja excluir "${musicas[i].nome}"?`)) {
    musicas.splice(i, 1);
    localStorage.setItem("musicas", JSON.stringify(musicas));
    location.reload();
  }
}

// ======= EVENTOS =======
window.addEventListener("DOMContentLoaded", () => {
  carregarMusicas();
  iniciarPainel();

  const campoBusca = document.getElementById("campoBusca");
  if (campoBusca) {
    campoBusca.addEventListener("input", (e) => {
      carregarMusicas(e.target.value);
    });
  }
});
