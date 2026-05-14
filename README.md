# This is slider-constructor project

## User guide

To start use this slider you must import  
constructor to your main JS file with this instruction:  
`import { Slider } from 'your-path/Slider.js';`

After that you have to initialize slider with this instruction:  
`const yourSlider = new Slider('#slider-wrapper)`.

Pay attention, that instruction above initiate slider  
with all navigation elements e.g. arrows, dots, autoPlay on.

If you require to turn off any of these elements you must  
pass a settings object. Full list of settings given below:  
`const yourSlider = new Slider('#slider-wrapper, {`  
 &emsp;`maxWidth: '500px',`&emsp;-- 700px is default value  
 &emsp;`autoPlay: false,`&emsp;&emsp;-- true is default value  
 &emsp;`interval: 3000,`&emsp;&emsp;&ensp;-- 3000 (3 seconds) is default  
 &emsp;`showDots: false,`&emsp;&emsp;-- true is default value  
 &emsp;`showArrows: false,`&ensp;&ensp;-- true is default value  
`})`.

## CSS classes and id to style

`#slider-wrapper`  
`.slider-btn`  
`.next-slide`  
`.prev-slide`  
`.slider-bullets`  
`.slider-bullets__bullet`  
`.slider-bullets__bullet.active`
