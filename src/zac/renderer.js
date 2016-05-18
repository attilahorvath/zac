'use strict';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec4 = require('gl-matrix').vec4;

class Renderer {
  constructor(dimensions = vec2.fromValues(800, 600)) {
    this.dimensions = vec2.clone(dimensions);

    this.canvas = document.createElement('canvas');

    this.canvas.width = this.dimensions[0];
    this.canvas.height = this.dimensions[1];

    document.body.appendChild(this.canvas);

    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendEquation(this.gl.FUNC_ADD);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.projection = mat4.create();
    mat4.ortho(this.projection, 0, this.dimensions[0], this.dimensions[1], 0, -1, 1);

    this.setViewport(vec4.fromValues(0, 0, this.dimensions[0], this.dimensions[1]));

    this.vertexBuffer = null;
    this.indexBuffer = null;
    this.shader = null;

    this.enabledVertexAttributeArrays = {};
    this.uniformValues = new Map();
  }

  setViewport(viewport) {
    if (viewport !== this.viewport) {
      this.gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);

      this.viewport = vec4.clone(viewport);
    }
  }

  bindVertexBuffer(vertexBuffer) {
    if (vertexBuffer !== this.vertexBuffer) {
      let vertexBufferObject = vertexBuffer ? vertexBuffer.vertexBufferObject : null;

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBufferObject);

      this.vertexBuffer = vertexBuffer;
    }
  }

  bindIndexBuffer(indexBuffer) {
    if (indexBuffer !== this.indexBuffer) {
      let indexBufferObject = indexBuffer ? indexBuffer.indexBufferObject : null;

      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);

      this.indexBuffer = indexBuffer;
    }
  }

  useShader(shader) {
    if (shader !== this.shader) {
      this.gl.useProgram(shader.shaderProgram);

      this.shader = shader;
    }
  }

  enableVertexAttributeArray(index) {
    if (!this.enabledVertexAttributeArrays[index]) {
      this.gl.enableVertexAttribArray(index);

      this.enabledVertexAttributeArrays[index] = true;
    }
  }

  setUniformValue(vertexAttribute, location, value) {
    if (this.uniformValues.get(location) !== value) {
      vertexAttribute.setUniformValue(this.gl, location, value);

      this.uniformValues.set(location, value);
    }
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  draw(shader, vertexBuffer, indexBuffer, transformation = mat4.create(), useProjection = true, mode = 'TRIANGLES', count = -1) {
    this.bindVertexBuffer(vertexBuffer);
    this.bindIndexBuffer(indexBuffer);

    shader.setVertexAttributes();

    shader.modelViewValue = transformation;
    shader.projectionValue = useProjection ? this.projection : mat4.create();

    shader.use();

    if (count === -1) {
      count = indexBuffer ? indexBuffer.elementCount : vertexBuffer.elementCount / shader.elementCount;
    }

    if (indexBuffer) {
      this.gl.drawElements(this.gl[mode], count, this.gl.UNSIGNED_SHORT, 0);
    } else {
      this.gl.drawArrays(this.gl[mode], 0, count);
    }
  }
}

export default Renderer;
