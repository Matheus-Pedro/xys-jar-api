document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("versions.json");
  const data = await response.json();

  document.getElementById("titulo").textContent = data.titulo;
  document.getElementById("descricao").textContent = data.descricao;

  const navList = document.getElementById("nav-list");
  const versionsContainer = document.getElementById("versions-container");

  // Exibe as versões em ordem LIFO (última versão no topo)
  data.versoes.reverse().forEach(versao => {
    // Adiciona item ao menu lateral com a classe "nav-link"
    navList.innerHTML += `
      <li>
        <a href="#${versao.id}" class="nav-link">
          <span class="material-icons">article</span> ${versao.versao}
        </a>
      </li>
    `;

    // Define HTML para a tag, se existir
    let tagHTML = "";
    if (versao.tag) {
      let tagClass = versao.tag === "Obsoleto" ? "tag-obsoleto" :
                     versao.tag === "Estável" ? "tag-estavel" :
                     versao.tag === "Beta" ? "tag-beta" : "tag-padrao";
      tagHTML = `<span class="tag ${tagClass}">${versao.tag}</span>`;
    }
    
    let isDownload = 'download';
    if (versao.download === "") {
      versao.download = "download-unavailable.html";
      isDownload = '';
    } else {
      versao.download = "versions/" + versao.download;
    }

    // Adiciona a seção da versão
    versionsContainer.innerHTML += `
      <section id="${versao.id}" class="version">
        <div class="version-header">
          <h2>Versão ${versao.versao} <small>(${versao.data})</small></h2>
          ${tagHTML}
        </div>
        <p><strong>Data de lançamento:</strong> ${versao.data}</p>
        <p>${versao.descricao}</p>
        <h3>Alterações:</h3>
        <ul>${versao.alteracoes.map(item => `<li>${item}</li>`).join("")}</ul>
        <div class="btn-group">
          <a href="coming-soon.html" class="btn">Ver Documentação</a>
          <a href="${versao.download}" class="btn btn-download" ${isDownload}>
            <span class="material-icons">download</span> Baixar
          </a>
        </div>
      </section>
    `;
  });

  // Define navLinks após a inserção dos links
  const navLinks = document.querySelectorAll('.nav-link');

  // Ativa o link do menu correspondente à seção visível
  window.addEventListener('scroll', function() {
    let scrollPos = window.scrollY || document.documentElement.scrollTop;
    navLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop - 100 && scrollPos < sectionTop + sectionHeight - 100) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  });

  // Para mobile: se a largura da janela for <= 768px, habilita o comportamento de carrossel
  if (window.innerWidth <= 768) {
    const navContainer = document.querySelector("nav ul");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          // Ajusta o carrossel para exibir o item clicado
          const offsetLeft = link.offsetLeft;
          navContainer.scrollTo({ left: offsetLeft - 50, behavior: "smooth" });
        }
      });
    });
  }
});
