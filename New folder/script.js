// Select elements
const sizePicker = document.getElementById("sizePicker");
let inputHeight = document.getElementById("inputHeight");
let inputWidth = document.getElementById("inputWidth");
let colorPicker = document.getElementById("colorPicker");
const pixelCanvas = document.getElementById("pixelCanvas");

let grid = [];
let startPoint = null;
let endPoint = null;
let paths = []; // Store all paths and their colors

// Function to create grid
function createGrid(height, width) {
    pixelCanvas.innerHTML = "";
    grid = [];

    for (let row = 0; row < height; row++) {
        let tr = document.createElement("tr");
        grid.push([]);

        for (let col = 0; col < width; col++) {
            let td = document.createElement("td");
            td.setAttribute("data-row", row);
            td.setAttribute("data-col", col);
            td.addEventListener("click", handleCellClick);
            tr.appendChild(td);
            grid[row].push(td);
        }

        pixelCanvas.appendChild(tr);
    }
}

// Event listener for grid size change
sizePicker.addEventListener("submit", (e) => {
    e.preventDefault();
    const height = parseInt(inputHeight.value);
    const width = parseInt(inputWidth.value);
    createGrid(height, width);
});

// Handle cell click to set start and end points
function handleCellClick(e) {
    const row = parseInt(e.target.getAttribute("data-row"));
    const col = parseInt(e.target.getAttribute("data-col"));

    // Handle setting of start point
    if (!startPoint) {
        startPoint = { row, col };
        e.target.style.backgroundColor = colorPicker.value;
    }
    // Handle setting of end point
    else if (!endPoint) {
        endPoint = { row, col };
        e.target.style.backgroundColor = colorPicker.value;
    }
}

// Dijkstra's algorithm to find the shortest path between start and end
function findPath(start, end, pathColor) {
    let queue = [];
    let visited = new Set();
    let distances = {};
    let previous = {};

    // Initialize distances to infinity
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            distances[`${row}-${col}`] = Infinity;
            previous[`${row}-${col}`] = null;
        }
    }

    distances[`${start.row}-${start.col}`] = 0;
    queue.push(start);

    // Directions (Up, Down, Left, Right)
    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    while (queue.length > 0) {
        queue.sort((a, b) => distances[`${a.row}-${a.col}`] - distances[`${b.row}-${b.col}`]);
        const current = queue.shift();
        const { row, col } = current;
        const currentKey = `${row}-${col}`;

        if (visited.has(currentKey)) continue;
        visited.add(currentKey);

        if (row === end.row && col === end.col) {
            let path = [];
            let currentCell = current;
            while (currentCell) {
                path.unshift(currentCell);
                currentCell = previous[`${currentCell.row}-${currentCell.col}`];
            }

            path.forEach((cell) => {
                const cellElement = grid[cell.row][cell.col];
                if (!cellElement.style.backgroundColor || cellElement.style.backgroundColor === "white") {
                    cellElement.style.backgroundColor = pathColor;
                }
            });

            paths.push({ path, color: pathColor });
            return true;
        }

        for (const [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (
                newRow >= 0 &&
                newRow < grid.length &&
                newCol >= 0 &&
                newCol < grid[0].length &&
                !visited.has(`${newRow}-${newCol}`)
            ) {
                const newDistance = distances[`${row}-${col}`] + 1;
                if (newDistance < distances[`${newRow}-${newCol}`]) {
                    distances[`${newRow}-${newCol}`] = newDistance;
                    previous[`${newRow}-${newCol}`] = { row, col };
                    queue.push({ row: newRow, col: newCol });
                }
            }
        }
    }

    alert("No path found.");
    return false;
}

// Button to find the path
document.getElementById("findPathBtn").addEventListener("click", () => {
    if (!startPoint || !endPoint) {
        alert("Please set both start and end points.");
        return;
    }

    // Draw the path with the selected color
    const success = findPath(startPoint, endPoint, colorPicker.value);

    if (success) {
        startPoint = null;
        endPoint = null;
    }
});

// Button to reset the grid
document.getElementById("resetBtn").addEventListener("click", () => {
    startPoint = null;
    endPoint = null;
    paths = [];
    createGrid(parseInt(inputHeight.value), parseInt(inputWidth.value));
});

// Initialize grid
createGrid(parseInt(inputHeight.value), parseInt(inputWidth.value));
