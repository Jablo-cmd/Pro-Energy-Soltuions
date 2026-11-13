(function () {
  "use strict";

  /* Mobile navigation toggle */
  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && links.classList.contains("is-open")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
        toggle.focus();
      }
    });
  }

  /* Close any open service dropdown when another opens */
  document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
    dropdown.addEventListener("toggle", function () {
      if (!dropdown.open) return;
      document.querySelectorAll(".nav-dropdown[open]").forEach(function (other) {
        if (other !== dropdown) other.open = false;
      });
    });
  });

  /* Scroll reveal for elements marked .reveal */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Contact form: prepare a clear email without claiming it was sent. */
  var form = document.querySelector(".contact-form[data-mailto-form]");
  if (form) {
    var status = form.querySelector(".form-status");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var fields = Array.from(new FormData(form).entries());
      var body = fields
        .map(function (field) {
          return field[0] + ": " + String(field[1]).trim();
        })
        .join("\n");
      var serviceField = form.querySelector('[name="Service Needed"]');
      var service = serviceField && serviceField.value ? serviceField.value : "Solar assessment";
      var subject = "Website enquiry - " + service;
      var mailto = "mailto:sales@proenergysols.co.za?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      if (status) {
        status.textContent = "Your email app should open with this enquiry prepared. Review the details and press Send. If no email app opens, please use the phone or WhatsApp links on this page.";
        status.classList.add("is-visible");
      }

      window.location.href = mailto;
    });
  }
})();
