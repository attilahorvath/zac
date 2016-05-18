'use strict';

class VertexBuffer {
  constructor(renderer, vertices = []) {
    this.renderer = renderer;
    this.vertexBufferObject = this.renderer.gl.createBuffer();

    this.fill(vertices);
  }

  fill(vertices = []) {
    this.renderer.bindVertexBuffer(this);

    this.renderer.gl.bufferData(this.renderer.gl.ARRAY_BUFFER, new Float32Array(vertices), this.renderer.gl.STATIC_DRAW);

    this.elementCount = vertices.length;
  }
}

export default VertexBuffer;
