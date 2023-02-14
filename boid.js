import { Application, Sprite, Texture } from './pixi.mjs'
import './Victor.js'
//import Victor from './Victor.js';

const maxVelocity = 2;
const maxAcceleration = maxVelocity * 0.1;

const cohesionWeight = 1;
const separationWeight = 5;
const alignmentWeight = 10;

const cohesionRange = 200;
const alignmentRange = 200;

const separateRange = 100;

class Flock
{
    /**
     * 
     * @param {Number} numBoids 
     * @param {Application} pixiApp 
     */
    constructor(numBoids, pixiApp)
    {
        /**
         * @type {Boid[]}
         */
        this.flock = []
        for(let i = 0; i < numBoids; i++)
        {
            let b = new Boid(Victor().randomize(Victor(0, 0), Victor(pixiApp.renderer.width, pixiApp.renderer.height)), pixiApp);
            this.flock.push(b);
        }
    }

    run(pixiApp)
    {
        for(let boid of this.flock)
        {
            boid.run(this.flock, pixiApp.renderer.width, pixiApp.renderer.height);
        }
    }
}

class Boid {
    /**
     * 
     * @param {Victor} position 
     * @param {Application} app 
     */
    constructor(position, app) {


        /** @type{Victor} */ this.position = position;


        /** @type{Victor} */ this.velocity = Victor().randomize(Victor(-maxVelocity, -maxVelocity), Victor(maxVelocity, maxVelocity));

        /** @type{Victor} */ this.acceleration = new Victor();

        /** @type{Sprite} */ this.img = new Sprite(Texture.from('Arrow.png'));

        this.img.scale.set(0.5);
        this.img.anchor.set(0.5);

        app.stage.addChild(this.img);
    }

    /**
     *  
     * @param {Boid[]} flock 
     * @param {Number} width 
     * @param {Number} height 
     */
    run(flock, width, height) {
        let a1 = this.cohesion(flock).multiplyScalar(cohesionWeight);
        let a2 = this.separation(flock).multiplyScalar(separationWeight);
        let a3 = this.alignment(flock).multiplyScalar(alignmentWeight);

        this.acceleration = a1.add(a2).add(a3);

        if (this.acceleration.length() > maxAcceleration) {
            this.acceleration.normalize().multiplyScalar(maxAcceleration)
        }

        // console.log(this.acceleration)

        this.velocity.add(this.acceleration).normalize().multiplyScalar(maxVelocity)


        this.position.add(this.velocity);

        this.img.rotation = this.velocity.horizontalAngle() + Math.PI * 0.5;

        if (this.position.x < 0) this.position.x = width;
        if (this.position.y < 0) this.position.y = height;
        if (this.position.x > width) this.position.x = 0;
        if (this.position.y > height) this.position.y = 0;

        this.img.x = this.position.x;
        this.img.y = this.position.y;
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
            if (boid !== this && this.position.distance(boid.position) < cohesionRange) {
                perceivedCenter.add(boid.position);
                count++
            }
        }

        return count > 0 ? perceivedCenter.divideScalar(count).subtract(this.position).mix(this.velocity, 0.2) : Victor().zero();
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
            if (boid !== this && this.position.distance(boid.position) < alignmentRange) {
                perceivedVelocity.add(boid.velocity);
                count++;
            }
        }


        return count > 0 ? perceivedVelocity.divideScalar(count).subtract(this.velocity) : this.velocity;
    }

    /**
     * 
     * @param {Boid[]} flock 
     * @returns {Victor}
     */
    separation(flock) {
        let c = Victor().zero()

        for (const boid of flock) {
            if (boid !== this && this.position.distance(boid.position) < separateRange)
            {
                let distance = this.position.distance(boid.position);
                if (distance < separateRange) {
                    c.add(this.position.clone().subtract(boid.position).divideScalar(distance));
                }
            }
        }

        return c;
    }
}

export { Flock, Boid }