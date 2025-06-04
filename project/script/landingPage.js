//recolor navbar and makes it smaller when scrolling to make it readable
window.addEventListener("scroll", function () {
    let navbar = document.getElementById("landingPageHeader");
    if (window.scrollY > window.innerHeight) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


function changeExampleImage(imageName) {
    document.getElementById("switchingImage").style.backgroundImage = `url(img/cubeExample/${imageName}.png)`;
}

let whatIsMasterCubeContentArray = [
    { "name": "TUTORIALS", "text": "There's nothing you can't find there","class":"material-icons"},
    { "name": "TIMER", "text": "Know your speed and ignore your limits" },
    { "name": "COMPETITION", "text": "Compete - Win - Repeat It's not that hard" },
    { "name": "SHOP PORTAL", "text": "Yess you need a 10th speedcube (trust me)" }
];

let currentWhatIsMasterCubeContentArrayIndex = 0;

function nextWhatIsMasterCubeBox() {
    currentWhatIsMasterCubeContentArrayIndex = currentWhatIsMasterCubeContentArrayIndex == 3 ? 0 : currentWhatIsMasterCubeContentArrayIndex + 1;
    updateWhatIsMasterCubeBox();
}

function previousWhatIsMasterCubeBox() {
    currentWhatIsMasterCubeContentArrayIndex = currentWhatIsMasterCubeContentArrayIndex == 0 ? 3 : currentWhatIsMasterCubeContentArrayIndex - 1;
    updateWhatIsMasterCubeBox();
}

function updateWhatIsMasterCubeBox() {
    document.getElementById("whatIsMastercubeTitle").innerHTML = whatIsMasterCubeContentArray[currentWhatIsMasterCubeContentArrayIndex].name;
    document.getElementById("whatIsMastercubeText").innerHTML = whatIsMasterCubeContentArray[currentWhatIsMasterCubeContentArrayIndex].text;
    document.getElementById("whatIsMastercubeIcon").className = whatIsMasterCubeContentArray[currentWhatIsMasterCubeContentArrayIndex].class;
}

