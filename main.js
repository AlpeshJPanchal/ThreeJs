import * as THREE from 'three';
import * as OBC from 'openbim-components';
import Stats from 'stats.js/src/Stats.js';
import * as dat from 'three/examples/jsm/libs/lil-gui.module.min';
import {Feature} from './src'
import {Load,LoadGeometry} from './Steploader'

const container = document.getElementById('container');
const components = new OBC.Components();
components.scene = new OBC.SimpleScene(components);
components.renderer = new OBC.PostproductionRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

components.init();
const scene = components.scene.get();

components.renderer.postproduction.enabled = true;
components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

// const grid = new OBC.SimpleGrid(components);
// const gridMesh = grid.get();
// const effects = components.renderer.postproduction.customEffects;
// effects.excludedMeshes.push(gridMesh);

// const mainObject =await Load();
// //LoadGeometry (mainObject);
// scene.add(mainObject);
// mainObject.children[0].children.forEach(element => {
//     components.meshes.add(element)
// });
// console.log(components)

const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
const cube = new THREE.Mesh(boxGeometry, boxMaterial);
cube.position.set(0, 1.5, 0);
// scene.add(cube);
// components.meshes.add(cube);
components.scene.setup();
console.log(components)
// const label = new OBC.Simple2DMarker(components);
// label.get().position.set(0, 4, 0);
// label.get().element.textContent = 'Hello, Components!';
// label.get().element.addEventListener('pointerdown', () => {
// console.log('Hello, Components!');
// });
const gui = new dat.GUI();
const mainToolbar = new OBC.Toolbar(components, {name: 'Main Toolbar', position: 'bottom'});
components.ui.addToolbar(mainToolbar);
const feature=new Feature(components,mainToolbar,gui)
feature.Add();
feature.AddUI()

