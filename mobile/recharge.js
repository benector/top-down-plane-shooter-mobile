import * as THREE from  'three';
import { GAME_SPEED } from './appMobile.js';

export default class Recharge extends THREE.Mesh{
    constructor(geometry, material){
        super(geometry, material);
        this.geometry.computeBoundingSphere();
        this.ZSpeed = GAME_SPEED;
        this.castShadow = true;
    }
    
    canMove(){
        if(this.position.z<170)
        return true;
        return false
    }

    move(){
        this.position.z+=GAME_SPEED;
    }
}