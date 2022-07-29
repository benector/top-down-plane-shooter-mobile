import * as THREE from  'three';
import { Vector3 } from '../../build/three.module.js';
import getPlayerPosition, { GAME_SPEED } from './appMobile.js';

export default class Projectile extends THREE.Mesh{

    constructor(geometry, material, isEnemy = false, playerPosition){
        super(geometry, material); //Mesh constructor
        this.isEnemy = isEnemy;
        this.geometry.computeBoundingSphere(); // gera bounding sphere do projétil
        Projectile.projectiles.push(this); // adiciona projétil a array de projéteis
        this.speed = 6;
        if(isEnemy){
            this.speed = 1.7;
        }
        else
            this.rotateY(Math.PI);
        this.castShadow = true;
    }

    static projectiles = [];

    static moveProjectiles(scene){
        for(let i = 0; i<Projectile.projectiles.length; i++){
            let absolutePosition = new THREE.Vector3();
            Projectile.projectiles[i].updateMatrixWorld();
            Projectile.projectiles[i].localToWorld(absolutePosition); // calcula posição do projétil em relação à origem

            if(absolutePosition.y >= 70){
                Projectile.projectiles[i].translateZ(Projectile.projectiles[i].speed); // movimenta projétil para frente
            } else {  // movimenta projétil para cima
                Projectile.projectiles[i].translateY(Projectile.projectiles[i].speed/1.5);
                Projectile.projectiles[i].translateZ(GAME_SPEED);
                if(Projectile.projectiles[i].position.y>=70){   // aponta projétil para o jogador
                    let playerPosition = getPlayerPosition();
                    Projectile.projectiles[i].lookAt(playerPosition.x, Projectile.projectiles[i].position.y, playerPosition.z);
                }
            }



            if(absolutePosition.z <= -170 || absolutePosition.z >= 150 || absolutePosition.x >= 370 || absolutePosition.x <= -370){ // remove projétil se estiver fora dos limites
                scene.remove(Projectile.projectiles[i]); 
                Projectile.projectiles.splice(i, 1); 
            } 
        }
    }
}
