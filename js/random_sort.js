const list_of_cards = document.querySelectorAll(".card");

// Randomly position, size, and color the cards
list_of_cards.forEach(element => {
    element.style.gridRowStart = Math.floor(Math.random() * 6) + 2; 
    element.style.gridRowEnd = `span ${Math.floor(Math.random() * 3) + 2}`; 
    element.style.backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
});