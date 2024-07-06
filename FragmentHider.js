import * as THREE from 'three';
import * as OBC from 'openbim-components';
import Stats from 'stats.js/src/Stats.js';
import * as dat from 'three/examples/jsm/libs/lil-gui.module.min';
import * as WEBIFC from 'web-ifc';

const container = document.getElementById('container');

const components = new OBC.Components();

components.scene = new OBC.SimpleScene(components);
components.renderer = new OBC.PostproductionRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

components.scene.setup();

components.renderer.postproduction.enabled = true;

const scene = components.scene.get();

components.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(5, 10, 3);
directionalLight.intensity = 0.5;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.5;
scene.add(ambientLight);

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
const gridMesh = grid.get();
const effects = components.renderer.postproduction.customEffects;
effects.excludedMeshes.push(gridMesh);
let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);

const mainToolbar = new OBC.Toolbar(components, {name: 'Main Toolbar', position: 'bottom'});
components.ui.addToolbar(mainToolbar);
const ifcButton = fragmentIfcLoader.uiElement.get("main");
mainToolbar.addChild(ifcButton);



await fragmentIfcLoader.setup()



const excludedCats = [
    WEBIFC.IFCTENDONANCHOR,
    WEBIFC.IFCREINFORCINGBAR,
    WEBIFC.IFCREINFORCINGELEMENT,
    WEBIFC.IFCSPACE,
];

for (const cat of excludedCats) {
    fragmentIfcLoader.settings.excludedCategories.add(cat);
}
// let model;
// async function loadIfcAsFragments() {
//     const file = await fetch('/4.ifc');
//     const data = await file.arrayBuffer();
//     const buffer = new Uint8Array(data);
//     model = await fragmentIfcLoader.load(buffer, "first");
//     scene.add(model)
// }
// await loadIfcAsFragments()
//const fragments = new OBC.FragmentManager(components);

fragmentIfcLoader.onIfcLoaded.add((model) => {
    classifier.byStorey(model);
    classifier.byEntity(model);
    console.log(model)
    
});


/*MD
Now that we have our model, let's start the `FragmentHider`. You
can use the `loadCached` method if you had used it before: it will
automatically load all the filters you created in previous sessions,
even after closing the browser and opening it again:
*/

const hider = new OBC.FragmentHider(components);
await hider.loadCached();

/*MD
### 📕📗📘 Setting up simple filters
___
Next, we will classify data by category and by level using the
`FragmentClassifier`. This will allow us to create a simple
filter for both classifications. Don't worry: we'll get to
the more complex filters later!
*/

const classifier = new OBC.FragmentClassifier(components);


const classifications = classifier.get();

/*MD
Next, we will create a simple object that we will use as the
base for the floors filter. It will just be a JS object with
the name of each storey as key and a boolean (true/false) as
value:
*/

const storeys = {};
const storeyNames = Object.keys(classifications.storeys);
for (const name of storeyNames) {
    storeys[name] = true;
}

/*MD
Now, let's do the same for categories:
*/

const classes = {};
const classNames = Object.keys(classifications.entities);
for (const name of classNames) {
    classes[name] = true;
}

/*MD
Finally, we will set up a simple menu in dat.gui to control
the visibility of storeys:
*/

const gui = new dat.GUI();

const storeysGui = gui.addFolder("Storeys");
for (const name in storeys) {
    storeysGui.add(storeys, name).onChange(async (visible) => {
        const found = await classifier.find({storeys: [name]});
        hider.set(visible, found);
    });
}

/*MD
Again, for categories it's very similar:
*/

const entitiesGui = gui.addFolder("Classes");
for (const name in classes) {
    entitiesGui.add(classes, name).onChange(async (visible) => {
        const found = await classifier.find({entities: [name]});
        hider.set(visible, found);
    });
}



const toolbar = new OBC.Toolbar(components);
components.ui.addToolbar(toolbar);
const hiderButton = hider.uiElement.get("main");
toolbar.addChild(hiderButton);


// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = '0px';
const renderer = components.renderer;
renderer.onBeforeUpdate.add(() => stats.begin());
renderer.onAfterUpdate.add(() => stats.end());