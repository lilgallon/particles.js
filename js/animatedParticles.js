/**
 * GPL-3.0 License
 * Author(s) : Lilian Gallon (N3ROO)
 * Contribute here : https://github.com/N3ROO/Animated-Particles
 * Troubleshooting : Instructions are available on the github page.
 */

class AnimatedParticles{

    /**
     * It creates a graph is the specified canvas
     * @param canvas_id id of the canvas where we will draw (no modifications will be done on this canvas. You can even
     * do something else on it, the particles will be drawn over it)
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
     * Start the graph (or resume it)
     */
    start(){
        this.running = true;
        this.starting = true;
        this.run();
    }

    /**
     * Stop the graph
     */
    stop(){
        this.running = false;
    }

    /**
     * This is the loop function
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
     *  Tells the browser that we wish to perform an animation and requests that the browser call a specified function
     *  to update an animation before the next repaint.
     */
    requestRedraw(){
        // We use a workaround to not lose the context (AnimatedParticle)
        let self = this;
        window.requestAnimationFrame(function () {self.run()});
    }

    /**
     * Used to init all the variables used to run the graph
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
     * Used to create particles of given amount
     * @param amount of particles
     */
    initParticleList(amount){

        for(let i = 0; i < amount; i++){

            // We create the size first since we will use it to find the positions
            let size = AnimatedParticles.random(2, 6);

            // Position (make sure that it is not out of bounds)
            let x = AnimatedParticles.random(size + 1, this.canvas.width - size);
            let y = AnimatedParticles.random(size + 1, this.canvas.height - size);

            // Then, we need the velocity vector (speed and direction)
            let speed = AnimatedParticles.random(0.1, 1);
            let direction = Math.random() * Math.PI * 2;

            let color = AnimatedParticles.random(0, 361);

            // Now we can create the particle
            let dot = new Particle(x, y, size, speed, direction, color);

            // Add this dot to the particle list
            this.particles.push(dot)
        }
    }

    /**
     * It updates all the particles (positions and springs)
     */
    update(){
        for(let index in this.particles){
            this.particles[index].update(this.canvas.width, this.canvas.height);
        }
    }

    /**
     * It draws all the particles
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

    mouseOver(){
        if(!this.isMouseOver) {
            for (let index in this.particles) {
                this.particles[index].setMultiplier(1.5);
            }
            this.isMouseOver = true;
        }
    }

    mouseOut(){
        if(this.isMouseOver) {
            for (let index in this.particles) {
                this.particles[index].setMultiplier(1);
            }
            this.isMouseOver = false;
        }
    }

    /**
     * Gives a random number between min and max [min; max[
     * @param min
     * @param max
     */
    static random(min, max){
        return Math.random() * (max - min) + min;
    }
}

