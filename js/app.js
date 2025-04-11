/* ==========================================================================
Constants, Variables, Data
========================================================================== */
const ACTIVITIES = document.querySelectorAll(".activity");
const CARDS = document.querySelectorAll(".activity__card");

const INVISIBLE_IMAGE = new Image();
INVISIBLE_IMAGE.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=";

let card_being_dragged = null;
let current_activity_id = null;

let offsetX = 0;
let offsetY = 0;

let originalStyles = {};

/* ==========================================================================
Event Listeners
========================================================================== */
CARDS.forEach(card => {
    card.addEventListener("dragstart", (event) => {
        card_being_dragged = card;
        current_activity_id = card.dataset.activityId;
        //card.classList.add("activity__card--being-dragged");

        // Offset the card position when being dragged
        // Based on where the user clicks the card
        const rect = card.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        // Save original styles to reset later
        const computed = window.getComputedStyle(card);
        originalStyles = {
            position: card.style.position,
            left: card.style.left,
            top: card.style.top,
            width: card.style.width,
            height: card.style.height,
            padding: card.style.padding,
            zIndex: card.style.zIndex,
            pointerEvents: card.style.pointerEvents,
        };

        // Calculate the padding in px (to avoid issues with percentage padding)
        const paddingTop = parseFloat(computed.paddingTop);
        const paddingRight = parseFloat(computed.paddingRight);
        const paddingBottom = parseFloat(computed.paddingBottom);
        const paddingLeft = parseFloat(computed.paddingLeft);

        // Set fixed dimensions and absolute position
        card.style.width = computed.width;
        card.style.height = computed.height;
        card.style.paddingTop = `${paddingTop}px`;
        card.style.paddingRight = `${paddingRight}px`;
        card.style.paddingBottom = `${paddingBottom}px`;
        card.style.paddingLeft = `${paddingLeft}px`;
        card.style.position = "absolute";
        card.style.zIndex = "9999";
        card.style.pointerEvents = "none"; // prevents re-capturing
        card.style.margin = "0";
        card.style.boxSizing = "border-box";

        // Move it to the body
        document.body.appendChild(card);
        moveCard(event.pageX, event.pageY);

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
        if (card_being_dragged) {
            // Reset styles
            Object.assign(card_being_dragged.style, originalStyles);

            // Remove dropzone classes
            document.querySelectorAll(".activity--dropzone")
                .forEach(cell => cell.classList.remove("activity--dropzone"));

            card_being_dragged = null;
            current_activity_id = null;
        }
    });
});

document.addEventListener("dragover", (e) => {
    if (card_being_dragged) {
        moveCard(e.pageX, e.pageY);
    }
});

ACTIVITIES.forEach(cell => {
    cell.addEventListener("dragover", (e) => {
        e.preventDefault(); // Allow drop
    });

    cell.addEventListener("drop", () => {
        if (card_being_dragged && cell.dataset.activityId === current_activity_id) {
            cell.appendChild(card_being_dragged);
        }

        // Clean up
        document.querySelectorAll(".activity--dropzone")
            .forEach(c => c.classList.remove("activity--dropzone"));

        if (card_being_dragged) {
            // Reset styles
            Object.assign(card_being_dragged.style, originalStyles);
            card_being_dragged = null;
            current_activity_id = null;
        }
    });
});

/* ==========================================================================
Functions
========================================================================== */
function moveCard(pageX, pageY) {
    card_being_dragged.style.left = `${pageX - offsetX}px`;
    card_being_dragged.style.top = `${pageY - offsetY}px`;
}
