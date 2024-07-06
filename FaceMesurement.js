// Set up scene (see SimpleScene tutorial)

import * as THREE from 'three';
import * as OBC from 'openbim-components';
import Stats from 'stats.js/src/Stats.js';

const container = document.getElementById('container');

const components = new OBC.Components();

components.scene = new OBC.SimpleScene(components);
components.renderer = new OBC.PostproductionRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

components.renderer.postproduction.enabled = true;

const scene = components.scene.get();

components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
components.scene.setup();

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
const effects = components.renderer.postproduction.customEffects;
effects.excludedMeshes.push(grid.get());

const dimensions = new OBC.FaceMeasurement(components);

let fragments = new OBC.FragmentManager(components);
const file = await fetch('/small.frag');
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
fragments.load(buffer);

let saved;
window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyO') {
        dimensions.delete();
    } else if (event.code === 'KeyS') {
        saved = dimensions.get();
        dimensions.deleteAll();
    } else if (event.code === 'KeyL') {
        if (saved) {
            dimensions.set(saved);
        }
    }
});

const mainToolbar = new OBC.Toolbar(components, { name: 'Main Toolbar', position: 'bottom' });
mainToolbar.addChild(dimensions.uiElement.get('main'));
components.ui.addToolbar(mainToolbar);

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = '0px';
const renderer = components.renderer;
renderer.onBeforeUpdate.add(() => stats.begin());
renderer.onAfterUpdate.add(() => stats.end());