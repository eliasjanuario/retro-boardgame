// Board pan / zoom camera.

let scale = 1;
let panning = false;
let pointX = 0;
let pointY = 0;
let start = { x: 0, y: 0 };
let panMoved = false;

function updateCamera() {
  board.style.transform =
    "translate3d(" + pointX + "px, " + pointY + "px, 0) scale(" + scale + ")";
}

function resetCamera() {
  scale = 1;
  pointX = 0;
  pointY = 0;
  panning = false;
  boardViewport.classList.remove("is-panning");
  updateCamera();
}

boardViewport.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();

    const rect = boardViewport.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xs = (mouseX - pointX) / scale;
    const ys = (mouseY - pointY) / scale;
    const delta = event.deltaY < 0 ? 0.1 : -0.1;
    const newScale = Math.min(3, Math.max(0.5, scale + delta));

    pointX = mouseX - xs * newScale;
    pointY = mouseY - ys * newScale;
    scale = newScale;
    updateCamera();
  },
  { passive: false }
);

boardViewport.addEventListener("mousedown", (event) => {
  if (event.button !== 0) {
    return;
  }

  panning = true;
  panMoved = false;
  start = { x: event.clientX - pointX, y: event.clientY - pointY };
  boardViewport.classList.add("is-panning");
});

boardViewport.addEventListener("mousemove", (event) => {
  if (!panning) {
    return;
  }

  const nextX = event.clientX - start.x;
  const nextY = event.clientY - start.y;

  if (Math.abs(nextX - pointX) > 2 || Math.abs(nextY - pointY) > 2) {
    panMoved = true;
  }

  pointX = nextX;
  pointY = nextY;
  updateCamera();
});

function endPan() {
  if (!panning) {
    return;
  }

  panning = false;
  boardViewport.classList.remove("is-panning");
}

boardViewport.addEventListener("mouseup", endPan);
boardViewport.addEventListener("mouseleave", endPan);
recenterButton.addEventListener("click", resetCamera);
updateCamera();

function boardPercentage(event) {
  const rect = board.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  return { x, y };
}

// TEMPORARY: click squares 1–100 and copy the log into the coordinates array.
board.addEventListener("click", (event) => {
  if (panMoved) {
    return;
  }

  const { x, y } = boardPercentage(event);
  console.log(`{ x: ${x.toFixed(2)}%, y: ${y.toFixed(2)}% },`);
});
