'use strict';

import Renderer from './renderer';
import Body from './body';

const timestep = 10;

class Simulation {
  constructor() {
    this.renderer = new Renderer();

    this.body = new Body(this);
  }

  run() {
    this.lastTime = 0;
    this.timeAccumulator = 0;

    requestAnimationFrame(timestamp => this.loop(timestamp));
  }

  loop(currentTime) {
    requestAnimationFrame(timestamp => this.loop(timestamp));

    let deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.timeAccumulator += deltaTime;

    while (this.timeAccumulator >= timestep) {
      this.body.integrate(timestep);

      this.timeAccumulator -= timestep;
    }

    this.renderer.clear();

    this.body.draw(this.timeAccumulator / timestep);
  }
}

export default Simulation;
