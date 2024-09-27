import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

/* const image = new Image();
let texture = new THREE.Texture(image)
texture.colorSpace = THREE.SRGBColorSpace

image.onload = () =>{
    texture.needsUpdate = true
    console.log(texture)
}

image.src = '/textures/door/color.jpg' */
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("/textures/minecraft.png");
colorTexture.colorSpace = THREE.SRGBColorSpace;
/* colorTexture.repeat.x =2
colorTexture.repeat.y =3

colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping */

/* colorTexture.rotation = Math.PI / 4;
colorTexture.center.x  =0.5
colorTexture.center.y  =0.5 */
// colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter;

/* ()=>{
        console.log('load')
    },
    ()=>{
        console.log('progress')

    },
    ()=>{
        console.log('error')

    }, */
loadingManager.onStart = () => {
  console.log("onstart trriggerd");
};
loadingManager.onLoad = () => {
  console.log("onload trriggerd");
};

loadingManager.onProgress = () => {
  console.log("onprogress trriggerd");
};

loadingManager.onError = () => {
  console.log("onerror trriggerd");
};

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 3);
scene.add(light);
// camera.position.x = 1;
// camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = (time) => {
  const elapsedTime = clock.getElapsedTime();
  time *= 0.001;  // convert time to seconds
  // Update controls
  controls.update();
  mesh.rotation.x = time;
  mesh.rotation.y = time;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
