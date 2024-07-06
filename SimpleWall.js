import * as THREE from "three";
import * as OBC from "openbim-components";
import * as CLAY from "openbim-clay/elements/walls";
import * as WEBIFC from "web-ifc";

import Stats from "stats.js/src/Stats.js";
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

const container = document.getElementById("container");

const components = new OBC.Components();

components.scene = new OBC.SimpleScene(components);
components.renderer = new OBC.PostproductionRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

components.renderer.postproduction.enabled = true;

const scene = components.scene.get();

components.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

components.scene.setup();

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));

const customEffects = components.renderer.postproduction.customEffects;
customEffects.excludedMeshes.push(grid.get());

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// IFC API

const model = new CLAY();
model.ifcAPI.SetWasmPath("https://unpkg.com/web-ifc@0.0.50/", true);
await model.init();

const simpleWallType = new CLAY.SimpleWallType(model);

const wall = simpleWallType.addInstance();
const wall2 = simpleWallType.addInstance();

scene.add(...wall.meshes);
scene.add(...wall2.meshes);

const simpleOpeningType = new CLAY.SimpleOpeningType(model);
const opening = simpleOpeningType.addInstance();
// scene.add(...opening.meshes);
// console.log(simpleOpeningType);

// wall.addOpening(opening);
// wall.update(true);

wall.startPoint.x = 0;
wall.startPoint.y = -15;
wall.endPoint.x = 0;
wall.endPoint.y = 20;
wall.update(true);

wall2.startPoint.x = 35;
wall2.startPoint.y = 15;
wall2.endPoint.x = -35;
wall2.endPoint.y = 15;
wall2.update(true);

wall.addCorner(wall2, true); //at the end point => true
wall.update(true);

window.addEventListener("keydown", () => {
  wall.removeOpening(opening);
  wall.update(true);
});

// Set up GUI

const gui = new dat.GUI();

gui
  .add(wall.startPoint, "x")
  .name("Start X")
  .min(-15)
  .max(15)
  .step(0.1)
  .onChange(() => {
    wall.update(true, true);
  });

gui
  .add(wall.startPoint, "y")
  .name("Start Y")
  .min(-15)
  .max(15)
  .step(0.1)
  .onChange(() => {
    wall.update(true, true);
  });

gui
  .add(wall.endPoint, "x")
  .name("End X")
  .min(-15)
  .max(15)
  .step(0.1)
  .onChange(() => {
    wall.update(true, true);
  });

gui
  .add(wall.endPoint, "y")
  .name("End Y")
  .min(-15)
  .max(15)
  .step(0.1)
  .onChange(() => {
    wall.update(true, true);
  });

gui
  .add(wall, "height")
  .name("Height")
  .min(1)
  .max(4)
  .step(0.05)
  .onChange(() => {
    wall.update(true);
  });

gui
  .add(simpleWallType, "width")
  .name("Width")
  .min(0.1)
  .max(0.5)
  .step(0.05)
  .onChange(() => {
    simpleWallType.update(true);
    wall.update(false, true);
  });

gui
  .add(opening.position, "x")
  .name("Opening X Position")
  .min(-5)
  .max(5)
  .step(0.1)
  .onChange(() => {
    wall.setOpening(opening);
    wall.update(true);
  });

gui
  .add(opening.position, "y")
  .name("Opening Y Position")
  .min(-5)
  .max(5)
  .step(0.1)
  .onChange(() => {
    wall.setOpening(opening);
    wall.update(true);
  });