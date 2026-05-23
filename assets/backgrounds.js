(function () {
  const owner = "Shinnosuke-Yoshida";
  const repo = "Shinnosuke-Yoshida.github.io";
  const backgroundFolders = ["assets/backgrounds"];
  const iconFolders = ["assets/icon"];
  const imagePattern = /\.(avif|webp|jpe?g|png|gif|svg)$/i;
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

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  async function applyRandomBackground() {
    const images = (await Promise.all(backgroundFolders.map(listImages))).flat();
    if (!images.length) return;
    const selected = pick(images);
    document.body.style.backgroundImage = `linear-gradient(180deg, rgba(7, 38, 50, 0.18), rgba(5, 42, 55, 0.56)), url("${selected}")`;
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";
  }

  async function applyRandomIcon() {
    const icons = (await Promise.all(iconFolders.map(listImages))).flat();
    if (!icons.length) return;
    const identity = document.querySelector('.identity');
    const heading = identity && identity.querySelector('h1');
    if (!identity || !heading || identity.querySelector('.random-name-icon')) return;

    const icon = document.createElement('img');
    icon.className = 'random-name-icon';
    icon.src = pick(icons);
    icon.alt = '';
    icon.style.width = '128px';
    icon.style.height = '128px';
    icon.style.objectFit = 'cover';
    icon.style.border = '1px solid var(--line)';
    icon.style.borderRadius = '50%';
    icon.style.marginRight = '22px';
    icon.style.verticalAlign = 'middle';

    heading.prepend(icon);
  }

  applyRandomBackground().catch(() => {});
  applyRandomIcon().catch(() => {});
})();
