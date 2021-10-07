const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const dpi = window.devicePixelRatio;

// sets number of cells horizontally
let cellNumber = 50;
let cellColor = 'black';
let cellMatrix = [];
const screenWidth = window.innerWidth * dpi;
const screenHeight = window.innerHeight * dpi;
const cellSize = screenWidth / cellNumber;


function drawGrid() {
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 1;

    for(let i = 0; i <= cellNumber; i++) {
        let x = cellSize * i;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, screenHeight);
        ctx.stroke();
        ctx.closePath();    
    }

    for(let i = 0; i * cellSize <= screenHeight; i++) {
        let y = cellSize * i;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(screenWidth, y);
        ctx.stroke();
        ctx.closePath();
    }
}

// most left top cell is on (0, 0)
function drawCell(cellColumn, cellRow) {
    ctx.fillStyle = cellColor;
    ctx.fillRect(
        // -2/1 offset to compensate border
        cellColumn * cellSize + 1, 
        cellRow * cellSize + 1, 
        cellSize - 2,
        cellSize - 2
    );
}

function clearCell(cellColumn, cellRow) {
    ctx.clearRect(
        // -2/1 offset to compensate border
        cellColumn * cellSize + 1, 
        cellRow * cellSize + 1, 
        cellSize - 2,
        cellSize - 2 
    );
}

function fixDPI() {
    
    const style = {
        get width() {
            return getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
        },
        
        get height() {
            return getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
        }
    }

    canvas.setAttribute('width', style.width * dpi);
    canvas.setAttribute('height', style.height * dpi);
}

function draw() {
    fixDPI();
    drawGrid();
}

function createCellMatrix() {
    for(let i = 0; i * cellSize <= screenHeight; i++) {
        cellMatrix[i] = [];  
        for(let k = 0; k <= cellNumber; k++) {
            cellMatrix[i][k] = {
                x: k,
                y: i
            };
        }
    }

}

function getCellNeighbours(x, y) {
    return {
        topLeft: getCell(y - 1, x - 1),
        top: getCell(y - 1, x),
        topRight: getCell(y - 1, x + 1),
        left: getCell(y, x - 1),
        right: getCell(y, x + 1),
        bottomLeft: getCell(y + 1, x -1),
        bottom: getCell(y + 1, x),
        bottomRight: getCell(y + 1, x + 1)
    }

    function getCell(x, y) {
        if (!cellMatrix[y]) return null;
        if (!cellMatrix[y][x]) return null;
        return cellMatrix[y][x];
    }
}



requestAnimationFrame(draw);
createCellMatrix();


[
    [1, 3, 5],
    [1, 3, 5],
    [1, 3, 5],
]

