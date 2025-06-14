$(function() {
  // 1) Chargement dynamique des sections
  $("section[data-include]").each(function() {
    const $sec = $(this),
          file = $sec.data("include");
    $.get(file)
     .done(html => $sec.html(html))
     .fail(() => $sec.html("<p>Erreur de chargement du contenu.</p>"));
  });

  // 2) Nav burger mobile
  $(".burger").on("click", () => {
    $("header nav").toggleClass("open");
  });

  // 3) Smooth scroll & active class
  const $navLinks = $("nav ul li a.section-title");
  const sections = $navLinks.map(function() {
    return $($(this).attr("href"));
  });

  function updateActive() {
    let idx = sections.length;
    while (--idx && $(window).scrollTop() + 120 < sections[idx].offset().top) {}
    $navLinks.removeClass("active")
             .eq(idx).addClass("active");
  }

  updateActive();
  $(window).on("scroll", updateActive);

  $navLinks.on("click", function(e) {
    e.preventDefault();
    const target = $($(this).attr("href"));
    if (target.length) {
      $("html, body").animate({ scrollTop: target.offset().top - 90 }, 500);
    }
  });
});


