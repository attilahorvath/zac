uniform mat4 modelView;
uniform mat4 projection;

attribute vec3 vertexPosition;
attribute vec4 vertexColor;

varying vec4 color;

void main() {
  color = vertexColor;

  gl_Position = projection * modelView * vec4(vertexPosition, 1.0);
}
