//recolor navbar when scrolling to make it readable
window.addEventListener("scroll", function () {
    let navbar = document.getElementById("tutorialHeader");
    if (window.scrollY > window.innerHeight/10) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


//make hover effects for tutorial l.boxes
const hoverContent = {
    "2x2LP": ["2x2", "Method: <b>LP</b>", "Difficulty: <span class='difficultyEasy'>Easy</span>"],
    "3x3LBL": ["3x3", "Medthod: <b>LBL</b>", "Difficulty: <span class='difficultyEasy'>Easy</span>"],
    "3x3CFOP": ["3x3", "Medthod: CFOP", "Difficulty: <span class='difficultyHard'>Hard</span>"],
    "3x3ROUX": ["3x3", "Medthod: ROUX", "Difficulty: <span class='difficultyMedium'>Medium</span>"],
    "4x4YAU": ["4x4", "Medthod: YAU", "Difficulty: <span class='difficultyMedium'>Medium</span>"],
    "5x5YAU": ["5x5", "Medthod: YAU", "Difficulty: <span class='difficultyMedium'>Medium</span>"],
    "6x6HOJA": ["6x6", "Medthod: HOJA", "Difficulty: <span class='difficultyHard'>Hard</span>"],
    "7x7HOJA": ["7x7", "Medthod: HOJA", "Difficulty: <span class='difficultyHard'>Hard</span>"],
    "skewbSB": ["Skweb", "Medthod: SB", "Difficulty: <span class='difficultyEasy'>Easy</span>"],
    "pyraminxPB": ["Pyraminx", "Medthod: PB", "Difficulty: <span class='difficultyEasy'>Easy</span>"],
    "megaminxMQL": ["Megaminx", "Medthod: MQL", "Difficulty: <span class='difficultyMedium'>Medium</span>"],
    "square-1YAOP": ["Square-1", "Medthod: YAOP", "Difficulty: <span class='difficultyHard'>Hard</span>"],
}

document.querySelectorAll('.tutorial-item').forEach(box => {
    const originalContent = box.innerHTML; // Store original content

    box.addEventListener('mouseenter', () => {
        box.innerHTML = `
                <p class="hoveredTextSize">${hoverContent[box.id][0]}</p>
                <p class="hoveredTextMethod">${hoverContent[box.id][1]}</p>
                <p class="hoveredTextDifficulty">${hoverContent[box.id][2]}</p>
                `;
    });

    box.addEventListener('mouseleave', () => {
        box.innerHTML = originalContent;
    });
});