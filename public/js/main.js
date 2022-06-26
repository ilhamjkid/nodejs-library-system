const sideBarBtn = document.querySelector("#sidebar-btn");
const sideBarMenu = document.querySelector("#sidebar-menu");
const mainMenu = document.querySelector("#main-menu");
sideBarBtn.addEventListener("click", () => {
  sideBarMenu.classList.toggle("sidebar-active");
  sideBarMenu.classList.toggle("sidebar-unactive");
  mainMenu.classList.toggle("main-active");
  mainMenu.classList.toggle("main-unactive");
});
