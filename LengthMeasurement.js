import * as THREE from 'three';
import * as OBC from 'openbim-components';
import Stats from 'stats.js/src/Stats.js';
import * as dat from 'three/examples/jsm/libs/lil-gui.module.min';

const container = document.getElementById('container');

const components = new OBC.Components();

components.scene = new OBC.SimpleScene(components);
components.renderer = new OBC.SimpleRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

const scene = components.scene.get();

components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(5, 10, 3);
directionalLight.intensity = 0.5;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.5;
scene.add(ambientLight);

const grid = new OBC.SimpleGrid(components);


const cubeGeometry = new THREE.BoxGeometry(3, 3, 3,2,2,2);
const cubeMaterial = new THREE.MeshStandardMaterial({color: '#6528D7'});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 1.5, 0)


scene.add(cube);
components.meshes.add(cube);

const dimensions = new OBC.LengthMeasurement(components);

//dimensions.enabled = true;
dimensions.snapDistance = 1;


//container.ondblclick = () => dimensions.create();

window.onkeydown = (event) => {
    if (event.code === 'Delete' || event.code === 'Backspace') {
        dimensions.delete();
    }
}


const mainToolbar = new OBC.Toolbar(components, { name: 'Main Toolbar', position: 'bottom' });
mainToolbar.addChild(dimensions.uiElement.get("main"));
components.ui.addToolbar(mainToolbar);

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = '0px';
const renderer = components.renderer;
renderer.onBeforeUpdate.add(() => stats.begin());
renderer.onAfterUpdate.add(() => stats.end());

// Set up dat.gui menu

const gui = new dat.GUI();

const shortcutsFolder = gui.addFolder('Shortcuts');


const shortcuts = {
    'Create dimension': "Double click" ,
    'Delete dimension': "Delete"
}

shortcutsFolder.add(shortcuts, 'Create dimension');
shortcutsFolder.add(shortcuts, 'Delete dimension');

const actionsFolder = gui.addFolder('Actions');

actionsFolder.add(dimensions, "enabled").name("Dimensions enabled");
actionsFolder.add(dimensions, "visible").name("Dimensions visible");

const color = {
    value: 0x000000
};

const helperColor = new THREE.Color();
actionsFolder.addColor(color, "value")
    .name("Dimensions color")
    .onChange((value) => {
        helperColor.setHex(value);
        dimensions.color = helperColor;
    });

const actions = {
    'Delete all dimensions': () => {
        dimensions.deleteAll();
    }
}

actionsFolder.add(actions, 'Delete all dimensions');