"use strict";

function main() {
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        console.error("WebGL not supported");
        return;
    }

    const program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"]);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");
    const textureLocation = [];
    const faceIndexLocation = gl.getUniformLocation(program, "u_faceIndex");

    for (let i = 0; i < 6; i++) {
        textureLocation[i] = gl.getUniformLocation(program, `u_texture[${i}]`);
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setPyramidGeometry(gl);

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    setTexcoords(gl);

    const textures = [];
    const textureUrls = [
        "labhubhu.jpg",
    ];

    for (let i = 0; i < textureUrls.length; i++) {
        (function(i) {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

            const image = new Image();
            image.src = textureUrls[i];
            image.addEventListener('load', function() {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

                if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                    gl.generateMipmap(gl.TEXTURE_2D);
                } else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }
                textures[i] = texture;
                console.log(`Texture ${i} loaded: ${textureUrls[i]}`);
            });
            image.addEventListener('error', function() {
                console.error(`Failed to load image: ${textureUrls[i]}`);
            });
        })(i);
    }

    function isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }

    const fieldOfViewRadians = degToRad(60);
    let modelXRotationRadians = degToRad(0);
    let modelYRotationRadians = degToRad(0);
    let then = 0;

    requestAnimationFrame(drawScene);

    function drawScene(time) {
        time *= 0.001;
        const deltaTime = time - then;
        then = time;

        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        modelYRotationRadians += -0.7 * deltaTime;
        modelXRotationRadians += -0.4 * deltaTime;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);

        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(texcoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
        const cameraPosition = [0, 1, 5];
        const up = [0, 1, 0];
        const target = [0, 0, 0];
        const cameraMatrix = m4.lookAt(cameraPosition, target, up);
        const viewMatrix = m4.inverse(cameraMatrix);
        const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

        let matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
        matrix = m4.yRotate(matrix, modelYRotationRadians);
        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        // Bind textures 
        for (let i = 0; i < textures.length; i++) {
            if (textures[i]) {
                gl.activeTexture(gl.TEXTURE0 + i);
                gl.bindTexture(gl.TEXTURE_2D, textures[i]);
                gl.uniform1i(textureLocation[i], i);
            }
        }

        // Draw each face 
        for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
            gl.uniform1i(faceIndexLocation, faceIndex);
            gl.drawArrays(gl.TRIANGLES, faceIndex * 6, 6);
        }

        requestAnimationFrame(drawScene);
    }

    function setPyramidGeometry(gl) {
        const positions = new Float32Array([
            // Base
            -1, 0, -1,
             1, 0, -1,
            -1, 0,  1,
             1, 0,  1,

            // Front face
            -1, 0, -1,
             1, 0, -1,
             0, 1, 0,

            // Right face
             1, 0, -1,
             1, 0,  1,
             0, 1, 0,

            // Back face
             1, 0,  1,
            -1, 0,  1,
             0, 1, 0,

            // Left face
            -1, 0,  1,
            -1, 0, -1,
             0, 1, 0,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    }

    function setTexcoords(gl) {
        const texcoords = new Float32Array([
            // Base
            0, 0,  1, 0,  0, 1,
            1, 0,  1, 1,  0, 1,

            // Front face
            0, 0,  1, 0,  0.5, 1,

            // Right face
            0, 0,  1, 0,  0.5, 1,

            // Back face
            0, 0,  1, 0,  0.5, 1,

            // Left face
            0, 0,  1, 0,  0.5, 1,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
}

main();
