import {Application, Renderer, Sprite, Texture, utils} from "pixi"
import "victor"

const maxVelocity = 3;
const maxAcceleration = 0.1;

const cohesionWeight = 1;
const separationWeight = 500;
const alignmentWeight = 15;

const visibleRange = 100;

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

            let acceleration = boid.run(this.flock);

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
        let neighbors = this.findNeighbor(flock);

        let a1 = this.cohesion(neighbors).multiplyScalar(cohesionWeight);
        let a2 = this.separation(neighbors).multiplyScalar(separationWeight);
        let a3 = this.alignment(neighbors).multiplyScalar(alignmentWeight);

        this.acceleration = a1.add(a2).add(a3);

        if (this.acceleration.length() > maxAcceleration) {
            this.acceleration.normalize().multiplyScalar(maxAcceleration)
        }

        return(this.acceleration);
    }

    /**
     * 
     * @param {Boid[]} flock 
     * @returns Boid[]
     */
    findNeighbor(flock)
    {
        return flock.filter(boid => boid !== this && this.position.distance(boid.position) < visibleRange);
    }

    /**
     *
     * @param {Boid[]} neighbors
     * @returns {Victor}
     */
    cohesion(neighbors) {
        return neighbors.length > 0 ? 
            neighbors
                .reduce((a, b) => a.add(b.position), Victor().zero())
                .divideScalar(neighbors.length)
                .subtract(this.position) : 
            Victor().zero();
    }

    /**
     *
     * @param {Boid[]} neighbors
     * @returns {Victor}
     */
    alignment(neighbors) {
        return neighbors.length > 0 ? 
            neighbors
                .reduce((a, b) => a.add(b.velocity), Victor())
                .divideScalar(neighbors.length)
                .subtract(this.velocity)
                .mix(this.velocity, 0.2) : 
            this.velocity;
    }

    /**
     *
     * @param {Boid[]} neighbors
     * @returns {Victor}
     */
    separation(neighbors) {
        return neighbors.reduce((a, b) => 
            a.add(
                this.position
                    .clone()
                    .subtract(b.position)
                    .divideScalar(this.position.distanceSq(b.position))), 
                Victor().zero());
    }
}

export {Flock, Boid}