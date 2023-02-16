import {Application} from "pixi"
import {Flock} from './boid.mjs'

// Create the application 
let app = new Application({ resizeTo: window, autoDensity: true});
document.body.appendChild(app.view);

let flock = new Flock(500, app);

app.ticker.add(() => flock.run());
