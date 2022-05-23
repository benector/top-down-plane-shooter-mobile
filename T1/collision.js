import * as THREE from  'three';
import { Box3, Sphere } from '../build/three.module.js';

// verificar intersecção entre projétil e inimigo

export function intersectProjectile(projectile, enemy) {
    //bounding sphere do projétil
    let spherePosition = new THREE.Vector3();
    projectile.getWorldPosition(spherePosition);
    let sphere = new Sphere(spherePosition, projectile.geometry.boundingSphere.radius);
    //bounding box do inimigo
    let box = new Box3(new THREE.Vector3(), new THREE.Vector3());
    box.setFromObject(enemy);  
    //checar colisão
    return box.intersectsSphere(sphere);
}

// verificar intersecção entre jogador e inimigo

export function intersectPlayer(player, enemy) {
    //bounding box do jogador
    let playerBox = new Box3(new THREE.Vector3(), new THREE.Vector3());
    playerBox.setFromObject(player); 
    //bounding box do inimigo
    let enemyBox = new Box3(new THREE.Vector3(), new THREE.Vector3());
    enemyBox.setFromObject(enemy);  
    //checar colisão
    return enemyBox.intersectsBox(playerBox);
}