const getVersionedAssetUrl = window.getVersionedAssetUrl || (url => url);

function isExternalUrl(url) {
  return /^(https?:|mailto:|tel:|#)/.test(url);
}

function joinAssetPath(rootPath, url) {
  if (!url || isExternalUrl(url) || url.startsWith("/")) return url;
  const root = rootPath.replace(/\/$/, "");
  return root && root !== "." ? `${root}/${url}` : url;
}

function createAssetResolver(rootPath) {
  return url => getVersionedAssetUrl(joinAssetPath(rootPath, url));
}

export function initSite(siteConfig) {
  const rootPath = document.body.dataset.siteRoot || ".";
  const assetUrl = createAssetResolver(rootPath);

  siteConfig.links.whatsapp = `https://wa.me/${siteConfig.whatsappPrimary}?text=${encodeURIComponent(siteConfig.whatsappText)}`;
  siteConfig.links.whatsappFloating = `https://wa.me/${siteConfig.whatsappFloatingNumber}?text=${encodeURIComponent(siteConfig.whatsappFloatingText)}`;
  siteConfig.links.phone = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
  siteConfig.links.email = `mailto:${siteConfig.email}`;
  siteConfig.links.instagram = siteConfig.instagram;
  siteConfig.links.maps = siteConfig.googleMaps;

  document.querySelectorAll("[data-company]").forEach(el => el.textContent = siteConfig.companyName.toUpperCase());
  document.querySelectorAll("[data-slogan]").forEach(el => el.textContent = siteConfig.slogan);
  document.querySelectorAll("[data-phone]").forEach(el => el.textContent = siteConfig.phone);
  document.querySelectorAll("[data-mobile]").forEach(el => el.textContent = siteConfig.mobile);
  document.querySelectorAll("[data-whatsapp-display]").forEach(el => el.textContent = siteConfig.whatsappDisplay);
  document.querySelectorAll("[data-email]").forEach(el => el.textContent = siteConfig.email);
  document.querySelectorAll("[data-address]").forEach(el => el.textContent = siteConfig.address);
  document.querySelectorAll("[data-address-long]").forEach(el => el.textContent = siteConfig.addressLong);
  document.querySelectorAll("[data-map-embed]").forEach(el => {
    el.src = siteConfig.googleMapsEmbed;
  });
  document.querySelectorAll("[data-link]").forEach(el => {
    const href = siteConfig.links[el.dataset.link];
    if (!href) return;
    el.href = href;
    if (href.startsWith("http")) {
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
  });
  document.querySelectorAll("[data-image]").forEach(el => {
    const image = siteConfig.images[el.dataset.image];
    if (image) el.src = assetUrl(image);
  });

  const heroImage = document.querySelector(".hero-image");
  if (heroImage) heroImage.style.backgroundImage = `url("${assetUrl(siteConfig.images.heroGate)}")`;

  const aboutPageHero = document.querySelector(".about-page-hero");
  if (aboutPageHero) {
    aboutPageHero.style.setProperty("--about-hero-bg", `url("${assetUrl(siteConfig.images.aboutHero)}")`);
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const servicesGrid = document.getElementById("services-grid");
  if (servicesGrid) {
    servicesGrid.innerHTML = siteConfig.services.map(service => `
      <article class="service-card reveal">
        <i class="ph ${service.icon}" aria-hidden="true"></i>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
      </article>`).join("");
  }

  const benefitsGrid = document.getElementById("benefits-grid");
  if (benefitsGrid) {
    benefitsGrid.innerHTML = siteConfig.benefits.map(benefit => `
      <article class="benefit reveal">
        <i class="ph ${benefit.icon}" aria-hidden="true"></i>
        <h3>${benefit.title}</h3>
        <p>${benefit.text}</p>
      </article>`).join("");
  }

  const reviewsGrid = document.getElementById("reviews-grid");
  if (reviewsGrid) {
    reviewsGrid.innerHTML = siteConfig.reviews.map(review => `
      <article class="review-card reveal">
        <div class="stars" aria-label="5 de 5 estrellas">${'<i class="ph-fill ph-star"></i>'.repeat(5)}</div>
        <div class="quote"><i class="ph-fill ph-quotes"></i><p>${review.text}</p></div>
        <div class="reviewer"><i class="ph ph-user"></i><div><strong>${review.name}</strong><small>${review.place}</small></div></div>
      </article>`).join("");
  }

  const brandList = document.getElementById("brand-list");
  if (brandList) {
    brandList.innerHTML = siteConfig.brands.map(brand => {
      if (typeof brand === "object" && brand.image) {
        return `<span class="brand-item"><img class="brand-logo" src="${assetUrl(brand.image)}" alt="Logo de ${brand.name}" loading="lazy" decoding="async"></span>`;
      }
      return `<span class="brand-item">${brand}</span>`;
    }).join("");
  }

  const productFeatures = document.getElementById("product-features");
  if (productFeatures) {
    productFeatures.innerHTML = siteConfig.productFeatures.map(feature => `
      <article class="product-feature reveal">
        <i class="ph ${feature.icon}" aria-hidden="true"></i>
        <h3>${feature.title}</h3>
      </article>`).join("");
  }

  const productList = document.getElementById("product-list");
  if (productList) {
    productList.innerHTML = siteConfig.featuredProducts.map(product => `
      <article class="product-card reveal">
        <img src="${assetUrl(product.image)}" alt="${product.title}" loading="lazy" decoding="async">
        <div class="product-card-copy">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <a href="#contacto">Ver más <i class="ph ph-arrow-right"></i></a>
        </div>
      </article>`).join("");
  }

  const contactHours = document.getElementById("contact-hours");
  if (contactHours) {
    contactHours.innerHTML = siteConfig.contact.openingHours.map((hour, index) => `
      <div class="contact-hours-row${index ? " contact-hours-row-separated" : ""}">
        <strong>${hour.title}</strong>
        <span>${hour.text}</span>
      </div>`).join("");
  }

  const contactService = document.getElementById("contact-service");
  if (contactService) {
    contactService.innerHTML = '<option value="">Seleccioná un servicio</option>' + siteConfig.contact.services.map(service => (
      `<option value="${service}">${service}</option>`
    )).join("");
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const service = String(formData.get("service") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const whatsappMessage = [
        "Hola Nortel, quiero solicitar un presupuesto.",
        "",
        `Nombre: ${name}`,
        `Teléfono: ${phone}`,
        email ? `Email: ${email}` : "",
        service ? `Servicio de interés: ${service}` : "",
        message ? `Mensaje: ${message}` : "",
      ].filter(Boolean).join("\n");

      window.location.href = `https://wa.me/${siteConfig.whatsappPrimary}?text=${encodeURIComponent(whatsappMessage)}`;
    });
  }

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  if (menuButton && navigation) {
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
  }

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
  if (sections.length && navLinks.length) {
    window.addEventListener("scroll", () => {
      const current = sections.filter(section => section.offsetTop <= scrollY + 130).at(-1)?.id || "inicio";
      navLinks.forEach(link => link.classList.toggle("active", link.hash === `#${current}`));
    }, { passive: true });
  }

  const localBusinessSchema = document.getElementById("local-business-schema");
  if (localBusinessSchema) {
    localBusinessSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: siteConfig.companyName,
      image: `${siteConfig.siteUrl}${siteConfig.images.heroGate}`,
      url: siteConfig.siteUrl,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address,
        addressLocality: "Acassuso",
        addressRegion: "Buenos Aires",
        addressCountry: "AR",
      },
      sameAs: [siteConfig.instagram],
      openingHours: "Mo-Fr 08:00-18:00",
      areaServed: ["Martínez", "San Isidro", "Zona Norte"],
      serviceType: ["Automatización de portones", "Cámaras de seguridad", "Control de accesos", "Servicio técnico"],
    });
  }
}
