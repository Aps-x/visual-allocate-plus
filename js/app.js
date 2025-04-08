let draggedCard = null;
let ghostCard = null;
let offsetX = 0;
let offsetY = 0;
let currentDataId = null;

const transparentImage = new Image();
transparentImage.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=";

document.querySelectorAll(".activity__card").forEach(card => {

    card.addEventListener("dragstart", (e) => {
        draggedCard = card;
        const rect = card.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        currentDataId = card.dataset.id;
    
        // Hide native drag image
        e.dataTransfer.setDragImage(transparentImage, 0, 0);
    
        // Clone and style ghost card
        ghostCard = card.cloneNode(true);
        copyComputedStyles(card, ghostCard);
        ghostCard.style.position = "absolute";
        ghostCard.style.pointerEvents = "none";
        ghostCard.style.opacity = "0.9";
        ghostCard.style.zIndex = "9999";
        ghostCard.style.margin = "0";
        ghostCard.style.boxSizing = "border-box";
        ghostCard.classList.add("activity__card--dragging-clone");
        document.body.appendChild(ghostCard);
        moveGhost(e.pageX, e.pageY);

        // Hide original card visually
        card.style.visibility = "hidden";
    
        // Highlight dropzones
        document.querySelectorAll(`.activity[data-id="${currentDataId}"]`)
            .forEach(cell => cell.classList.add("activity--dropzone"));
    });
    
    card.addEventListener("dragend", () => {
        // Show the original card again
        card.style.visibility = "visible";
    
        if (ghostCard) {
            ghostCard.remove();
            ghostCard = null;
        }
    
        document.querySelectorAll(".activity--dropzone")
            .forEach(cell => cell.classList.remove("activity--dropzone"));
    
        draggedCard = null;
        currentDataId = null;
    });
    
});

document.addEventListener("dragover", (e) => {
    if (ghostCard) {
        moveGhost(e.pageX, e.pageY);
    }
});

document.querySelectorAll(".activity").forEach(cell => {
    cell.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    cell.addEventListener("drop", () => {
        if (draggedCard) {
            cell.appendChild(draggedCard);
        }

        document.querySelectorAll(".activity--dropzone")
            .forEach(c => c.classList.remove("activity--dropzone"));

        if (ghostCard) {
            ghostCard.remove();
            ghostCard = null;
        }
    });
});

function moveGhost(pageX, pageY) {
    ghostCard.style.left = `${pageX - offsetX}px`;
    ghostCard.style.top = `${pageY - offsetY}px`;
}

function copyComputedStyles(source, target) {
    const computed = window.getComputedStyle(source);
    for (let prop of computed) {
        target.style.setProperty(prop, computed.getPropertyValue(prop), computed.getPropertyPriority(prop));
    }
}