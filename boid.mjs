import{Application,Renderer,Sprite,Texture,utils}from"pixi";import"victor";const maxVelocity=3,maxAcceleration=.1,maxAccelSq=.1*.1,cohesionWeight=1,separationWeight=500,alignmentWeight=15,visibleRange=100,visibleRangeSq=1e4,separateRange=50,separateRangeSq=2500;class Flock{constructor(numBoids,pixiApp){this.flock=new Array(numBoids),this.sprites=new Array(numBoids),this.pixiRenderer=pixiApp.renderer;for(let i=0;i<numBoids;i++){this.flock[i]=new Boid(Victor().randomize(Victor(0,0),Victor(this.pixiRenderer.width,this.pixiRenderer.height)));let s=new Sprite(Texture.from("Arrow.png"));s.scale.set(.3),s.anchor.set(.5),pixiApp.stage.addChild(s),this.sprites[i]=s}}run(){for(let i=0;i<this.flock.length;i++){let boid=this.flock[i],sprite=this.sprites[i],acceleration=boid.run(this.flock);boid.velocity.add(acceleration).normalize().multiplyScalar(3),boid.position.add(boid.velocity),sprite.rotation=boid.velocity.horizontalAngle()+.5*Math.PI,boid.position.x<0&&(boid.position.x=this.pixiRenderer.width),boid.position.y<0&&(boid.position.y=this.pixiRenderer.height),boid.position.x>this.pixiRenderer.width&&(boid.position.x=0),boid.position.y>this.pixiRenderer.height&&(boid.position.y=0),sprite.x=boid.position.x,sprite.y=boid.position.y;let tmp=boid.velocity.clone().normalize();sprite.tint=utils.rgb2hex([0,Math.cos(tmp.x),Math.cos(tmp.y)])}}}class Boid{constructor(position){this.position=position,this.velocity=Victor().randomize(Victor(-3,-3),Victor(3,3))}run(flock){let neighbors=this.findNeighbor(flock),a1=this.cohesion(neighbors).multiplyScalar(1),a2=this.separation(neighbors).multiplyScalar(500),a3=this.alignment(neighbors).multiplyScalar(15);return this.acceleration=a1.add(a2).add(a3),this.acceleration.lengthSq()>maxAccelSq&&this.acceleration.normalize().multiplyScalar(.1),this.acceleration}findNeighbor(flock){return flock.filter((boid=>boid!==this&&this.position.distanceSq(boid.position)<1e4))}cohesion(neighbors){return neighbors.length>0?neighbors.reduce(((a,b)=>a.add(b.position)),Victor().zero()).divideScalar(neighbors.length).subtract(this.position):Victor().zero()}alignment(neighbors){return neighbors.length>0?neighbors.reduce(((a,b)=>a.add(b.velocity)),Victor()).divideScalar(neighbors.length).subtract(this.velocity).mix(this.velocity,.2):this.velocity}separation(neighbors){return neighbors.filter((boid=>this.position.distanceSq(boid.position)<2500)).reduce(((a,b)=>a.add(this.position.clone().subtract(b.position).divideScalar(this.position.distanceSq(b.position)))),Victor().zero())}}export{Flock,Boid};