'use strict';

import VertexBuffer from './vertex_buffer';
import IndexBuffer from './index_buffer';

import SimpleShader from './shaders/simple_shader';

import State from './state';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec3 = require('gl-matrix').vec3;

class Entity {
  constructor(simulation) {
    this.simulation = simulation;
    this.renderer = this.simulation.renderer;

    const vertices = [
      -10.0, -10.0, 0.0, 1.0, 1.0, 1.0, 1.0,
      -10.0,  10.0, 0.0, 1.0, 1.0, 1.0, 1.0,
       10.0,  10.0, 0.0, 1.0, 1.0, 1.0, 1.0,
       10.0, -10.0, 0.0, 1.0, 1.0, 1.0, 1.0
    ];

    const indices = [
      0, 1, 3,
      3, 1, 2
    ];

    this.shader = new SimpleShader(this.renderer);
    this.vertexBuffer = new VertexBuffer(this.renderer, vertices);
    this.indexBuffer = new IndexBuffer(this.renderer, indices);

    this.state = new State(vec2.fromValues(100, 100), vec2.fromValues(0, 0));

    this.transformation = mat4.fromTranslation(mat4.create(), vec3.fromValues(this.state.position[0], this.state.position[1], 0));
  }

  evaulate(derivative, deltaTime) {
    let state = new State();

    state.position = vec2.scaleAndAdd(vec2.create(), this.state.position, derivative.position, deltaTime);
    state.velocity = vec2.scaleAndAdd(vec2.create(), this.state.velocity, derivative.velocity, deltaTime);

    let output = new State();

    output.position = state.velocity;
    output.velocity = this.calculateVelocity(state);

    return output;
  }

  integrate(deltaTime) {
    let a = this.evaulate(new State(), 0);
    let b = this.evaulate(a, deltaTime * 0.5);
    let c = this.evaulate(b, deltaTime * 0.5);
    let d = this.evaulate(c, deltaTime);

    let positionDerivative = vec2.fromValues(1.0 / 6.0 * (a.position[0] + 2 * (b.position[0] + c.position[0]) + d.position[0]), 1.0 / 6.0 * (a.position[1] + 2 * (b.position[1] + c.position[1]) + d.position[1]));
    let velocityDerivative = vec2.fromValues(1.0 / 6.0 * (a.velocity[0] + 2 * (b.velocity[0] + c.velocity[0]) + d.velocity[0]), 1.0 / 6.0 * (a.velocity[1] + 2 * (b.velocity[1] + c.velocity[1]) + d.velocity[1]));

    this.state.position = vec2.scaleAndAdd(vec2.create(), this.state.position, positionDerivative, deltaTime);
    this.state.velocity = vec2.scaleAndAdd(vec2.create(), this.state.velocity, velocityDerivative, deltaTime);

    this.transformation = mat4.fromTranslation(mat4.create(), vec3.fromValues(this.state.position[0], this.state.position[1], 0));
  }

  calculateVelocity(state) {
    // Spring:
    let springPosition = vec2.fromValues(400, 300);
    let x = vec2.subtract(vec2.create(), state.position, springPosition);
    let spring = vec2.scale(vec2.create(), x, -0.000001);
    let damper = vec2.scale(vec2.create(), state.velocity, 0.0001);
    return vec2.subtract(vec2.create(), spring, damper);

    // Gravity:
    // let attractorPosition = vec2.fromValues(200, 200);
    // let n = vec2.normalize(vec2.create(), vec2.subtract(vec2.create(), attractorPosition, state.position));
    // let r = vec2.squaredDistance(attractorPosition, state.position);
    // return vec2.scale(vec2.create(), n, r * 0.00000001);
  }

  draw() {
    this.renderer.draw(this.shader, this.vertexBuffer, this.indexBuffer, this.transformation);
  }
}

export default Entity;
