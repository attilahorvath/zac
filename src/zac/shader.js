'use strict';

import VertexAttribute from './vertex_attribute';
import MatrixVertexAttribute from './matrix_vertex_attribute';

const mat4 = require('gl-matrix').mat4;

const defaultVertexAttributes = [
  new VertexAttribute('vertexPosition')
];

const defaultUniforms = [
  new MatrixVertexAttribute('modelView'),
  new MatrixVertexAttribute('projection')
];

class Shader {
  constructor(renderer, vertexShaderSource, fragmentShaderSource, vertexAttributes = [], uniforms = []) {
    this.renderer = renderer;

    const gl = this.renderer.gl;

    this.vertexAttributes = defaultVertexAttributes.concat(vertexAttributes);
    this.uniforms = defaultUniforms.concat(uniforms);

    this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(this.vertexShader, vertexShaderSource());
    gl.compileShader(this.vertexShader);

    if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(this.vertexShader));
    }

    this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(this.fragmentShader, fragmentShaderSource());
    gl.compileShader(this.fragmentShader);

    if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(this.vertexShader));
    }

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, this.vertexShader);
    gl.attachShader(this.shaderProgram, this.fragmentShader);
    gl.linkProgram(this.shaderProgram);

    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert(gl.getProgramInfoLog(this.shaderProgram));
    }

    this.elementCount = 0;
    this.vertexSize = 0;

    for (let vertexAttribute of this.vertexAttributes) {
      this[vertexAttribute.name] = gl.getAttribLocation(this.shaderProgram, vertexAttribute.name);

      this.elementCount += vertexAttribute.elementCount;
      this.vertexSize += vertexAttribute.byteCount;
    }

    for (let uniform of this.uniforms) {
      this[uniform.name] = gl.getUniformLocation(this.shaderProgram, uniform.name);
    }

    this.modelViewValue = mat4.create();
    this.projectionValue = mat4.create();
  }

  setVertexAttributes() {
    let offset = 0;

    for (let vertexAttribute of this.vertexAttributes) {
      this.renderer.gl.vertexAttribPointer(this[vertexAttribute.name], vertexAttribute.elementCount, this.renderer.gl[vertexAttribute.elementType], false, this.vertexSize, offset);

      offset += vertexAttribute.byteCount;
    }
  }

  use() {
    this.renderer.useShader(this);

    for (let vertexAttribute of this.vertexAttributes) {
      this.renderer.enableVertexAttributeArray(this[vertexAttribute.name]);
    }

    for (let uniform of this.uniforms) {
      this.renderer.setUniformValue(uniform, this[uniform.name], this[`${uniform.name}Value`]);
    }
  }
}

export default Shader;
