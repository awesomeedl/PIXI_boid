import {Application, Renderer, Sprite, Texture, utils} from 'https://cdn.jsdelivr.net/npm/pixi.js@7.1.2/dist/pixi.min.mjs'
import './victor.min.js'

const maxVelocity = 1.5;
const maxAcceleration = 0.1;

const cohesionWeight = 1;
const separationWeight = 500;
const alignmentWeight = 15;

const visibleRange = 100;

const separateRange = 50;

class Flock {
    /**
     *
     * @param {Number} numBoids
     * @param {Application} pixiApp
     */
    constructor(numBoids, pixiApp) {
        /** @type {Boid[]} */ this.flock = new Array(numBoids)
        /** @type {Sprite[]} */this.sprites = new Array(numBoids)

        /** @type {Renderer} */this.pixiRenderer = pixiApp.renderer;

        for (let i = 0; i < numBoids; i++) {
            this.flock[i] = new Boid(Victor().randomize(Victor(0, 0), Victor(this.pixiRenderer.width, this.pixiRenderer.height)));

            let s = new Sprite(Texture.from('Arrow.png'));
            s.scale.set(0.3);
            s.anchor.set(0.5);
            pixiApp.stage.addChild(s)
            this.sprites[i] = s;
        }
    }

    run() {
        for (let i = 0; i < this.flock.length; i++) {
            let boid = this.flock[i];
            let sprite = this.sprites[i];

            let [acceleration, c, s, a] = boid.run(this.flock);

            boid.velocity.add(acceleration).normalize().multiplyScalar(maxVelocity)


            boid.position.add(boid.velocity);

            sprite.rotation = boid.velocity.horizontalAngle() + Math.PI * 0.5;

            if (boid.position.x < 0) boid.position.x = this.pixiRenderer.width;
            if (boid.position.y < 0) boid.position.y = this.pixiRenderer.height;
            if (boid.position.x > this.pixiRenderer.width) boid.position.x = 0;
            if (boid.position.y > this.pixiRenderer.height) boid.position.y = 0;

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
    }

    /**
     * @param {Boid[]} flock
     * @return {Victor}
     */
    run(flock) {
        let a1 = this.cohesion(flock).multiplyScalar(cohesionWeight);
        let a2 = this.separation(flock).multiplyScalar(separationWeight);
        let a3 = this.alignment(flock).multiplyScalar(alignmentWeight);

        this.acceleration = Victor().zero()
        this.acceleration.add(a1);
        this.acceleration.add(a2);
        this.acceleration.add(a3);

        if (this.acceleration.length() > maxAcceleration) {
            this.acceleration.normalize().multiplyScalar(maxAcceleration)
        }

        return([this.acceleration, a1, a2, a3]);
    }

    /**
     *
     * @param {Boid[]} flock
     * @returns {Victor}
     */
    cohesion(flock) {
        let perceivedCenter = Victor();
        let count = 0;

        for (const boid of flock) {
            if (boid === this) continue;
            let distance = this.position.distance(boid.position) 
            if(distance < visibleRange) {
                perceivedCenter.add(boid.position);
                count++
            }
        }

        return count > 0 ? perceivedCenter.divideScalar(count).subtract(this.position) : Victor().zero();
    }

    /**
     *
     * @param {Boid[]} flock
     * @returns {Victor}
     */
    alignment(flock) {
        let perceivedVelocity = Victor().zero();
        let count = 0;

        for (const boid of flock) {
            if (boid !== this && this.position.distance(boid.position) < visibleRange) {
                perceivedVelocity.add(boid.velocity);
                count++;
            }
        }


        return count > 0 ? perceivedVelocity.divideScalar(count).subtract(this.velocity).mix(this.velocity, 0.2) : this.velocity;
    }

    /**
     *
     * @param {Boid[]} flock
     * @returns {Victor}
     */
    separation(flock) {
        let c = Victor().zero()

        for (const boid of flock) {
            if (boid !== this && this.position.distance(boid.position) < separateRange) {
                let distance = this.position.distance(boid.position);

                c.add(this.position.clone().subtract(boid.position).divideScalar(distance * distance));

            }
        }

        return c;
    }
}

export {Flock, Boid}