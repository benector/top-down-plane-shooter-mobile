async function launchMissile(){
  if(playerDead)
    return;
  let missile= new Missile(missileGeometry, missileMaterial);
  missile.position.set(airplane.position.x, airplane.position.y, airplane.position.z - 10);
  scene.add(missile);
  if(!launching)
  return;
  await delay(500);
  if(launching)
    launchMissile();
}
//controle do avião porjoystick e botões

//botões
const shootButton = document.getElementById('shoot');
shootButton.addEventListener('touchstart', (event) => {
  if(!airplane.shooting){
    airplane.shooting = true;
    airplane.shootingTimer = 0;
    shoot();
  }
});

shootButton.addEventListener('touchend', (event) => {
  airplane.shooting = false;

});

const launchButton = document.getElementById('launch');
launchButton.addEventListener('touchstart', (event)=>{

  if(!launching){
    launching = true;
    launchMissile();
  }
})

launchButton.addEventListener('touchend', (event) => {
  launching = false;

});


//joysticks

function addJoysticks(){
   
    // Details in the link bellow:
    // https://yoannmoi.net/nipplejs/
  
    let joystickL = nipplejs.create({
      zone: document.getElementById('joystickWrapper1'),
      mode: 'static',
      position: { top: '-80px', left: '80px' }
    });
    
    joystickL.on('move', function (evt, data) {  
      const forward = data.vector.y
      const turn = data.vector.x
  
      if (forward > 0) 
        airplane.moveUp();
      else if (forward < 0)
      airplane.moveDown();
  
      if (turn > 0) 
        airplane.moveRight()
      else if (turn < 0)
        airplane.moveLeft()
    })
  

}  

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function restartGame(){
  await delay(5000)
  window.location.reload();
}

//start game
export function onStartButtonPressed() {
  
  const loadingScreen = document.getElementById( 'loading-screen' );
  loadingScreen.transition = 0;
  loadingScreen.classList.add( 'fade-out' );
  loadingScreen.addEventListener( 'transitionend', (e) => {
    const element = e.target;
    element.remove();  
  });  
  pause = false;

  addJoysticks();

}
