/**
 * GPL-3.0 License
 * Author(s) : Lilian Gallon (N3ROO)
 * Contribute here : https://github.com/N3ROO/particles.js
 * Troubleshooting : Instructions are available on the github page.
 */

 /**
  * It sets up the environment, and handle all the particles.
  */
class ParticlesHandler{

    /**
     * It creates a graph is the specified canvas.
     * @param canvas_id id of the canvas where we will draw.
     *      No modifications will be done on this canvas. You can even
     *      do something else on it, the particles will be drawn over it.
     */
    constructor(canvas_id){
        this.canvas_id = canvas_id;
        this.running = false;
        this.starting = false;

        this.DIST_TOLERANCE = 150;
        this.STROKE_WIDTH = 3;

        // Event handling
        this.isMouseOver = false;
        let self = this;
        document.getElementById(this.canvas_id).addEventListener("mouseover", self.mouseOver.bind(this), false);
        document.getElementById(this.canvas_id).addEventListener("mouseout", self.mouseOut.bind(this), false);
    }

    /**
     * Starts the graph (or resume it)
     */
    start(){
        this.running = true;
        this.starting = true;
        this.run();
    }

    /**
     * Stops the graph.
     */
    stop(){
        this.running = false;
    }

    /**
     * This is the loop function.
     */
    run(){
        if(this.starting) {
            this.init();
            this.initParticleList(this.canvas.width / 20);
            this.starting = false;
        }

        this.update();
        this.draw();

        if(this.running){
            this.requestRedraw();
        }
    }

    /**
     * Tells the browser that we wish to perform an animation and requests that the browser call a specified function
     * to update an animation before the next repaint.
     */
    requestRedraw(){
        // We use a workaround to not lose the context (ParticlesHandler)
        let self = this;
        window.requestAnimationFrame(function () {self.run()});
    }

    /**
     * Used to init all the variables used to run the graph.
     */
    init(){
        // We need to retrieve the canvas information
        this.canvas = document.getElementById(this.canvas_id);
        
        // Make it visually fill the positioned parent
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        // ...then set the internal size to match
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        // Now we can get the information
        this.context = this.canvas.getContext("2d");


        // We need a variable to store all the particles
        this.particles = [];
    }

    /**
     * Used to create particles of given amount.
     * @param {number} amount of particles.
     */
    initParticleList(amount){

        for(let i = 0; i < amount; i++){

            // We create the size first since we will use it to find the positions
            let size = ParticlesHandler.random(2, 6);

            // Position (make sure that it is not out of bounds)
            let x = ParticlesHandler.random(size + 1, this.canvas.width - size);
            let y = ParticlesHandler.random(size + 1, this.canvas.height - size);

            // Then, we need the velocity vector (speed and direction)
            let speed = ParticlesHandler.random(0.1, 1);
            let direction = Math.random() * Math.PI * 2;

            let color = ParticlesHandler.random(0, 361);

            // Now we can create the particle
            let dot = new Particle(x, y, size, speed, direction, color);

            // Add this dot to the particle list
            this.particles.push(dot)
        }
    }

    /**
     * It updates all the particles (positions and springs).
     */
    update(){
        for(let index in this.particles){
            this.particles[index].update(this.canvas.width, this.canvas.height);
        }
    }

    /**
     * It draws all the particles.
     */
    draw(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(let index in this.particles){
            // We need to draw the springs between particles before them otherwise, the springs
            // will be over and not under the particles
            for(let neighbor_index in this.particles){
                if(neighbor_index !== index){
                    // Retrieve the distance
                    let dist = this.particles[index].distanceTo(this.particles[neighbor_index]);

                    if(dist < this.DIST_TOLERANCE){
                        // Draw the spring
                        this.context.beginPath();
                        this.context.strokeWidth = this.STROKE_WIDTH;
                        this.context.strokeStyle = "rgba(255,255,255," + (1 - dist/this.DIST_TOLERANCE) + ")";
                        this.context.moveTo(this.particles[index].x, this.particles[index].y);
                        this.context.lineTo(this.particles[neighbor_index].x, this.particles[neighbor_index].y);
                        this.context.stroke();
                        this.context.closePath();
                    }
                }
            }
        }

        // We draw it here so the springs are under the particles
        for(let index in this.particles){
            this.particles[index].draw(this.context);
        }
    }

    /**
     * Called when the mouse is over the canvas.
     */
    mouseOver(){
        // We make sure that we apply the multiplier only once, and not
        // at every tick when the mouse is over.
        if(!this.isMouseOver) {
            for (let index in this.particles) {
                this.particles[index].setMultiplier(1.5);
            }
            this.isMouseOver = true;
        }
    }

    /**
     * Called when the mouse is out of the canvas.
     */
    mouseOut(){
        // We make sure that we apply the multiplier only once, and not
        // at every tick when the mouse is out.
        if(this.isMouseOver) {
            for (let index in this.particles) {
                this.particles[index].setMultiplier(1);
            }
            this.isMouseOver = false;
        }
    }

    /**
     * Gives a random number between min and max [min; max[.
     * @param min,
     * @param max.
     */
    static random(min, max){
        return Math.random() * (max - min) + min;
    }
}

/**
 * All the particle properties are in this class.
 */
class Particle{

    /**
     * Creates a particle.
     * @param {number} x position on horizontal axis,
     * @param {number} y position on vertical axis,
     * @param {number} size the size of the particle,
     * @param {number} speed the speed obviously,
     * @param {number} direction in radians,
     * @param {number} color hsl color.
     * @constructor
     */
    constructor(x, y, size, speed, direction, color){
        this.x = x;
        this.y = y;

        this.size = size;

        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;

        this.color = color;

        this.multiplier = 1;

        return this;
    }

    /**
     * It moves the particle by taking in account its environment.
     * @param {number} width in pixels of the environment,
     * @param {number} height in pixels of the environment.
     */
    update(width, height){

        let multiplier_increment = 0;
        if(this.multiplier !== 1){
            multiplier_increment = this.multiplier / 2;
        }

        this.setSpeed(this.getSpeed() + multiplier_increment);

        // Change the position of the particles according to the borders
        if(this.x + this.size > width || this.x - this.size < 0){
            this.vx *= -1;
            this.x = this.x + this.size > width ? width - this.size : this.size
        }else{
            this.x += this.vx;
        }

        if(this.y + this.size > height || this.y - this.size < 0){
            this.vy *= - 1;
            this.y = this.y + this.size > height ? height - this.size : this.size
        }else{
            this.y += this.vy;
        }

        this.setSpeed(this.getSpeed() - multiplier_increment);
    }

    /**
     * It draws the particle with all its properties.
     * @param {canvas 2D context} context used to draw on the canvas.
     */
    draw(context){
        context.beginPath();

        // Figure
        context.arc(this.x, this.y, this.getSize(), 0,Math.PI*2, false);

        // Coloration
        let brightness = 100;
        if(this.multiplier > 1){
            // TODO: check if it is okay (10: magic number)
            brightness = 100 - (this.multiplier * 10);
        }

        context.fillStyle = 'hsl(' + this.color + ', 100%, ' + brightness + '%, 100%)';
        context.fill();

        context.closePath();
    }

    /**
     * @returns {number} the size of the particle by taking in account the current multiplier.
     */
    getSize(){
        return this.size * this.multiplier;
    }

    /**
     * @returns {number} : speed of the particle.
     */
    getSpeed(){
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }

    /**
     * Changes the speed of the particle.
     * @param {number} speed new speed.
     */
    setSpeed(speed){
        // Set the speed
        const direction = this.getDirection();
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
    }

    /**
     * @returns {number} : the direction of the particle (radians).
     */
    getDirection(){
        return Math.atan2(this.vy, this.vx);
    }

    /**
     * Changes the direction of the particle.
     * @param {number} direction new direction (radians).
     */
    setDirection(direction){
        const speed = this.getSpeed();
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
    }

    /**
     * Changes the current multiplier of the particle.
     * @param {number} multiplier (1 = default).
     */
    setMultiplier(multiplier){
        this.multiplier = multiplier;
    }

    /**
     * Gives the distance between this particle and the given one.
     * @param {Particle} particle,
     * @returns {number} : distance to the specified particle.
     */
    distanceTo(particle){
        let dx = particle.x - this.x;
        let dy = particle.y - this.y;
        return Math.sqrt(dx*dx + dy*dy);
    }
}