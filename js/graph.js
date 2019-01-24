/**
 * GPL-3.0 License
 * Author(s) : Lilian Gallon (N3ROO)
 * Contribute here : https://github.com/N3ROO/Animated-Particles
 */

$(document).ready(function() {
    execute()
});

// Used to create the lines
var DIST_TOLERANCE = 150;
var STROKE_WIDTH = 3;

// Used to move the dots master when an event is detected
var multiplier = 0;

function execute(){
    // Set the size to the canvas the same as the container
    // We prevent smoothing by putting the same dimensions for the
    // canvas and the canvas container
    
    var container_height_str = $("#particles-container").css("height");
    var container_width_str = $("#particles-container").css("width");

    $("#canvas").css("height", container_height_str);
    $("#canvas").css("width", container_width_str);

    var container_height = container_height_str.replace("px", "");
    var container_width = container_width_str.replace("px", "");

    var canvas = document.getElementById("canvas");
    canvas.height = container_height;
    canvas.width = container_width;

    var context = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;

    var dots = [];

    // Init the dots list
    for(var i = 0; i < width/20 ; i++){
        var dot = particle.create(Math.random()*(width-width/20)+width/20,      // x position
                                  Math.random()*(height-height/20)+height/20,   // y position
                                  2,                                            // speed
                                  Math.random()*Math.PI*2);                     // direction

        // We apply the color here that will be different sorts of white
        dot.color = 'hsl(' + (i%10)*30 +',100%,100%)';
        // We give a random size to every dot
        dot.size = Math.random()*3 + 2
        // Some will be faster than other
        dot.setSpeed(dot.size/8)
        // Air friction :o
        dot.friction = 0.1
        // Add this dot to the dot list !
        dots.push(dot)
    }

    update()

    function update(){
        // We clear the canvas
        context.clearRect(0, 0, width, height)

        // For each dot, we will update its position
        for(var dot_index in dots){
            // Change the dots color according to the multiplier
            dots[dot_index].color='hsl(' + (dot_index%5)*60 + ',100%,a%)'.replace('a',Number(100 - 14*multiplier) > 50 ? Number(100 - 14*multiplier) : 50)
            
            // Update the dot position
            dots[dot_index].update()
            
            var radius = calculate_size(dots[dot_index])/2 + 1
            // Change the direction of the dots if they hit the borders
            if(dots[dot_index].x + radius > width || dots[dot_index].x - radius < 0){
                dots[dot_index].vx *= -1
                dots[dot_index].x = dots[dot_index].x + radius > width ? width - radius : radius
            }
            if(dots[dot_index].y + radius > height || dots[dot_index].y - radius < 0){
                dots[dot_index].vy *= - 1
                dots[dot_index].y = dots[dot_index].y + radius > height ? height - radius : radius
            }

            context.beginPath()

            // Creates the circle that represents a dot with its color
            context.fillStyle = dots[dot_index].color
            context.arc(dots[dot_index].x, dots[dot_index].y,
                        calculate_size(dots[dot_index]),
                        0,
                        Math.PI*2, false);
            
            // Sets its speed (if the multiplier changed otherwise it will stay the same)
            dots[dot_index].setSpeed(dots[dot_index].size / 4 + multiplier * 20)

            // Draw !
            context.fill()
            context.closePath()

            // Draw the lines if the dots are close enough
            for(var neighbor_index in dots){
                if(neighbor_index != dot_index){
                    // Retrieve the distance
                    var dist = dots[dot_index].distanceTo(dots[neighbor_index])
                    if(dist < DIST_TOLERANCE){
                        // Create the line ...
                        context.beginPath()
                        context.strokeWidth = STROKE_WIDTH
                        context.strokeStyle="rgba(255,255,255,opacity)".replace("opacity", 1 - dist/DIST_TOLERANCE);
                        context.moveTo(dots[dot_index].x,dots[dot_index].y)
                        context.lineTo(dots[neighbor_index].x,dots[neighbor_index].y)
                        context.stroke()
                    }
                }
            }
        }
        // Tells the browser that we wish to perform an animation and requests that the browser call a specified 
        // function to update an animation before the next repaint.
        requestAnimationFrame(update)
    }

    function calculate_size(dot){
        return dot.size + 4*multiplier < 20 ? dot.size + 4 *multiplier : 20;
    }

    // On a resize, we need to update everything otherwise some dots could be outside
    window.onresize=function(){
        var container_height_str = $("#particles-container").css("height");
        var container_width_str = $("#particles-container").css("width");

        $("#canvas").css("height", container_height_str);
        $("#canvas").css("width", container_width_str);

        var container_height = container_height_str.replace("px", "");
        var container_width = container_width_str.replace("px", "");

        var canvas=document.getElementById("canvas");
        canvas.height = container_height;
        canvas.width = container_width;

        width = canvas.width;
        height = canvas.height;
        dots = []
        for(var i = 0; i < width/20; i++){
            var dot = particle.create(Math.random()*(width - width/20) + width/20,
                                      Math.random()*(height - height/20) + height/20,
                                      2,
                                      Math.random()*Math.PI*2);
            dot.color = 'hsl(' + (i%10)*30 + ',100%,100%)';
            dot.size = Math.random()*3 + 2
            dot.setSpeed(dot.size / 8)
            dot.friction = 0.1
            dots.push(dot)
        }
    }

    // Dynamic!!!!!
    $('#particles-container').bind("mouseover", function() {
        multiplier = 1
    });
    
    $('#particles-container').bind("mouseout",function() {
        multiplier = 0
    });    
}

