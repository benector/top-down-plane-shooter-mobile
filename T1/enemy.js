import * as THREE from  'three';
import { PlaneGeometry } from '../build/three.module.js';
import { degreesToRadians, radiansToDegrees } from '../libs/util/util.js';
import { missile } from './geometries.js';
import getPlayerPosition, { GAME_SPEED, scene } from './main.js';
import Projectile from './projectile.js';

const textureLoader = new THREE.TextureLoader();
const explosion = [];
for (let i = 1; i < 17; i++) {
    explosion.push(textureLoader.load("assets/explosion/" + i + ".png"));  
}

export default class Enemy extends THREE.Object3D{

    constructor(obj, type = 'A', isGrounded = false, direction = -1){
        super();
        this.add(obj.clone());
        if(isGrounded){
            this.children[0].scale.x = 0.0012;
            this.children[0].scale.y = 0.0012;
            this.children[0].scale.z = 0.0012;
            this.children[0].rotateY(Math.PI/2);
        } else {
            this.children[0].scale.x = 2.5;
            this.children[0].scale.y = 2.5;
            this.children[0].scale.z = 2.5;
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
        this.explosionFrame = -1;
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
        if(this.children.length = 1){
            let explosionGeometry = new PlaneGeometry(35, 35);
            let explosionPlane = new THREE.Mesh(explosionGeometry, new THREE.MeshBasicMaterial({transparent: true}))
            if(this.isGrounded)
                explosionPlane.translateY(10);
            explosionPlane.rotateX(degreesToRadians(-40));
            this.add(explosionPlane);  
        }
        if(this.explosionFrame == 8)
            this.children[0].visible = false;
        if(this.explosionFrame < 15) {
            this.explosionFrame ++;
            this.children[1].material.map = explosion[this.explosionFrame];
        } else {
            this.remove(this.children[1]);
        }
    }

    shoot(){
        if(!this.canShoot || this.isDead)
            return;
        let projectileGeometry = new THREE.SphereGeometry(2.8);
        let projectile = new Projectile(projectileGeometry,
                            new THREE.MeshLambertMaterial( {color: "rgb(255, 150, 60)"} ),
                            true,
                            this.isGrounded,
                            this.isGrounded ? missile : null);
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
        let explosionAudio = new Audio('assets/enemy-shot.mp3');
        explosionAudio.play();
        scene.add(projectile);
        this.shootingTimer = 0;
    }

    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

}