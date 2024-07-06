import * as THREE from 'three';
import * as OBC from 'openbim-components';
import Stats from 'stats.js/src/Stats.js';
import * as dat from 'three/examples/jsm/libs/lil-gui.module.min';
import * as WEBIFC from 'web-ifc';

export class Feature {
    
    constructor(components,mainToolbar,gui){
        this.components=components;
        this.gui=gui;
        this.mainToolbar = mainToolbar;
        this.lastSelection;

        this.singleSelection = {
            value: true,
        };
        this.classifier = new OBC.FragmentClassifier(this.components);
    }
    Add(){
        this.CreateFragmentHighlighter()
        ///////////////--------------dimension-----------------///////////
        this.createLengthMeasure()
        //////////////--------import----------//////
        this.ImportGeometry()
        ////////////------------edgeselection----------//////////
        this.edgeMeasurement= new OBC.EdgeMeasurement(this.components);
       
        this.CreateFreamentTree()
        this.EdgeClipper()
        
    }
    AddUI(){
        this.AddImportUI()
        this.AddlengthUI()
        this.AddLineMeasurementUI()
        this.AddFreagmentTreeUI()
        this.AddEdgeClipperUI()
    }
    createLengthMeasure(){
        this.dimensions = new OBC.LengthMeasurement(this.components);
        this.dimensions.enabled = false;
        this.dimensions.snapDistance = 1;
        // this.dimensions.onBeforeCreate.add(()=>{
        //     this.highlighter.enabled=false
        // })
        // this.dimensions.onAfterCancel.add(()=>{
        //     this.highlighter.enabled=true
        // })

        
    }
    async ImportGeometry(){
        this.fragmentIfcLoader = new OBC.FragmentIfcLoader(this.components);
        await  this.fragmentIfcLoader.setup()

        const excludedCats = [
            WEBIFC.IFCTENDONANCHOR,
            WEBIFC.IFCREINFORCINGBAR,
            WEBIFC.IFCREINFORCINGELEMENT,
            WEBIFC.IFCSPACE,
        ];
        for (const cat of excludedCats) {
            this.fragmentIfcLoader.settings.excludedCategories.add(cat);
        }
        this.fragmentIfcLoader.onIfcStartedLoading.add(()=>{
            //this.fragmentIfcLoader.dispose()
            //this.classifier.dispose()
            //this.highlighter.updateHighlight();
            console.log("Load start")
        })
        

         this.fragmentIfcLoader.onIfcLoaded.add((model) => {
           // const classifier = this.components.tools.get(OBC.FragmentClassifier);
            this.highlighter.updateHighlight();
            this.classifier.byStorey(model);
            this.classifier.byEntity(model);
            async()=>{await styler.update();}
            this.modelTree.update(['storeys', 'entities']);
            
            console.log(model)
            console.log(this.components)
            
        });

    }
    AddImportUI(){
       
        const ifcButton = this.fragmentIfcLoader.uiElement.get("main");
        this.mainToolbar.addChild(ifcButton);
       

    }
    AddlengthUI(){
        const LengthMeasurementButton=this.dimensions.uiElement.get("main")
        LengthMeasurementButton.tooltip = "Measurement";
        this.mainToolbar.addChild(LengthMeasurementButton);
       
        const actionsFolder = this.gui.addFolder('Actions');
        const actions = {
            'Delete all dimensions': () => {
                this.dimensions.deleteAll();
            }
        }
        LengthMeasurementButton.onClick.add(()=>{
            
            if(LengthMeasurementButton.active){
                this.highlighter.enabled=false
            }
            else{
                this.highlighter.enabled=true
            }
        })
        
        actionsFolder.add(actions, 'Delete all dimensions');
    }
    AddLineMeasurementUI(){
        const EdgeMeasurement=this.edgeMeasurement.uiElement.get('main')
        EdgeMeasurement.tooltip = "Edge Measurement";
        this.mainToolbar.addChild(EdgeMeasurement);

        EdgeMeasurement.onClick.add(()=>{
            
            if(EdgeMeasurement.active){
                this.highlighter.enabled=false
            }
            else{
                this.highlighter.enabled=true
            }
        })
	   
    }
    AddEdgeClipperUI(){
        const stylerButton = this.styler.uiElement.get("mainButton");
        this.mainToolbar.addChild(stylerButton);
        stylerButton.onClick.add(()=>{
            
            if(stylerButton.active){
                this.highlighter.enabled=false
            }
            else{
                this.highlighter.enabled=true
            }
        })

    }
    async CreateFreamentTree(){
        this.modelTree = new OBC.FragmentTree(this.components);
        await this.modelTree.init();

        //this.modelTree.update(['storeys', 'entities']);



        this.modelTree.onSelected.add(({ items, visible }) => {
            if(visible) {
                this.Addhighlighter.highlightByID('select', items, true, true);
            }
        });

        this.modelTree.onHovered.add(({ items, visible }) => {
            if(visible) {
                this.highlighter.highlightByID('hover', items);
            }
        });
    }
    AddFreagmentTreeUI(){
        this.mainToolbar.addChild(this.modelTree.uiElement.get("main"));
    }
    CreateFragmentHighlighter(){
        const fragments = this.components.tools.get(OBC.FragmentManager);
        this.highlighter = new OBC.FragmentHighlighter(this.components, fragments);

        this.highlighter.updateHighlight();

        this.components.renderer.postproduction.customEffects.outlineEnabled = true;
       
        this.highlighter.outlinesEnabled = true;



        const highlightMaterial = new THREE.MeshBasicMaterial({
            color: '#BCF124',
            depthTest: false,
            opacity: 0.8,
            transparent: true
        });
       
        this.highlighter.add('default', highlightMaterial);
        this.highlighter.outlineMaterial.color.set(0xf0ff7a);

        this.components.renderer.container.addEventListener('click', (event) => this.highlightOnClick(event));

       
    }
    highlightOnID() {
        if (this.lastSelection !== undefined) {
            this.highlighter.highlightByID('default', lastSelection);
        }
    }
    async highlightOnClick(event) {
        const result = await this.highlighter.highlight('default', this.singleSelection.value);
        if (result) {
            this.lastSelection = {};
            for (const fragment of result.fragments) {
                const fragmentID = fragment.id;
                this.lastSelection[fragmentID] = [result.id];
            }
        }
    }
    async EdgeClipper(){
        this.clipper = new OBC.EdgesClipper(this.components);
        this.clipper.enabled = true;
        //const classifier = new OBC.FragmentClassifier(this.components);
        this.styler = new OBC.FragmentClipStyler(this.components);
        await this.styler.setup();
        const PlaneMaterial = new THREE.MeshBasicMaterial({
            color: [ 255, 255, 255 ],
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2,
            
            depthWrite: false
        });
        //PlaneMaterial.visible=false;
        
        //this.clipper.PlaneType.helper.visible=false
        //this.clipper.PlaneType.visible=false
        
        //this.clipper.visible=false;
        this.clipper.material=PlaneMaterial
        window.ondblclick = () => {
            this.clipper.create();
        }
    }
    
}
