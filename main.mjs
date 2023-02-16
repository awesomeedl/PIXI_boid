import {Application} from 'https://cdn.jsdelivr.net/npm/pixi.js@7.1.2/dist/pixi.min.mjs';
import {Flock} from './boid.mjs'
import './victor.min.js'

// Create the application 
let app = new Application({ resizeTo: window, autoDensity: true});
document.body.appendChild(app.view);

let flock = new Flock(500, app);

app.ticker.add(() => flock.run());
