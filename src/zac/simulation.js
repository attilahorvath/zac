'use strict';

import Renderer from './renderer';
import Body from './body';

class Simulation {
  constructor() {
    this.renderer = new Renderer();

    this.body = new Body(this);
  }

  run() {
    this.lastTime = 0;

    requestAnimationFrame(timestamp => this.loop(timestamp));
  }

  loop(currentTime) {
    requestAnimationFrame(timestamp => this.loop(timestamp));

    let deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.body.integrate(deltaTime);

    this.renderer.clear();

    this.body.draw();
  }
}

export default Simulation;
