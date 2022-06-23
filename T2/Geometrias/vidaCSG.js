/*
Return a new CSG solid representing space in either this solid or in the
solid `csg`. Neither this solid nor the solid `csg` are modified.

    A.union(B)

    +-------+            +-------+
    |       |            |       |
    |   A   |            |       |
    |    +--+----+   =   |       +----+
    +----+--+    |       +----+       |
         |   B   |            |       |
         |       |            |       |
         +-------+            +-------+

Return a new CSG solid representing space in this solid but not in the
solid `csg`. Neither this solid nor the solid `csg` are modified.

    A.subtract(B)

    +-------+            +-------+
    |       |            |       |
    |   A   |            |       |
    |    +--+----+   =   |    +--+
    +----+--+    |       +----+
         |   B   |
         |       |
         +-------+

Return a new CSG solid representing space both this solid and in the
solid `csg`. Neither this solid nor the solid `csg` are modified.

    A.intersect(B)

    +-------+
    |       |
    |   A   |
    |    +--+----+   =   +--+
    +----+--+    |       +--+
         |   B   |
         |       |
         +-------+
*/

import * as THREE from  'three';
import Stats from '../build/jsm/libs/stats.module.js';
import GUI from '../libs/util/dat.gui.module.js'
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer,
        initCamera, 
        initDefaultBasicLight,
        createGroundPlane,
        onWindowResize,
        degreesToRadians} from "../libs/util/util.js";

import { CSG } from '../libs/other/CSGMesh.js'        

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
renderer.setClearColor("rgb(30, 30, 40)");
var camera = initCamera(new THREE.Vector3(4, -8, 8)); // Init camera in this position
   camera.up.set( 0, 0, 1 );

window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
initDefaultBasicLight(scene, true, new THREE.Vector3(12, -15, 20), 28, 1024) ;	

var groundPlane = createGroundPlane(20, 20); // width and height (x, y)
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

var trackballControls = new TrackballControls( camera, renderer.domElement );

// To be used in the interface
let mesh1, mesh2, mesh3;

buildInterface();
buildObjects();
render();

function buildObjects()
{
   let auxMat = new THREE.Matrix4();
   
   // Base objects
   let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 2))
   let cubeMesh2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 2))
   let cylinderMesh = new THREE.Mesh( new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32))
   
   // CSG holders
   let csgObject, csgObject2, cubeCSG, cubeCSG2,cylinderCSG

    // Object 4 - Cube UNION cube
   cubeMesh2.rotateX(degreesToRadians(90))
   cubeMesh2.rotateY(degreesToRadians(90))
   cubeMesh2.position.set(0.0, 0.0, 0) // reset position
   updateObject(cubeMesh2) 
   cubeCSG2 = CSG.fromMesh(cubeMesh2)
   cubeCSG = CSG.fromMesh(cubeMesh)
   csgObject = cubeCSG.union(cubeCSG2) // Execute union
   mesh3 = CSG.toMesh(csgObject, auxMat)
   mesh3.material = new THREE.MeshPhongMaterial({color: 'indianred'})
   mesh3.position.set(-4, 0, 1.02)
   
  /// Object 5 - Cross SUBTRACT cylinder
   cylinderCSG = CSG.fromMesh(cylinderMesh)   
   csgObject2 = cylinderCSG.subtract(csgObject) // Execute subtraction
   mesh1 = CSG.toMesh(csgObject2, auxMat)
   mesh1.material = new THREE.MeshPhongMaterial({color: 'red'})
   mesh1.position.set(0, 0, 2)
   scene.add(mesh1)

}

function updateObject(mesh)
{
   mesh.matrixAutoUpdate = false;
   mesh.updateMatrix();
}

function buildInterface()
{
  var controls = new function ()
  {
    this.wire = false;
    
    this.onWireframeMode = function(){
       mesh1.material.wireframe = this.wire;
       mesh2.material.wireframe = this.wire;       
       mesh3.material.wireframe = this.wire;              
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'wire', false)
    .name("Wireframe")
    .onChange(function(e) { controls.onWireframeMode() });
}

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}
