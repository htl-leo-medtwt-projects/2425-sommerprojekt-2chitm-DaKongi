/// <refernce path="shopDataJson.json" />

//dropDown
[...document.getElementsByClassName('shopTopBarCategory')].forEach(element => {
    element.addEventListener("mouseover", () => {
        const dropDownId = element.getAttribute("dropDown");
        document.getElementById(dropDownId).style.display = "flex";
    });

    element.addEventListener("mouseleave", () => {
        const dropDownId = element.getAttribute("dropDown");
        document.getElementById(dropDownId).style.display = "none";
    });
});

//test log names
cubes.forEach(element => {
    console.log(element.name);
});

function dailyTip() {
    let randNum = getRandNum(0, cubes.length - 1);

    document.getElementById("presentedCubeText").innerHTML = cubes[randNum].name;

    let buildStr = "";
    for (let i = 0; i < Math.min(cubes[cubes.findIndex(cube => cube.name === document.getElementById("presentedCubeText").textContent)].shops.length, 4); i++) {
        buildStr +=
            `
        <div class="shopBox" id="dailyTipShopBox${i}"></div>
        `
    }
    document.getElementById("dailyShopBoxes").innerHTML = buildStr;

    for (let i = 0; i < Math.min(cubes[cubes.findIndex(cube => cube.name === document.getElementById("presentedCubeText").textContent)].shops.length, 4); i++) {
        document.getElementById("dailyTipShopBox" + i).style.backgroundImage = `url('../img/shop/shopsIcons/${cubes[cubes.findIndex(cube => cube.name === document.getElementById("presentedCubeText").textContent)].shops[i].name}.png')`
    }
}
dailyTip();

function getRandNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//search Bar
function search() {
    let value = document.getElementById('searchBar').value;

    //clear Search Bar
    document.getElementById('searchBar').value = "";

    //get all fitting cubes
    let fittingCubes = [];
    cubes.forEach(element => {
        if (element.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
            fittingCubes.push(element);
        }
    });

    console.log(fittingCubes)

    //show fitting cubes
    document.getElementById('searchResultsContent').innerHTML = "";

    for (let i = 0; i < fittingCubes.length; i++) {
        document.getElementById('searchResultsContent').innerHTML += `
        <div class="searchResultsBox" id="searchResultBox-${i}">
            <img src="../img/shop/categories/3x3.jpg" alt="cube">
            <p>${fittingCubes[i].name}</p>
        </div>
        `
    };

    //jump to searchResult
    window.location.hash = "#searchResults"


    //add eventlistener for hover effect
    document.querySelectorAll('.searchResultsBox').forEach(box => {
        // Store original content
        const originalContent = box.innerHTML;
        const name = box.querySelector('p').textContent.trim();

        box.addEventListener('mouseenter', () => {
            let data = cubes[cubes.findIndex(cube => cube.name == name)];
            console.log(data)
            box.innerHTML = `
                    <p class="hoveredText hoveredTextSize">${data.size}</p>
                    <p class="hoveredText hoveredTextBrand">Brand: ${data.brand}</p>
                    <p class="hoveredText hoveredTextIsMaglev">Maglev: ${data.isMaglev ? "yes" : "no"}</p>
                    <p class="hoveredText hoveredTextIsMaglev">Magnetic: ${data.isMagnetic ? "yes" : "no"}</p>
                    <p class="hoveredText hoveredTextIsMaglev">UV-Coated: ${data.isUVCoated ? "yes" : "no"}</p>
                    <p class="hoveredText clickToShowMoreInfo">(Click to show more info)</p>
                    `;

            //flip card or maybe not
            // box.style.transform = "scaleX(-1)";
        });

        box.addEventListener('mouseleave', () => {
            box.innerHTML = originalContent;
        });
    });
}

document.getElementById('searchBar').addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();
        search();
    }
});