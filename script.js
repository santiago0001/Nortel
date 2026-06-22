SITE_CONFIG.links.whatsapp = `https://wa.me/${SITE_CONFIG.whatsappPrimary}?text=${encodeURIComponent(SITE_CONFIG.whatsappText)}`;
SITE_CONFIG.links.whatsappFloating = `https://wa.me/${SITE_CONFIG.whatsappFloatingNumber}?text=${encodeURIComponent(SITE_CONFIG.whatsappFloatingText)}`;
SITE_CONFIG.links.phone = `tel:${SITE_CONFIG.phone.replace(/[^\d+]/g, "")}`;
SITE_CONFIG.links.email = `mailto:${SITE_CONFIG.email}`;
SITE_CONFIG.links.instagram = SITE_CONFIG.instagram;
SITE_CONFIG.links.maps = SITE_CONFIG.googleMaps;

document.querySelectorAll("[data-company]").forEach(el => el.textContent = SITE_CONFIG.companyName.toUpperCase());
document.querySelectorAll("[data-slogan]").forEach(el => el.textContent = SITE_CONFIG.slogan);
document.querySelectorAll("[data-phone]").forEach(el => el.textContent = SITE_CONFIG.phone);
document.querySelectorAll("[data-email]").forEach(el => el.textContent = SITE_CONFIG.email);
document.querySelectorAll("[data-address]").forEach(el => el.textContent = SITE_CONFIG.address);
document.querySelectorAll("[data-link]").forEach(el => el.href = SITE_CONFIG.links[el.dataset.link]);
document.querySelectorAll("[data-image]").forEach(el => el.src = SITE_CONFIG.images[el.dataset.image]);
document.querySelector(".hero-image").style.backgroundImage = `url("${SITE_CONFIG.images.heroGate}")`;
document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("services-grid").innerHTML = SITE_CONFIG.services.map(service => `
  <article class="service-card reveal">
    <i class="ph ${service.icon}" aria-hidden="true"></i>
    <h3>${service.title}</h3>
    <p>${service.description}</p>
  </article>`).join("");

document.getElementById("benefits-grid").innerHTML = SITE_CONFIG.benefits.map(benefit => `
  <article class="benefit reveal">
    <i class="ph ${benefit.icon}" aria-hidden="true"></i>
    <h3>${benefit.title}</h3>
    <p>${benefit.text}</p>
  </article>`).join("");

document.getElementById("reviews-grid").innerHTML = SITE_CONFIG.reviews.map(review => `
  <article class="review-card reveal">
    <div class="stars" aria-label="5 de 5 estrellas">${'<i class="ph-fill ph-star"></i>'.repeat(5)}</div>
    <div class="quote"><i class="ph-fill ph-quotes"></i><p>${review.text}</p></div>
    <div class="reviewer"><i class="ph ph-user"></i><div><strong>${review.name}</strong><small>${review.place}</small></div></div>
  </article>`).join("");

document.getElementById("brand-list").innerHTML = SITE_CONFIG.brands.map(brand => {
  if (typeof brand === "object" && brand.image) {
    return `<span class="brand-item"><img class="brand-logo" src="${brand.image}" alt="Logo de ${brand.name}"></span>`;
  }
  return `<span class="brand-item">${brand}</span>`;
}).join("");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.innerHTML = `<i class="ph ph-${open ? "x" : "list"}"></i>`;
});
navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.innerHTML = '<i class="ph ph-list"></i>';
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];
window.addEventListener("scroll", () => {
  const current = sections.filter(section => section.offsetTop <= scrollY + 130).at(-1)?.id || "inicio";
  navLinks.forEach(link => link.classList.toggle("active", link.hash === `#${current}`));
}, { passive: true });

document.getElementById("local-business-schema").textContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_CONFIG.companyName,
  image: `${SITE_CONFIG.siteUrl}${SITE_CONFIG.images.heroGate}`,
  url: SITE_CONFIG.siteUrl,
  telephone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  address: { "@type": "PostalAddress", streetAddress: "Av. Fleming 900", addressLocality: "Martínez", addressRegion: "Buenos Aires", addressCountry: "AR" },
  sameAs: [SITE_CONFIG.instagram],
  openingHours: "Mo-Fr 08:00-18:00",
  areaServed: ["Martínez", "San Isidro", "Zona Norte"],
  serviceType: ["Automatización de portones", "Cámaras de seguridad", "Control de accesos", "Servicio técnico"]
});
