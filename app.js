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

const topTouchButton = document.querySelector(".float-text-top");
const blackWindow = document.querySelector(".black-window");
const closeWindow = document.querySelector(".close-window");
const dragStrip = document.querySelector(".drag-strip"); // Select the drag strip
const resizeCorner = document.querySelector(".resize-corner"); // Select the resize visual cue

const secondBlackWindow = document.querySelector(".second-black-window");
const secondCloseWindow = document.querySelector(".second-close-window");
const floatTextInside = document.querySelector(".float-text-inside");

let isDragging = false;
let offsetX, offsetY; // Offset relative to the mouse click position within the strip
let isResizing = false;
let activeZIndex = 50; // Track the highest z-index

// Variables for the second black window
let isDraggingSecond = false;
let offsetXSecond, offsetYSecond; // Offset relative to the mouse click position within the strip
let isResizingSecond = false;

// Function to bring a black window to the front
function bringToFront(windowElement) {
  activeZIndex++;
  windowElement.style.zIndex = activeZIndex;
}

// Dragging functionality for the first black window
dragStrip.addEventListener("mousedown", (e) => {
  isDragging = true;
  blackWindow.classList.add("dragging"); // Add dragging class
  blackWindow.style.cursor = "grabbing"; // Show grabbing cursor
  const rect = blackWindow.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  bringToFront(blackWindow);
  e.preventDefault();
});

// Add touch support for dragging the first black window (explorer)
dragStrip.addEventListener("touchstart", (e) => {
  isDragging = true;
  const rect = blackWindow.getBoundingClientRect();
  const touch = e.touches[0]; // Get the first touch point
  offsetX = touch.clientX - rect.left;
  offsetY = touch.clientY - rect.top;
  bringToFront(blackWindow);
  e.preventDefault(); // Prevent default touch behavior
});

blackWindow.addEventListener("mousedown", () => {
  bringToFront(blackWindow);
});

window.addEventListener("mousemove", (e) => {
  if (isDragging && blackWindow.style.display === "block") {
    const newLeft = e.clientX - offsetX;
    const newTop = e.clientY - offsetY;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const boxWidth = blackWindow.offsetWidth;
    const boxHeight = blackWindow.offsetHeight;

    let adjustedLeft = newLeft;
    let adjustedTop = newTop;

    if (newLeft < 0) adjustedLeft = 0;
    else if (newLeft + boxWidth > screenWidth) adjustedLeft = screenWidth - boxWidth;

    if (newTop < 0) adjustedTop = 0;
    else if (newTop + boxHeight > screenHeight) adjustedTop = screenHeight - boxHeight;

    blackWindow.style.left = `${adjustedLeft}px`;
    blackWindow.style.top = `${adjustedTop}px`;
  }
});

window.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const newLeft = e.clientX; // Calculate the new left position based on the mouse's movement
    const newTop = e.clientY; // Calculate the new top position based on the mouse's movement

    // Ensure the box stays within the screen boundaries
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const boxWidth = blackWindow.offsetWidth / 2; // Half the width of the box
    const boxHeight = blackWindow.offsetHeight / 2; // Half the height of the box

    let adjustedLeft = newLeft;
    let adjustedTop = newTop;

    // Check horizontal boundaries
    if (newLeft < boxWidth) {
      adjustedLeft = boxWidth; // Allow the box to move half its width inside the left edge
    } else if (newLeft + boxWidth > screenWidth) {
      adjustedLeft = screenWidth - boxWidth; // Allow the box to move half its width outside the right edge
    }

    // Check vertical boundaries
    if (newTop < boxHeight) {
      adjustedTop = boxHeight; // Allow the box to move half its height inside the top edge
    } else if (newTop + boxHeight > screenHeight) {
      adjustedTop = screenHeight - boxHeight; // Allow the box to move half its height outside the bottom edge
    }

    blackWindow.style.left = `${adjustedLeft}px`;
    blackWindow.style.top = `${adjustedTop}px`;
  }
});

window.addEventListener("touchmove", (e) => {
  if (isDragging && blackWindow.style.display === "block") {
    const touch = e.touches[0]; // Get the first touch point
    const newLeft = touch.clientX;
    const newTop = touch.clientY;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const boxWidth = blackWindow.offsetWidth / 2; // Half the width of the box
    const boxHeight = blackWindow.offsetHeight / 2; // Half the height of the box

    let adjustedLeft = newLeft;
    let adjustedTop = newTop;

    // Check horizontal boundaries
    if (newLeft < boxWidth) {
      adjustedLeft = boxWidth; // Prevent moving beyond the left edge
    } else if (newLeft + boxWidth > screenWidth) {
      adjustedLeft = screenWidth - boxWidth; // Prevent moving beyond the right edge
    }

    // Check vertical boundaries
    if (newTop < boxHeight) {
      adjustedTop = boxHeight; // Prevent moving beyond the top edge
    } else if (newTop + boxHeight > screenHeight) {
      adjustedTop = screenHeight - boxHeight; // Prevent moving beyond the bottom edge
    }

    blackWindow.style.left = `${adjustedLeft}px`;
    blackWindow.style.top = `${adjustedTop}px`;
  }
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  isResizing = false;
  blackWindow.classList.remove("dragging"); // Remove dragging class
  blackWindow.style.cursor = "default"; // Reset cursor to default
});

window.addEventListener("touchend", () => {
  isDragging = false;
  blackWindow.classList.remove("dragging"); // Remove dragging class
  blackWindow.style.cursor = "default"; // Reset cursor to default
});

// Resizing functionality for the first black window (explorer)
resizeCorner.addEventListener("mousedown", (e) => {
  isResizing = true;
  bringToFront(blackWindow);
  e.preventDefault();
});

// Add touch support for resizing the first black window (explorer)
resizeCorner.addEventListener("touchstart", (e) => {
  isResizing = true;
  const rect = blackWindow.getBoundingClientRect();
  const touch = e.touches[0]; // Get the first touch point
  offsetX = touch.clientX - rect.left;
  offsetY = touch.clientY - rect.top;
  bringToFront(blackWindow);
  e.preventDefault(); // Prevent default touch behavior
});

window.addEventListener("mousemove", (e) => {
  if (isResizing && blackWindow.style.display === "block") {
    const rect = blackWindow.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let newWidth = Math.max(e.clientX - rect.left, 200); // Minimum width of 200px
    let newHeight = newWidth * (3 / 4) + 40; // Maintain 4:3 aspect ratio and add 40px to the height

    if (rect.left + newWidth > screenWidth) {
      newWidth = screenWidth - rect.left;
      newHeight = newWidth * (3 / 4) + 40;
    }
    if (rect.top + newHeight > screenHeight) {
      newHeight = screenHeight - rect.top;
      newWidth = (newHeight - 40) * (4 / 3); // Adjust width to maintain 4:3 aspect ratio
    }

    blackWindow.style.width = `${newWidth}px`;
    blackWindow.style.height = `${newHeight}px`;
  }
});

window.addEventListener("touchmove", (e) => {
  if (isResizing && blackWindow.style.display === "block") {
    
    const touch = e.touches[0]; // Get the first touch point
    const rect = blackWindow.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const minWidth = 200; // Minimum width of 200px
    const minHeight = minWidth * (3 / 4) + 40; // Maintain 4:3 aspect ratio and add 40px to the height

    let newWidth = Math.max(touch.clientX - rect.left, minWidth); // Enforce minimum width
    let newHeight = newWidth * (3 / 4) + 40; // Maintain 4:3 aspect ratio and add 40px to the height

    if (rect.left + newWidth > screenWidth) {
      newWidth = screenWidth - rect.left;
      newHeight = Math.max(newWidth * (3 / 4) + 40, minHeight);
    }
    if (rect.top + newHeight > screenHeight) {
      newHeight = screenHeight - rect.top;
      newWidth = Math.max((newHeight - 40) * (4 / 3), minWidth); // Adjust width to maintain 4:3 aspect ratio
    }

    blackWindow.style.width = `${newWidth}px`;
    blackWindow.style.height = `${newHeight}px`;
  }
});

window.addEventListener("mouseup", () => {
  isResizing = false;
});

window.addEventListener("touchend", () => {
  isResizing = false;
});

touchButton.addEventListener("click", () => {
  // Toggle the visibility of the floating card and link boxes
  card.classList.toggle("active");
  if (card.classList.contains("active")) {
    linkBoxesContainer.style.display = "block";
    linkBoxesContainer.classList.add("active");
  } else {
    linkBoxesContainer.style.display = "none";
    linkBoxesContainer.classList.remove("active");
  }
});

close.addEventListener("click", moveCard);

topTouchButton.addEventListener("click", () => {
  // Ensure the bottom float text remains visible
  card.classList.remove("active");
  linkBoxesContainer.classList.remove("active");
  linkBoxesContainer.style.display = "none";

  // Show the black window
  blackWindow.style.display = "block";

  // Reset the black window to its default position and size
  blackWindow.style.left = "50%";
  blackWindow.style.top = "50%";
  blackWindow.style.width = "400px"; // Default width remains the same
  blackWindow.style.height = "340px"; // Adjust height to 300px (4:3) + 40px
  blackWindow.style.transform = "translate(-50%, -50%)"; // Center the box
  bringToFront(blackWindow);
});

closeWindow.addEventListener("click", () => {
  // Hide the black window
  blackWindow.style.display = "none";
});

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

// Open the second black window when clicking on sample.txt
floatTextInside.addEventListener("click", () => {
  secondBlackWindow.style.display = "block";

  // Set the initial position and size independently
  secondBlackWindow.style.left = "50%"; // Center horizontally
  secondBlackWindow.style.top = "50%"; // Center vertically
  secondBlackWindow.style.width = "200px"; // Set width to 200px
  secondBlackWindow.style.height = `${200 * (9 / 16) + 40}px`; // Maintain 16:9 aspect ratio and add 40px to the height
  secondBlackWindow.style.transform = "translate(-50%, -50%)"; // Center the box visually

  bringToFront(secondBlackWindow); // Bring it to the front
});

// Ensure the second black window is independent
secondBlackWindow.addEventListener("mousedown", () => {
  bringToFront(secondBlackWindow);
});

// Dragging functionality for the second black window
secondBlackWindow.querySelector(".drag-strip").addEventListener("mousedown", (e) => {
  isDraggingSecond = true;
  secondBlackWindow.classList.add("dragging"); // Add dragging class
  bringToFront(secondBlackWindow);
  e.preventDefault();
});

// Add touch support for dragging the second black window (sample.txt)
secondBlackWindow.querySelector(".drag-strip").addEventListener("touchstart", (e) => {
  isDraggingSecond = true;
  bringToFront(secondBlackWindow);
  e.preventDefault(); // Prevent default touch behavior
});

window.addEventListener("mousemove", (e) => {
  if (isDraggingSecond && secondBlackWindow.style.display === "block") {
    const newLeft = e.clientX;
    const newTop = e.clientY;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const boxWidth = secondBlackWindow.offsetWidth / 2; // Half the width of the box
    const boxHeight = secondBlackWindow.offsetHeight / 2; // Half the height of the box

    let adjustedLeft = newLeft;
    let adjustedTop = newTop;

    // Check horizontal boundaries
    if (newLeft < boxWidth) {
      adjustedLeft = boxWidth; // Prevent moving beyond the left edge
    } else if (newLeft + boxWidth > screenWidth) {
      adjustedLeft = screenWidth - boxWidth; // Prevent moving beyond the right edge
    }

    // Check vertical boundaries
    if (newTop < boxHeight) {
      adjustedTop = boxHeight; // Prevent moving beyond the top edge
    } else if (newTop + boxHeight > screenHeight) {
      adjustedTop = screenHeight - boxHeight; // Prevent moving beyond the bottom edge
    }

    secondBlackWindow.style.left = `${adjustedLeft}px`;
    secondBlackWindow.style.top = `${adjustedTop}px`;
  }
});

window.addEventListener("touchmove", (e) => {
  if (isDraggingSecond) {
    const touch = e.touches[0]; // Get the first touch point
    const newLeft = touch.clientX;
    const newTop = touch.clientY;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const boxWidth = secondBlackWindow.offsetWidth / 2; // Half the width of the box
    const boxHeight = secondBlackWindow.offsetHeight / 2; // Half the height of the box

    let adjustedLeft = newLeft;
    let adjustedTop = newTop;

    // Check horizontal boundaries
    if (newLeft < boxWidth) {
      adjustedLeft = boxWidth; // Prevent moving beyond the left edge
    } else if (newLeft + boxWidth > screenWidth) {
      adjustedLeft = screenWidth - boxWidth; // Prevent moving beyond the right edge
    }

    // Check vertical boundaries
    if (newTop < boxHeight) {
      adjustedTop = boxHeight; // Prevent moving beyond the top edge
    } else if (newTop + boxHeight > screenHeight) {
      adjustedTop = screenHeight - boxHeight; // Prevent moving beyond the bottom edge
    }

    secondBlackWindow.style.left = `${adjustedLeft}px`;
    secondBlackWindow.style.top = `${adjustedTop}px`;
  }
});

window.addEventListener("mouseup", () => {
  isDraggingSecond = false;
  secondBlackWindow.classList.remove("dragging"); // Remove dragging class
});

window.addEventListener("touchend", () => {
  isDraggingSecond = false;
});

// Resizing functionality for the second black window (sample.txt)
secondBlackWindow.querySelector(".resize-corner").addEventListener("mousedown", (e) => {
  isResizingSecond = true;
  bringToFront(secondBlackWindow);
  e.preventDefault();
});

// Add touch support for resizing the second black window (sample.txt)
secondBlackWindow.querySelector(".resize-corner").addEventListener("touchstart", (e) => {
  isResizingSecond = true;
  const rect = secondBlackWindow.getBoundingClientRect();
  const touch = e.touches[0]; // Get the first touch point
  offsetXSecond = touch.clientX - rect.left;
  offsetYSecond = touch.clientY - rect.top;
  bringToFront(secondBlackWindow);
  e.preventDefault(); // Prevent default touch behavior
});

window.addEventListener("mousemove", (e) => {
  if (isResizingSecond && secondBlackWindow.style.display === "block") {
    const rect = secondBlackWindow.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const minWidth = 180; // Minimum width of 180px
    const minHeight = minWidth * (9 / 16) + 40; // Calculate minimum height based on 16:9 aspect ratio and 40px added

    let newWidth = Math.max(e.clientX - rect.left, minWidth); // Enforce minimum width
    let newHeight = newWidth * (9 / 16) + 40; // Maintain 16:9 aspect ratio and add 40px to the height

    if (rect.left + newWidth > screenWidth) {
      newWidth = screenWidth - rect.left;
      newHeight = Math.max(newWidth * (9 / 16) + 40, minHeight);
    }
    if (rect.top + newHeight > screenHeight) {
      newHeight = screenHeight - rect.top;
      newWidth = Math.max((newHeight - 40) * (16 / 9), minWidth); // Adjust width to maintain 16:9 aspect ratio
    }

    secondBlackWindow.style.width = `${newWidth}px`;
    secondBlackWindow.style.height = `${newHeight}px`;
  }
});

window.addEventListener("touchmove", (e) => {
  if (isResizingSecond) {
    const touch = e.touches[0]; // Get the first touch point
    const rect = secondBlackWindow.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const minWidth = 180; // Minimum width of 180px
    const minHeight = minWidth * (9 / 16) + 40; // Calculate minimum height based on 16:9 aspect ratio and 40px added

    let newWidth = Math.max(touch.clientX - rect.left, minWidth); // Enforce minimum width
    let newHeight = newWidth * (9 / 16) + 40; // Maintain 16:9 aspect ratio and add 40px to the height

    if (rect.left + newWidth > screenWidth) {
      newWidth = screenWidth - rect.left;
      newHeight = Math.max(newWidth * (9 / 16) + 40, minHeight);
    }
    if (rect.top + newHeight > screenHeight) {
      newHeight = screenHeight - rect.top;
      newWidth = Math.max((newHeight - 40) * (16 / 9), minWidth); // Adjust width to maintain 16:9 aspect ratio
    }

    secondBlackWindow.style.width = `${newWidth}px`;
    secondBlackWindow.style.height = `${newHeight}px`;
  }
});

window.addEventListener("mouseup", () => {
  isResizingSecond = false;
});

window.addEventListener("touchend", () => {
  isResizingSecond = false;
});

// Disable resizing from anywhere except the corner for sample.txt
secondBlackWindow.addEventListener("mousedown", (e) => {
  if (!e.target.classList.contains("resize-corner")) {
    e.preventDefault(); // Prevent resizing from non-corner areas
  }
});

// Close the second black window
secondCloseWindow.addEventListener("click", () => {
  secondBlackWindow.style.display = "none";
});

// Bring the first black window to the front when clicked
blackWindow.addEventListener("mousedown", () => {
  bringToFront(blackWindow);
});