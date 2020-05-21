var eggcounter = 0;
$("#egg1").click(function () {
  if (eggcounter == 0) {
    eggcounter++;
    document.getElementById("egg1").style.opacity = 1.0;
    document.getElementById("egg2").style.opacity = 0.5;
    console.log(eggcounter);
  }
});

$("#egg2").click(function () {
  if (eggcounter == 1) {
    eggcounter++;
    document.getElementById("egg2").style.opacity = 1.0;
    document.getElementById("egg3").style.opacity = 0.5;
    console.log(eggcounter);
  }
});

$("#egg3").click(function () {
  if (eggcounter == 2) {
    eggcounter++;
    document.getElementById("egg3").style.opacity = 1.0;
    document.getElementById("egg4").style.opacity = 0.5;
    console.log(eggcounter);
  }
});

$("#egg4").click(function () {
  if (eggcounter == 3) {
    eggcounter++;
    document.getElementById("egg4").style.opacity = 1.0;
    console.log(eggcounter);

    for (i = 0; i < 25; i++) {
      easterEgg(Math.random() * 90 + "%", Math.random() * 90 + "%");
    }
    window.scrollTo(0, 0);

    var zoomerTunes = document.createElement("audio");
    zoomerTunes.setAttribute("src", "./resources/mlg-airhorn.mp3");
    document.body.appendChild(zoomerTunes);
  }
});

function easterEgg(x, y) {
  console.log("easter egg in progress");
  var zoomer = document.createElement("img");
  zoomer.setAttribute(
    "src",
    "https://i.kym-cdn.com/photos/images/original/001/402/574/13b.gif"
  );
  zoomer.style.position = "absolute";
  zoomer.style.width = "150px";
  zoomer.style.left = x;
  zoomer.style.top = y;
  zoomer.style.zIndex = "99";
  zoomer.onclick = function () {
    zoomer.style.visibility = "hidden";
  };
  document.body.appendChild(zoomer);
}
