/* ==========================================================================
Constants, Variables, Data
========================================================================== */
const ACTIVITIES = document.querySelectorAll(".activity");
const CARDS = document.querySelectorAll(".activity__card");

const INVISIBLE_IMAGE = new Image();
INVISIBLE_IMAGE.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=";

let card_being_dragged = null;
let current_activity_id = null;

let original_container = null;
let dropped_in_valid_zone = false;

let offset_x = 0;
let offset_y = 0;

/* ==========================================================================
Event Listeners
========================================================================== */
CARDS.forEach(card => {
    card.addEventListener("dragstart", (event) => {
        card_being_dragged = card;
        current_activity_id = card_being_dragged.dataset.activityId;
        original_container = card.parentElement;
        dropped_in_valid_zone = false;

        // Offset the card position when being dragged...
        // Based on where the user clicks the card.
        const rect = card_being_dragged.getBoundingClientRect();
        offset_x = event.clientX - rect.left;
        offset_y = event.clientY - rect.top;
        
        // Card width is set by the grid-parent auto-columns.
        // Card height and padding are percentage based for responsiveness.
        // This introduces a problem when the card is moved to the body...
        // Because percentage is relative to the container.
        // Convert relative percentage values => absolute pixel values.
        const card_computed_style = window.getComputedStyle(card_being_dragged);
        const card_padding = Get_Padding_As_Pixels(card_computed_style);

        card_being_dragged.style.setProperty('--width', card_computed_style.width);
        card_being_dragged.style.setProperty('--height', card_computed_style.height);
        card_being_dragged.style.setProperty('--padding', card_padding);
        
        // IMPORANT: Must be added after computing the style
        card_being_dragged.classList.add("activity__card--being-dragged");

        // Move card to the body
        document.body.appendChild(card);
        Move_Card(event.pageX, event.pageY);

        // Hide native drag image
        event.dataTransfer.setDragImage(INVISIBLE_IMAGE, 0, 0);

        // Highlight matching dropzones
        ACTIVITIES.forEach(activity => {
            if (activity.dataset.activityId === current_activity_id) {
                activity.classList.add("activity--dropzone");
            }
        });
    });

    card.addEventListener("dragend", () => {
        // If the card wasn't dropped in a valid zone, return it to original container
        if (!dropped_in_valid_zone) {
            original_container.appendChild(card_being_dragged);
        }

        card_being_dragged.classList.remove("activity__card--being-dragged");

        // Remove dropzone classes
        ACTIVITIES.forEach(activity => {
            activity.classList.remove("activity--dropzone");
        });

        // Reset global references
        card_being_dragged = null;
        current_activity_id = null;
        original_container = null;
        dropped_in_valid_zone = false;
    });
});

// When the card is dragged over the page, update position
document.addEventListener("dragover", (event) => {
    if (card_being_dragged) {
        Move_Card(event.pageX, event.pageY);
    }
});

ACTIVITIES.forEach(activity => {
    activity.addEventListener("dragover", (event) => {
        // Make sure the drop event is not ignored
        event.preventDefault();
    });

    activity.addEventListener("drop", () => {
        if (card_being_dragged && activity.dataset.activityId === current_activity_id) {
            activity.appendChild(card_being_dragged);
            dropped_in_valid_zone = true;
        }

        // Remove dropzone classes
        ACTIVITIES.forEach(activity => {
            activity.classList.remove("activity--dropzone");
        });

        if (card_being_dragged) {
            // Reset styles
            card_being_dragged.classList.remove("activity__card--being-dragged");
        }

        // Reset handled in dragend
    });
});

/* ==========================================================================
Functions
========================================================================== */
function Move_Card(page_x, page_y) {
    card_being_dragged.style.setProperty('--left', `${page_x - offset_x}px`);
    card_being_dragged.style.setProperty('--top', `${page_y - offset_y}px`);
}

function Get_Padding_As_Pixels(computed_style) {
    // Padding should be even on all sides, original below
    return computed_style.getPropertyValue('padding-left');

    // const padding_top = computed_style.getPropertyValue('padding-top');
    // const padding_right = computed_style.getPropertyValue('padding-right');
    // const padding_bottom = computed_style.getPropertyValue('padding-bottom');
    // const padding_left = computed_style.getPropertyValue('padding-left');

    // return `${padding_top} ${padding_right} ${padding_bottom} ${padding_left}`;
}
