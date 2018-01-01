import { WebGLRenderer, Scene, PerspectiveCamera, PointLight } from 'three';
import * as THREE from 'three';

import loop from 'raf-loop';
import resize from 'brindille-resize';

import OBJLoader from 'three-obj-loader';
import average from 'analyser-frequency-average';
import WebMidi from 'webmidi';

import Torus from './objects/Torus';
import OrbitControls from './controls/OrbitControls';

import { analyser1, freq1, bands1 } from './utils/audioFreqs';
import { analyser2, freq2, bands2 } from './utils/audioFreqs';
import { analyser3, freq3, bands3 } from './utils/audioFreqs';

import webMidiControl from './utils/midiControl';

OBJLoader(THREE);

// audio stuff
var subAvg1 = 0,
  lowAvg1 = 0,
  midAvg1 = 0,
  highAvg1 = 0;

var subAvg2 = 0,
  lowAvg2 = 0,
  midAvg2 = 0,
  highAvg2 = 0;

var subAvg3 = 0,
  lowAvg3 = 0,
  midAvg3 = 0,
  highAvg3 = 0;

var orbScale = 10;
// visuals stuff
var particles;
var orbs;

// colors
const colors2 = [0xffffff, 0x040b14, 0xcbd3e5];
const emissive2 = 0x040b14;
const specular2 = 0xffffff;
const shininess2 = 80;

/* Init renderer and canvas */
const container = document.body;
const renderer = new WebGLRenderer({ antialias: true, alpha: true });

renderer.setClearColor(0xffffff, 0.0);
container.style.overflow = 'hidden';
container.style.margin = 0;
container.appendChild(renderer.domElement);

/* Main scene and camera */
const scene = new Scene();

const camera = new PerspectiveCamera(
  50,
  resize.width / resize.height,
  0.1,
  100000
);
camera.position.z = -15;
camera.fov = 65;

const controls = new OrbitControls(camera, {
  element: renderer.domElement,
  distance: 20,
  phi: Math.PI * 10.5
});

/* Lights */
const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambLight);
ambLight.position.x = 10;

const light = new THREE.PointLight(0xffffff, 0.5);
scene.add(light);
light.position.x = -20;
light.position.y = 1.5;

const helper = new THREE.PointLightHelper(light, 0.1);
scene.add(helper);

/* Actual content of the scene */
//model
var loader = new THREE.OBJLoader();

// load a resource
loader.load(
  // resource URL
  'src/objects/earth_obj.obj',
  // called when resource is loaded
  function(object) {
    const objs = [];

    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        objs.push(child);
      }
    });

    drawOrbs(objs[0]);
    //scene.add(object);
  }
);

var loader2 = new THREE.OBJLoader();
// load a resource
loader2.load(
  // resource URL
  'src/objects/model.obj',
  // called when resource is loaded
  function(object) {
    const objs = [];

    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        objs.push(child);
      }
    });

    drawParticles(objs[0]);
  }
);

/* Various event listeners */
resize.addListener(onResize);

/* create and launch main loop */
const engine = loop(render);
engine.start();

/* gradien background vars*/
var mult;
var angle;
var audioData;
const w = document.body.clientWidth / 50;
const h = document.body.clientHeight / 10;

/* -------------------------------------------------------------------------------- */

/**
  Resize canvas
*/
function onResize() {
  camera.aspect = resize.width / resize.height;
  camera.updateProjectionMatrix();
  renderer.setSize(resize.width, resize.height);
}

function drawParticles(mesh) {
  particles = new THREE.Object3D();
  scene.add(particles);

  for (let i = 0; i < 100; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: colors2[Math.floor(Math.random() * colors2.length)],
      flatShading: THREE.FlatShading,
      emissive: emissive2,
      opacity: 5,
      shininess: 120,
      transparent: true,
      specular: specular2
    });

    const mesh2 = new THREE.Mesh(mesh.geometry, material);
    mesh2.scale.set(20, 20, 20);
    mesh2.position.set(
      (Math.random() - 0.5) * 500,
      (Math.random() - 0.5) * 500,
      (Math.random() - 0.5) * 500
    );

    mesh2.updateMatrix();
    mesh2.matrixAutoUpdate = true;
    particles.add(mesh2);
  }
}

function drawOrbs(mesh) {
  orbs = new THREE.Object3D();
  scene.add(orbs);

  for (let i = 0; i < 100; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: colors2[Math.floor(Math.random() * colors2.length)],
      flatShading: THREE.FlatShading,
      emissive: emissive2,
      opacity: 0.8,
      transparent: true,
      specular: specular2
    });

    const mesh3 = new THREE.Mesh(mesh.geometry, material);
    mesh3.scale.set(orbScale, orbScale, orbScale);
    mesh3.position.set(
      (Math.random() - 0.5) * 500,
      (Math.random() - 0.5) * 500,
      (Math.random() - 0.5) * 500
    );

    mesh3.updateMatrix();
    mesh3.matrixAutoUpdate = true;
    orbs.add(mesh3);
  }
}

/**
  Render loop
*/
function render() {
  controls.update();

  // get sound freqs
  //track1
  subAvg1 = average(analyser1, freq1, bands1.sub.from, bands1.sub.to);
  lowAvg1 = average(analyser1, freq1, bands1.low.from, bands1.low.to);
  midAvg1 = average(analyser1, freq1, bands1.mid.from, bands1.mid.to);
  highAvg1 = average(analyser1, freq1, bands1.high.from, bands1.high.to);
  // console.log('track1');
  // console.log(subAvg1, lowAvg1, midAvg1, highAvg1);

  //track2
  subAvg2 = average(analyser2, freq2, bands2.sub.from, bands2.sub.to);
  lowAvg2 = average(analyser2, freq2, bands2.low.from, bands2.low.to);
  midAvg2 = average(analyser2, freq2, bands2.mid.from, bands2.mid.to);
  highAvg2 = average(analyser2, freq2, bands2.high.from, bands2.high.to);
  // console.log('track2');
  // console.log(subAvg2, lowAvg2, midAvg2, highAvg2);

  //track3
  subAvg3 = average(analyser3, freq3, bands3.sub.from, bands3.sub.to);
  lowAvg3 = average(analyser3, freq3, bands3.low.from, bands3.low.to);
  midAvg3 = average(analyser3, freq3, bands3.mid.from, bands3.mid.to);
  highAvg3 = average(analyser3, freq3, bands3.high.from, bands3.high.to);
  // console.log('track3');
  // console.log(subAvg3, lowAvg3, midAvg3, highAvg3);

  mult = 20;
  audioData = subAvg1;

  const color1 = Math.floor(audioData * mult);
  document.documentElement.style.setProperty('--pos1', color1 + '%');
  const color2 = Math.floor(audioData * mult + 24);
  document.documentElement.style.setProperty('--pos2', color2 + '%');
  const color3 = Math.floor(audioData * mult + 30);
  document.documentElement.style.setProperty('--pos3', color3 + '%');
  const color4 = Math.floor(audioData * mult + 46);
  document.documentElement.style.setProperty('--pos4', color4 + '%');
  const color5 = Math.floor(audioData * mult + 59);
  document.documentElement.style.setProperty('--pos5', color5 + '%');
  const color6 = Math.floor(audioData * mult + 71);
  document.documentElement.style.setProperty('--pos6', color6 + '%');
  const color7 = Math.floor(audioData * mult + 84);
  document.documentElement.style.setProperty('--pos7', color7 + '%');
  const color8 = Math.floor(audioData * mult + 100);
  document.documentElement.style.setProperty('--pos8', color8 + '%');

  const grad = Math.floor(100 * highAvg3);
  document.documentElement.style.setProperty(
    '--gradient_angle',
    100 - grad + 'deg'
  );

  particles.rotation.y += lowAvg1 / 500;
  particles.rotation.y -= lowAvg2 / 500;

  particles.rotation.z += midAvg2 / 500;
  particles.rotation.z -= midAvg3 / 500;

  orbs.rotation.y += highAvg3 / 500;
  orbs.rotation.y -= highAvg1 / 500;

  orbs.rotation.z += subAvg1 / 1000;
  orbs.rotation.z -= subAvg3 / 1000;

  console.log(highAvg3);
  for (var i = 0; i < particles.children.length; i++) {
    //if (i === 0) console.log(particles.children[i]);
    particles.children[i].rotation.x += midAvg2 / 50;
    particles.children[i].rotation.x -= lowAvg2 / 50;

    particles.children[i].rotation.y += midAvg2 / 50;
    particles.children[i].rotation.y -= highAvg2 / 50;

    particles.children[i].rotation.z += highAvg3 * 5;
    particles.children[i].rotation.z -= highAvg3 * 5;
  }

  for (var j = 0; j < particles.children.length; j = j + 10) {
    particles.children[j].scale.set(
      100 * highAvg3,
      100 * highAvg3,
      100 * highAvg3
    );
  }

  for (var i = 0; i < orbs.children.length; i++) {
    orbs.children[i].scale.set(
      orbScale * subAvg1,
      orbScale * subAvg1,
      orbScale * subAvg1
    );
  }

  renderer.render(scene, camera);
}
