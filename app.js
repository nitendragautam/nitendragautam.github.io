/* ─── Portfolio rendering + animations ─────────────────────────── */
(function () {
  "use strict";

  var hasGsap = typeof window.gsap !== "undefined";
  var hasST = hasGsap && typeof window.ScrollTrigger !== "undefined";
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Render: hero ---------- */
  document.getElementById("hero-name").innerHTML =
    'Hi, I\'m <span class="glow">' + PROFILE.name + "</span>";
  document.getElementById("hero-headline").textContent = PROFILE.headline;
  document.getElementById("hero-summary").textContent = PROFILE.summary;
  document.getElementById("hero-contact").innerHTML =
    '<a href="mailto:' + PROFILE.email + '">' + PROFILE.email + "</a>" +
    '<a href="' + PROFILE.linkedin + '" target="_blank" rel="noopener">' + PROFILE.linkedinLabel + "</a>" +
    "<span>" + PROFILE.location + "</span>";
  document.getElementById("footer-name").textContent = PROFILE.name;
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Render: stats ---------- */
  document.getElementById("stats-grid").innerHTML = STATS.map(function (s, i) {
    return (
      '<div class="stat reveal">' +
        '<div class="stat-value" data-value="' + s.value + '" data-prefix="' + (s.prefix || "") +
        '" data-suffix="' + (s.suffix || "") + '">0</div>' +
        '<div class="stat-label">' + s.label + "</div>" +
      "</div>"
    );
  }).join("");

  /* ---------- Render: timeline ---------- */
  document.getElementById("timeline-list").innerHTML = CAREER.map(function (c) {
    var highlights = c.highlights.map(function (h) { return "<li>" + h + "</li>"; }).join("");
    var tech = (c.tech || []).map(function (t) { return "<span>" + t + "</span>"; }).join("");
    return (
      '<div class="tl-item reveal">' +
        '<div class="tl-dot"></div>' +
        '<div class="tl-card">' +
          '<span class="tl-period">' + c.period + "</span>" +
          "<h3>" + c.role + "</h3>" +
          '<p class="tl-company">' + c.company + " · " + c.location + "</p>" +
          '<ul class="tl-highlights">' + highlights + "</ul>" +
          (tech ? '<div class="tl-tech">' + tech + "</div>" : "") +
        "</div>" +
      "</div>"
    );
  }).join("");

  /* ---------- Render: skills ---------- */
  document.getElementById("skills-grid").innerHTML = SKILLS.map(function (s) {
    return (
      '<div class="skill reveal">' +
        '<div class="skill-name"><span>' + s.name + "</span><em>" + s.level + "%</em></div>" +
        '<div class="skill-bar"><div class="skill-fill" data-level="' + s.level + '"></div></div>' +
      "</div>"
    );
  }).join("");

  /* ---------- Render: education ---------- */
  document.getElementById("edu-grid").innerHTML = EDUCATION.map(function (e) {
    return (
      '<div class="edu-card reveal">' +
        '<div class="edu-date">' + e.date + "</div>" +
        "<h3>" + e.degree + "</h3>" +
        "<p>" + e.institution + " · " + e.location + "</p>" +
      "</div>"
    );
  }).join("");

  /* ---------- Render: contact ---------- */
  var cards = [
    { label: "Email", value: PROFILE.email, href: "mailto:" + PROFILE.email },
    { label: "LinkedIn", value: PROFILE.linkedinLabel, href: PROFILE.linkedin },
    { label: "Phone", value: PROFILE.phone, href: "tel:+1" + PROFILE.phone.replace(/\D/g, "") },
    { label: "Location", value: PROFILE.location, href: null },
  ];
  document.getElementById("contact-cards").innerHTML = cards.map(function (c) {
    var inner = "<small>" + c.label + "</small><strong>" + c.value + "</strong>";
    return c.href
      ? '<a class="contact-card" href="' + c.href + '"' + (c.href.indexOf("http") === 0 ? ' target="_blank" rel="noopener"' : "") + ">" + inner + "</a>"
      : '<div class="contact-card">' + inner + "</div>";
  }).join("");

  /* ---------- Render: latest blog posts ---------- */
  (function latestPosts() {
    var el = document.getElementById("latest-posts");
    if (!el || typeof POSTS === "undefined") return;
    el.innerHTML = POSTS.slice(0, 3).map(function (p) {
      return (
        '<a class="post-card reveal" href="post.html?slug=' + p.slug + '">' +
          '<p class="post-meta">' + p.date + "</p>" +
          "<h3>" + p.title + "</h3>" +
          "<p>" + p.excerpt + "</p>" +
          '<span class="read-more">Read more →</span>' +
        "</a>"
      );
    }).join("");
  })();

  /* ---------- Counters ---------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-value"), 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1600, start = null;
    function tick(now) {
      if (!start) start = now;
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Skill bars ---------- */
  function fillBar(el) {
    el.style.transition = "width 1.4s cubic-bezier(0.22, 1, 0.36, 1)";
    requestAnimationFrame(function () {
      el.style.width = el.getAttribute("data-level") + "%";
    });
  }

  /* ---------- Animations ---------- */
  if (hasST) {
    // Scroll-triggered reveals
    gsap.utils.toArray(".reveal").forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 36 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    // Glowing timeline progress line
    var tl = document.querySelector(".timeline");
    if (tl) {
      var prog = document.createElement("div");
      prog.className = "timeline-progress";
      tl.appendChild(prog);
      gsap.to(prog, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: tl, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
      });
    }

    // Counters + skill bars on enter
    ScrollTrigger.batch(".stat-value", {
      start: "top 90%", once: true,
      onEnter: function (els) { els.forEach(animateCounter); },
    });
    ScrollTrigger.batch(".skill-fill", {
      start: "top 92%", once: true,
      onEnter: function (els) { els.forEach(fillBar); },
    });
  } else {
    // Fallback when GSAP CDN is unavailable
    document.body.classList.add("no-anim");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        if (en.target.classList.contains("stat-value")) animateCounter(en.target);
        if (en.target.classList.contains("skill-fill")) fillBar(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll(".stat-value, .skill-fill").forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero particles ---------- */
  (function particles() {
    var canvas = document.getElementById("particles");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var dots = [], W, H;
    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    var N = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 16000));
    for (var i = 0; i < N; i++) {
      dots.push({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.0006,
        vy: (Math.random() - 0.5) * 0.0006,
        a: Math.random() * 0.5 + 0.15,
      });
    }
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(function (d) {
        d.x = (d.x + d.vx + 1) % 1;
        d.y = (d.y + d.vy + 1) % 1;
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 211, 238," + d.a + ")";
        ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  })();
})();
