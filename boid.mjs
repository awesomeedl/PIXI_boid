import { Sprite, Texture, utils } from "pixi"
import "victor"

import { app, spatialHash } from './main.mjs'

const maxVelocity = 3;
const maxAcceleration = 0.1;
const maxAccelSq = maxAcceleration * maxAcceleration;

const cohesionWeight = 1;
const separationWeight = 500;
const alignmentWeight = 15;

export const visibleRange = 100;
const visibleRangeSq = visibleRange * visibleRange;

const separateRange = 50;
const separateRangeSq = separateRange * separateRange;

class Flock {
    /**
     *
     * @param {Number} numBoids
     */
    constructor(numBoids) {
        /** @type {Boid[]} */ this.flock = new Array(numBoids)
        /** @type {Sprite[]} */this.sprites = new Array(numBoids)

        this.specialBoid = Math.floor(Math.random() * this.flock.length);

        for (let i = 0; i < numBoids; i++) {
            this.flock[i] = new Boid(Victor().randomize(Victor(0, 0), Victor(app.renderer.width, app.renderer.height)));

            let s = new Sprite(Texture.from('Arrow.png'));
            s.scale.set(0.3);
            s.anchor.set(0.5);
            app.stage.addChild(s)
            this.sprites[i] = s;
        }
    }

    run() {
        for (let i = 0; i < this.flock.length; i++) {
            let boid = this.flock[i];
            let sprite = this.sprites[i];

            let neighbors = spatialHash.getNeighbors(boid.spatialIndex);
            // let neighbors = this.flock;
            let acceleration = boid.run(neighbors);


            boid.velocity.add(acceleration).normalize().multiplyScalar(maxVelocity)

            boid.position.add(boid.velocity);

            sprite.rotation = boid.velocity.horizontalAngle() + Math.PI * 0.5;

            if (boid.position.x < 0) boid.position.x = app.renderer.width;
            if (boid.position.y < 0) boid.position.y = app.renderer.height;
            if (boid.position.x > app.renderer.width) boid.position.x = 0;
            if (boid.position.y > app.renderer.height) boid.position.y = 0;

            sprite.x = boid.position.x;
            sprite.y = boid.position.y;

            let tmp = boid.velocity.clone().normalize();
            sprite.tint = utils.rgb2hex([0, Math.cos(tmp.x), Math.cos(tmp.y)]);
        }
    }
}

class Boid {
    /**
     * @param {Victor} position
     */
    constructor(position) {
        /** @type{Victor} */ this.position = position;
        /** @type{Victor} */ this.velocity = Victor().randomize(Victor(-maxVelocity, -maxVelocity), Victor(maxVelocity, maxVelocity));
        /** @type{number} */ this.spatialIndex = spatialHash.getIndex(position);
    }

    /**
     * @param {Boid[]} flock
     * @return {Victor}
     */
    run(flock) {
        let a1 = this.cohesion(flock).multiplyScalar(cohesionWeight);
        let a2 = this.separation(flock).multiplyScalar(separationWeight);
        let a3 = this.alignment(flock).multiplyScalar(alignmentWeight);

        this.acceleration = a1.add(a2).add(a3);

        if (this.acceleration.lengthSq() > maxAccelSq) {
            this.acceleration.normalize().multiplyScalar(maxAcceleration)
        }

        return (this.acceleration);
    }

    /**
     * 
     * @param {Boid} other 
     * @returns {boolean}
     */
    isNeighbor(other) {
        return other !== this && this.position.distanceSq(other.position) < visibleRangeSq;
    }

    /**
     *
     * @param {Boid[]} flock
     * @returns {Victor}
     */
    cohesion(flock) {
        let c = Victor();
        let count = 0;

        for (let boid of flock) {
            if (!this.isNeighbor(boid)) continue;

            c.add(boid.position);
            count++;
        }

        return count > 0 ? c.divideScalar(count).subtract(this.position) : c;
    }

    /**
     *
     * @param {Boid[]} flock
     * @returns {Victor}
     */
    alignment(flock) {
        let a = Victor();
        let count = 0;

        for (let boid of flock) {
            if (!this.isNeighbor(boid)) continue;

            a.add(boid.velocity);
            count++;
        }

        return count > 0 ? a.divideScalar(count).subtract(this.velocity).mix(this.velocity, 0.2) : this.velocity;
    }

    /**
     *
     * @param {Boid[]} flock
     * @returns {Victor}
     */
    separation(flock) {
        let s = Victor();

        for (let boid of flock) {
            if (boid !== this && this.position.distanceSq(boid.position) < separateRangeSq) {
                s.add(this.position.clone().subtract(boid.position).divideScalar(this.position.distanceSq(boid.position)));
            }
        }

        return s;
    }
}

export { Flock, Boid }