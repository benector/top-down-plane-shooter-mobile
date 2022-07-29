import * as THREE from  'three';
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

    async shoot(){
        await this.delay(1000);
        if(!this.canShoot || this.isDead)
            return;
        this.canShoot = false;
        let projectile = new Projectile(new THREE.SphereGeometry(2.8),
                            new THREE.MeshLambertMaterial( {color: "rgb(255, 150, 60)"} ),
                            true);
        projectile.translateX(this.position.x);
        projectile.translateY(this.position.y);
        projectile.translateZ(this.position.z);

        if(!this.isGrounded){
            projectile.lookAt(getPlayerPosition());
        }
        scene.add(projectile);
        await this.delay(this.type == 'B' ? 3500 : 2500);
        this.canShoot = true;
    }

    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

}