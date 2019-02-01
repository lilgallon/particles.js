# particles.js
![tag](https://img.shields.io/github/tag/n3roo/nero-engine.svg)
![size](https://img.shields.io/github/size/:user/:repo/:path.svg)
![issues](https://img.shields.io/github/issues/n3roo/nero-engine.svg)
![license](https://img.shields.io/github/license/n3roo/nero-engine.svg)

An easy way to make your website sexy with particle backgrounds.

## Description

I made this script to make my website look "modern". I decided to release the script to improve it from time to time.

Main features :
- Highly customizable,
- Easy to install,
- Pure javascript (no dependencies),
- Lightweight,
- Compatible with all browsers.

## How to use it

- Download the [lastest version](https://github.com/N3ROO/particles.js).
- Include the script in your HTML.
```html
<script src="path/particles.js"></script>
<!-- or -->
<script src="path/particles.min.js"></script>
```

- Add a canvas in a container where you want the particle background to be. The canvas will automatically be scaled with the parent container.
```html
<!-- Here, the canvas will fit the <div> container -->
<div>
    <canvas id="canvas-id"></canvas>
</div>
```

- Execute the script. If you don't know where to put this, put it just before the `</body>` tag.
```html
<script>
    (function() {
        let particlesHandler = new ParticlesHandler("particles-canvas");
        particlesHandler.start();
    })();
</script>
```

- Here are all the functions that you may use :

**Function**|**Description**
:-----:|:-----:
ParticlesHandler(canvas-id, settings)|It creates the class attributes.
start()|If first call : it initializes the particles with the settings (if set), and starts the loop. Otherwise it resumes the loop.
stop()|It stops the loop (all the particles are frozen).
setMultiplierIn(multiplierIn)|Change multiplier when the mouse is in the canvas.
setMultiplierOut(multiplierOut)|Change multiplier when the mouse out of the canvas.

- Go to the [github wiki](https://github.com/N3ROO/particles.js/wiki) for more details.

## How to customize it

To simplify the customization, we use an object written this way :

```javascript
let settings = {
    // Handler settings (-1 = default)
    amount: -1, // number of particles
    tolerance: -1, // distance from which lines will be drawn
    lineWidth: -1, // width of the lines between particles

    // Particles settings (random between min and max, both included)
    // the size of a particle
    sizeMin: -1,
    sizeMax: -1,
    // position of a particle
    positionXMin: -1,
    positionXMax: -1,
    positionYMin: -1,
    positionYMax: -1,
    // speed of a particle
    speedMin: -1,
    speedMax: -1, 
    // direction of a particle (in radians)
    directionMin: -1,
    directionMax: -1,
    // color of a particle (HSL color from 0 to 360)
    colorMin: -1,
    colorMax: -1,

    // Interaction settings (if the mouse goes in or out of the canvas)
    multiplierIn: -1, // multiplier if the mouse is in the canvas
    multiplierOut: -1 // multiplier if the mouse is out of the canvas
};
```

Then, add it to the ParticleHandler constructor :
```javascript
    let settings = { }; // customize everything in here
    let particlesHandler = new ParticlesHandler("particles-canvas", settings);
    particlesHandler.start();
```

**Setting**|**Description**
:-----:|:-----:
amount|The amount of particles
tolerance|Distance from which lines between particles will be drawn (in pixels)
lineWidth|Width of the lines between particles (in pixels)
sizeMin|The minimum size of a particle (radius in pixels)
sizeMax|The maximum size of a particle (radius in pixels)
positionXMin|The minimum X position for a particle (in pixels)
positionXMax|The maximum X position for a particle (in pixels)
positionYMin|The minimum Y position for a particle (in pixels)
positionYMax|The maximum X position for a particle (in pixels)
speedMin|The minimum speed of a particle (in pixels per animation request)
speedMax|The maximum speed of a particle (in pixels per animation request)
directionMin|The minimum direction of a particle (in radians)
directionMax|The maximum direction of a particle (in radians)
colorMin|The minimum color of a particle (HSL color from 0 to 360)
colorMax|The maximum color of a particle (HSL color from 0 to 360)
multiplierIn|The minimum multiplier of a particle (when the mouse is over)
multiplierOut|The maximum multiplier of a particle (when the mouse is out)

Things to know :
- **Default value** : If you want the default value, leave "-1" to the setting concerned.
- **Min max** : A value is taken randomly in [min; max] range (both min and max are included). Put same value as min and max if you don't want a random value.
- **Multiplier** : It is used to give a "dynamic" look to the particles. You can change the effects when the mouse is in or out of the canvas.
- **Colors** : Initially, the color of all the particles is white since their luminosity is set to 100%. But further is the multiplier from 1.0, darker the particles are. So the particle colors can be seen when the mouse is over the canvas. This feature will be customizable in the next versions.

## Contribution

You can contribute to improve the project as long as your code is clean. I am not a Javascript specialist, I don't know the conventions or anything. Fork the project, and make a pull request, and I will check it as soon as possible.

## Credits

- Lilian Gallon (N3ROO)
