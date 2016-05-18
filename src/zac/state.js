'use strict';

const vec2 = require('gl-matrix').vec2;

class State {
  constructor(position = vec2.create(), velocity = vec2.create()) {
    this.position = vec2.clone(position);
    this.velocity = vec2.clone(velocity);
  }

  static evaulate(initial, derivative, deltaTime) {
    let state = new State();

    state.position = vec2.scaleAndAdd(vec2.create(), initial.position, derivative.position, deltaTime);
    state.velocity = vec2.scaleAndAdd(vec2.create(), initial.velocity, derivative.velocity, deltaTime);

    let output = new State();

    output.position = vec2.clone(state.velocity);
    output.velocity = State.calculateAcceleration();

    return output;
  }

  static calculateAcceleration() {
    return vec2.fromValues(0.0001, 0.0001);
  }
}

export default State;
