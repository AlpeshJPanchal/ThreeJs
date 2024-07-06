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

const mainToolbar = new OBC.Toolbar(components);
mainToolbar.name = "Main toolbar";
components.ui.addToolbar(mainToolbar);

const alertButton = new OBC.Button(components);
alertButton.materialIcon = "info";
alertButton.tooltip = "Information";
mainToolbar.addChild(alertButton);
alertButton.onClick.add(() => {
alert('I\'ve been clicked!');
});

const boxes = [];
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshLambertMaterial({ color: '#6528D7' });

function getRandomNumber(limit) {
    return Math.random() * limit;
    }

function createBox() {
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(mesh);
    mesh.position.x = getRandomNumber(10);
    mesh.position.y = getRandomNumber(10);
    mesh.position.z = getRandomNumber(10);
    boxes.push(mesh);
    }
function deleteBox() {
    if(!boxes.length) return;
    const box = boxes.pop();
    box.removeFromParent();
    }
function deleteAllBoxes() {
    const count = boxes.length;
    for(let i = 0; i < count; i++) {
    deleteBox();
    }
    }
function animateBoxes() {
    const oneDegree = Math.PI / 180;
    for(const box of boxes) {
    box.rotation.x += oneDegree;
    box.rotation.y += oneDegree;
    box.rotation.z += oneDegree;
    }
    }
components.renderer.onBeforeUpdate.add(animateBoxes);
const cubeTools = new OBC.Button(components);
cubeTools.materialIcon = "widgets";
cubeTools.tooltip = "Tools";
mainToolbar.addChild(cubeTools);

const createCubeButton = new OBC.Button(components);
createCubeButton.materialIcon = "add_box";
createCubeButton.label = "Create box";
createCubeButton.onClick.add(() => createBox());
cubeTools.addChild(createCubeButton);

const deleteCubeButtons = new OBC.Button(components);
deleteCubeButtons.materialIcon = "disabled_by_default";
deleteCubeButtons.label = "Delete box";
cubeTools.addChild(deleteCubeButtons);

const deleteSingleCubeButton = new OBC.Button(components, {
    materialIconName: 'disabled_by_default',
    name: 'Single',
    closeOnClick: false
});
deleteSingleCubeButton.onClick.add(() => deleteBox());
deleteCubeButtons.addChild(deleteSingleCubeButton);
const deleteAllCubesButton = new OBC.Button(components);
deleteAllCubesButton.materialIcon = "disabled_by_default";
deleteAllCubesButton.label = "All";
deleteAllCubesButton.onClick.add(() => deleteAllBoxes());
deleteCubeButtons.addChild(deleteAllCubesButton);

const contextDeleteButtons = new OBC.Button(components);
contextDeleteButtons.materialIcon = 'widgets';
contextDeleteButtons.label = "Delete";
const deleteAllCubesContextButton = new OBC.Button(components);
deleteAllCubesContextButton.materialIcon = "widgets";
deleteAllCubesContextButton.label = "All cubes";
deleteAllCubesContextButton.onClick.add(() => deleteAllBoxes());
contextDeleteButtons.addChild(deleteAllCubesContextButton);
components.ui.contextMenu.addChild(contextDeleteButtons);