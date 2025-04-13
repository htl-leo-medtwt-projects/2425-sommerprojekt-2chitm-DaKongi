let contestants = [];
let disciplines = [];
let mode = "classic";

let compData = {
    "names": contestants,
    "disciplines": disciplines,
    "gamemode": "classic"
}

let currentContestantIndex = 0;

let timesArray = [];

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
                        "time": -1
                    });
                }
            }

            gameLoop();
        }
    }


}

function gameLoop() {
    let finished = false;
    //while (!finished){
    let currentPlayer = getNextPlayer();
    document.getElementById("playersTurn").innerHTML = document.getElementById("playersTurn").innerHTML.replace("[Player]", currentPlayer);


    // }
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
    document.getElementById("scramble").innerHTML = "<div>" + generateScramble() + "</div>";
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