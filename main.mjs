import { Application } from "pixi"
import { Flock } from './boid.mjs'
import { SpatialHash } from "./spatial_hash.mjs";

export const app = new Application({ resizeTo: window, autoDensity: true });
export const spatialHash = new SpatialHash()

const flock = new Flock(500);

document.body.appendChild(app.view);

app.ticker.add(() => {
    spatialHash.refresh(flock);
    flock.run()
});