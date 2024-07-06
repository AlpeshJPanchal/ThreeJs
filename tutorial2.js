import * as THREE from 'three';
import * as OBC from 'openbim-components';


const container = document.getElementById('container');
const components = new OBC.Components();
components.scene = new OBC.SimpleScene(components);
components.renderer = new OBC.SimpleRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);
const grid = new OBC.SimpleGrid(components);

components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
components.init();
const scene = components.scene.get();
components.tools.init(OBC);

const button =  new OBC.Button(components);
button.materialIcon = "straighten";
const toolbar = new OBC.Toolbar(components);
components.ui.addToolbar(toolbar);
toolbar.addChild(button);









// const grid = new OBC.SimpleGrid(components);
// const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
// const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
// const cube = new THREE.Mesh(boxGeometry, boxMaterial);
// cube.position.set(0, 1.5, 0);
// scene.add(cube);
// components.scene.setup();
// const label = new OBC.Simple2DMarker(components);
// label.get().position.set(0, 4, 0);
// label.get().element.textContent = 'Hello, Components!';
// label.get().element.addEventListener('pointerdown', () => {
// console.log('Hello, Components!');
// });