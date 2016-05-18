'use strict';

const vec2 = require('gl-matrix').vec2;

class State {
  constructor(position = vec2.create(), velocity = vec2.create()) {
    this.position = vec2.clone(position);
    this.velocity = vec2.clone(velocity);
  }
}

export default State;
