import * as THREE from  'three';
import { Box3, Sphere } from '../build/three.module.js';

export function intersectProjectile(projectile, enemy) {
    //projectile's bounding sphere
    let spherePosition = new THREE.Vector3();
    projectile.getWorldPosition(spherePosition);
    let sphere = new Sphere(spherePosition, projectile.geometry.boundingSphere.radius);
    //enemy's bounding box
    let box = new Box3(new THREE.Vector3(), new THREE.Vector3());
    box.setFromObject(enemy);  
    //check collision
    return box.intersectsSphere(sphere);
}

export function intersectPlayer(player, enemy) {
    //projectile's bounding sphere
    let playerBox = new Box3(new THREE.Vector3(), new THREE.Vector3());
    playerBox.setFromObject(player); 
    //enemy's bounding box
    let enemyBox = new Box3(new THREE.Vector3(), new THREE.Vector3());
    enemyBox.setFromObject(enemy);  
    //check collision
    return enemyBox.intersectsBox(playerBox);
}