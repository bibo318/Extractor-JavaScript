(function () {
  var endpoints = [];
  var seen = {};

  // Common API path prefixes used to detect endpoint strings
  var apiPrefixes = [
    "api", "v\\d+", "rest", "graphql", "gql",
    "auth", "oauth",
    "user", "users", "account", "accounts",
    "login", "logout", "register",
    "search", "upload", "download",
    "admin", "public", "private",
    "data", "service", "services",
    "endpoint", "endpoints",
    "health", "status", "config", "settings",
    "webhook", "webhooks",
    "notify", "notification", "notifications",
    "message", "messages",
    "report", "reports",
    "file", "files", "image", "images", "media",
    "feed", "feeds",
    "token", "tokens", "refresh",
    "verify", "validate", "confirm",
    "payment", "payments",
    "order", "orders",
    "product", "products",
    "cart", "carts", "checkout",
  ];
  var apiPrefixPattern = new RegExp(
    "['\"`](\\/" + "(?:" + apiPrefixes.join("|") + ")" + "[^'\"`\\s]*)",
    "g"
  );

  // Patterns to detect API endpoints
  var patterns = [
    // fetch/axios/XHR calls with string URLs
    /(?:fetch|axios\.get|axios\.post|axios\.put|axios\.patch|axios\.delete|axios\.request)\s*\(\s*['"`]([^'"`\s]+)['"`]/g,
    // $.ajax / $.get / $.post
    /\$\.(?:ajax|get|post|put|delete)\s*\(\s*['"`]([^'"`\s]+)['"`]/g,
    // url: "..." inside objects
    /url\s*:\s*['"`]([^'"`\s]+)['"`]/g,
    // path strings starting with known API prefixes (e.g. /api/, /v1/, /rest/)
    apiPrefixPattern,
    // XMLHttpRequest .open(method, url)
    /\.open\s*\(\s*['"`][A-Z]+['"`]\s*,\s*['"`]([^'"`\s]+)['"`]/g,
  ];

  function extractFromText(text) {
    patterns.forEach(function (pattern) {
      pattern.lastIndex = 0;
      var match;
      while ((match = pattern.exec(text)) !== null) {
        var url = match[1];
        if (url && !seen[url]) {
          seen[url] = true;
          endpoints.push(url);
        }
      }
    });
  }

  // Extract from all inline scripts
  var scripts = document.querySelectorAll("script");
  scripts.forEach(function (script) {
    if (!script.src && script.textContent) {
      extractFromText(script.textContent);
    }
  });

  // Fetch external scripts and extract from them
  var externalScripts = [];
  scripts.forEach(function (script) {
    if (script.src) {
      externalScripts.push(script.src);
    }
  });

  // Also check already-loaded script resources via performance entries
  if (window.performance && window.performance.getEntriesByType) {
    window.performance.getEntriesByType("resource").forEach(function (entry) {
      if (
        entry.initiatorType === "script" &&
        externalScripts.indexOf(entry.name) === -1
      ) {
        externalScripts.push(entry.name);
      }
    });
  }

  var total = externalScripts.length;
  var fetched = 0;

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function showResults() {
    var html =
      "<!DOCTYPE html><html><head>" +
      "<meta charset='utf-8'>" +
      "<title>Endpoint Extractor – Results</title>" +
      "<style>" +
      "body{font-family:monospace;background:#1e1e2e;color:#cdd6f4;margin:0;padding:20px}" +
      "h1{color:#cba6f7;font-size:1.4em;margin-bottom:10px}" +
      ".meta{color:#a6e3a1;margin-bottom:16px;font-size:.9em}" +
      ".list{list-style:none;padding:0;margin:0}" +
      ".list li{padding:6px 10px;border-bottom:1px solid #313244;word-break:break-all}" +
      ".list li:hover{background:#313244}" +
      ".list li a{color:#89b4fa;text-decoration:none}" +
      ".list li a:hover{text-decoration:underline}" +
      ".empty{color:#f38ba8;font-style:italic}" +
      ".copy-btn{margin-top:16px;padding:8px 16px;background:#cba6f7;color:#1e1e2e;border:none;border-radius:4px;cursor:pointer;font-size:.9em;font-weight:bold}" +
      ".copy-btn:hover{background:#b4befe}" +
      "</style></head><body>" +
      "<h1>🔍 Endpoint Extractor</h1>" +
      "<div class='meta'>Source: " +
      document.location.href +
      " &nbsp;|&nbsp; Found: <strong>" +
      endpoints.length +
      "</strong> endpoint(s)</div>";

    if (endpoints.length === 0) {
      html += "<p class='empty'>No endpoints found on this page.</p>";
    } else {
      html += "<ul class='list'>";
      endpoints.forEach(function (ep) {
        var display = escapeHtml(ep);
        var rawHref = ep.charAt(0) === "/" ? document.location.origin + ep : ep;
        var href = escapeHtml(rawHref);
        html +=
          "<li><a href='" +
          href +
          "' target='_blank' rel='noopener noreferrer'>" +
          display +
          "</a></li>";
      });
      html += "</ul>";
      html +=
        "<button class='copy-btn' onclick=\"navigator.clipboard.writeText(" +
        JSON.stringify(endpoints.join("\n")) +
        ").then(function(){this.textContent='Copied!';}.bind(this))\">📋 Copy all</button>";
    }

    html += "</body></html>";

    var win = window.open("", "_blank");
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
    } else {
      alert(
        "Popup blocked. Please allow popups for this site and try again.\n\nEndpoints found:\n" +
          (endpoints.length ? endpoints.join("\n") : "(none)")
      );
    }
  }

  if (total === 0) {
    showResults();
    return;
  }

  externalScripts.forEach(function (src) {
    fetch(src, { credentials: "omit" })
      .then(function (r) {
        return r.text();
      })
      .then(function (text) {
        extractFromText(text);
      })
      .catch(function () {
        // ignore cross-origin / network errors
      })
      .finally(function () {
        fetched++;
        if (fetched === total) {
          showResults();
        }
      });
  });
})();
