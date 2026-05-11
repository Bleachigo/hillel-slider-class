# This is the slider/carousel project

## User guide:

To start use this slider you must import  
class to your main JS file with this instruction:  
`import { Slider } from 'your-path/Slider.js';`

After that you have to initialize slider with this instruction:
`const yourSlider = new Slider('#slider-wrapper)`.

Pay attention, that instruction above initiate slider  
with all navigation elements e.g. arrows, dots, autoPlay on.

If you require to turn off any of these elements you must  
pass an settings object. Full list of settings given below:  
`const yourSlider = new Slider('#slider-wrapper, {  
  maxWidth: '500px',  -- 400px is default value  
  autoPlay: false,    -- true is default value  
  interval: 3000,     -- 3000 (3 seconds) is default  
  showDots: false,    -- true is default value  
  showArrows: false,  -- true is default value  
})`.
