import * as THREE from  'three';
import {degreesToRadians} from "../libs/util/util.js";

import { CSG } from '../libs/other/CSGMesh.js'        

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