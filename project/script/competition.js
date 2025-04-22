let contestants = [];
let disciplines = [];
let mode = "classic";

let compData = {
    "names": contestants,
    "disciplines": disciplines,
    "gamemode": "classic"
}

let currentContestantIndex = 0;
let currentDisciplineIndex = 0;
let currentRound = 1;

let timesArray = [];

let timesStarted = 0;

function generateDisciplines() {
    //generate disciplines 
    let options = ["3x3", "4x4", "5x5", "6x6", "7x7", "skewb", "pyraminx", "megaminx", "square-1", "3x3_blind", "multi_blind"];

    let str = "";

    for (let i = 0; i < options.length; i++) {
        str += `<label onchange="changeDisciplines(this.querySelector('input').value,this.querySelector('input').checked)">
                <input type="checkbox" class="ui-checkbox" name="puzzle" value="${options[i]}">
                ${options[i].replace("_", " ")}
                </label><br>`
    }

    document.getElementById("disciplinesSelect").innerHTML = str;
};
generateDisciplines();


//create contestants localstorage entry if it doesn't exist already (here is the error)
// if (localStorage.getItem("contestants") == null) {
//     localStorage.setItem("contestants", JSON.stringify(contestants));
// } else {
//     contestants = JSON.parse(localStorage.getItem("contestants"));
//     //add to html
//     let previousValue = document.getElementById("contestantsInputs").innerHTML;
//     for (let i = 0; i < contestants.length; i++) {
//         //insert at top
//         document.getElementById("contestantsInputs").innerHTML = "<div class='contestantNames'>" + contestants[i] + "</div>" + previousValue;
//     }
// }

let nameInput = document.getElementById("contestantInput");
function addContestant() {
    let nameInput = document.getElementById("contestantInput");
    if (nameInput.value != "") {
        contestants.push(nameInput.value);
        localStorage.setItem("contestants", JSON.stringify(contestants));
        nameInput.value = "";

        //add to html
        let previousValue = document.getElementById("contestantsInputs").innerHTML;
        for (let i = 0; i < contestants.length; i++) {
            //insert at top
            document.getElementById("contestantsInputs").innerHTML = "<div class='contestantNames'>" + contestants[i] + "</div>" + previousValue;
        }
    } else {
        alert("please enter a name")
    }
}

function clearContestants() {
    contestants = [];
    localStorage.setItem("contestants", contestants);
}

function changeDisciplines(value, isChecked) {
    if (isChecked) {
        disciplines.push(value);
    } else {
        removeElement(disciplines, value);
    }
}

function removeElement(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function getCheckedGameMode() {
    compData.gamemode = document.querySelector('input[name="game_mode"]:checked').value; //QuerySelector from Stack Overflow
}

function startGame() {
    let readyToStart = false;

    //check if game is able to start
    if (compData.disciplines.length != 0 && compData.names.length != 0) {
        //if classic or duel -> at least two players required
        if (compData.gamemode == "duel" || compData.gamemode == "classic") {
            if (compData.names.length > 1) {
                //ready to start
                readyToStart = true;
            }
        }
    }

    //start the competition
    if (readyToStart) {
        //if gamemode is classic or solo -> show classic comp area
        if (compData.gamemode == "duel" || compData.gamemode == "classic") {
            document.getElementById("competitionStartSettings").style.setProperty("display", "none", "important");
            document.getElementById("classicCompArea").style.setProperty("display", "flex", "important");

            //prepare timesArray
            for (let i = 0; i < compData.names.length; i++) {
                timesArray.push({
                    "name": compData.names[i],
                    "disciplines": [],
                })

                for (let j = 0; j < compData.disciplines.length; j++) {
                    timesArray[i].disciplines.push({
                        "discipline": compData.disciplines[j],
                        "times": []
                    });
                }
            }

            gameLoop();
        }
    }


}

let currentPlayer;
function gameLoop() {
    currentPlayer = getNextPlayer();

    for (let i = 0; i < compData.names.length; i++) {
        timesStarted = 0;
        while (timesStarted < 5) {
            document.getElementById("playersTurn").innerHTML = document.getElementById("playersTurn").innerHTML.replace("[Player]", currentPlayer);
            document.getElementById("currentRound").innerHTML = document.getElementById("currentRound").innerHTML.replace("[X]", currentRound);
            document.getElementById("currentDiscipline").innerHTML = disciplines[currentDisciplineIndex];

            if (timesArray[timesArray.findIndex(obj => obj.name == currentPlayer)].disciplines[timesArray[timesArray.findIndex(obj => obj.name == currentPlayer)].disciplines.findIndex(obj => obj.discipline == disciplines[currentDisciplineIndex])].times.length >= 5) {
                //next Contestant
                endRound();
                currentPlayer = getNextPlayer();
            }
        }
    }
}

function endRound() {
    document.getElementById("playerComplete").style.display = "block";
}

function switchToNextPlayer() {

}

function getNextPlayer() {
    let nextPlayer = compData.names[currentContestantIndex];

    if (currentContestantIndex == compData.names.length - 1) {
        currentContestantIndex = 0;
    } else {
        currentContestantIndex++;
    }

    return nextPlayer;
}

function getNextDiscipline() {
    let nextDiscipline = compData.disciplines[currentDisciplineIndex];

    if (currentDisciplineIndex == compData.disciplines.length - 1) {
        currentDisciplineIndex = 0;
    } else {
        currentDisciplineIndex++;
    }

    return nextDiscipline;
}

function addTimes() {

}

/********TIMER********/
//mainly copied from the timer page

let milliseconds = 0;
let intervalId;
let keyDownTime;
let colorChangeTimer = null;
let turnedRed = false;
let timerRunning = false;
const originalFontColor = document.documentElement.style.getPropertyValue("--font-color");

function startTimer() {
    milliseconds = 0;
    timerRunning = true;
    timesStarted++;
    if (!intervalId) {
        intervalId = setInterval(() => {
            milliseconds += 10;
            document.getElementById("timer").innerHTML = formatMilliseconds(milliseconds);
        }, 10);
    }
}

function stopTimer() {
    timerRunning = false;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }

    saveTime();
    displayTime();


    //document.getElementById("scramble").innerHTML = "<div>" + generateScramble() + "</div>";
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

function parseFormattedTime(timeStr) {
    let minutes = 0, seconds = 0, milliseconds = 0;

    if (timeStr.includes(':')) {
        const [minPart, secPart] = timeStr.split(':');
        minutes = parseInt(minPart, 10);
        const [sec, ms] = secPart.split('.');
        seconds = parseInt(sec, 10);
        milliseconds = parseInt(ms, 10) * 10;
    } else {
        const [sec, ms] = timeStr.split('.');
        seconds = parseInt(sec, 10);
        milliseconds = parseInt(ms, 10) * 10;
    }

    return (minutes * 60000) + (seconds * 1000) + milliseconds;
}

//spacebar needs to be pressed for 0.5s to start the timer, prevents accidental start
document.addEventListener("keydown", function (event) {
    if (event.key === " " && !event.repeat) {
        if (timerRunning) {
            stopTimer();
            timerRunning = false;
        } else {
            if (!turnedRed) {
                document.getElementById("timer").style.color = "red";
                turnedRed = true;
            }

            keyDownTime = Date.now();
            colorChangeTimer = setTimeout(() => {
                if (Date.now() - keyDownTime >= 500) {
                    document.getElementById("timer").style.color = "green";
                }
            }, 500);
        }
    }
});

function saveTime() {
    let contestant = currentPlayer;
    let time = parseFormattedTime(document.getElementById("timer").textContent);
    let discipline = disciplines[currentDisciplineIndex];

    timesArray[timesArray.findIndex(obj => obj.name == contestant)].disciplines[timesArray[timesArray.findIndex(obj => obj.name == contestant)].disciplines.findIndex(obj => obj.discipline == discipline)].times.push(time);
}

function displayTime() {
    let contestant = currentPlayer;
    let discipline = disciplines[currentDisciplineIndex];
    let timeList = document.getElementById("timeList");

    let relevantTimes = timesArray[timesArray.findIndex(obj => obj.name == contestant)].disciplines[timesArray[timesArray.findIndex(obj => obj.name == contestant)].disciplines.findIndex(obj => obj.discipline == discipline)].times;

    for (let i = 1; i <= relevantTimes.length; i++) {
        timeList.innerHTML = timeList.innerHTML.replace(`Time ${i}: --:--`, `Time ${i}: ${formatMilliseconds(relevantTimes[i - 1])}`);
    }


    //Here is a problem
    //show current MO3
    document.getElementById("TimeListMo3").innerHTML = "MO3: " + getMO3(relevantTimes);

    //show best possible MO3
    document.getElementById("bestMO3").innerHTML = getBestPossibleMO3(relevantTimes);
}

document.addEventListener("keyup", function (event) {
    if (event.key === " ") {
        turnedRed = false;
        document.getElementById("timer").style.color = originalFontColor;

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
        document.getElementById("timer").innerHTML = "00.00"
    }
});

/********OTHER CALCULATIONS********/
function getMO3(timesArray) {
    times = timesArray.slice(); //copy array
    //sort times
    let sortedArray = bubbleSort(times);

    //remove highest and lowest
    sortedArray.shift();
    sortedArray.pop();

    let total = 0;
    sortedArray.forEach(element => {
        total += element;
    });
    console.log(sortedArray.length)
    return formatMilliseconds(total / sortedArray.length == 0 ? 1 : sortedArray.length);
}

function getBestPossibleMO3(timesArray) {
    times = timesArray.slice();  //copy array
    //fill up with best possible times
    while (times.length < 5) {
        times.push(10); //timer counts in 10ms steps => 0.1 is the best possible time
    }

    //sort times
    let sortedArray = bubbleSort(times);

    //remove highest and lowest
    sortedArray.shift();
    sortedArray.pop();

    let total = 0;
    sortedArray.forEach(element => {
        total += element;
    });

    return formatMilliseconds(total / 3);
}

//bubble Sort written by ai for time reasons
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
