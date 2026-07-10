const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll(".nav a")];
const copyButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("[data-copy-status]");
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

menuToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  }
});

copyButton?.addEventListener("click", async () => {
  const email = "tianr@stanford.edu";
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = "Email copied.";
    return;
  } catch {}

  const helper = document.createElement("textarea");
  helper.value = email;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();

  try {
    const copied = document.execCommand("copy");
    copyStatus.textContent = copied ? "Email copied." : email;
  } catch {
    copyStatus.textContent = email;
  } finally {
    helper.remove();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: "-25% 0px -55% 0px",
    threshold: [0.1, 0.3, 0.6],
  }
);

sections.forEach((section) => observer.observe(section));
