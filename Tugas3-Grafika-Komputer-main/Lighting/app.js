"use strict";

function main() {
  // webgl canvas
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  const program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const normalLocation = gl.getAttribLocation(program, "a_normal");

  const worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
  const worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
  const colorFrontLocation = gl.getUniformLocation(program, "u_colorFront");
  const colorBackLocation = gl.getUniformLocation(program, "u_colorBack");
  const shininessLocation = gl.getUniformLocation(program, "u_shininess");
  const lightDirectionLocation = gl.getUniformLocation(program, "u_lightDirection");
  const lightWorldPositionLocation = gl.getUniformLocation(program, "u_lightWorldPosition");
  const viewWorldPositionLocation = gl.getUniformLocation(program, "u_viewWorldPosition");
  const worldLocation = gl.getUniformLocation(program, "u_world");

  // buffer position
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setPyramidGeometry(gl);

  // buffer normal
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  setPyramidNormals(gl);

  let fRotationRadians = 0;
  let shininess = 80;
  let lightDirection = [0, 0, 1];
  
  drawScene();

  // rotation cube
  function updateRotation(event, ui) {
    fRotationRadians = degToRad(ui.value);
    drawScene();
  }

  // draw the pyramid in canvas
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(normalLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projectionMatrix = m4.perspective(degToRad(75), aspect, 1, 2000);

    const camera = [0, 2, 5];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const cameraMatrix = m4.lookAt(camera, target, up);
    const viewMatrix = m4.inverse(cameraMatrix);
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    const worldMatrix = m4.yRotation(fRotationRadians);
    const worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
    const worldInverseMatrix = m4.inverse(worldMatrix);
    const worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);

    gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix);
    gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
    gl.uniformMatrix4fv(worldLocation, false, worldMatrix);

    gl.uniform4fv(colorFrontLocation, [0, 1, 0, 1]); // Green front
    gl.uniform4fv(colorBackLocation, [1, 0, 0, 1]); // Red back

    const lightPosition = [5, 5, 10];
    gl.uniform3fv(lightWorldPositionLocation, lightPosition);
    gl.uniform3fv(viewWorldPositionLocation, camera);
    gl.uniform1f(shininessLocation, shininess);

    const lightDirectionMatrix = m4.lookAt(lightPosition, target, up);
    lightDirection = [-lightDirectionMatrix[8], -lightDirectionMatrix[9], -lightDirectionMatrix[10]];
    gl.uniform3fv(lightDirectionLocation, lightDirection);

    gl.drawArrays(gl.TRIANGLES, 0, 18); // Pyramid has 18 vertices
  }
}

// pyramid geometry
function setPyramidGeometry(gl) {
  const positions = new Float32Array([
    // Base
    -1, 0, -1,
     1, 0, -1,
    -1, 0,  1,
     1, 0,  1,

    // Sides
    -1, 0, -1,
     1, 0, -1,
     0, 1, 0,

     1, 0, -1,
     1, 0,  1,
     0, 1, 0,

     1, 0,  1,
    -1, 0,  1,
     0, 1, 0,

    -1, 0,  1,
    -1, 0, -1,
     0, 1, 0,
  ]);
  
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

// pyramid normals
function setPyramidNormals(gl) {
  const normals = new Float32Array([
    // Base normals
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,

    // Side normals
    0, 0.447, -0.894,
    0, 0.447, -0.894,
    0, 0.447, -0.894,

    0.894, 0.447, 0,
    0.894, 0.447, 0,
    0.894, 0.447, 0,

    0, 0.447, 0.894,
    0, 0.447, 0.894,
    0, 0.447, 0.894,

    -0.894, 0.447, 0,
    -0.894, 0.447, 0,
    -0.894, 0.447, 0,
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
}

main();
