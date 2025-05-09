/// <refernce path="shopDataJson.json" />

//dropDown
[...document.getElementsByClassName('shopTopBarCategory')].forEach(element => {
    element.addEventListener("mouseover", () => {
        const dropDownId = element.getAttribute("dropDown");
        document.getElementById(dropDownId).style.display = "block";
    });

    element.addEventListener("mouseleave", () => {
        const dropDownId = element.getAttribute("dropDown");
        document.getElementById(dropDownId).style.display = "none";
    });
});

[...document.getElementsByClassName('dropDownWca')].forEach(element => {
    element.addEventListener("click", () => {
        dropDownSearchWCA(element.textContent);
    });
});

function dropDownSearchWCA(value) {
    let fittingCubes = [];
    cubes.forEach(element => {
        if (element.size == value) {
            fittingCubes.push(element);
        }
    });

    console.log(fittingCubes)

    showSearchResults(fittingCubes);
}

//test log names
// cubes.forEach(element => {
//     console.log(element.name);
// });

function dailyTip() {
    let randNum = getRandNum(0, cubes.length - 1);

    document.getElementById("presentedCubeText").innerHTML = cubes[randNum].name;

    let buildStr = "";
    for (let i = 0; i < Math.min(cubes[cubes.findIndex(cube => cube.name === document.getElementById("presentedCubeText").textContent)].shops.length, 4); i++) {
        buildStr +=
            `
        <div class="shopBox" id="dailyTipShopBox${i}" onclick="window.open('')"></div>
        `
    }
    document.getElementById("dailyShopBoxes").innerHTML = buildStr;

    for (let i = 0; i < Math.min(cubes[cubes.findIndex(cube => cube.name === document.getElementById("presentedCubeText").textContent)].shops.length, 4); i++) {
        document.getElementById("dailyTipShopBox" + i).style.backgroundImage = `url('../img/shop/shopsIcons/${cubes[cubes.findIndex(cube => cube.name === document.getElementById("presentedCubeText").textContent)].shops[i].name}.png')`
    }

   document.getElementById("presentedCubeImg").src = `../img/shop/cubes/${cubes[randNum].brand}_${cubes[randNum].size}.png`;
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

    showSearchResults(fittingCubes);
}

function showSearchResults(fittingCubes) {
    //show fitting cubes
    document.getElementById('searchResultsContent').innerHTML = "";

    for (let i = 0; i < fittingCubes.length; i++) {
        document.getElementById('searchResultsContent').innerHTML += `
        <div class="searchResultsBox" id="searchResultBox-${i}" data-cubeName="${fittingCubes[i].name}" onclick="showDetailShops(this)">
            <img src="../img/shop/cubes/${fittingCubes[i].brand}_${fittingCubes[i].size}.png" alt="cube">
            <p>${fittingCubes[i].name}</p>
        </div>
        `
    };

    [...document.getElementsByClassName("searchResultsBox")].forEach(element => {
        element.addEventListener("click", () => {
            document.getElementById("shopOverlay").style.display = "block";
        })
    });

    //add eventlistener for hover effect
    document.querySelectorAll('.searchResultsBox').forEach(box => {
        // Store original content
        const originalContent = box.innerHTML;
        const name = box.querySelector('p').textContent.trim();

        box.addEventListener('mouseover', () => {
            let data = cubes[cubes.findIndex(cube => cube.name == name)];
            box.innerHTML = `
                    <p class="hoveredText hoveredTextSize">Starting from: ${data.shops[getBestPrice(data)]?.price !== undefined ? data.shops[getBestPrice(data)].price : "no price available"}</p>
                    <p class="hoveredText hoveredTextBrand">Brand: ${data.brand}</p>
                    <p class="hoveredText hoveredTextIsMaglev">Maglev: ${data.isMaglev ? "yes" : "no"}</p>
                    <p class="hoveredText hoveredTextIsMaglev">Magnetic: ${data.isMagnetic ? "yes" : "no"}</p>
                    <p class="hoveredText hoveredTextIsMaglev">UV-Coated: ${data.isUVCoated ? "yes" : "no"}</p>
                    `;

            //flip card or maybe not
            // box.style.transform = "scaleX(-1)";
        });

        box.addEventListener('mouseleave', () => {
            box.innerHTML = originalContent;
        });
    });

    //jump to searchResult
    window.location.hash = "#searchResults"
}

document.getElementById('searchBar').addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();
        search();
    }
});

function showDetailShops(element) {
    let currentItem = cubes[cubes.findIndex(cube => cube.name == element.dataset.cubeName)]
    console.log(currentItem);
}

//returns the index of the shop with the best price
function getBestPrice(element) {
    let priceArray = [];
    element.shops.forEach(shop => {
        priceArray.push(parseFloat(shop.price.replace(/[^\d.]/g, ""))); //parsing is not from me
    });

    let cheapest = Math.min(...priceArray);

    return element.shops.findIndex(shop => shop.price == "€" + cheapest);
}

//Categories
function showWcaCubes() {
    showSearchResults(cubes);
}

function show3x3() {
    let fittingCubes = [];
    cubes.forEach(element => {
        if (element.size == "3x3") fittingCubes.push(element);
    });
    showSearchResults(fittingCubes);
}

function showBiggerCubes() {
    let fittingCubes = [];
    cubes.forEach(element => {
        if (element.size != "3x3") fittingCubes.push(element);
    });
    showSearchResults(fittingCubes);
}