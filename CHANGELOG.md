## Version 0.1 : 24/01/19

- Ugly code base

## Version 1.0 : 01/02/19

- Huge refactoring,
- Algorithms optimization,
- Removed JQuery,
- Improved compatibility,
- Add ability to customize the particles,
- Detailed verbose to troubelshoot,
- Easier to install,
- Lightweight

## Version 1.1 : 02/02/19

- Fix #5 : The canvas does tear anymore when resizing the window
- Fix #4 : The canvas now fits perfectly the parent container & resizes automatically
- Fix #2 : The default particle amount has been lowered
- Small fix : mouse events are now not added to event list if an error occurred during initialization

## Version 1.2 : 03/02/19

- Fix #6 : The mouse event now listen to the parent container, and not the canvas
- Fix #9 : The spawning position automatically adjusts with the new canvas size if the size changed
- Add : Troubleshoot guide if the canvas is not initially sized correctly

## Version 1.3 : 01/03/19

- Add #12 : Dynamic particles amount (when resizing the window)
- Add #13 : Mobile detection (you can disable the script if the user is using a phone)
- Fix #14 : Particles are not black anymore for user with Microsoft Edge

## Version 1.4 : 16/07/19

**Not backward compatible if you used setMultiplierIn or setMultiplierOut. Here are the details why:**
- setMultiplierIn and setMultiplierOut were removed. Now, you can update in real time any setting:
```javascript
// Retrieve the settings
let settings = particleHandler.settings;
// Update the settings
particleHandler.settings.multiplierIn = 123;
particleHandler.settings.multiplierOut = 456;
// Apply changes
particleHandler.settings = settings;
```
- All the attributes are now private (except settings)

Changes:
- Add #16: Ability to change the springs color (thanks @ElRacoon)
  - New settings: springColorR, springColorG, springColorB
- Add #18: Ability to change & update settings at any time
- Add #19: Ability to set a min and a max amount of particles (useful when using dynamic amount)
- Fix #20: Some methods needed to be private, now they are private following ECMA6

Misc:
- Decreased default amount of particles