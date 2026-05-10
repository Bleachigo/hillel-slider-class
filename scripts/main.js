import { Slider } from './Slider.js';

const mySlider = new Slider('#slider-wrapper', {
  interval: 3000,
  showArrows: true,
  showDots: true,
  autoPlay: true,
  maxWidth: '800px',
});
