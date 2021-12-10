const width = document.body.clientWidth;
const height = window.innerHeight - 4;
const rectSize = width / 100;

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

function execute() {
    if(graphics.interactive == true)
    {
        graphics.interactive = false;
    }
    else
    {
        grid = initialize();
    }
}

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

let grid = initialize();

graphics.on('pointerdown', onClick);

function onClick(event) {
    let x = Math.floor(event.data.global.x / rectSize);
    let y = Math.floor(event.data.global.y / rectSize);

    if(grid[x][y][0] === 0)
    {
        grid[x][y] = [1, 1]
        graphics.beginFill(0xFFFFFF)
        .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
        .endFill();
    }
    else
    {
        grid[x][y] = [0, 0]
        graphics.beginFill(0x000000)
        .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
        .endFill();
    }
}

// for(let x = 0; x < grid.length; x++)
// {
//     for(let y = 0; y < grid[x].length; y++)
//     {
//         if(grid[x][y][0]  === 1)
//         {
//             graphics.beginFill(0xFFFFFF);
//             graphics.drawRect(x * rectSize, y * rectSize, rectSize, rectSize);
//             graphics.endFill();
//         }
//     }
// }




let timer = 0.0;
app.ticker.add((delta) =>{
    if(graphics.interactive == true) return;
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

window.addEventListener('resize', resize);

function redraw()
{
    for(let x = 0; x < grid.length; x++)
    {
        for(let y = 0; y < grid[x].length; y++)
        {
            grid[x][y][0] = grid[x][y][1];
            if(grid[x][y][0] === 1)
                graphics.beginFill(0xFFFFFF);
            else
                graphics.beginFill(0x000000)
                .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
                .endFill();
        }
    }
}

function recalculate()
{
    //console.log("recalculate");
    for(let x = 0; x < grid.length; x++)
    {
        for(let y = 0; y < grid[x].length; y++)
        {
            let count = 0;

            for(let i = x - 1; i <= x + 1; i++)
            {
                if(i < 0 || i >= grid.length) continue;
                
                for(let j = y - 1; j <= y + 1; j++)
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
                if(count == 3)
                {
                    grid[x][y][1] = 1; // Mark for creation
                }
            }

        }
    }
}

function countNeighbors(x, y)
{
    console.log("neighbor")
    count = 0;
    // let minX = Math.max(x - 1, 0);
    // let maxX = Math.min(x + 1, grid.length);
    // let minY = Math.max(y - 1, 0);
    // let maxY = Math.min(y + 1, grid[0].length);

    for(let i = x - 1; i <= x + 1; i++)
    {
        if(i < 0 || i >= grid.length) continue;
        for(let j = y - 1; j <= y + 1; j++)
        {
            if(j < 0 || j >= grid.length) continue;
            if(i == x && j == y) continue;
            if(grid[x][y][0] === 1)
            {
                count++;
            }
        }
    }

    return count;
}

function resize() {
    app.renderer.resize(width, height);
}

// function initialize()
// {
//     let grid = new Array(Math.floor(width / rectSize));
//     for(let x = 0; x < grid.length; x ++)
//     {
//         grid[x] = new Array(Math.floor(height / rectSize))
//         for(let y = 0; y < grid[x].length; y ++)
//         {
//             if(Math.random() > 0.7)
//             {
//                 grid[x][y] = [1, 1];
//             }
//             else
//             {
//                 grid[x][y] = [0, 0];
//             }
//         }
//     }
//     return grid;
// }

function initialize() {
    let grid = new Array(Math.floor(width / rectSize));
    for(let x = 0; x < grid.length; x++)
    {
        grid[x] = new Array(Math.floor((height - 100) / rectSize))
        for(let y = 0; y < grid[x].length; y++)
        {
            grid[x][y] = [0, 0];

            graphics.beginFill(0x000000)
            .lineStyle(1, 0x999999, 1, 1)
            .drawRect(x * rectSize, y * rectSize, rectSize, rectSize)
            .endFill();
        }
    }
    graphics.interactive = true;
    return grid;
}

resize();