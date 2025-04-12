let contestants = [];
let disciplines = [];
let mode = "classic";

let compData = {
    "names": contestants,
    "disciplines": disciplines,
    "gamemode": "classic"
}

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
        }
    }

    
}

function get