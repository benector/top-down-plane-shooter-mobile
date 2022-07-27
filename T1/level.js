import * as THREE from  'three';
import { buildHealerGeometry, E1, E2, E3, launcher } from './geometries.js';
import { createEnemy, createRecharge, finishLevel} from './main.js';


let rechargeGeometry = buildHealerGeometry();
let rechargeMaterial = new THREE.MeshLambertMaterial( {color: "rgb(255, 0, 0)"} );
//TIPO A: createEnemy(-50, 70, -170, enemyGeometry, enemyMaterial);

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

export default async function playLevel(){
    await delay(2500);
    // createEnemy(-50, 70, -170, E1);
    // await delay(800);
    // createEnemy(50, 70, -170, E1);
    // await delay(800);
    // createEnemy(100, 70, -170, E1);
    // await delay(800);
    // createEnemy(-100, 70, -170, E1);
    // await delay(800);
    // createEnemy(150, 70, -170, E1);
    // await delay(800);
    // createEnemy(70, 70, -170, E1);
    // await delay(800);
    // createEnemy(-10, 70, -170, E1);
    // await delay(5500);

    createEnemy(0, 6, -250, launcher, 'A', true);
    await delay(999999999);
    createEnemy(150, 6, -250, launcher, 'A', true);
    await delay(800);
    createEnemy(70, 6, -250, launcher, 'A', true);
    createEnemy(-50, 70, -170, E1);
    await delay(800);
    createRecharge(-50, 70, -170, rechargeGeometry, rechargeMaterial);
    createEnemy(-70, 6, -250, launcher, 'A', true);
    createEnemy(-120, 70, -170, E1);
    await delay(6500);

    createEnemy(0, 70, -200, E3, 'C', false, -1);
    await delay(1000);
    createEnemy(0, 70, -200, E3, 'C', false, -1);
    await delay(1000);
    createEnemy(0, 70, -200, E3, 'C', false, -1);
    await delay(1000);
    createEnemy(0, 70, -200, E3, 'C', false, -1);
    await delay(2200);
    createEnemy(0, 70, -200, E3, 'C', false, 1);
    await delay(1000);
    createEnemy(0, 70, -200, E3, 'C', false, 1);
    await delay(1000);
    createEnemy(0, 70, -200, E3, 'C', false, 1);
    await delay(1000);
    createEnemy(0, 70, -200, E3, 'C', false, 1);
    await delay(7500);

    createEnemy(-150, 6, -300, launcher, 'A', true);
    await delay(600);
    createEnemy(-100, 6, -300, launcher, 'A', true);
    await delay(600);
    createEnemy(50, 70, -150, E2, 'D', false, -1);
    await delay(600);
    createEnemy(0, 70, -150, E2, 'D', false, -1);
    createRecharge(-30, 70, -170, rechargeGeometry, rechargeMaterial);
    await delay(600);
    createEnemy(-50, 70, -150, E2, 'D', false, -1);
    await delay(600);
    createEnemy(100, 6, -300, launcher, 'A', true);
    await delay(600);
    createEnemy(150, 6, -300, launcher, 'A', true);
    await delay(6500);

    createEnemy(-150, 6, -300, launcher, 'A', true);
    await delay(600);
    createEnemy(-100, 6, -300, launcher, 'A', true);
    createEnemy(-360, 70, -120, E1, 'B');
    await delay(1000);
    createEnemy(-360, 70, -120, E1, 'B');
    await delay(1000);
    createEnemy(-360, 70, -120, E1, 'B');
    await delay(1000);
    createEnemy(-360, 70, -120, E1, 'B');
    createRecharge(-120, 70, -170, rechargeGeometry, rechargeMaterial);
    await delay(1000);
    createEnemy(-360, 70, -120, E1, 'B');
    await delay(7500);

    createEnemy(0, 70, -200, E3, 'C', false, -1);
    await delay(800);
    createEnemy(200, 70, -150, E2, 'D', false, -1);
    await delay(800);
    createEnemy(0, 70, -200, E3, 'C', false, -1);
    await delay(800);
    createEnemy(200, 70, -150, E2, 'D', false, -1);
    await delay(800);
    createEnemy(0, 70, -200, E3, 'C', false, -1);
    await delay(800);
    createEnemy(10, 6, -250, launcher, 'A', true);
    await delay(800);
    createEnemy(150, 6, -250, launcher, 'A', true);
    await delay(800);
    createEnemy(70, 6, -250, launcher, 'A', true);
    await delay(800);
    createEnemy(100, 6, -250, launcher, 'A', true);
    await delay(6500);

    createEnemy(-150, 70, -170, E1);
    createEnemy(360, 70, -20, E1, 'B', false, 1);
    await delay(800);
    createEnemy(-100, 70, -170, E1);
    createEnemy(360, 70, -70, E1, 'B', false, 1);
    await delay(800);
    createEnemy(-50, 70, -170, E1);
    createEnemy(360, 70, -120, E1, 'B', false, 1);
    await delay(7500);

    createEnemy(360, 70, 140, E1, 'B', false, 1);
    await delay(900);
    createEnemy(360, 70, 140, E1, 'B', false, 1);
    await delay(400);
    createEnemy(150, 6, -250, launcher, 'A', true);
    await delay(500);
    createEnemy(360, 70, 140, E1, 'B', false, 1);
    await delay(400);
    createEnemy(70, 6, -250, launcher, 'A', true);
    await delay(500);
    createEnemy(360, 70, 140, E1, 'B', false, 1);
    await delay(400);
    createEnemy(10, 6, -250, launcher, 'A', true);
    createRecharge(50, 70, -170, rechargeGeometry, rechargeMaterial);
    await delay(7500);

    createEnemy(0, 70, -170, E1);
    createEnemy(150, 6, -250, launcher, 'A', true);
    createEnemy(-150, 6, -250, launcher, 'A', true);
    await delay(1000);
    createEnemy(-40, 70, -170, E1);
    createEnemy(40, 70, -170, E1);
    await delay(1000);
    createEnemy(-80, 70, -170, E1);
    createEnemy(80, 70, -170, E1);
    createRecharge(0, 70, -170, rechargeGeometry, rechargeMaterial);
    await delay(1000);
    createEnemy(-120, 70, -170, E1);
    createEnemy(120, 70, -170, E1);
    await delay(1000);
    createEnemy(-160, 70, -170, E1);
    createEnemy(160, 70, -170, E1);
    createEnemy(0, 6, -250, launcher, 'A', true);
    await delay(6500);

    createEnemy(-200, 70, -150, E3, 'D', false, 1);
    await delay(800);
    createEnemy(200, 70, -150, E3, 'D', false, -1);
    await delay(800);
    createEnemy(-200, 70, -150, E3, 'D', false, 1);
    await delay(800);
    createEnemy(200, 70, -150, E3, 'D', false, -1);
    await delay(800);
    createEnemy(-200, 70, -150, E3, 'D', false, 1);
    await delay(800);
    createEnemy(200, 70, -150, E3, 'D', false, -1);
    await delay(4200);

    createEnemy(-360, 70, 0, E1, 'B', false, -1);
    createEnemy(360, 70, 30, E1, 'B', false, 1);
    await delay(800);
    createEnemy(-360, 70, 0, E1, 'B', false, -1);
    createEnemy(360, 70, 30, E1, 'B', false, 1);
    await delay(300);
    createEnemy(-80, 70, -170, E1);
    createEnemy(0, 70, -170, E1);
    createEnemy(80, 70, -170, E1);
    createEnemy(100, 6, -250, launcher, 'A', true);
    createEnemy(-100, 6, -250, launcher, 'A', true);
    await delay(18500);

    finishLevel();

}

