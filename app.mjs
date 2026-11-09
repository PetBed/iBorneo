import { formatRinggit, getEstimate } from "./pricing.mjs";
import { createInquiryMailto } from "./inquiry.mjs";

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

function closeNavigation(restoreFocus = false) {
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");

  if (restoreFocus) {
    menuToggle.focus();
  }
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

  if (isExpanded) {
    closeNavigation();
    return;
  }

  mainNav.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation");
});

mainNav.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (menuToggle.getAttribute("aria-expanded") === "true") {
      closeNavigation();
      const target = document.getElementById(link.hash.slice(1));
      const heading = target?.matches("h1, h2") ? target : target?.querySelector("h1, h2");

      if (heading) {
        heading.tabIndex = -1;
        window.requestAnimationFrame(() => heading.focus({ preventScroll: true }));
      }
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeNavigation(true);
  }
});

window.matchMedia("(min-width: 721px)").addEventListener("change", (event) => {
  if (event.matches) {
    closeNavigation();
  }
});

const estimateAmount = document.querySelector("#estimate-amount");
const estimateEntity = document.querySelector("#estimate-entity");
const estimateError = document.querySelector("#estimate-error");
const estimateIncluded = document.querySelector("#estimate-included");
const entityInputs = document.querySelectorAll('input[name="entity"]');

function renderEstimate(entityId) {
  try {
    const estimate = getEstimate(entityId);
    const scopeItems = estimate.includedScope
      .replace(/\s+and\s+/i, ", ")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    estimateAmount.textContent = formatRinggit(estimate.amount);
    estimateEntity.textContent = `${estimate.label} · Fast-track`;
    estimateIncluded.replaceChildren(
      ...scopeItems.map((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        return listItem;
      }),
    );
    estimateError.textContent = "";
    estimateError.hidden = true;
  } catch (error) {
    if (!(error instanceof RangeError)) {
      throw error;
    }

    estimateAmount.textContent = "";
    estimateEntity.textContent = "Select a supported business structure.";
    estimateIncluded.replaceChildren();
    estimateError.textContent = "That business structure is not supported. Select one of the listed options.";
    estimateError.hidden = false;
  }
}

entityInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) {
      renderEstimate(input.value);
    }
  });
});

const filterButtons = document.querySelectorAll("[data-filter]");
const serviceCards = document.querySelectorAll(".service-card");
const supportedFilters = new Set([...filterButtons].map((button) => button.dataset.filter));

function applyServiceFilter(requestedFilter) {
  const selectedFilter = supportedFilters.has(requestedFilter) ? requestedFilter : "all";

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === selectedFilter));
  });

  serviceCards.forEach((card) => {
    card.hidden = selectedFilter !== "all" && card.dataset.category !== selectedFilter;
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyServiceFilter(button.dataset.filter);
  });
});

applyServiceFilter("all");

const inquiryForm = document.querySelector("#inquiry-form");

inquiryForm.addEventListener("submit", (event) => {
  if (!inquiryForm.reportValidity()) {
    return;
  }

  event.preventDefault();
  const fields = new FormData(inquiryForm);

  window.location.assign(createInquiryMailto({
    name: fields.get("name")?.toString() ?? "",
    email: fields.get("email")?.toString() ?? "",
    phone: fields.get("phone")?.toString() ?? "",
    service: fields.get("service")?.toString() ?? "",
    message: fields.get("message")?.toString() ?? "",
  }));
});

const selectedEntity = document.querySelector('input[name="entity"]:checked');

if (selectedEntity) {
  renderEstimate(selectedEntity.value);
}
