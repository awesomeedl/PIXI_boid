let width = window.innerWidth;
let height = windows.innerHeight;

// Create the application 
let app = new PIXI.Application({ width: width, height: height });
document.body.appendChild(app.view);

let number = 30;

let texture = PIXI.Texture.from('Arrow.png');

function init() {
    for(let i = 0; i < number; i++)
    {
        let boid = new PIXI.Sprite(texture);
        boid.anchor.set(0.5);

        boid.x = Math.random() * width;
        boid.y = Math.random() * height;
        console.log('(' + boid.x + ', ' + boid.y + ')');
        app.stage.addChild(boid);
    }
}

init();
