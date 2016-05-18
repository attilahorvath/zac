'use strict';

class IndexBuffer {
  constructor(renderer, indices = []) {
    this.renderer = renderer;
    this.indexBufferObject = this.renderer.gl.createBuffer();

    this.fill(indices);
  }

  fill(indices = []) {
    this.renderer.bindIndexBuffer(this);

    this.renderer.gl.bufferData(this.renderer.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.renderer.gl.STATIC_DRAW);

    this.elementCount = indices.length;
  }
}

export default IndexBuffer;
