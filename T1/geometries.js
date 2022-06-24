import * as THREE from  'three';
import {degreesToRadians, getMaxSize} from "../libs/util/util.js";

import { CSG } from '../libs/other/CSGMesh.js' 
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from '../build/jsm/loaders/OBJLoader.js';    
import { Object3D } from '../build/three.module.js';

export function buildHealerGeometry(){
    let auxMat = new THREE.Matrix4();
    // Base objects
    let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 10))
    let cubeMesh2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 10))
    let cylinderMesh = new THREE.Mesh( new THREE.CylinderGeometry(7.5, 7.5, 2.5, 32))
    
    // CSG holders
    let csgObject, csgObject2, cubeCSG, cubeCSG2,cylinderCSG
 
     // Object 4 - Cube UNION cube
    cubeMesh2.rotateX(degreesToRadians(90))
    cubeMesh2.rotateY(degreesToRadians(90))
    cubeMesh2.position.set(0.0, 0.0, 0) // reset position
    cubeMesh2.matrixAutoUpdate = false;
    cubeMesh2.updateMatrix();
    cubeCSG2 = CSG.fromMesh(cubeMesh2)
    cubeCSG = CSG.fromMesh(cubeMesh)
    csgObject = cubeCSG.union(cubeCSG2) // Execute union
    let mesh3 = CSG.toMesh(csgObject, auxMat)
    mesh3.material = new THREE.MeshPhongMaterial({color: 'indianred'})
    mesh3.position.set(-4, 0, 1.02)
    
   /// Object 5 - Cross SUBTRACT cylinder
    cylinderCSG = CSG.fromMesh(cylinderMesh)   
    csgObject2 = cylinderCSG.subtract(csgObject) // Execute subtraction
    let mesh1 = CSG.toMesh(csgObject2, auxMat)
    return mesh1.geometry;
}

export function loadGLTFFile(modelName, visibility, desiredScale)
{
  var loader = new GLTFLoader( );
  var object = new Object3D();
  loader.load( "assets/" + modelName + '.gltf', function ( gltf ) {
    var obj = gltf.scene;
    obj.name = modelName;
    obj.visible = visibility;
    obj.traverse( function ( child ) {
      if ( child ) {
          child.castShadow = true;
      }
    });
    obj.traverse( function( node )
    {
      if( node.material ) node.material.side = THREE.DoubleSide;
    });

    var obj = normalizeAndRescale(obj, desiredScale);
    var obj = fixPosition(obj);
    object.add(obj);
    }, onProgress, onError);
    //console.log(object.children);
    return object;
}

function onError() { };

function onProgress ( xhr, model ) { }

function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

function fixPosition(obj)
{
  // Fix position of the object over the ground plane
  var box = new THREE.Box3().setFromObject( obj );
  if(box.min.y > 0)
    obj.translateY(-box.min.y);
  else
    obj.translateY(-1*box.min.y);
  return obj;
}