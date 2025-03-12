//Timer
let milliseconds = 0;
let intervalId;
let keyDownTime;
let colorChangeTimer = null;
let turnedRed = false;

let timerRunning = false;

let currentMode = "3x3"

function startTimer() {
    milliseconds = 0;
    timerRunning = true;
    if (!intervalId) {
        intervalId = setInterval(() => {
            milliseconds += 10;
            document.getElementById("time").innerHTML = formatMilliseconds(milliseconds);
        }, 10);
    }
}

function stopTimer() {
    timerRunning = false;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    document.getElementById("scramble").innerHTML = generateScramble();

    saveTime();
    showTimes();
    showStats();
}

function formatMilliseconds(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms / 1000) % 60);
    const milliseconds = Math.floor((ms % 1000) / 10);

    if (minutes == 0) {
        return `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
}

//spacebar needs to be pressed for 0.5s to start the timer, prevents accidental start
document.addEventListener("keydown", function (event) {
    if (event.key === " " && !event.repeat) {
        if (timerRunning) {
            stopTimer();
            timerRunning = false;
        } else {
            if (!turnedRed) {
                document.getElementById("time").style.color = "red";
                turnedRed = true;
            }

            keyDownTime = Date.now();
            colorChangeTimer = setTimeout(() => {
                if (Date.now() - keyDownTime >= 500) {
                    document.getElementById("time").style.color = "green";
                }
            }, 500);
        }
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === " ") {
        turnedRed = false;
        document.getElementById("time").style.color = "rgb(0, 240, 255)";

        if (keyDownTime !== null) {
            let elapsedTime = Date.now() - keyDownTime;
            if (elapsedTime >= 500) {
                startTimer();
                timerRunning = true;
            }
            keyDownTime = null;
        }

        clearTimeout(colorChangeTimer);
    }
});


//Press Escape to reset the timer to 0
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        document.getElementById("time").innerHTML = "00.00"
    }
});

//set a Scramble on page load
document.getElementById("scramble").innerHTML = generateScramble();

//Scramble Generator
function generateScramble(length = 20, size = 3) {
    let possibleScrambleAddition = [" ", "2", "'"];
    let possibleScrambleParts = ["R", "L", "U", "D", "B", "F"];

    let scrambleLenght = 20;

    let scramble = "";
    let lastRandNum = null;
    let randNum = null;
    for (let i = 0; i < scrambleLenght; i++) {
        do {
            randNum = getRandNum(0, possibleScrambleParts.length - 1);
        } while (randNum == lastRandNum);

        scramble += `${possibleScrambleParts[randNum]}${possibleScrambleAddition[getRandNum(0, possibleScrambleAddition.length - 1)]} `

        lastRandNum = randNum;
    }

    return scramble;
}

function getRandNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//create time array, if it doesn't exist
if (localStorage.getItem(`times${currentMode}`) == null) {
    localStorage.setItem(`times${currentMode}`, JSON.stringify([]));
}

//save time in local storage
function saveTime() {
    let times = JSON.parse(localStorage.getItem(`times${currentMode}`));
    times.push(document.getElementById("time").innerHTML);
    localStorage.setItem(`times${currentMode}`, JSON.stringify(times));
}

//reset Times
function clearTimes() {
    localStorage.setItem("times", JSON.stringify([]))
}

//generate mo3,ao5,ao12,ao100 and total Average
function generateStatistics() {
    let times = JSON.parse(localStorage.getItem("times"));
    times = times.filter(item => item !== "DNF"); //this line is from BlackboxAI

    let best = null;
    let mo3 = null;
    let ao5 = null;
    let ao12 = null;
    let ao100 = null;
    let totalAverage = null;

    best = Math.min(...times);

    if (times.length >= 5) {
        let last5Entrys = times.slice(-5);

        for (let i = 0; i < 5; i++) {
            ao5 += parseFloat(last5Entrys[i]);
        }
        ao5 /= 5;

        //remove smallest and biggest number
        let min = Math.min(...last5Entrys);
        let max = Math.max(...last5Entrys);
        let mo3Array = last5Entrys.filter(num => num !== min && num !== max);

        for (let i = 0; i < 3; i++) {
            mo3 += parseFloat(mo3Array[i]);
        }
        mo3 /= 3;
    }

    if (times.length >= 12) {
        let last12Entrys = times.slice(-12);

        for (let i = 0; i < 12; i++) {
            ao12 += parseFloat(last12Entrys[i]);
        }
        ao12 /= 12;
    }

    if (times.length >= 100) {
        let last100Entrys = times.slice(-100);

        for (let i = 0; i < 100; i++) {
            ao100 += parseFloat(last100Entrys[i]);
        }
        ao100 /= 100;
    }

    for (let i = 0; i < times.length; i++) {
        totalAverage += parseFloat(times[i]);
    }
    totalAverage /= times.length;

    best = best == null || best == Infinity ? "-" : best < 3.13 ? best.toFixed(2) + "(WR)" : best.toFixed(2); //adds (WR) if the time is a world record
    mo3 = mo3 == null ? "-" : mo3 < 4.05 ? mo3.toFixed(2) + "(WR)" : mo3.toFixed(2); //adds (WR) if the mo3 is a world record
    ao5 = ao5 == null ? "-" : ao5.toFixed(2);
    ao12 = ao12 == null ? "-" : ao12.toFixed(2);
    ao100 = ao100 == null ? "-" : ao100.toFixed(2);
    totalAverage = totalAverage == null ? "-" : totalAverage.toFixed(2);

    return {
        "best": best,
        "mo3": mo3,
        "ao5": ao5,
        "ao12": ao12,
        "ao100": ao100,
        "totalAverage": totalAverage
    }
}

//set the times in list
function showTimes() {
    let timeBox = document.getElementById("times");
    let times = JSON.parse(localStorage.getItem("times"));
    times.reverse();

    if (times.length == 0) {
        timeBox.innerHTML = "<h2>Times</h2><div>No times recorded.</div>";
    } else {

        let str = "<h2>Times</h2>";
        for (let i = 0; i < times.length; i++) {
            str += `
            <div class="singleTime">Solve ${times.length - i}: ${times[i]}</div>
        `;
        }
        timeBox.innerHTML = str;
    }
}
showTimes();

//set the stats in list
function showStats() {
    let statsBox = document.getElementById("stats");
    let stats = generateStatistics();

    statsBox.innerHTML = `
        <h2>Statistics</h2>
        <div>Best: ${stats.best}</div>
        <div>mo3: ${stats.mo3}</div>
        <div>ao5: ${stats.ao5}</div>
        <div>ao12: ${stats.ao12}</div>
        <div>ao100: ${stats.ao100}</div>
        <div>Total Ø: ${stats.totalAverage}</div>
    `
}
showStats();

// Custom context menu (not finished yet)
const menu = document.getElementById("context-menu");
let clickedElement = null;

// Use event delegation for context menu
document.addEventListener("contextmenu", function (event) {
    if (event.target.classList.contains("singleTime")) {
        event.preventDefault(); // Disable default menu
        menu.style.display = "block";
        clickedElement = event.target;

        // Set position by mouse cursor
        menu.style.left = `${event.pageX}px`;
        menu.style.top = `${event.pageY}px`;
    }
});

document.getElementById("menu-delete").addEventListener("click", function () {
    if (clickedElement) {
        // Get index of element
        let index = parseInt(clickedElement.innerHTML.charAt(6) + clickedElement.innerHTML.charAt(7));

        // Set new array without the clicked element
        let times = JSON.parse(localStorage.getItem("times"));
        times.splice(index - 1, 1);
        localStorage.setItem("times", JSON.stringify(times));

        showTimes();
        showStats();
    }
});
document.getElementById("menu-+2").addEventListener("click", function () {
    if (clickedElement) {
        // Get index of element
        let index = parseInt(clickedElement.innerHTML.charAt(6) + clickedElement.innerHTML.charAt(7));

        //TODO: modify the clicked element (+2)
        console.log("not available yet");

        showTimes();
        showStats();
    }
});
document.getElementById("menu-dnf").addEventListener("click", function () {
    if (clickedElement) {
        // Get index of element
        let index = parseInt(clickedElement.innerHTML.charAt(6) + clickedElement.innerHTML.charAt(7));

        // Set new array without the clicked element
        let times = JSON.parse(localStorage.getItem("times"));
        times[index - 1] = "DNF";
        localStorage.setItem("times", JSON.stringify(times));

        showTimes();
        showStats();
    }
});


// Hide menu when clicking anywhere else
document.addEventListener("click", function () {
    menu.style.display = "none";
});