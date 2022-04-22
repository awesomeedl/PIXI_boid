let width = document.body.clientWidth;
let height = document.body.clientHeight;

// Create the application 
let app = new PIXI.Application({ width, height });
document.body.appendChild(app.view);

let graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

let number = 30;
let boids = [];

let texture = PIXI.Texture.from('Arrow.png');

function init() {
    for(let i = 0; i < number; i++)
    {
        let boid = new PIXI.Sprite(texture);
        boid.anchor.set(0.5);

        boid.x = Math.random() * width;
        boid.y = Math.random() * height;
        
        app.stage.addChild(boid);
    }
}

function draw_boids() {

}
