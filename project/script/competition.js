let contestants = [];
let disciplines = [];
let mode = "classic";

let compData = {
    "names": contestants,
    "disciplines": disciplines,
    "gamemode": "classic"
}

let duelData = {
    "player1": { "points": 0, "times": [] },
    "player2": { "points": 0, "times": [] }
}
let duelPointsToWin = 5;

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

    if (compData.gamemode == "duel" && compData.names.length == 2) {
        document.getElementById("addContestant").onclick = null; //disable button
        document.getElementById("addContestant").style.backgroundColor = "gray";
    }

    if (compData.gamemode == "solo" && compData.names.length == 1) {
        document.getElementById("addContestant").onclick = null; //disable button
        document.getElementById("addContestant").style.backgroundColor = "gray";
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
            } else {
                alert("Please enter more players")
            }
        } else if (compData.gamemode == "solo" && compData.names.length == 1) {
            //solo 
            readyToStart = true;
        }
    } else {
        alert("Please enter more players or disciplines!")
    }

    //start the competition
    if (readyToStart) {
        console.log('hello world')
        //if gamemode is classic or solo -> show classic comp area
        if (compData.gamemode == "solo" || compData.gamemode == "classic") {
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
                        "times": [],
                        "mo3": -1
                    });
                }
            }

        } else if (compData.gamemode == "duel" && compData.names.length == 2) {
            document.getElementById("competitionStartSettings").style.setProperty("display", "none", "important");
            document.getElementById("duelCompArea").style.setProperty("display", "flex", "important");

            //set names
            document.getElementById('duelNameField1').innerHTML = compData.names[0];
            document.getElementById('duelNameField2').innerHTML = compData.names[1];
            document.getElementById('duelTimeSelectName1').innerHTML = compData.names[0];
            document.getElementById('duelTimeSelectName2').innerHTML = compData.names[1];

            //set scramble
            document.getElementById("duelScrambleCon").innerHTML = generateScramble();
        }

        gameUpdate();
    }


}

function getRandNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let currentPlayer;
function gameUpdate() {
    if (compData.gamemode == "classic" || compData.gamemode == "solo") {
        let lastPlayer = timesArray[timesArray.length - 1];
        let lastDiscipline = lastPlayer.disciplines?.[lastPlayer.disciplines.length - 1];
        //check if competition has ended (last player has in last discipline all solves done)
        if (lastDiscipline?.times?.length >= 5) {
            endCompetition();
            return;
        }

        if (timesStarted == 0) {
            currentPlayer = getNextPlayer();
            document.getElementById("playersTurn").innerHTML = currentPlayer + "s Turn";
            document.getElementById("currentDiscipline").innerHTML = disciplines[currentDisciplineIndex];
        }

        //check if currentPlayer has made 5 Solves in current discipline
        if (timesArray[timesArray.findIndex(obj => obj.name == currentPlayer)].disciplines[timesArray[timesArray.findIndex(obj => obj.name == currentPlayer)].disciplines.findIndex(obj => obj.discipline == disciplines[currentDisciplineIndex])].times.length == 5) {
            //next Contestant
            setTimeout(() => {
                endRound();
                currentPlayer = getNextPlayer();
            }, 1000)
        }
    } else if (compData.gamemode == "duel") {
        //game ends by 5 points
        if (duelData.player1.points >= duelPointsToWin || duelData.player2.points >= duelPointsToWin) {
            endDuel();
            return;
        }

        document.getElementById('duelTimerDiscipline').innerHTML = disciplines[currentDisciplineIndex];
    }
}

function endDuel() {
    document.getElementById("duelComplete").style.display = "flex";

    //get Winner
    let winner = duelData.player1.points >= duelPointsToWin ? 0 : 1;
    document.getElementById("duelResultName").innerHTML = compData.names[winner];
}

function saveDuellTime(player) {
    duelData[player].points++;
    duelData[player].times.push(parseFormattedTime(document.getElementById("duelTimerTimer").textContent));

    showDuelPoints();
    document.getElementById("duelTimeSelect").style.display = "none";

    //game ends by 5 points
    if (duelData.player1.points >= duelPointsToWin || duelData.player2.points >= duelPointsToWin) {
        endDuel();
        return;
    }
}

function showDuelPoints() {
    //player 1
    let str1 = "";
    for (let i = 0; i < duelData.player1.points; i++) {
        str1 += "<img src='../img/coin.png' alt='Master Cube Point' class='duelPoints'>"
    }

    document.getElementById("duelPointBoxLeftPoints").innerHTML = str1;

    //player 2
    let str2 = "";
    for (let i = 0; i < duelData.player2.points; i++) {
        str2 += "<img src='../img/coin.png' alt='Master Cube Point' class='duelPoints'>"
    }
    document.getElementById("duelPointBoxRightPoints").innerHTML = str2;
}

function endCompetition() {
    document.getElementById("endCompetition").style.display = "flex";
}

function endRound() {
    //check if everyone made their turn
    if (timesArray[timesArray.length - 1].name != currentPlayer) {
        document.getElementById("playerComplete").style.display = "flex";
    } else {
        document.getElementById("disciplineComplete").style.display = "flex";
    }
}

function switchToNextPlayer() {
    document.getElementById("playerComplete").style.display = "none";

    currentPlayer = getNextPlayer();
    timesStarted = 0;

    document.getElementById("playerComplete").style.display = "none";
    document.getElementById("timeAndStatsCon").innerHTML = `<div id="timeList">
                    <h3>Times</h3>
                    <p>Time 1: --:--</p>
                    <p>Time 2: --:--</p>
                    <p>Time 3: --:--</p>
                    <p>Time 4: --:--</p>
                    <p>Time 5: --:--</p>


                </div>

                <div id="timer">
                    00:00
                </div>

                <div id="position">
                    <h3>Current MO3</h3>
                    <p id="TimeListMo3">--:--</p>

                    <h3>Best possible MO3</h3>
                    <p id="bestMO3">--:--</p>
                </div>`;

    document.getElementById("playersTurn").innerHTML = document.getElementById("playersTurn").innerHTML.replace("[Player]", currentPlayer);

    gameUpdate();
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

function changeToNextDiscipline() {
    if (currentDisciplineIndex == compData.disciplines.length - 1) {
        currentDisciplineIndex = 0;
    } else {
        currentDisciplineIndex++;
    }

    switchToNextPlayer();
    document.getElementById("disciplineComplete").style.display = "none";
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
            if (compData.gamemode == "classic" || compData.gamemode == "solo") {
                document.getElementById("timer").innerHTML = formatMilliseconds(milliseconds);
            } else {
                document.getElementById("duelTimerTimer").innerHTML = formatMilliseconds(milliseconds);
            }
        }, 10);
    }
}

function stopTimer() {
    timerRunning = false;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }

    if (compData.gamemode == "classic" || compData.gamemode == "solo") {
        saveTime();
        displayTime();
        gameUpdate();
    } else if (compData.gamemode == "duel") {
        document.getElementById('duelTimeSelect').style.display = "flex";
        document.getElementById('resultInstantTime').innerHTML = document.getElementById("duelTimerTimer").textContent;

        currentDisciplineIndex = getRandomInt(disciplines.length - 1)
        gameUpdate();
    }

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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
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
                if (compData.gamemode == "classic" || compData.gamemode == "solo") {
                    document.getElementById("timer").style.color = "red";
                } else {
                    document.getElementById("duelTimerTimer").style.color = "red";
                }
                turnedRed = true;
            }

            keyDownTime = Date.now();
            colorChangeTimer = setTimeout(() => {
                if (Date.now() - keyDownTime >= 500) {
                    if (compData.gamemode == "classic" || compData.gamemode == "solo") {
                        document.getElementById("timer").style.color = "green";
                    } else {
                        document.getElementById("duelTimerTimer").style.color = "green";
                    }
                }
            }, 500);
        }
    }
});

//alternative: press down(for mobile)
document.querySelector('#duelTimer').addEventListener("touchstart", function (event) {
    if (timerRunning) {
        stopTimer();
        timerRunning = false;
    } else {
        if (!turnedRed) {
            document.getElementById("duelTimerTimer").style.color = "red";
            turnedRed = true;
        }

        keyDownTime = Date.now();
        colorChangeTimer = setTimeout(() => {
            if (Date.now() - keyDownTime >= 500) {
                document.getElementById("duelTimerTimer").style.color = "green";
            }
        }, 500);
    }
});

document.querySelector('#duelTimer').addEventListener("touchend", function (event) {
    turnedRed = false;
    document.getElementById("duelTimerTimer").style.color = originalFontColor;

    if (keyDownTime !== null) {
        let elapsedTime = Date.now() - keyDownTime;
        if (elapsedTime >= 500) {
            startTimer();
            timerRunning = true;
        }
        keyDownTime = null;
    }

    clearTimeout(colorChangeTimer);
});

document.querySelector('#timeAndStatsCon').addEventListener("touchstart", function (event) {
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
});

document.querySelector('#timeAndStatsCon').addEventListener("touchend", function (event) {
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


    //set and show show current MO3
    timesArray[timesArray.findIndex(obj => obj.name == contestant)].disciplines[timesArray[timesArray.findIndex(obj => obj.name == contestant)].disciplines.findIndex(obj => obj.discipline == discipline)].mo3 = getMO3(relevantTimes);
    document.getElementById("TimeListMo3").innerHTML = "MO3: " + getMO3(relevantTimes);

    //show best possible MO3
    document.getElementById("bestMO3").innerHTML = getBestPossibleMO3(relevantTimes);
}

document.addEventListener("keyup", function (event) {
    if (event.key === " ") {
        turnedRed = false;
        if (compData.gamemode == "classic" || compData.gamemode == "solo") {
            document.getElementById("timer").style.color = originalFontColor;
        } else {
            document.getElementById("duelTimerTimer").style.color = originalFontColor;
        }

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
    let times = timesArray.slice(); //copy array
    //sort times
    let sortedArray = bubbleSort(times);

    //remove highest and lowest
    sortedArray.shift();
    sortedArray.pop();

    let total = 0;
    sortedArray.forEach(element => {
        total += element;
    });
    return formatMilliseconds(total / (sortedArray.length == 0 ? 1 : sortedArray.length));
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


/**********Generate Results Table***********/
let instantTableBody = document.getElementById("instantTableBody");
let currentShownDiscipline;
let currentShownDisciplineIndex = 0;

function nextCurrentShownDisciplineIndex() {
    if (currentShownDisciplineIndex == timesArray[0].disciplines.length - 1) {
        currentShownDisciplineIndex = 0;
    } else {
        currentShownDisciplineIndex++;
    }
    goToResults();
}

function previousCurrentShownDisciplineIndex() {
    if (currentShownDisciplineIndex == 0) {
        currentShownDisciplineIndex = timesArray[0].disciplines.length - 1;
    } else {
        currentShownDisciplineIndex--;
    }
    goToResults();
}

function goToResults() {
    document.getElementById("results").style.setProperty("display", "flex", "important");
    document.getElementById("endCompetition").style.setProperty("display", "none", "important");
    document.getElementById('classicCompArea').style.setProperty("display", "none", "important");

    //set discipline picker correctly
    console.log(currentShownDisciplineIndex)
    currentShownDiscipline = timesArray[0].disciplines[currentShownDisciplineIndex].discipline;
    document.getElementById("disciplineText").textContent = currentShownDiscipline;

    generateInstantTable();
}

function generateInstantTable() {
    let currentSelectedDiscipline = document.getElementById("disciplineText").textContent;
    let str = "";


    for (let i = 0; i < timesArray.length; i++) {
        let mo3 = getMO3(timesArray[i].disciplines[disciplines.findIndex(d => d === currentSelectedDiscipline)].times);

        str +=
            `
        <tr id="instantTableRow-${i}">
        <td>${timesArray[i].name}</td>
        <td id="resultPosition-${i}">----</td>
        <td id="resultMO3-${i}">${mo3}</td>
        <td>${formatMilliseconds(Math.min(...(timesArray[i].disciplines[disciplines.findIndex(d => d === currentSelectedDiscipline)].times)))}</td>
        <td>${new Date().toLocaleDateString('en-GB')}</td>
        <td><div class="downloadPDF" onclick="downloadPDF(${i})">Download</div></td>
        </tr>
        `
    }
    instantTableBody.innerHTML = str;

    getPositions();
}

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

function getPositions() {
    let mo3s = [];

    for (let i = 0; i < timesArray.length; i++) {
        mo3s[i] = parseFormattedTime(document.getElementById(`resultMO3-${i}`).textContent);
    }

    let positions = {};
    const originalLenght = mo3s.length;
    for (let i = 0; i < originalLenght; i++) {
        let smallestNum = Math.min(...mo3s);

        positions[i + 1] = smallestNum;
        removeElement(mo3s, smallestNum);
    }

    //assign positions
    for (let i = 0; i < timesArray.length; i++) {
        let mo3 = parseFormattedTime(document.getElementById(`resultMO3-${i}`).innerHTML);
        let pos = null;
        for (let key in positions) {
            if (positions[key] == mo3) {
                pos = key;
                break;
            }
        }
        document.getElementById(`resultPosition-${i}`).innerHTML = pos;
    }
}

function showRules() {
    document.getElementById("compRules").style.display = "flex";
}

function hideRules() {
    document.getElementById("compRules").style.display = "none";
}

//mobile specific
if (window.innerWidth < 600) {

}

function nextSettting(current) {
    if (current === "gamemode") {
        document.getElementById("gamemode").style.setProperty("display", "none", "important");
        document.getElementById('contestants').style.setProperty("display", "block", "important");
    }

    if (current === "comp") {
        if (compData.gamemode == "classic" || compData.gamemode == "duel") {
            if (compData.names.length >= 2) {
                document.getElementById("contestants").style.setProperty("display", "none", "important");
                document.getElementById('disciplines').style.setProperty("display", "block", "important");
            } else { alert("add more Players") }
        } else if (compData.names.length <= 1) {
            document.getElementById("contestants").style.setProperty("display", "none", "important");
            document.getElementById('disciplines').style.setProperty("display", "block", "important");
        }
    }
}

/***TO PDF***/
//Mischung aus Fremdcode und eigenem
async function downloadPDF(row) {
    // Load your local template.pdf
    const existingPdfBytes = await fetch('../data/template.pdf').then(res => res.arrayBuffer());

    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const formattedDate = `${day}.${month}.${year}`;

    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    const table = document.getElementById("resultsTableTable");

    //center on x
    const pageWidth1 = firstPage.getWidth();
    const textWidth1 = font.widthOfTextAtSize(table.rows[row].cells[0].textContent, 24);
    const x1 = (pageWidth1 - textWidth1) / 2;

    const pageWidth2 = firstPage.getWidth();
    const textWidth2 = font.widthOfTextAtSize(table.rows[row].cells[1].textContent, 48);
    const x2 = (pageWidth2 - textWidth2) / 2;

    const pageWidth3 = firstPage.getWidth();
    const textWidth3 = font.widthOfTextAtSize(formattedDate, 24);
    const x3 = (pageWidth3 - textWidth3) / 2;

    const pageWidth4 = firstPage.getWidth();
    const textWidth4 = font.widthOfTextAtSize(document.getElementById('disciplineText').textContent, 20);
    const x4 = (pageWidth4 - textWidth4) / 2;

    row++;

    //name
    firstPage.drawText(table.rows[row].cells[0].textContent, {
        x: x1,
        y: 560,
        size: 24,
        font: font,
        color: PDFLib.rgb(0, 0, 0),
    });

    //position
    firstPage.drawText(table.rows[row].cells[1].textContent + ".", {
        x: x1,
        y: 340,
        size: 48,
        font: font,
        color: PDFLib.rgb(0, 0, 0),
    });

    //mo3
    firstPage.drawText(table.rows[row].cells[2].textContent, {
        x: 150,
        y: 110,
        size: 20,
        font: font,
        color: PDFLib.rgb(0, 0, 0),
    });

    //discipline
    firstPage.drawText(document.getElementById('disciplineText').textContent, {
        x: x4,
        y: 650,
        size: 48,
        font: font,
        color: PDFLib.rgb(0, 0, 0),
    });

     //best
    firstPage.drawText(table.rows[row].cells[3].textContent, {
        x: 350,
        y: 110,
        size: 20,
        font: font,
        color: PDFLib.rgb(0, 0, 0),
    });

    // Save the modified PDF and trigger download
    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Master Cube Certificate.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}