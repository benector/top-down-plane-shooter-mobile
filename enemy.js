import * as THREE from  'three';
import { radiansToDegrees } from './libs/util/util.js';
import getPlayerPosition, { GAME_SPEED, scene } from './appMobile.js';
import Projectile from './projectile.js';

export default class Enemy extends THREE.Object3D{

    constructor(obj, type = 'A', isGrounded = false, direction = -1){
        super();
        this.add(obj.clone());
        if(isGrounded){
            this.children[0].scale.x = 0.0012
            this.children[0].scale.y = 0.0012
            this.children[0].scale.z = 0.0012
            this.children[0].rotateY(Math.PI/2)
        } else {
            this.children[0].scale.x = 2.5
            this.children[0].scale.y = 2.5
            this.children[0].scale.z = 2.5
        }
        this.direction = direction;
        this.ZSpeed = (isGrounded ? GAME_SPEED : 0.9) * (type == 'B' ? direction*-1 : 1 );
        if(type == 'D'){
                this.XSpeed = Math.sqrt(0.9/3) * direction;
                this.ZSpeed = Math.sqrt(0.9);
        } 
        this.type = type; 
        this.isGrounded = isGrounded;
        this.isDead = false;
        this.canShoot = true;
        this.shootingTimer = 70;
    }

    canMove(){
   
        if(this.position.z<(this.isGrounded? 150 :170) && this.position.x < 370 && this.position.x > -370)
            return true;
        this.isDead = true;
        return false;
    }

    move(){
        switch(this.type){
            case 'A':
                this.position.z+=this.ZSpeed;
                break;
            case 'B':
                this.position.x+=this.ZSpeed;
                this.children[0].rotation.y = Math.PI/2 * -this.direction;
                break;
            case 'C':
                this.position.z+=this.ZSpeed/1.2;
                this.position.x = this.position.z * this.position.z * 0.005 * this.direction;
                if(!this.isDead){
                    this.children[0].rotation.y = this.position.z == 0 ? 0 : (( Math.PI/2 + (this.position.x - this.position.z) * ((Math.PI/2)/ this.position.z)));
                    this.children[0].rotation.z = (250 + this.position.x/250)* Math.PI/9 * this.direction;
                }
                break;
            case 'D':
                this.position.z+= this.ZSpeed;
                this.position.x+= this.XSpeed;
                this.children[0].rotation.y = 0.9 * this.direction;
                break;
            
        }
    }
    
    fall(){
        if(this.children[0].scale.x > 0){
            this.children[0].rotation.y+=0.08;
            this.children[0].position.y-=0.6;
            this.children[0].scale.x -= 0.02;
            this.children[0].scale.y -= 0.02;
            this.children[0].scale.z -= 0.02;
        }
    }

    shoot(){
        console.log(this.shootingTimer);
        if(!this.canShoot || this.isDead)
            return;
        let projectileGeometry = this.isGrounded ? new THREE.CylinderGeometry(0.1, 1.8, 8, 32) : new THREE.SphereGeometry(2.8);
        let projectile = new Projectile(projectileGeometry,
                            new THREE.MeshLambertMaterial( {color: "rgb(255, 150, 60)"} ),
                            true,
                            this.isGrounded);
        projectile.translateX(this.position.x);
        projectile.translateY(this.position.y);
        projectile.translateZ(this.position.z);

        let playerPosition = getPlayerPosition();
        if(this.isGrounded){
            projectile.updateMatrixWorld();
            let absolutePosition = new THREE.Vector3();
            projectile.children[0].localToWorld(absolutePosition);
            let tan = playerPosition.x == absolutePosition.x ? 0 : (playerPosition.z - absolutePosition.z) / (playerPosition.x - absolutePosition.x);
            let angle;
            if(playerPosition.x > absolutePosition.x){
                angle = Math.PI/2 - Math.atan(tan);
            } else if(playerPosition.x < absolutePosition.x){
                angle = -1 * (Math.PI/2 - Math.atan(-1 * tan));
            } else {
                angle = 0;
            }
            projectile.children[0].rotateY(angle);
        } else {
            projectile.lookAt(playerPosition);
        }
        scene.add(projectile);
        this.shootingTimer = 0;
    }

    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

}