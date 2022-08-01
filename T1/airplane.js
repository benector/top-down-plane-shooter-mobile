import * as THREE from  'three';
import { degreesToRadians } from '../libs/util/util.js';
import { plane } from './geometries.js';

const textureLoader = new THREE.TextureLoader();
const explosion = [];
for (let i = 1; i < 17; i++) {
    explosion.push(textureLoader.load("assets/explosion/" + i + ".png"));  
}

export default class Airplane extends THREE.Object3D{
    
    constructor(){
        super();
        //esse objeto na verdade é o holder do avião feito para manter os eixos de direção
        //que seriam perdidos caso o cone fosse rotacionado na horizontal pra parecer uma avião
        //então o avião é rotacionado e adicionado ao holder do avião
        this.position.set(0.0, 70.0, 40.0);
        this.add(plane);
        this.children[0].scale.x = 2
        this.children[0].scale.y = 2
        this.children[0].scale.z = 2
        this.damage = 0;
        this.shooting = false;
        this.shootingTimer = 0;
        this.explosionFrame = -1;
    }

    //movimentação

    moveLeft(){
        if((this.children[0].rotation.z > 2.5 && this.children[0].rotation.z>=0) || (this.children[0].rotation.z < -2.2 && this.children[0].rotation.z<=0))
            this.children[0].rotateZ(-0.3);
        if(this.position.x>-180)
            this.translateX(-2.0);
    }

    moveRight(){
        if((this.children[0].rotation.z > 2.2 && this.children[0].rotation.z>=0) || (this.children[0].rotation.z < -2.5 && this.children[0].rotation.z<=0))
            this.children[0].rotateZ(0.3);
        if(this.position.x<180)
            this.translateX(2.0);
    }

    moveUp(){
        if(this.position.z>-130)
        this.translateZ(-2.0);
    }

    moveDown(){
        if(this.position.z<140)
        this.translateZ(2.0);
    }

    //dano
    
    hit(damage){
        this.damage+=damage;
    }

    fix(){
        if(this.damage>0)
        this.damage-=1;
    }

    resetDamage(){
        this.damage = 0;
    }

    getDamage(){
        return this.damage;
    }

    //morte

    fall(){
        if(this.children.length = 1){
            let explosionGeometry = new THREE.PlaneGeometry(35, 35);
            let explosionPlane = new THREE.Mesh(explosionGeometry, new THREE.MeshBasicMaterial({transparent: true}))
            explosionPlane.rotateX(degreesToRadians(-40));
            this.add(explosionPlane);  
        }
        if(this.explosionFrame % 16 == 0){
            let explosionAudio = new Audio('assets/explosion.mp3');
            explosionAudio.play();
        } 
        if(this.explosionFrame == 53)
            this.children[0].visible = false;
        if(this.explosionFrame < 52) {
            this.explosionFrame ++;
            this.children[1].material.map = explosion[this.explosionFrame%16];
        } else {
            this.remove(this.children[1]);
            this.children[0].visible = false;
        }
    }

}