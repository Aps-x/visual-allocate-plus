const ACCORDION = document.querySelector(".accordion");

ACCORDION.addEventListener("click", (event) => {
    const active_panel = event.target.closest(".accordion__panel");

    if (!active_panel) {
        return;
    } 

    Toggle_Accordion(active_panel);
});

function Toggle_Accordion(panel_to_activate) {
    const active_button = panel_to_activate.querySelector("button");
    const active_panel = panel_to_activate.querySelector(".accordion__content");
    const active_panel_is_opened = active_button.getAttribute("aria-expanded");

    if (active_panel_is_opened === "true") {
        panel_to_activate.querySelector("button").setAttribute("aria-expanded", false);
        panel_to_activate.querySelector(".accordion__content").setAttribute("aria-hidden", true);
    } 
    else {
        panel_to_activate.querySelector("button").setAttribute("aria-expanded", true);
        panel_to_activate.querySelector(".accordion__content").setAttribute("aria-hidden", false);
    }
}