const m4 = twgl.m4;
const v3 = twgl.v3;
const gl = document.querySelector("canvas").getContext("webgl");

const vs = `
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

attribute vec4 position;
attribute vec3 normal;

varying vec3 v_normal;

void main() {
  gl_Position = u_worldViewProjection * position;
  v_normal = (u_worldInverseTranspose * vec4(normal, 0)).xyz;
}
`;

const fs = `
precision mediump float;

varying vec3 v_normal;
uniform vec3 u_lightDir;
uniform vec4 u_color;

void main() {
  vec3 norm = normalize(v_normal);
  float light = dot(u_lightDir, norm) * .5 + .5;
  gl_FragColor = vec4(u_color.rgb * light, u_color.a);
}
`;

const progInfo = twgl.createProgramInfo(gl, [vs, fs]);
const bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 1);

const projection = m4.identity();
const camera = m4.identity();
const view = m4.identity();
const viewProjection = m4.identity();
const world = m4.identity();
const worldViewProjection = m4.identity();
const worldInverse = m4.identity();
const worldInverseTranspose = m4.identity();

const fov = degToRad(75);
const zNear = 0.1;
const zFar = 100;

const lightDir = v3.normalize([-1, 1, 1]);

const keys = {};

let px = 0, py = 0, pz = -10;
let elev = 0, ang = 0, roll = 0;
const speed = 2;
const turnSpeed = 45;

let then = 0;

function render(now) {
  now *= 0.001;  // seconds;
  const deltaTime = now - then;
  then = now;

  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  gl.useProgram(progInfo.program);

  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  m4.perspective(fov, aspect, zNear, zFar, projection);

  m4.identity(camera);    
  m4.translate(camera, [px, py, pz], camera);
  m4.rotateX(camera, degToRad(elev), camera);   
  m4.rotateY(camera, degToRad(-ang), camera);   
  m4.rotateZ(camera, degToRad(roll), camera);
  
  m4.inverse(camera, view);
  m4.multiply(projection, view, viewProjection);

  for (let x = -2; x <= 2; ++x) {
    for (let y = -2; y <= 2; ++y) {
      for (let z = -2; z <= 2; ++z) {
        if (x === 0 && y === 0 && z === 0) continue;
        
        m4.identity(world);
        m4.translate(world, [x * 2.5, y * 2.5, z * 2.5], world);
        
        m4.multiply(viewProjection, world, worldViewProjection);
        m4.inverse(world, worldInverse);
        m4.transpose(worldInverse, worldInverseTranspose);
        
        twgl.setBuffersAndAttributes(gl, progInfo, bufferInfo);
        twgl.setUniforms(progInfo, {
          u_worldViewProjection: worldViewProjection,
          u_worldInverseTranspose: worldInverseTranspose,
          u_color: [Math.abs(x) * 0.5, Math.abs(y) * 0.5, Math.abs(z) * 0.5, 1],
          u_lightDir: lightDir,
        });
        twgl.drawBufferInfo(gl, bufferInfo);
      }
    }
  }

  // Movement controls
  if (keys['87'] || keys['83']) { // W for forward, S for backward
    const direction = keys['87'] ? 1 : -1;
    px -= camera[8] * deltaTime * speed * direction;
    py -= camera[9] * deltaTime * speed * direction;
    pz -= camera[10] * deltaTime * speed * direction;
  }

  if (keys['65'] || keys['68']) { // A for left, D for right
    const direction = keys['68'] ? 1 : -1;
    ang += deltaTime * turnSpeed * direction;
  }

  if (keys['81'] || keys['69']) { // Q for roll left, E for roll right
    const direction = keys['81'] ? 1 : -1;
    roll += deltaTime * turnSpeed * direction;
  }

  if (keys['38'] || keys['40']) { // Arrow UP for up, Arrow DOWN for down
    const direction = keys['38'] ? 1 : -1;
    elev += deltaTime * turnSpeed * direction;
  }

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

window.addEventListener('keydown', (e) => {
  keys[e.keyCode] = true;
  e.preventDefault();
});
window.addEventListener('keyup', (e) => {
  keys[e.keyCode] = false;
  e.preventDefault();
});

function degToRad(d) {
  return d * Math.PI / 180;
}
