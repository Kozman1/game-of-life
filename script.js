const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const dpi = window.devicePixelRatio;
let isRunning = false;

// sets number of cells horizontally
let cellNumber = 40;
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
                isPopulated: false,
                x: k,
                y: i
            };
        }
    }

}

function getCellNeighbours(x, y) {
    return [
        getCell(y - 1, x - 1),
        getCell(y - 1, x),
        getCell(y - 1, x + 1),
        getCell(y, x - 1),
        getCell(y, x + 1),
        getCell(y + 1, x -1),
        getCell(y + 1, x),
        getCell(y + 1, x + 1) 
    ].filter(cell => { return cell });

    function getCell(x, y) {
        if (!cellMatrix[y]) return null;
        if (!cellMatrix[y][x]) return null;
        return cellMatrix[y][x];
    }
}

window.addEventListener('click', (e) => {
    let x = e.clientX,
        y = e.clientY,
        c = Math.trunc(x * dpi / cellSize),
        r = Math.trunc(y * dpi / cellSize);
        console.log(c, cellMatrix[c])
    if(cellMatrix[r][c].isPopulated) {
        clearCell(c, r);
        cellMatrix[r][c].isPopulated = false;
    }
    else {
        drawCell(c, r);
        cellMatrix[r][c].isPopulated = true;
    }
}); 


function evalGeneration() {
    console.log('started');
    for(i = 0; i < cellMatrix.length; i++) {
        for(k = 0; k < cellMatrix[i].length; k++) {
            let cell = cellMatrix[i][k];
            let populated = getCellNeighbours(cell.x, cell.y).filter(cell => cell.isPopulated);
            if(populated.length === 2 || populated.length === 3) {
                drawCell(i, k);
                cell.isPopulated = true;
            }
            else {
                clearCell(i, k);
                cell.isPopulated = false;
            }
        }
    }
}


requestAnimationFrame(draw);
createCellMatrix();

(async () => {
    while(false) {
        await timeout(700);
        evalGeneration();
    }
})();


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}