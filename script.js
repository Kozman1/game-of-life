const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');




function drawGrid(screenWidth, screenHeight, cellNumber) {
    const cellSize = screenWidth / cellNumber;
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 1;

    ctx.translate(-0.5, -0.5);
    for(let i = 0; i < cellNumber; i++) {
        let x = cellSize * i;
        let y = cellSize * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, screenHeight);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(screenWidth, y);
        ctx.stroke();
        ctx.closePath();
        
    }

}

drawGrid(window.innerWidth, window.innerHeight, 200);