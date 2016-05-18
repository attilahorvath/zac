'use strict';

import VertexAttribute from '../vertex_attribute';
import Shader from '../shader';

const vertexShaderSource = require('../../../shaders/simple.vert');
const fragmentShaderSource = require('../../../shaders/simple.frag');

const vertexAttributes = [
  new VertexAttribute('vertexColor', 4)
];

class SimpleShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, vertexAttributes);
  }
}

export default SimpleShader;
