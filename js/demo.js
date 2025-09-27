// demo.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js";
import { VRButton } from "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/webxr/VRButton.js";

let camera, scene, renderer, controls;
let ocean;

export const DEMO = {
  Initialize: function () {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000022);

    // Camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 2, 6);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Simple ocean plane (placeholder for fft-ocean shader)
    const geometry = new THREE.PlaneGeometry(200, 200, 100, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0x1e90ff,
      flatShading: true,
      side: THREE.DoubleSide,
    });
    ocean = new THREE.Mesh(geometry, material);
    ocean.rotation.x = -Math.PI / 2;
    scene.add(ocean);

    // Example cube floating
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xff4444 })
    );
    cube.position.y = 1.5;
    scene.add(cube);

    window.addEventListener("resize", DEMO.Resize);
  },

  Resize: function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },

  Update: function () {
    // Simple animation for ocean effect
    const time = performance.now() * 0.001;
    ocean.material.color.setHSL(0.55, 0.6, 0.5 + 0.1 * Math.sin(time));
    renderer.render(scene, camera);
  },
};

// Auto-start animation
DEMO.Initialize();
renderer.setAnimationLoop(DEMO.Update);
