import { Sprite, Texture } from './pixi.mjs'
import './Victor.js'

const maxVelocity = 3;
const maxAcceleration = 0.03;

const cohesionWeight = 1;
const separationWeight = 100.0;
const alignmentWeight = 1;
const separateRange = 500.0;

export default class Boid {
    constructor(position, app) {
        this.position = position;
        this.velocity = Victor().randomize(Victor(-maxVelocity, -maxVelocity), Victor(maxVelocity, maxVelocity));
        this.acceleration = new Victor();

        this.img = new Sprite(Texture.from('Arrow.png'));
        this.img.scale.set(0.5);
        this.img.anchor.set(0.5);

        app.stage.addChild(this.img);
    }

    run(flock, width, height) {
        let a1 = this.cohesion(flock).multiplyScalar(cohesionWeight);
        let a2 = this.separation(flock).multiplyScalar(separationWeight);
        let a3 = this.alignment(flock).multiplyScalar(alignmentWeight);

        this.acceleration = a1.add(a2).add(a3);

        if (this.acceleration.length() > maxAcceleration) {
            this.acceleration.normalize().multiplyScalar(maxAcceleration)
        }

        // console.log(this.acceleration)

        this.velocity.add(this.acceleration);

        if (this.velocity.length() > maxVelocity) {
            this.velocity.normalize().multiplyScalar(maxVelocity)
        }

        this.position.add(this.velocity);

        this.img.rotation = this.velocity.horizontalAngle() + Math.PI * 0.5;

        if (this.position.x < 0) this.position.x = width;
        if (this.position.y < 0) this.position.y = height;
        if (this.position.x > width) this.position.x = 0;
        if (this.position.y > height) this.position.y = 0;

        this.img.x = this.position.x;
        this.img.y = this.position.y;
    }

    cohesion(flock) {
        let perceivedCenter = Victor();
        let count = 0;

        for (const boid of flock) {
            if (boid !== this) {
                perceivedCenter.add(boid.position);
                count++
            }
        }

        if(count > 0)
        {
            perceivedCenter.divideScalar(count);

            return perceivedCenter.subtract(this.position);
        }
        else
        {
            return Victor().zero();
        }
    }

    alignment(flock) {
        let perceivedVelocity = Victor();
        let count = 0;

        for (const boid of flock) {
            if (boid !== this) {
                perceivedVelocity.add(boid.velocity);
                count++;
            }
        }

        if(count > 0)
        {

            perceivedVelocity.divideScalar(count);

            return perceivedVelocity.subtract(this.velocity);
        }
        else
        {
            return Victor().zero();
        }
    }

    separation(flock) {
        let c = Victor().zero()

        for (const boid of flock) {
            if (boid === this) continue;
            let distance = this.position.distance(boid.position);
            if (distance < separateRange) {
                c.add(this.position.clone().subtract(boid.position).divideScalar(distance));
            }

        }

        return c;
    }
}