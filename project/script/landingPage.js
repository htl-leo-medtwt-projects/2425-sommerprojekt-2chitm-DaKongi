//recolor navbar and makes it smaller when scrolling to make it readable
window.addEventListener("scroll", function () {
    let navbar = document.getElementById("landingPageHeader");
    if (window.scrollY > window.innerHeight) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


function changeExampleImage(imageName){
    document.getElementById("switchingImage").style.backgroundImage = `url(img/cubeExample/${imageName}.png)`;
}