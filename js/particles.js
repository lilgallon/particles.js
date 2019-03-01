/**
 * particles.js
 * Current version : 1.3
 * Author(s) : Lilian Gallon (N3ROO)
 * Troubleshooting : Instructions are available on the github page.
 * Contribute here : https://github.com/N3ROO/particles.js
 * GPL-3.0 License
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
     * @param settings all the settings are stored in this variable. Check
     *      github for details.
     * @param verbose the script writes what is happenning to the console.
     */
    constructor(canvas_id, settings, verbose){
        this.canvas_id = canvas_id;
        this.running = false;
        this.starting = false;
        this.resizing = false;

        // We will need to check the settings juste before starting the loop
        this.settings = settings;

        // Used to troubleshoot
        if(verbose === undefined){
            this.verbose = false;
        }else{
            this.verbose = verbose;
        }

        // Event handling
        this.isMouseOver = false;
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
     * @param {number} multiplierIn multiplier when the mouse is in the canvas.
     */
    setMultiplierIn(multiplierIn){
        this.settings.multiplierIn = multiplierIn;
    }

    /**
     * @param {number} multiplierOut multiplier when the mouse is out of the canvas.
     */
    setMultiplierOut(multiplierOut){
        this.settings.multiplierOut = multiplierOut;
    }

    /**
     * This is the loop function.
     */
    run(){
        if(this.starting) {
            if(this.verbose){
                console.log("First start, we need to init everything.");
            }

            this.init();
            this.initParticleList();
            this.starting = false;

            if(this.verbose && this.running){
                console.log("Everything is ready.");
            }else if(this.verbose){
                console.log("A problem occurred during init.");
            }
        }

        // It could have been cancelled during init if an error occurred
        if(this.running){
            this.update();
            this.draw();

            this.requestRedraw();
        }else{
            if(this.verbose){
                console.log("Loop stopped.");
            }
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
        if(this.verbose){
            console.log("particlesHandler initialization.");
        }

        // We need to retrieve the canvas information
        this.canvas = document.getElementById(this.canvas_id);
        if(this.canvas === null){
            console.error({
                error: "The canvas id '" + this.canvas_id + "' was not found.",
                troubleshooting: "Make sure that it is spelled corretly, and that it does not have the # prefix.",
                impact: "Cancelling particlesHandler initialization."
            });
            this.stop();
            return;
        }

        // Make it visually fill the positioned parent
        this.canvas.width = window.getComputedStyle(this.canvas.parentNode).getPropertyValue("width").replace("px", "");
        this.canvas.height = window.getComputedStyle(this.canvas.parentNode).getPropertyValue("height").replace("px", "");
        this.canvas.style.width = window.getComputedStyle(this.canvas.parentNode).getPropertyValue("width");
        this.canvas.style.height = window.getComputedStyle(this.canvas.parentNode).getPropertyValue("height");

        if(this.canvas.width === 0 || this.canvas.height === 0){
            let error_msg = "";
            if(this.canvas.width === 0){
                error_msg += "The canvas as a width of 0. ";
            }
            if(this.canvas.height === 0){
                error_msg += "The canvas as an height of 0. ";
            }

            console.error({
                error: error_msg,
                troubleshooting: "Make sure that the canvas is in a parent div and that the parent div has a non-null size.",
                impact: "Cancelling particlesHandler initialization."
            });
            this.stop();
            return;
        }

        if(this.verbose){
            console.log("Canvas size (w, h) : (" + this.canvas.width + "," + this.canvas.height + ")");
        }

        // Now we can get the information
        this.context = this.canvas.getContext("2d");

        this.loadSettings(this.settings);

        // Check if it is disabled on mobile and if the user uses a mobile
        if(this.settings.disableOnMobile === 1){
            if(this.isOnMobile()){
                if(this.verbose){
                    console.log("The particles script is disabled for mobile users.")
                }
                this.stop();
                return;
            }
        }

        // Set up mouse event listeners
        let self = this;
        this.canvas.parentElement.addEventListener("mouseover", self.mouseOver.bind(this), false);
        this.canvas.parentElement.addEventListener("mouseout", self.mouseOut.bind(this), false);

        // Resize event listener
        window.addEventListener('resize', self.onResize.bind(this));
    }

    /**
     * It verifies and loads the settings.
     * @param {object} settings variable with all the settings (check github for details)
     */
    loadSettings(settings){
        if(this.verbose){
            console.log("Loading settings.");
        }

        if(settings === undefined){
            if(this.verbose){
                console.log("Settings variable is undefined, we need to create it.");
            }

            settings = {
                disableOnMobile: -1,
                amount: -1,
                dynamicAmount: -1,
                tolerance: -1,
                lineWidth: -1,
                sizeMin: -1,
                sizeMax: -1,
                positionXMin: -1,
                positionXMax: -1,
                positionYMin: -1,
                positionYMax: -1,
                speedMin: -1,
                speedMax: -1,
                directionMin: -1,
                directionMax: -1,
                colorMin: -1,
                colorMax: -1,
                multiplierIn: -1,
                multiplierOut: -1
            }
        };

        this.loadSetting(settings, "disableOnMobile", 1, 0, 1);

        this.loadSetting(settings, "amount"       , this.canvas.width * this.canvas.height / 6000, 0, Number.MAX_SAFE_INTEGER);
        this.loadSetting(settings, "dynamicAmount", 1, 0, 1);
        this.loadSetting(settings, "tolerance"    , 150, 0, Number.MAX_SAFE_INTEGER);
        this.loadSetting(settings, "lineWidth"    , 3  , 0, Number.MAX_SAFE_INTEGER);

        this.loadSetting(settings, "sizeMin"     , 2, 0, Number.MAX_SAFE_INTEGER);
        this.loadSetting(settings, "sizeMax"     , 6, 0, Number.MAX_SAFE_INTEGER);

        this.loadSetting(settings, "positionXMin", settings.sizeMax + 1, settings.sizeMax + 1, this.canvas.width - settings.sizeMax - 1);
        this.loadSetting(settings, "positionXMax", this.canvas.width - settings.sizeMax, settings.sizeMax + 1, this.canvas.width - settings.sizeMax - 1);
        this.loadSetting(settings, "positionYMin", settings.sizeMax + 1, settings.sizeMax + 1, this.canvas.height - settings.sizeMax - 1);
        this.loadSetting(settings, "positionYMax", this.canvas.height - settings.sizeMax, settings.sizeMax + 1, this.canvas.height - settings.sizeMax - 1);
        this.loadSetting(settings, "speedMin"    , 200, 0, Number.MAX_SAFE_INTEGER);
        this.loadSetting(settings, "speedMax"    , 400, 0, Number.MAX_SAFE_INTEGER);
        this.loadSetting(settings, "directionMin", 0, 0, Math.PI * 2);
        this.loadSetting(settings, "directionMax", Math.PI * 2, 0, Math.PI * 2);
        this.loadSetting(settings, "colorMin"    , 0, 0, 360);
        this.loadSetting(settings, "colorMax"    , 360, 0, 360);

        this.loadSetting(settings, "multiplierIn" , 1.5, 0.001, Number.MAX_SAFE_INTEGER);
        this.loadSetting(settings, "multiplierOut", 1, 0.001, Number.MAX_SAFE_INTEGER);

        this.settings = settings;
    }

    loadSetting(settings, settingName, defaultValue, minValue, maxValue){
        let status;
        if(settings[settingName] === undefined){
            settings[settingName] = defaultValue;
            status = "undefined";
        }else if(settings[settingName] === -1){
            settings[settingName] = defaultValue;
            status = "default";
        }else if(settings[settingName] < minValue){
            settings[settingName] = minValue;
            status = "too low";
        }else if(settings[settingName] > maxValue){
            settings[settingName] = maxValue
            status = "too high";
        }

        if(this.verbose){
            console.log("Loaded setting '" + settingName + "', status : " + status + ".");
        }
        // If none of these statements is reached, it means that the setting is set correctly
    }

    /**
     * Credits : http://detectmobilebrowsers.com/
     * @returns whether or not the user is on a mobile.
     */
    isOnMobile(){
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    /**
     * Used to create particles.
     */
    initParticleList(){

        if(this.verbose){
            console.log("Creating " + this.settings.amount + " particles.");
        }

        this.particles = [];

        for(let i = 0; i < this.settings.amount; i++){

            // We create the size first since we will use it to find the positions
            let size = ParticlesHandler.random(this.settings.sizeMin, this.settings.sizeMax);

            // Position (make sure that it is not out of bounds)
            let x = ParticlesHandler.random(this.settings.positionXMin, this.settings.positionXMax);
            let y = ParticlesHandler.random(this.settings.positionYMin, this.settings.positionYMax);

            // Then, we need the velocity vector (speed and direction)
            let speed = ParticlesHandler.random(this.settings.speedMin, this.settings.speedMax);
            let direction = ParticlesHandler.random(this.settings.directionMin, this.settings.directionMax);

            let color = ParticlesHandler.random(this.settings.colorMin, this.settings.colorMax);

            // Now we can create the particle
            let dot = new Particle(x, y, size, speed / 1000, direction, color);

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

                    if(dist < this.settings.tolerance){
                        // Draw the spring
                        this.context.beginPath();
                        this.context.strokeWidth = this.settings.lineWidth;
                        this.context.strokeStyle = "rgba(255,255,255," + (1 - dist/this.settings.tolerance) + ")";
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
            if(this.verbose){
                console.log("Mouse in, changing multiplier to " + this.settings.multiplierIn + ".");
            }

            for (let index in this.particles) {
                this.particles[index].setMultiplier(this.settings.multiplierIn);
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
            if(this.verbose){
                console.log("Mouse out, changing multiplier to " + this.settings.multiplierOut + ".");
            }

            for (let index in this.particles) {
                this.particles[index].setMultiplier(this.settings.multiplierOut);
            }
            this.isMouseOver = false;
        }
    }

    /**
     * Called when the window is resized.
     */
    onResize(){
        let oldWidth = this.canvas.width;
        let oldHeight = this.canvas.height;

        // Resize canvas
        this.canvas.width = window.getComputedStyle(this.canvas.parentNode).getPropertyValue("width").replace("px", "");
        this.canvas.height = window.getComputedStyle(this.canvas.parentNode).getPropertyValue("height").replace("px", "");
        this.canvas.style.width = window.getComputedStyle(this.canvas.parentNode).getPropertyValue("width");
        this.canvas.style.height = window.getComputedStyle(this.canvas.parentNode).getPropertyValue("height");

        // Fix particles spawning position with new size
        this.settings.positionXMax += this.canvas.width - oldWidth;
        this.settings.positionYMax += this.canvas.height- oldHeight;

        // Update the particles amount proportionally with the new window size
        if(this.settings.dynamicAmount === 1){
            this.settings.amount *= (this.canvas.width * this.canvas.height) / (oldWidth * oldHeight);
        }

        // Recreate particles list
        this.initParticleList();
    }

    /**
     * Gives a random number between min and max [min; max].
     * @param min,
     * @param max.
     */
    static random(min, max){
        return Math.random() * ((max + 1) - min) + min;
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

        context.fillStyle = 'hsl(' + this.color + ', 100%, ' + brightness + '%)';
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