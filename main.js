let calculate = false;

let width = document.body.clientWidth;
let height = window.innerHeight - 4;
let rectSize = width / 100;

console.log(width, " ", height);

const app = new PIXI.Application(width, height, {backgroundColor:0x000000});

document.body.appendChild(app.view);

const button = new PIXI.Graphics()
    .beginFill(0xff0000)
    .drawCircle(width / 2, height - 50, 20)
    .endFill();

button.interactive = true;
button.buttonMode = true;
button.on('pointerdown', execute);
app.stage.addChild(button);

const graphics = new PIXI.Graphics();
graphics.on('pointerdown', onClick);
app.stage.addChild(graphics);

let grid = new Array();
initialize();

function execute() {
    if(calculate === false)
    {
        calculate = true;
        graphics.interactive = false;
    }
    else
    {
        calculate = false;
        initialize();
    }
}


function onClick(event) {
    let x = Math.floor(event.data.global.x / rectSize);
    let y = Math.floor(event.data.global.y / rectSize);
    if(grid[x][y][0] === 0)
    {
        grid[x][y] = [1, 1];
        graphics.beginFill(0xFFFFFF)
        .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)

    }
    else
    {
        grid[x][y] = [0, 0];
        graphics.beginFill(0x000000)
        .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)

    }
    graphics.endFill();
}

function redraw()
{
    graphics.clear();
    for(let x = 0; x < grid.length; x++)
    {
        for(let y = 0; y < grid[x].length; y++)
        {
            grid[x][y][0] = grid[x][y][1];
            if(grid[x][y][0] === 1)
            {
                graphics.beginFill(0xFFFFFF)
                .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
            }
            else
            {
                graphics.beginFill(0x000000)
                .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
            }
        }
    }
    graphics.endFill();
}

function recalculate()
{
    for(let x = 0; x < grid.length; x++)
    {
        for(let y = 0; y < grid[x].length; y++)
        {
            let count = 0;

            for(let i = (x - 1); i <= (x + 1); i++)
            {
                if(i < 0 || i >= grid.length) continue;
                
                for(let j = (y - 1); j <= (y + 1); j++)
                {
                    if(j < 0 || j >= grid[x].length) continue;

                    if(i === x && j === y) continue;

                    if(grid[i][j][0] === 1)
                    {
                        count++;
                    }
                }
            }

            if(grid[x][y][0] === 1) // Alive
            {
                if (count < 2 || count >= 3)
                {
                    grid[x][y][1] = 0; // Mark for deletion
                }  
            }
            else
            {
                if(count === 3)
                {
                    grid[x][y][1] = 1; // Mark for creation
                }
            }

        }
    }
}

function initialize() {
    grid = new Array(Math.floor(width / rectSize));
    graphics.clear();
    graphics.beginFill(0x000000)
    for(let x = 0; x < grid.length; x++)
    {
        grid[x] = new Array(Math.floor((height - 100) / rectSize))
        for(let y = 0; y < grid[x].length; y++)
        {
            grid[x][y] = [0, 0];

            graphics
            .lineStyle(1, 0x999999, 1, 1)
            .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
        }
    }
    graphics.endFill();
    graphics.interactive = true;
}

let timer = 0.0;
app.ticker.add((delta) =>{
    if(calculate === false) return;
    timer += delta;
    {
        if(timer > 10.0)
        {
            timer = 0.0;
            recalculate();
            redraw();
        }
    }
})

// UI -----------------------------------

window.addEventListener('resize', resize);

function resize() {
    app.renderer.resize(width, height);
}

resize();