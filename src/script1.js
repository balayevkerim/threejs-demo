import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from 'lil-gui'
import { RGBELoader } from "three/examples/jsm/Addons.js";

const gui = new GUI()
const canvas = document.querySelector("canvas.webgl");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);

const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");

const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");

const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matcapTexture = textureLoader.load("/textures/matcaps/1.png");

const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");


doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace


const material = new THREE.MeshPhysicalMaterial();
material.metalness = 1
material.roughness = 1
material.map = doorColorTexture
material.metalnessMap= doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1

material.displacementMap  = doorHeightTexture
material.displacementScale = 0.1
material.normalMap = doorNormalTexture

material.clearcoat = 1
material.clearcoatRoughness =0
gui.add(material, 'clearcoat').min(0).max(1).step(0.0001)
gui.add(material, 'sheen').min(0).max(1).step(0.0001)
gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001)

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
const ambientLight = new THREE.AmbientLight(0xffffff,1);
scene.add(ambientLight)

/* const pointLight = new THREE.PointLight(0xffffff,30);
scene.add(pointLight)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4 */
material.transparent = true
material.side = THREE.DoubleSide

// material.normalMap = doorNormalTexture

const rgbeLoader = new RGBELoader();
rgbeLoader.load('./textures/environmentMap/2k.hdr',(envMap)=>{
    console.log(envMap)
    envMap.mapping=  THREE.EquirectangularReflectionMapping
    scene.background =  envMap;
    scene.environment = envMap
    console.log('loaded')
})
// material.alphaMap =  doorAlphaTexture
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1,100,100), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);

torus.position.x = 1.5;

scene.add(sphere, plane, torus);

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
  sphere.rotation.x = 0.1 * elapsedTime;
  plane.rotation.x = 0.1 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  sphere.rotation.y = 0.15 * elapsedTime;
  plane.rotation.y = 0.15 * elapsedTime;
  torus.rotation.y = 0.15 * elapsedTime;
  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
