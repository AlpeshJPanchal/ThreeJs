import * as THREE from 'three';
import Stats from 'stats.js/src/Stats.js';
import * as OBC from 'openbim-components';
import * as dat from 'three/examples/jsm/libs/lil-gui.module.min';

const container = document.getElementById('container');

const components = new OBC.Components();

components.scene = new OBC.SimpleScene(components);
const renderer = new OBC.PostproductionRenderer(components, container);
components.renderer = renderer;

const camera = new OBC.SimpleCamera(components);
components.camera = camera;
components.camera.controls.setLookAt(30, 30, 30, 0, 0, 0);

components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

components.scene.setup();

renderer.postproduction.enabled = true;

const scene = components.scene.get();

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(5, 10, 3);
directionalLight.intensity = 0.5;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.5;
scene.add(ambientLight);

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
const gridMesh = grid.get();
renderer.postproduction.customEffects.excludedMeshes.push(gridMesh);

const fragments = new OBC.FragmentManager(components);

const file = await fetch("/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.load(buffer);

/*MD
### 🎲 Creation of Bounding Boxes
---

Now that our setup is done, lets see how you can use **[`FragmentBoundingBox()`](../api/classes/components.FragmentBoundingBox)**.

You will be amazed to see how easy it is to create [bounding box](https://threejs.org/docs/?q=bound#api/en/math/Box3) using **components**.💪

We will use `OBC.FragmentBoundingBox()` and add the Fragment model to it using `add(model)`.

    */

const fragmentBbox = new OBC.FragmentBoundingBox(components);
fragmentBbox.add(model);

/*MD

#### 👓 Reading the Mesh Data

After adding the model, we can now read the mesh from bounding box using **`getMesh()`**

*/
const bbox = fragmentBbox.getMesh();
fragmentBbox.reset();

/*MD

### ⏏️ Creating a Toolbar for Navigating the Model
---
We'll make a **Toolbar Component** and set it at the bottom.
In addition, we will add a **zoom in** button to this toolbar that will be used to zoom in at the BIM Model.

*/

const toolbar = new OBC.Toolbar(components, {position: "bottom"});
components.ui.addToolbar(toolbar);
const button = new OBC.Button(components);
    button.materialIcon = "zoom_in_map";
    button.tooltip = "Zoom to building";
toolbar.addChild(button);

/*MD

:::tip Simplistic and Powerful Toolbar!

🎛️ We have a dedicated tutorial on how to implement **Toolbar**, check **[Toolbar and UIManager](UIManager.mdx)** tutorial if you have any doubts!

:::

### 🎮 Managing Zoom Events
---

Now that all the setup is done, we need to trigger the zoom event on a button click.🖱

We will use `fitToSphere` from **[camera.controls](../api/classes/components.SimpleCamera#controls)**,
which takes the `mesh` as a parameter and zooms to it.

Also, we will enable a nice transition effect while zooming to the mesh by setting the last parameter as **true**

*/

const controls = components.camera.controls;
button.onClick.add(() => {
        controls.fitToSphere(bbox, true);
    })

/*MD

**Congratulations** 🎉 on completing this short yet useful tutorial!
You can now easily zoom to Fragment **Mesh** using **[FragmentBoundingBox](../api/classes/components.FragmentBoundingBox)**😎
Let's keep it up and check out another tutorial! 🎓

    */

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = '0px';
stats.dom.style.right = 'auto';

components.renderer.onBeforeUpdate.add(() => stats.begin());
components.renderer.onAfterUpdate.add(() => stats.end());