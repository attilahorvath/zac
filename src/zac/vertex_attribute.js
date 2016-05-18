'use strict';

class VertexAttribute {
  constructor(name, elementCount = 3, elementType = 'FLOAT') {
    this.name = name;
    this.elementCount = elementCount;
    this.elementType = elementType;

    this.uniformMethod = `uniform${this.elementCount}${this.elementType === 'FLOAT' ? 'f' : 'i'}${this.elementCount > 1 ? 'v' : ''}`;

    switch (this.elementType) {
    case 'BYTE':
      this.byteCount = this.elementCount * Int8Array.BYTES_PER_ELEMENT;
      break;
    case 'UNSIGNED_BYTE':
      this.byteCount = this.elementCount * Uint8Array.BYTES_PER_ELEMENT;
      break;
    case 'SHORT':
      this.byteCount = this.elementCount * Int16Array.BYTES_PER_ELEMENT;
      break;
    case 'UNSIGNED_SHORT':
      this.byteCount = this.elementCount * Uint16Array.BYTES_PER_ELEMENT;
      break;
    case 'FIXED':
      this.byteCount = this.elementCount * Int32Array.BYTES_PER_ELEMENT;
      break;
    case 'FLOAT':
      this.byteCount = this.elementCount * Float32Array.BYTES_PER_ELEMENT;
      break;
    }
  }

  setUniformValue(gl, location, value) {
    gl[this.uniformMethod](location, value);
  }
}

export default VertexAttribute;
