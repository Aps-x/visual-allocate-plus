const ACCORDION = document.querySelector(".accordion");

ACCORDION.addEventListener("click", (event) => {
    const panel = event.target.closest(".accordion__panel");

    if (!panel) {
        return;
    }

    const button = panel.querySelector("button");
    const content = panel.querySelector(".accordion__content");

    const is_expanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!is_expanded));
    content.setAttribute("aria-hidden", String(is_expanded));
});
