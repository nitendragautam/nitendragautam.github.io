/* ─── Blog listing + Markdown post rendering ───────────────────── */
(function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function postCard(p) {
    return (
      '<a class="post-card" href="post.html?slug=' + esc(p.slug) + '">' +
        '<p class="post-meta">' + esc(p.date) + "</p>" +
        "<h3>" + esc(p.title) + "</h3>" +
        "<p>" + esc(p.excerpt) + "</p>" +
        '<span class="read-more">Read more →</span>' +
      "</a>"
    );
  }

  // Listing page (blog.html)
  window.renderBlogList = function (elId) {
    var el = document.getElementById(elId);
    if (!el || typeof POSTS === "undefined") return;
    el.innerHTML = POSTS.length
      ? POSTS.map(postCard).join("")
      : "<p>No posts yet — check back soon.</p>";
  };

  // Single post page (post.html?slug=...)
  window.renderPost = function () {
    var slug = new URLSearchParams(window.location.search).get("slug");
    var post = typeof POSTS !== "undefined"
      ? POSTS.find(function (p) { return p.slug === slug; })
      : null;
    var titleEl = document.getElementById("post-title");
    var metaEl = document.getElementById("post-meta");
    var bodyEl = document.getElementById("post-content");

    if (!post) {
      titleEl.textContent = "Post not found";
      bodyEl.innerHTML = '<p>Sorry, that post doesn\'t exist. <a href="blog.html">Back to all posts</a>.</p>';
      return;
    }
    if (typeof marked === "undefined") {
      bodyEl.innerHTML = "<p>Could not load the Markdown renderer. Please check your connection and refresh.</p>";
      return;
    }

    document.title = post.title + " — Nitendra Gautam";
    titleEl.textContent = post.title;
    metaEl.textContent = post.date;

    fetch("posts/" + post.slug + ".md")
      .then(function (res) { if (!res.ok) throw new Error("missing"); return res.text(); })
      .then(function (md) { bodyEl.innerHTML = marked.parse(md); })
      .catch(function () {
        bodyEl.innerHTML = "<p>Could not load this post.</p>";
      });
  };
})();
