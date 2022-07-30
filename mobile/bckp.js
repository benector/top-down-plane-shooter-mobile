var joystickLPressed = false;
var shootButtonIsPressed = false;
var launchButtonIsPressed = false;
//controle do avião porjoystick
addJoysticks();

function addJoysticks(){
   
    // Details in the link bellow:
    // https://yoannmoi.net/nipplejs/
  
    let joystickL = nipplejs.create({
      zone: document.getElementById('joystickWrapper1'),
      mode: 'static',
      position: { top: '-80px', left: '80px' }
    });
    
    joystickL.on('move', function (evt, data) {
      console.log('evt', evt);
      console.log('data', data);
  
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
  
    joystickL.on('start', function(evt){
      console.log('joystickL pressed')
      joystickLPressed = true;
    });
    joystickL.on('end', function (evt) {
      console.log('joystickL unpressed')
      joystickLPressed = false;
      
    })
}  
function shootButtonPressed(){
    shootButtonIsPressed = true;
  }
  
  function launchButtonPressed(){
    launchButtonIsPressed = true;
  }
  
  const shootButton = document.getElementById('shoot');
  shootButton.addEventListener("click", shootButtonPressed);
  
  const launchButton = document.getElementById('launch');
  shootButton.addEventListener("click", launchButtonPressed);