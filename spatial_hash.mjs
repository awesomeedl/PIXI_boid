import "victor"

import { app } from "./main.mjs";
import { Boid, Flock } from "./boid.mjs";
import { visibleRange } from "./boid.mjs";

class SpatialHash {
    constructor() {
        /** @type {number} */
        this.numRows = Math.ceil(app.renderer.height / visibleRange);

        /** @type {number} */
        this.numCols = Math.ceil(app.renderer.width / visibleRange);

        /** @type{Boid[]} */
        this.hashTable = Array.from(Array(this.numRows * this.numCols), () => []);
    }

    /**
     * 
     * @param {Flock} flock 
     */
    refresh(flock) {
        this.numRows = Math.ceil(app.renderer.height / visibleRange);
        this.numCols = Math.ceil(app.renderer.width / visibleRange);
        this.hashTable = Array.from(Array(this.numRows * this.numCols), () => []);

        for (let boid of flock.flock) {
            let index = this.getIndex(boid.position)
            boid.spatialIndex = index;
            this.hashTable[index].push(boid);
        };
    }

    /**
     * 
     * @param {Victor} position 
     * @returns {number}
     */
    getIndex(position) {
        return Math.floor(position.x / visibleRange) + Math.floor(position.y / visibleRange) * this.numCols;
    }

    /**
     * 
     * @param {number} index 
     * @returns {Boid[]}
     */
    getNeighbors(index) {
        let neighbors = [];

        let hasTop = index >= this.numCols;
        let hasBot = (index + this.numCols) < this.hashTable.length;
        let hasLeft = index % this.numCols != 0;
        let hasRight = (index + 1) % this.numCols != 0;

        neighbors.push(...this.hashTable[index]);
        if (hasTop) neighbors.push(...this.hashTable[index - this.numCols]);
        if (hasBot) neighbors.push(...this.hashTable[index + this.numCols]);
        if (hasLeft) neighbors.push(...this.hashTable[index - 1]);
        if (hasRight) neighbors.push(...this.hashTable[index + 1]);
        if (hasTop && hasLeft) neighbors.push(...this.hashTable[index - this.numCols - 1]);
        if (hasTop && hasRight) neighbors.push(...this.hashTable[index - this.numCols + 1]);
        if (hasBot && hasLeft) neighbors.push(...this.hashTable[index + this.numCols - 1]);
        if (hasBot && hasRight) neighbors.push(...this.hashTable[index + this.numCols + 1]);

        return neighbors;
    }
}

export { SpatialHash }