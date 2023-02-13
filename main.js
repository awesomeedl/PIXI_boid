let width = window.innerWidth;
let height = window.innerHeight;

// Create the application 
let app = new PIXI.Application({ width: width, height: height });
document.body.appendChild(app.view);

let number = 30;

let flock = [];


function init() {
    for (let i = 0; i < number; i++) {
        let boid = new Boid(Victor().randomize(Victor(0, 0), Victor(width, height)), app)
        flock.push(boid);
    }

    console.log(flock.length);
}

function calculate() {
    for (let boid of flock) {
        boid.run(flock);
    }
}

init();

app.ticker.add((delta) => {
    calculate();
})
