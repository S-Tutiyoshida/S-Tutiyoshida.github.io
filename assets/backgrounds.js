(function () {
  const owner = "Shinnosuke-Yoshida";
  const repo = "Shinnosuke-Yoshida.github.io";
  const folders = ["assets/backgrounds", "assets/images", "assets"];
  const imagePattern = /\.(avif|webp|jpe?g|png|gif)$/i;
  const excluded = new Set(["README.md", "icons.svg", "猫.JPG"]);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  async function listImages(folder) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}?ref=main`;
    const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) return [];
    const items = await response.json();
    if (!Array.isArray(items)) return [];
    return items
      .filter((item) => item.type === "file" && imagePattern.test(item.name) && !excluded.has(item.name))
      .map((item) => item.download_url || `/${item.path}`);
  }

  async function applyRandomBackground() {
    const groups = await Promise.all(folders.map(listImages));
    const primary = groups[0].length ? groups[0] : groups.flat();
    if (!primary.length) return;
    const selected = primary[Math.floor(Math.random() * primary.length)];
    document.body.style.backgroundImage = `linear-gradient(180deg, rgba(7, 38, 50, 0.18), rgba(5, 42, 55, 0.56)), url("${selected}")`;
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";
  }

  applyRandomBackground().catch(() => {});
})();
