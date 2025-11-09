const tuktuk = document.querySelector(".moving-tuktuk");

tuktuk.addEventListener("animationend", () => {
  tuktuk.style.display = "none";
});