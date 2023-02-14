import { Application } from './pixi.mjs';
import { Flock } from './boid.js'
import './Victor.js'

// Create the application 
let app = new Application({ resizeTo: window, autoDensity: true});
document.body.appendChild(app.view);

let flock = new Flock(100, app);

app.ticker.add((delta) => {
    flock.run(app);
})
