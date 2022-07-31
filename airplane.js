import * as THREE from  'three';
import { plane } from './geometries.js';

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
        this.rotation.y+=0.08;
        this.position.y-=0.6;
    }

}