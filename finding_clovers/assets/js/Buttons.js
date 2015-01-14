var buttons = [];
var stage;

function setStage(stage){
    this.stage = stage;
}

function registerButton(x, y, action, sprite){
    var button;
    button = sprite;
    button.x = x;
    button.y = y;
    button.action = action;
    button.hovering = false;
    button.active = false;
    
    button.addEventListener("mouseover", handleButtonHover);
    button.addEventListener("mouseout", handleButtonExit);
    button.addEventListener("click", handleButtonClick);
    
    return buttons.push(button) - 1;
}
                            
function handleButtonHover(event){
    event.target.hovering = true;
    event.target.gotoAndStop(1);
}

function handleButtonExit(event){
    event.target.hovering = false;
    event.target.gotoAndStop(0);
}

function handleButtonClick(event){
    event.target.action();
}

//function checkHovering(x, y){
//    console.log("check hovering");
//    for(var i = 0; i < buttons.length; i++){
//        var target = buttons[i];
//        var bounds = target.getBounds();
//        if(target.active){
//            if(x > target.x && x < target.x + bounds.width 
//               && y > target.y && y < target.y + bounds.height){
//                target.hovering = true;
//                console.log("Hovering: " + i);
//            }else{
//                target.hovering = false;
//            }
//        }
//    }
//}

function activate(buttonIndex){
    buttons[buttonIndex].active = true;
    stage.addChild(buttons[buttonIndex]);
}

function deactivate(buttonIndex){
    buttons[buttonIndex].active = false;
    stage.removeChild(buttons[buttonIndex]);
}

function deactivateAll(){
    for(var i = 0; i < buttons.length; i++){
        buttons[i].active = false;
        stage.removeChild(buttons[i]);
    }
}