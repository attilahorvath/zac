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

    this.state = new State(vec2.fromValues(100, 100));

    this.transformation = mat4.fromTranslation(mat4.create(), vec3.fromValues(this.state.position[0], this.state.position[1], 0));
  }

  integrate(deltaTime) {
    let a = State.evaulate(this.state, new State(), 0);
    let b = State.evaulate(this.state, a, deltaTime * 0.5);
    let c = State.evaulate(this.state, b, deltaTime * 0.5);
    let d = State.evaulate(this.state, c, deltaTime);

    let positionDerivative = vec2.fromValues(1.0 / 6.0 * (a.position[0] + 2 * (b.position[0] + c.position[0]) + d.position[0]), 1.0 / 6.0 * (a.position[1] + 2 * (b.position[1] + c.position[1]) + d.position[1]));
    let velocityDerivative = vec2.fromValues(1.0 / 6.0 * (a.velocity[0] + 2 * (b.velocity[0] + c.velocity[0]) + d.velocity[0]), 1.0 / 6.0 * (a.velocity[1] + 2 * (b.velocity[1] + c.velocity[1]) + d.velocity[1]));

    this.state.position = vec2.scaleAndAdd(vec2.create(), this.state.position, positionDerivative, deltaTime);
    this.state.velocity = vec2.scaleAndAdd(vec2.create(), this.state.velocity, velocityDerivative, deltaTime);

    this.transformation = mat4.fromTranslation(mat4.create(), vec3.fromValues(this.state.position[0], this.state.position[1], 0));
  }

  draw() {
    this.renderer.draw(this.shader, this.vertexBuffer, this.indexBuffer, this.transformation);
  }
}

export default Entity;
