$(function () {
  // 1) Chargement dynamique des sections
  const $sections = $("section[data-include]");
  const total = $sections.length;
  let loaded = 0;

  $sections.each(function () {
    const $sec = $(this),
      file = $sec.data("include");

    $.get(file)
      .done((html) => {
        $sec.html(html);
      })
      .fail(() => {
        $sec.html("<p>Erreur de chargement du contenu.</p>");
      })
      .always(() => {
        loaded++;
        if (loaded === total) {
          // Toutes les sections ont été chargées
          if (window.location.hash) {
            const target = $(window.location.hash);
            if (target.length) {
              setTimeout(() => {
                $("html, body").animate(
                  { scrollTop: target.offset().top - 90 },
                  600
                );
              }, 100); // Petit délai pour que le DOM s’installe
            }
          }
        }
      });
  });

  // 2) Nav burger mobile
  $(".burger").on("click", () => {
    $("header nav").toggleClass("open");
  });

  // 3) Smooth scroll & active class
  const $navLinks = $("nav ul li a.section-title");

  function updateActive() {
    const scrollPos = $(window).scrollTop() + 120;
    let currentIndex = 0;

    $navLinks.each(function (i) {
      const target = $($(this).attr("href"));
      if (target.length && scrollPos >= target.offset().top) {
        currentIndex = i;
      }
    });

    $navLinks.removeClass("active").eq(currentIndex).addClass("active");
  }

  $(window).on("scroll", updateActive);
  updateActive();

  $navLinks.on("click", function (e) {
    e.preventDefault();
    const target = $($(this).attr("href"));
    if (target.length) {
      $("html, body").animate({ scrollTop: target.offset().top - 90 }, 500);
    }
  });
});



// Animation de la matrice binaire en fond
function generateBinaryStream() {
  const binary = document.querySelector('.binary-stream');
  if (!binary) return;

  for (let i = 0; i < 50; i++) {
    const span = document.createElement('span');
    span.textContent = Math.random() > 0.5 ? '0' : '1';
    span.style.left = `${Math.random() * 100}%`;
    span.style.animationDelay = `${Math.random() * 3}s`;
    binary.appendChild(span);
  }
}

// Appelle cette fonction au chargement complet
$(function () {
  generateBinaryStream();
});


// Gestion du clic sur les projets pour rediriger vers un fichier
function bindProjectClicks() {
  document.querySelectorAll('.project').forEach(project => {
    project.style.cursor = 'pointer';
    project.addEventListener('click', () => {
      const file = project.getAttribute('data-file');
      if (file) {
        window.location.href = file;
      }
    });
  });
}

// Appelle cette fonction après le chargement dynamique de `projects.html`
$(function () {
  // Appelle après un petit délai pour s'assurer que le contenu est injecté
  const waitForProjects = setInterval(() => {
    if (document.querySelector('.project')) {
      bindProjectClicks();
      clearInterval(waitForProjects);
    }
  }, 100);
});


function setupContactForm() {
  const form = document.getElementById("contactForm");
  const exportBtn = document.getElementById("exportMessages");

  if (!form || !exportBtn) return;

  // Submit handler
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const data = { name, email, message, timestamp: new Date().toISOString() };

    const existing = JSON.parse(localStorage.getItem("messages")) || [];
    existing.push(data);

    localStorage.setItem("messages", JSON.stringify(existing));
    alert("Message sauvegardé localement !");
  });

  // Show export button when pressing Ctrl + E
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "e") {
      exportBtn.style.display = "inline-block";
    }
  });

  // Export button handler
  exportBtn.addEventListener("click", function () {
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    const jsonData = JSON.stringify(messages, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "contact-messages-log.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    alert("Fichier JSON exporté !");
  });
}

// Call setupContactForm after #contact section is loaded
$(function () {
  const waitForContact = setInterval(() => {
    if (document.getElementById("contactForm")) {
      setupContactForm();
      clearInterval(waitForContact);
    }
  }, 100);
});


