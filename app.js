const cursor = document.querySelector(".cursor");

window.addEventListener("mousemove", (e) => {
  cursor.style.left = e.pageX + "px";
  cursor.style.top = e.pageY + "px";
  cursor.setAttribute("data-fromTop", cursor.offsetTop - scrollY);
  // console.log(e)
});
window.addEventListener("scroll", () => {
  const fromTop = cursor.getAttribute("data-fromTop");
  cursor.style.top = scrollY + parseInt(fromTop) + "px";
  console.log(scrollY);
});
window.addEventListener("click", () => {
  if (cursor.classList.contains("click")) {
    cursor.classList.remove("click");
    void cursor.offsetWidth; // trigger a DOM reflow
    cursor.classList.add("click");
  } else {
    cursor.classList.add("click");
  }
});


// *********************
// This Code is for only the floating card in right bottom corner
// **********************

const touchButton = document.querySelector(".float-text");
const card = document.querySelector(".float-card-info");
const close = document.querySelector(".gg-close-r");
const linkBoxesContainer = document.querySelector(".link-boxes-container"); // Select the link boxes container

touchButton.addEventListener("click", moveCard);
close.addEventListener("click", moveCard);

function moveCard() {
  card.classList.toggle("active");
  if (linkBoxesContainer.classList.contains("active")) {
    linkBoxesContainer.classList.remove("active");
    linkBoxesContainer.style.display = "none";
  } else {
    linkBoxesContainer.classList.add("active");
    linkBoxesContainer.style.display = "block";
  }
}