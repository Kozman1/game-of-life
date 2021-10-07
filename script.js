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

function createCellMatrix() {
    for(let y = 0; y * cellSize <= screenHeight; y++) {
        cellMatrix[y] = [];  
        for(let x = 0; x <= cellNumber; x++) {
            cellMatrix[y][x] = {
                isPopulated: false,
                populatedNextTick: false,
                x: x,
                y: y
            };
        }
    }

}

function getCellNeighbours(x, y) {
    return [
        getCell(x - 1, y - 1),
        getCell(x, y - 1),
        getCell(x + 1, y - 1),
        getCell(x - 1, y),
        getCell(x + 1, y),
        getCell(x - 1, y + 1),
        getCell(x, y + 1),
        getCell(x + 1, y + 1) 
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
    for(let y = 0; y < cellMatrix.length; y++) {
        for(let x = 0; x < cellMatrix[y].length; x++) {
            let cell = cellMatrix[y][x];
            let populated = getCellNeighbours(x, y).filter(neighbour => neighbour.isPopulated);
            
            if(populated.length === 2 || populated.length === 3) {
                drawCell(x, y);
                cell.populatedNextTick = true;
            }
            else {
                clearCell(x, y);
                cell.populatedNextTick = false;
            }
        }
    }

    for(y = 0; y < cellMatrix.length; y++) {
        for(x = 0; x < cellMatrix[y].length; x++) {
            let cell = cellMatrix[y][x];
            let populated = getCellNeighbours(x, y).filter(cell => cell.populatedNextTick);

            if(populated.length === 2 || populated.length === 3) {
                cell.isPopulated = true;
            }
            else {
                cell.isPopulated = false;
            }
        }
    }
}

function draw() {
    fixDPI();
    drawGrid();
}


requestAnimationFrame(draw);
createCellMatrix();

async function run() {
    while(true) {
        await timeout(1000);
        evalGeneration();
    }
}


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}