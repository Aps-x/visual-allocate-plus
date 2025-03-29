const ACCORDION = document.querySelector(".accordion");

ACCORDION.addEventListener("click", (e) => {
    const activePanel = e.target.closest(".accordion__panel");
    if (!activePanel) return;
    toggleAccordion(activePanel);
});

function toggleAccordion(panelToActivate) {
    const activeButton = panelToActivate.querySelector("button");
    const activePanel = panelToActivate.querySelector(".accordion__content");
    const activePanelIsOpened = activeButton.getAttribute("aria-expanded");

    if (activePanelIsOpened === "true") {
        panelToActivate.querySelector("button").setAttribute("aria-expanded", false);
        panelToActivate.querySelector(".accordion__content").setAttribute("aria-hidden", true);
    } else {
        panelToActivate.querySelector("button").setAttribute("aria-expanded", true);
        panelToActivate.querySelector(".accordion__content").setAttribute("aria-hidden", false);
    }
}