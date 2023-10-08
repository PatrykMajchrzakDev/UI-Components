const carousel = document.querySelector(".carousel");
const arrowIcons = document.querySelectorAll(".wrapper i");
const firstImg = carousel.querySelectorAll("img")[0];

let isDragStart = false,
  prevPageX,
  prevScrollLeft,
  positionDiff,
  isDragging = false;

//14 cause of css .carousel img margin left
let firstImgWidth = firstImg.clientWidth + 14;

const showHideIcons = () => {
  let scrollWidth = carousel.scrollWidth - carousel.clientWidth; // getting max scrollable width
  //showing and hiding prev/next icon according to carouse scroll left value
  arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
  arrowIcons[1].style.display =
    carousel.scrollLeft == scrollWidth ? "none" : "block";
};

arrowIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    //if clicked icon is left, reduce width value from the carouse scroll left, else add to it
    carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
    setTimeout(() => showHideIcons(), 60); //if called too fast icon wont appear after moving first time
  });
});

const dragStart = (e) => {
  //updating global variables value on mouse down event
  isDragStart = true;

  // || is for touched devices
  prevPageX = e.pageX || e.touches[0].pageX;
  prevScrollLeft = carousel.scrollLeft;
};

//autoSlide to the middle of img
const autoSlide = () => {
  //if there is no images left to scroll then return from here
  if (carousel.scrollLeft == carousel.scrollWidth - carousel.clientWidth)
    return;

  positionDiff = Math.abs(positionDiff); //making position to always be positive
  //getting difference value that needs to add or reduce from carousel left to take middle img to the center
  let valDifference = firstImgWidth - positionDiff;

  //user scrolling to the right
  if (carousel.scrollLeft > prevScrollLeft) {
    //if user positionDiff is greate than 33% of image width then add ddifference value to the scorllLeft
    //else reduce positionDiff from it
    return (carousel.scrollLeft +=
      positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff);
  }
  //user scrolling to the left
  carousel.scrollLeft -=
    positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
};

const dragStop = () => {
  isDragStart = false;
  carousel.classList.remove("dragging");

  //Now, isDragging will only be true if user starts dragging, otherwise
  //its false & autoSlide function won't call
  if (!isDragging) return;
  isDragging = false;

  autoSlide();
};

//scrolling images / carousel to left according to mouse pointer
const dragging = (e) => {
  if (!isDragStart) return;

  //this is necessary to change scroll behaviour while dragging image cause scroll-behaviour: smooth
  //is not smooth while dragging
  carousel.classList.add("dragging");
  //this is necessary to not drag images when clicked and moved mouse
  e.preventDefault();
  isDragging = true;

  //scrollLeft set or return the number of pixel an element's content is scrolled horizontally
  carousel.scrollLeft = e.pageX;
  positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
  carousel.scrollLeft = prevScrollLeft - positionDiff;

  //to show/hide arrow icons when dragging
  showHideIcons();
};

//touch events are for touch devices
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("mouseleave", dragStop);
carousel.addEventListener("touchend", dragStop);
