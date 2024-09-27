import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

const gui = new GUI();
const canvas = document.querySelector("canvas.webgl");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const fontLoader = new FontLoader();

const axisHelper = new THREE.AxesHelper();
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
const scene = new THREE.Scene();
// scene.add(axisHelper)

const textureLoader = new THREE.TextureLoader();

const matcapTexture = textureLoader.load("/textures/matcaps/5.png");

// const cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial());

// scene.add(cube);
let text;
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const geometry = new TextGeometry("Karim Balayev", {
    font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  // gui.add(geometry,'size').min(0.2).max(10).step(0.1)
  geometry.center();
  geometry.computeBoundingBox();
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  text = new THREE.Mesh(geometry, material);

  scene.add(text);
  const donutGeo = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeo, material);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;

    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
const tick = (time) => {
  const elapsedTime = clock.getElapsedTime();
  // Update controls
  if (text) {
    // text.rotation.x = elapsedTime;
    text.rotation.y = elapsedTime;
  }
  /*  if (donut) {
    donut.rotation.x = elapsedTime;
  } */

  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
