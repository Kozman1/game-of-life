const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const dpi = window.devicePixelRatio;

// sets number of cells horizontally
let cellNumber = 50;
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

function drawCell(cellColumn, cellRow) {
    
    ctx.fillStyle = 'black';
    ctx.fillRect(cellColumn * cellSize)
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

requestAnimationFrame(draw);




