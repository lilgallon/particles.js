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

## How to customize it

To simplify the customization, we use an object written this way:
```javascript
let settings = {
    // Handler settings
    amount: val, // number of particles
    tolerance: val, // distance from which lines will be drawn
    lineWidth: val, // width of the lines between particles

    // Particles settings (random between min and max)
    size: [min, max], // the size of particle
    position: [min, max], // position of a particle
    speed: [min, max], // speed of a particle
    direction: [min, max], // direction of a particle (in radians)
    color: [min, max], // color of a particle (HSL color from 0 to 360)

    // Interaction settings (if the mouse goes in or out of the canvas)
    multiplierIn: value, // multiplier if the mouse is in the canvas
    multiplierOut: value // multiplier if the mouse is out of the canvas
}
```

> TODO: explain the colors

> TODO: explain the multipliers

> TODO: finish documentation

## Contribution

You can contribute to improve the project as long as your code is clean. I am not a Javascript specialist, I don't know the conventions or anything. Fork the project, and make a pull request, and I will check it as soon as possible.

## Credits

- Lilian Gallon (N3ROO)
