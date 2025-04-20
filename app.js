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
  const rect = blackWindow.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  bringToFront(blackWindow);
  e.preventDefault();
});

window.addEventListener("mousemove", (e) => {
  if (isDragging && blackWindow.style.display === "block") {
    const newLeft = e.clientX;
    const newTop = e.clientY;

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
  blackWindow.classList.remove("dragging"); // Remove dragging class
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

    let newWidth = Math.max(e.clientX - rect.left, 335); // Minimum width to fit all three float texts
    let newHeight = newWidth * (3 / 4) + 80; // Maintain 4:3 aspect ratio and add 80px for the drag bar

    // Prevent upscaling when touching the left border
    if (rect.left <= 0 && e.clientX > rect.right) {
      newWidth = rect.width; // Prevent upscaling
      newHeight = rect.height; // Maintain current height
    }

    // Prevent upscaling when touching the top border
    if (rect.top <= 0 && e.clientY > rect.bottom) {
      newHeight = rect.height; // Prevent upscaling
      newWidth = rect.width; // Maintain current width
    }

    // Allow downscaling even when touching the top or left borders
    if (rect.left <= 0 && e.clientX < rect.right) {
      newWidth = Math.max(335, e.clientX); // Allow downscaling but not below the minimum width
      newHeight = newWidth * (3 / 4) + 80; // Recalculate height to maintain aspect ratio
    }

    if (rect.top <= 0 && e.clientY < rect.bottom) {
      newHeight = Math.max(335 * (3 / 4) + 80, e.clientY); // Allow downscaling but not below the minimum height
      newWidth = (newHeight - 80) * (4 / 3); // Recalculate width to maintain aspect ratio
    }

    // Prevent upscaling beyond the right and bottom borders
    if (rect.left + newWidth > screenWidth) {
      newWidth = screenWidth - rect.left;
      newHeight = newWidth * (3 / 4) + 80;
    }
    if (rect.top + newHeight > screenHeight) {
      newHeight = screenHeight - rect.top;
      newWidth = (newHeight - 80) * (4 / 3); // Adjust width to maintain 4:3 aspect ratio
    }

    blackWindow.style.width = `${newWidth}px`;
    blackWindow.style.height = `${newHeight}px`;

    // Adjust float-text-inside positions and sizes
    const floatTexts = blackWindow.querySelectorAll(".float-text-inside");
    const sampleText = floatTexts[0]; // sample.txt
    const testText = floatTexts[1]; // test.txt
    const oddText = floatTexts[2]; // odd.txt

    const baseWidth = 335; // Initial width of the black box
    const scaleFactor = newWidth / baseWidth; // Linear scaling factor

    // Adjust sample.txt to always be 5px from the left
    const sampleWidth = 100 * scaleFactor; // Scale the width dynamically
    sampleText.style.width = `${sampleWidth}px`;
    sampleText.style.height = `${sampleWidth}px`;
    sampleText.style.left = "5px"; // Keep 5px from the left
    sampleText.style.top = "45px"; // Keep 45px from the top

    // Adjust test.txt to always be centered horizontally minus 5px
    const testWidth = 100 * scaleFactor; // Scale the width dynamically
    testText.style.width = `${testWidth}px`;
    testText.style.height = `${testWidth}px`;
    testText.style.left = `${(newWidth - testWidth) / 2 - 2.5}px`; 
    testText.style.top = "45px"; // Keep 45px from the top

    // Adjust odd.txt to always be 10px from the right
    const oddWidth = 100 * scaleFactor; // Scale the width dynamically
    oddText.style.width = `${oddWidth}px`;
    oddText.style.height = `${oddWidth}px`;
    oddText.style.left = `${newWidth - oddWidth - 10}px`; // Keep 10px from the right
    oddText.style.top = "45px"; // Keep 45px from the top
  }
});

window.addEventListener("touchmove", (e) => {
  if (isResizing && blackWindow.style.display === "block") {
    const touch = e.touches[0]; // Get the first touch point
    const rect = blackWindow.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let newWidth = Math.max(touch.clientX - rect.left, 335); // Minimum width to fit all three float texts
    let newHeight = newWidth * (3 / 4) + 80; // Maintain 4:3 aspect ratio and add 80px for the drag bar

    // Prevent upscaling when touching the left border
    if (rect.left <= 0 && touch.clientX > rect.right) {
      newWidth = rect.width; // Prevent upscaling
      newHeight = rect.height; // Maintain current height
    }

    // Prevent upscaling when touching the top border
    if (rect.top <= 0 && touch.clientY > rect.bottom) {
      newHeight = rect.height; // Prevent upscaling
      newWidth = rect.width; // Maintain current width
    }

    // Allow downscaling even when touching the top or left borders
    if (rect.left <= 0 && touch.clientX < rect.right) {
      newWidth = Math.max(335, touch.clientX); // Allow downscaling but not below the minimum width
      newHeight = newWidth * (3 / 4) + 80; // Recalculate height to maintain aspect ratio
    }

    if (rect.top <= 0 && touch.clientY < rect.bottom) {
      newHeight = Math.max(335 * (3 / 4) + 80, touch.clientY); // Allow downscaling but not below the minimum height
      newWidth = (newHeight - 80) * (4 / 3); // Recalculate width to maintain aspect ratio
    }

    // Prevent upscaling beyond the right and bottom borders
    if (rect.left + newWidth > screenWidth) {
      newWidth = screenWidth - rect.left;
      newHeight = newWidth * (3 / 4) + 80;
    }
    if (rect.top + newHeight > screenHeight) {
      newHeight = screenHeight - rect.top;
      newWidth = (newHeight - 80) * (4 / 3); // Adjust width to maintain 4:3 aspect ratio
    }

    blackWindow.style.width = `${newWidth}px`;
    blackWindow.style.height = `${newHeight}px`;

    // Adjust float-text-inside positions and sizes
    const baseWidth = 335; // Initial width of the black box
    const scaleFactor = newWidth / baseWidth; // Linear scaling factor

    const floatTexts = blackWindow.querySelectorAll(".float-text-inside");
    const basePositions = [5, 115, 225]; // Base left positions for sample.txt, test.txt, and odd.txt
    const iconBaseWidth = 100; // Base width of each icon

    floatTexts.forEach((floatText, index) => {
      const scaledWidth = iconBaseWidth * scaleFactor; // Scale the icon width dynamically
      const scaledLeft = basePositions[index] * scaleFactor; // Scale the left position dynamically

      floatText.style.width = `${scaledWidth}px`; // Set the scaled width
      floatText.style.height = `${scaledWidth}px`; // Maintain square aspect ratio
      floatText.style.left = `${scaledLeft}px`; // Set the scaled left position
      floatText.style.top = "45px"; // Keep the top position fixed
      floatText.style.transform = "none"; // Ensure no additional scaling is applied
    });
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

  // Reset the black window to its minimum size and position
  blackWindow.style.left = "50%";
  blackWindow.style.top = "50%";
  blackWindow.style.width = "335px"; // Minimum width
  blackWindow.style.height = `${335 * (3 / 4) + 80}px`; // Minimum height (4:3 aspect ratio + 80px for header)
  blackWindow.style.transform = "translate(-50%, -50%)"; // Center the box
  bringToFront(blackWindow);

  // Reset the float-text-inside positions and sizes
  const floatTexts = blackWindow.querySelectorAll(".float-text-inside");
  const baseLeft = [5, 115, 225]; // Initial left positions for sample.txt, test.txt, and odd.txt
  const baseWidth = 100; // Initial width of each icon
  floatTexts.forEach((floatText, index) => {
    floatText.style.width = `${baseWidth}px`; // Reset width
    floatText.style.height = `${baseWidth}px`; // Reset height
    floatText.style.left = `${baseLeft[index]}px`; // Reset left position
    floatText.style.top = "45px"; // Reset top position
    floatText.style.transform = "none"; // Reset scaling
  });
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

    let newWidth = Math.max(e.clientX - rect.left, 180); // Minimum width of 180px
    let newHeight = newWidth * (9 / 16) + 40; // Maintain 16:9 aspect ratio and add 40px for the drag bar

    // Prevent upscaling when touching the left border
    if (rect.left <= 0 && e.clientX > rect.right) {
      newWidth = rect.width; // Prevent upscaling
      newHeight = rect.height; // Maintain current height
    }

    // Prevent upscaling when touching the top border
    if (rect.top <= 0 && e.clientY > rect.bottom) {
      newHeight = rect.height; // Prevent upscaling
      newWidth = rect.width; // Maintain current width
    }

    // Allow downscaling even when touching the top or left borders
    if (rect.left <= 0 && e.clientX < rect.right) {
      newWidth = Math.max(180, e.clientX); // Allow downscaling but not below the minimum width
      newHeight = newWidth * (9 / 16) + 40; // Recalculate height to maintain aspect ratio
    }

    if (rect.top <= 0 && e.clientY < rect.bottom) {
      newHeight = Math.max(180 * (9 / 16) + 40, e.clientY); // Allow downscaling but not below the minimum height
      newWidth = (newHeight - 40) * (16 / 9); // Recalculate width to maintain aspect ratio
    }

    // Prevent upscaling beyond the right and bottom borders
    if (rect.left + newWidth > screenWidth) {
      newWidth = screenWidth - rect.left;
      newHeight = newWidth * (9 / 16) + 40;
    }
    if (rect.top + newHeight > screenHeight) {
      newHeight = screenHeight - rect.top;
      newWidth = (newHeight - 40) * (16 / 9); // Adjust width to maintain 16:9 aspect ratio
    }

    secondBlackWindow.style.width = `${newWidth}px`;
    secondBlackWindow.style.height = `${newHeight}px`;

    // Adjust float-text-inside positions and sizes
    const baseWidth = 200; // Initial width of the second black box
    const scaleFactor = newWidth / baseWidth; // Linear scaling factor

    const floatTextInside = secondBlackWindow.querySelector(".float-text-inside");
    floatTextInside.style.transform = `scale(${scaleFactor})`;
    floatTextInside.style.transformOrigin = "top left"; // Scale from the top-left corner
    floatTextInside.style.top = "45px"; // Keep it fixed to 45px from the top
    floatTextInside.style.left = "5px"; // Keep it fixed to 5px from the left
  }
});

window.addEventListener("touchmove", (e) => {
  if (isResizingSecond && secondBlackWindow.style.display === "block") {
    const touch = e.touches[0]; // Get the first touch point
    const rect = secondBlackWindow.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let newWidth = Math.max(touch.clientX - rect.left, 180); // Minimum width of 180px
    let newHeight = newWidth * (9 / 16) + 40; // Maintain 16:9 aspect ratio and add 40px for the drag bar

    // Prevent upscaling when touching the left border
    if (rect.left <= 0 && touch.clientX > rect.right) {
      newWidth = rect.width; // Prevent upscaling
      newHeight = rect.height; // Maintain current height
    }

    // Prevent upscaling when touching the top border
    if (rect.top <= 0 && touch.clientY > rect.bottom) {
      newHeight = rect.height; // Prevent upscaling
      newWidth = rect.width; // Maintain current width
    }

    // Allow downscaling even when touching the top or left borders
    if (rect.left <= 0 && touch.clientX < rect.right) {
      newWidth = Math.max(180, touch.clientX); // Allow downscaling but not below the minimum width
      newHeight = newWidth * (9 / 16) + 40; // Recalculate height to maintain aspect ratio
    }

    if (rect.top <= 0 && touch.clientY < rect.bottom) {
      newHeight = Math.max(180 * (9 / 16) + 40, touch.clientY); // Allow downscaling but not below the minimum height
      newWidth = (newHeight - 40) * (16 / 9); // Recalculate width to maintain aspect ratio
    }

    // Prevent upscaling beyond the right and bottom borders
    if (rect.left + newWidth > screenWidth) {
      newWidth = screenWidth - rect.left;
      newHeight = newWidth * (9 / 16) + 40;
    }
    if (rect.top + newHeight > screenHeight) {
      newHeight = screenHeight - rect.top;
      newWidth = (newHeight - 40) * (16 / 9); // Adjust width to maintain 16:9 aspect ratio
    }

    secondBlackWindow.style.width = `${newWidth}px`;
    secondBlackWindow.style.height = `${newHeight}px`;

    // Adjust float-text-inside positions and sizes
    const baseWidth = 200; // Initial width of the second black box
    const scaleFactor = newWidth / baseWidth; // Linear scaling factor

    const floatTextInside = secondBlackWindow.querySelector(".float-text-inside");
    floatTextInside.style.transform = `scale(${scaleFactor})`;
    floatTextInside.style.transformOrigin = "top left"; // Scale from the top-left corner
    floatTextInside.style.top = "45px"; // Keep it fixed to 45px from the top
    floatTextInside.style.left = "5px"; // Keep it fixed to 5px from the left
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

const folderWindows = document.querySelectorAll(".folder");

// Add dragging functionality to all folder windows
folderWindows.forEach((folder) => {
  const dragStrip = folder.querySelector(".drag-strip");
  const resizeCorner = folder.querySelector(".resize-corner");
  let isDraggingFolder = false;
  let isResizingFolder = false;
  let offsetXFolder, offsetYFolder;

  dragStrip.addEventListener("mousedown", (e) => {
    isDraggingFolder = true;
    folder.classList.add("dragging");
    folder.style.cursor = "grabbing";
    const rect = folder.getBoundingClientRect();
    offsetXFolder = e.clientX - rect.left;
    offsetYFolder = e.clientY - rect.top;
    bringToFront(folder);
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (isDraggingFolder) {
      const newLeft = e.clientX - offsetXFolder;
      const newTop = e.clientY - offsetYFolder;

      folder.style.left = `${newLeft}px`;
      folder.style.top = `${newTop}px`;
    }
  });

  window.addEventListener("mouseup", () => {
    isDraggingFolder = false;
    folder.classList.remove("dragging");
    folder.style.cursor = "default";
  });

  resizeCorner.addEventListener("mousedown", (e) => {
    isResizingFolder = true;
    bringToFront(folder);
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (isResizingFolder) {
      const rect = folder.getBoundingClientRect();
      let newWidth = Math.max(e.clientX - rect.left, 200); // Minimum width of 200px
      let newHeight = newWidth * (3 / 4) + 40; // Maintain 4:3 aspect ratio and add 40px for the drag bar

      folder.style.width = `${newWidth}px`;
      folder.style.height = `${newHeight}px`;
    }
  });

  window.addEventListener("mouseup", () => {
    isResizingFolder = false;
  });

  folder.addEventListener("mousedown", () => {
    bringToFront(folder);
  });
});

const floatTexts = document.querySelectorAll(".float-text, .float-text-top, .float-text-inside");

floatTexts.forEach((floatText) => {
  floatText.addEventListener("touchstart", () => {
    floatText.style.backgroundColor = "transparent"; // Remove hover effect on touch interaction
  });
});