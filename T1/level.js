import * as THREE from  'three';
import { createEnemy, scene } from './main.js';
import Enemy from './enemy.js';

let enemyGeometry = new THREE.ConeGeometry( 8, 3, 3 );
let enemyMaterial = new THREE.MeshLambertMaterial( {color: "rgb(255, 255, 255)"} );

//TIPO A: createEnemy(-50, 70, -170, enemyGeometry, enemyMaterial);

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

export default async function playLevel(){
    await delay(1500);
    createEnemy(-50, 70, -170, enemyGeometry, enemyMaterial);
    await delay(800);
    createEnemy(50, 70, -170, enemyGeometry, enemyMaterial);
    await delay(800);
    createEnemy(100, 70, -170, enemyGeometry, enemyMaterial);
    await delay(800);
    createEnemy(-100, 70, -170, enemyGeometry, enemyMaterial);
    await delay(800);
    createEnemy(150, 70, -170, enemyGeometry, enemyMaterial);
    await delay(800);
    createEnemy(70, 70, -170, enemyGeometry, enemyMaterial);
    await delay(800);
    createEnemy(-10, 70, -170, enemyGeometry, enemyMaterial);
    await delay(5500);

    createEnemy(-100, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    await delay(800);
    createEnemy(150, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    await delay(800);
    createEnemy(70, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    createEnemy(-50, 70, -170, enemyGeometry, enemyMaterial);
    await delay(800);
    createEnemy(-70, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    createEnemy(-120, 70, -170, enemyGeometry, enemyMaterial);
    await delay(6500);

    createEnemy(0, 70, -200, enemyGeometry, enemyMaterial, 'C', false, -1);
    await delay(800);
    createEnemy(0, 70, -200, enemyGeometry, enemyMaterial, 'C', false, -1);
    await delay(800);
    createEnemy(0, 70, -200, enemyGeometry, enemyMaterial, 'C', false, -1);
    await delay(800);
    createEnemy(0, 70, -200, enemyGeometry, enemyMaterial, 'C', false, -1);
    await delay(2200);
    createEnemy(0, 70, -200, enemyGeometry, enemyMaterial, 'C', false, 1);
    await delay(800);
    createEnemy(0, 70, -200, enemyGeometry, enemyMaterial, 'C', false, 1);
    await delay(800);
    createEnemy(0, 70, -200, enemyGeometry, enemyMaterial, 'C', false, 1);
    await delay(800);
    createEnemy(0, 70, -200, enemyGeometry, enemyMaterial, 'C', false, 1);
    await delay(7500);

    createEnemy(-150, 6, -300, enemyGeometry, enemyMaterial, 'A', true);
    await delay(600);
    createEnemy(-100, 6, -300, enemyGeometry, enemyMaterial, 'A', true);
    await delay(600);
    createEnemy(50, 70, -150, enemyGeometry, enemyMaterial, 'D', false, -1);
    await delay(600);
    createEnemy(0, 70, -150, enemyGeometry, enemyMaterial, 'D', false, -1);
    await delay(600);
    createEnemy(-50, 70, -150, enemyGeometry, enemyMaterial, 'D', false, -1);
    await delay(600);
    createEnemy(100, 6, -300, enemyGeometry, enemyMaterial, 'A', true);
    await delay(600);
    createEnemy(150, 6, -300, enemyGeometry, enemyMaterial, 'A', true);
    await delay(6500);

    createEnemy(-150, 6, -300, enemyGeometry, enemyMaterial, 'A', true);
    await delay(600);
    createEnemy(-100, 6, -300, enemyGeometry, enemyMaterial, 'A', true);
    createEnemy(-360, 70, -120, enemyGeometry, enemyMaterial, 'B');
    await delay(1000);
    createEnemy(-360, 70, -120, enemyGeometry, enemyMaterial, 'B');
    await delay(1000);
    createEnemy(-360, 70, -120, enemyGeometry, enemyMaterial, 'B');
    await delay(1000);
    createEnemy(-360, 70, -120, enemyGeometry, enemyMaterial, 'B');
    await delay(1000);
    createEnemy(-360, 70, -120, enemyGeometry, enemyMaterial, 'B');
    await delay(7500);

    createEnemy(0, 70, -200, enemyGeometry, enemyMaterial, 'C', false, -1);
    await delay(800);
    createEnemy(-200, 70, -150, enemyGeometry, enemyMaterial, 'D', false, 1);
    await delay(800);
    createEnemy(0, 70, -200, enemyGeometry, enemyMaterial, 'C', false, -1);
    await delay(800);
    createEnemy(-200, 70, -150, enemyGeometry, enemyMaterial, 'D', false, 1);
    await delay(800);
    createEnemy(0, 70, -200, enemyGeometry, enemyMaterial, 'C', false, -1);
    await delay(800);
    createEnemy(10, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    await delay(800);
    createEnemy(150, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    await delay(800);
    createEnemy(70, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    await delay(800);
    createEnemy(100, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    await delay(6500);

    createEnemy(-150, 70, -170, enemyGeometry, enemyMaterial);
    createEnemy(360, 70, -20, enemyGeometry, enemyMaterial, 'B', false, 1);
    await delay(800);
    createEnemy(-100, 70, -170, enemyGeometry, enemyMaterial);
    createEnemy(360, 70, -70, enemyGeometry, enemyMaterial, 'B', false, 1);
    await delay(800);
    createEnemy(-50, 70, -170, enemyGeometry, enemyMaterial);
    createEnemy(360, 70, -120, enemyGeometry, enemyMaterial, 'B', false, 1);
    await delay(7500);

    createEnemy(360, 70, 140, enemyGeometry, enemyMaterial, 'B', false, 1);
    await delay(900);
    createEnemy(360, 70, 140, enemyGeometry, enemyMaterial, 'B', false, 1);
    await delay(400);
    createEnemy(150, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    await delay(500);
    createEnemy(360, 70, 140, enemyGeometry, enemyMaterial, 'B', false, 1);
    await delay(400);
    createEnemy(70, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    await delay(500);
    createEnemy(360, 70, 140, enemyGeometry, enemyMaterial, 'B', false, 1);
    await delay(400);
    createEnemy(10, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    await delay(7500);

    createEnemy(0, 70, -170, enemyGeometry, enemyMaterial);
    createEnemy(150, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    createEnemy(-150, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    await delay(1000);
    createEnemy(-40, 70, -170, enemyGeometry, enemyMaterial);
    createEnemy(40, 70, -170, enemyGeometry, enemyMaterial);
    await delay(1000);
    createEnemy(-80, 70, -170, enemyGeometry, enemyMaterial);
    createEnemy(80, 70, -170, enemyGeometry, enemyMaterial);
    await delay(1000);
    createEnemy(-120, 70, -170, enemyGeometry, enemyMaterial);
    createEnemy(120, 70, -170, enemyGeometry, enemyMaterial);
    await delay(1000);
    createEnemy(-160, 70, -170, enemyGeometry, enemyMaterial);
    createEnemy(160, 70, -170, enemyGeometry, enemyMaterial);
    createEnemy(0, 6, -250, enemyGeometry, enemyMaterial, 'A', true);
    await delay(6500);

    createEnemy(-200, 70, -150, enemyGeometry, enemyMaterial, 'D', false, 1);
    await delay(800);
    createEnemy(200, 70, -150, enemyGeometry, enemyMaterial, 'D', false, -1);
    await delay(800);
    createEnemy(-200, 70, -150, enemyGeometry, enemyMaterial, 'D', false, 1);
    await delay(800);
    createEnemy(200, 70, -150, enemyGeometry, enemyMaterial, 'D', false, -1);
    await delay(800);
    createEnemy(-200, 70, -150, enemyGeometry, enemyMaterial, 'D', false, 1);
    await delay(800);
    createEnemy(200, 70, -150, enemyGeometry, enemyMaterial, 'D', false, -1);
    await delay(800);
}

