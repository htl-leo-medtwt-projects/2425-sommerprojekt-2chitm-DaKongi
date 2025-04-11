let contestants = [];
let disciplines = [];
let mode = "classic";

let compData = {
    "names": contestants,
    "disciplines": 1,
    "gamemode": "classic"
}


//create contestants localstorage entry if it doesn't exist already (here is the error)
if (localStorage.getItem("contestants") == null) {
    localStorage.setItem("contestants", JSON.stringify(contestants));
} else {
    contestants = JSON.parse(localStorage.getItem("contestants"));
    //add to html
    let previousValue = document.getElementById("contestantsInputs").innerHTML;
    for (let i = 0; i < contestants.length; i++) {
        //insert at top
        document.getElementById("contestantsInputs").innerHTML = "<div class='contestantNames'>" + contestants[i] + "</div>" + previousValue;
    }
}

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

function changeDisciplines(){
    
}