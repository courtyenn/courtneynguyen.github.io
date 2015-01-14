var game_template = (function () {
    
    var CANVAS_WIDTH = 900, CANVAS_HEIGHT = 600, FPS = 30, SQUARE=40; //Game dimensions
    var BLUE = 0, WHITE = 1, RED = 2, GREEN = -1; //POWER-UPS
    var canvas, stage, queue, frames = 0, previousGameState = "", currentGameState ="", score = 0; //Critical game variables
    var menu, gamePlay, gameMenu, instructions, creditButton, credits; //Game screens
    var mainCharacter, enemies = []; //Enemy and enemies are hardcoded for now
    var snManager, roomManager, date; //Support variables
    var cloverSheet; //Global spritesheets
    var keyPressed = {},jamieButton = false;
    var panelContainer, thePanel, redCount, redTally = 0, greenCount, greenTally = 0, blueCount, blueTally = 0, whiteCount, whiteTally = 0;
    var panelHealthbarCurrent, panelRedActive, panelBlueActive, panelWhiteActive, panelAreaName;
    var healthWidth = 200, powerUpHeight = 200;
    
    var trackingBoss = false;
    
    document.onkeydown = handleKeyPress;
    document.onkeyup = handleKeyRelease;

window.onkeyup = function(event) {
    keyPressed[event.keyCode] = true;
};
    
    var fileManifest = [
        {src:"titleScreen.png", id:"title_screen"},
        {src:"BriSpriteSheet.png", id:"bri"},
        {src:"instruction_screen.jpg", id:"instructions"},
        {src:"gameOverScreen.png", id:"gameover_screen"},
        {src:"gameWinScreen.png", id:"gameWinScreen"},
        {src:"goblin.png", id:"F1_enemy"},
        {src:"cloverSheet.png", id:"all_clovers"},
        {src:"F1_bg.jpg", id:"forest_background"},
        {src:"caveEntranceBackground.png", id:"cave_entrance_background"},
        {src:"F1_bush.png", id:"F1_obj"},
        {src:"trans.png", id:"trans"},
        {src:"menuButtons.png", id:"menuButtons"},
        {src:"pinBoar.png", id:"pinBoar"},
        {src:"bigRock.png", id:"bigRock"},
        {src:"boss.png", id:"boss"},
        {src:"bossBackground.png", id:"bossBackground"},
       {src: "audio/1TitleScreen.mp3", id: "musicPreGame"}, 
       {src: "audio/2ForestLevel.mp3", id: "musicForestLevel"}, 
       // {src: "audio/3CaveEntrance.mp3", id: "musicCaveEntrance"}, 
       // {src: "audio/4CaveLevel.mp3", id: "musicCaveLevel"}, 
       // {src: "audio/5LavaLevel.mp3", id: "musicLavaLevel"}, 
       // {src: "audio/6BossLevel.mp3", id: "musicBossLevel"}, 
       {src: "audio/7GameOver.mp3", id: "musicGameOver"}, 
        {src: "audio/weaponswipe.mp3",id: "weaponswipe"},
        {src: "C1_bg.jpg", id:"cave_background"},
        {src: "C1_rock.png", id:"C1_rock"},
        {src: "L1_rock.png", id:"L1_rock"},
        {src: "L1_bg.jpg", id:"lava_background"},
        {src: "P1_bg.jpg", id: "pink_background"},
        {src: "credits.jpg", id: "creditPic"}
    ];
    
    function displaySprites() {
        roomDefiner.defineRooms(mainCharacter);
        roomDefiner.roomManager.startRoom();
        mainCharacter.playAnimation("standUp");  
    }
    
function createSidePanel() {

        function mainPanel(){
            return new createjs.Container()
        }

        function panelBackground(hexColor){
            this.hexColor = hexColor;
            return new createjs.Shape(new createjs.Graphics().beginFill(this.hexColor).drawRect(0, 0, 300, 600))
        }

        function panelText(displayText, sizeAndFont, hexColor){
            this.displayText = displayText;
            this.sizeAndFont = sizeAndFont;
            this.hexColor = hexColor;
            return new createjs.Text(this.displayText, this.sizeAndFont, this.hexColor)
        }

        function panelHealthbar(hexColor, width, height) {
            this.hexColor = hexColor;
            this.width = width;
            this.height = height;
            return new createjs.Shape(new createjs.Graphics().beginFill(this.hexColor).drawRect(0, 0, this.width, this.height))
        }

        function panelClover(hexColor, width, height) {
            this.sprite = new createjs.Sprite(cloverSheet);
            this.sprite.gotoAndStop(hexColor);
            this.hexColor = hexColor;
            // this.width = width;
            // this.height = height; not necessary for sprites but is for shapes
            return this.sprite;
            // return new createjs.Shape(new createjs.Graphics().beginFill(this.hexColor).drawRect(0, 0, this.width, this.height))
        }

        function panelPowerUpTimer(hexColor, width, height) {
            this.hexColor = hexColor;
            this.width = width;
            this.height = height;
            return new createjs.Shape(new createjs.Graphics().beginFill(this.hexColor).drawRect(0, 0, this.width, this.height))
        }

        function panelArea(icon, width, height){
            this.icon = icon;
            this.width = width;
            this.height = height;
            return new createjs.Shape(new createjs.Graphics().beginFill(this.hexColor).drawRect(0, 0, this.width, this.height))
        }

        function panelBag(hexColor, width, height){
            this.hexColor = hexColor;
            this.width = width;
            this.height = height;
            return new createjs.Shape(new createjs.Graphics().beginFill(this.hexColor).drawRect(0,0, this.width, this.height))
        }

         //////////////////////
        /// main container ///
        panelContainer = new mainPanel();
        panelContainer.x = 600;
        panelContainer.y = 0;

         ////////////////////////
        /// panel background ///
        var panelBackgroundColor = new panelBackground("#222");
        panelContainer.addChild(panelBackgroundColor);

         //////////////////
        /// healthbars ///
        panelHealthbarCurrent = new panelHealthbar("#CC453D", 200, 40);
        panelHealthbarCurrent.x = 60;
        panelHealthbarCurrent.y = 50;
        var panelHealthbarEmpty = new panelHealthbar("#F4C6C3", 200, 40);
        panelHealthbarEmpty.x = 60;
        panelHealthbarEmpty.y = 50;
        panelContainer.addChild(panelHealthbarEmpty, panelHealthbarCurrent);

         ///////////////
        /// clovers ///
        var panelRedClover = new panelClover("redClover", 30, 30);
        panelRedClover.x = 87;
        panelRedClover.y = 110;
        var panelBlueClover = new panelClover("blueClover", 30, 30);
        panelBlueClover.x = 143;
        panelBlueClover.y = 110;
        var panelWhiteClover = new panelClover("whiteClover", 30, 30);
        panelWhiteClover.x = 200.5;
        panelWhiteClover.y = 110;
        panelContainer.addChild(panelRedClover, panelBlueClover, panelWhiteClover);

         //////////////////////
        /// powerup timers ///
        panelRedActive = new panelPowerUpTimer("#FF7068", 40, 0);
        panelRedActive.x = 82;
        panelRedActive.y = 160;
        var panelRedNotActive = new panelPowerUpTimer("#EEEEEE", 40, 100);
        panelRedNotActive.x = 82;
        panelRedNotActive.y = 160;
        panelBlueActive = new panelPowerUpTimer("#6CC7D9", 40, 0);
        panelBlueActive.x = 138;
        panelBlueActive.y = 160;
        var panelBlueNotActive = new panelPowerUpTimer("#EEEEEE", 40, 100);
        panelBlueNotActive.x = 138;
        panelBlueNotActive.y = 160;
        panelWhiteActive = new panelPowerUpTimer("#D8D9CB", 40, 0);
        panelWhiteActive.x = 195.5;
        panelWhiteActive.y = 160;
        var panelWhiteNotActive = new panelPowerUpTimer("#EEEEEE", 40, 100);
        panelWhiteNotActive.x = 195.5;
        panelWhiteNotActive.y = 160;
        panelContainer.addChild(panelRedNotActive, panelBlueNotActive, panelWhiteNotActive);
        panelContainer.addChild(panelRedActive, panelBlueActive, panelWhiteActive);

         ////////////
        /// area ///
        var panelAreaIcon = new panelArea("#BFC9CC", 60, 60);
        panelAreaIcon.x = 60;
        panelAreaIcon.y = 300;
        panelAreaName = new panelText("Area Name", "bold 20px Haettenschweiler", "#EEEEEE");
        panelAreaName.x = 75;
        panelAreaName.y = 300;
        panelContainer.addChild(panelAreaIcon, panelAreaName);

        ///////////////////
        /// clover bag ///
        var panelCloverBag = new panelBag("#987640", 250, 170);
        panelCloverBag.x = 25;
        panelCloverBag.y = 405;
        var bagRedClover = new panelClover("redClover", 30, 30);
        bagRedClover.x = 35;
        bagRedClover.y = 415;
        var bagGreenClover = new panelClover("greenClover", 30, 30);
        bagGreenClover.x = 35;
        bagGreenClover.y = 455;
        var bagBlueClover = new panelClover("blueClover", 30, 30);
        bagBlueClover.x = 35;
        bagBlueClover.y = 495;
        var bagWhiteClover = new panelClover("whiteClover", 30, 30);
        bagWhiteClover.x = 35;
        bagWhiteClover.y = 535;

         //////////////
        /// tallys ///
        redCount = new panelText(" x  " + redTally, "bold 20px Arial", "#FF7068");
        redCount.x = 75;
        redCount.y = 420;
        greenCount = new panelText(" x  " + greenTally, "bold 20px Arial", "#96E54E");
        greenCount.x = 75;
        greenCount.y = 460;
        blueCount = new panelText(" x  " + blueTally, "bold 20px Arial", "#6CC7D9");
        blueCount.x = 75;
        blueCount.y = 500;
        whiteCount = new panelText(" x  " + whiteTally, "bold 20px Arial", "#D8D9CB");
        whiteCount.x = 75;
        whiteCount.y = 540;

        panelContainer.addChild(panelCloverBag);
        panelContainer.addChild(redCount, greenCount,blueCount, whiteCount);
        panelContainer.addChild(bagRedClover, bagGreenClover, bagBlueClover, bagWhiteClover);

        /////////////////////
        /// add to stage ///
        stage.addChild(panelContainer);
        panelContainer.visible = true;

        stage.update();
        // return {
        //     updateHpShape: function() {
        //         var increase, decrease;
        //     },

        //     updatePowerShape: function(powerUpTime) {
        //         var increase, decrease;
        //     },

        //     updateCloverCount: function(color, count) {
        //         var color, count, powerUpTime;
        //         return count;
        //     },

        //     updateArea: function() {
        //         var name, icon;
        //     },

        //     updateCloverBag: function() {
        //         // clover count
        //     }
        // }
    }

    function updatePanelAreaName(areaName){
        panelAreaName.text = areaName;
    }

    function updatePanelAreaIcon(areaIcon) {
        panelAreaIcon.sprite.gotoAndPlay(areaIcon);
    }

    function Character(sprite, posX, posY){
        var sprite = sprite;
        var currentHp = 16;
        var maxHp = 16;
        var damage = 1;
        var poweredDamage = 1;
        var range = 1;
        var name = "Bri";
        var currentPowerUps = [];
        var width = SQUARE;
        var height = SQUARE;
        var pos = {x: posX, y: posY, width: SQUARE, height: SQUARE};
        var x = posX;
        var y = posY;
        var speed = 5;
        var poweredSpeed = 5;
        var attackTimer = 0;
        var alive = true;
        var currentState = "NORMAL";
        var direction = "UP";
        var collectedClovers = {
        red: 0,
        blue: 0,
        white: 0,
        green: 0
        };
        
        function attack(){
            var weaponswipe = createjs.Sound.play("weaponswipe", {interrupt: createjs.Sound.INTERRUPT_ANY});
            for(var x = 0; x < enemies.length; x++){
                //console.log(collides(pos, enemies[x]));
                if(collidesAttack(pos, enemies[x],mainCharacter.direction)){
                    //console.log("DAMAGE: " + damage);
                    enemies[x].takeDamage(damage);  
                }
            }
        }
        return{
            name: name,
            x: this.x,
            y: this.y,
            width: width,
            height: height,
            currentHp: currentHp, 
            maxHp: maxHp,
            damage : damage,
            sprite: sprite,
            speed : speed,
            alive: alive,
            currentState : currentState,
            currentPowerUps: currentPowerUps,
            direction: this.direction,
            collectedClovers: collectedClovers, //Clayton, use this property to get individualized amounts of red, blue, green and white clovers
            /*
            
            ALEJANDRO, CLAYTON: I propose we make blue a speed boost. A shield is too complex for this short of a time period and requires
            complex testing. So, for now, I am making it a speed boost, and then if we have time we'll make it an aura. 
            
            */
            init: function(){
                this.currentHp = maxHp;
                console.log("I AM ALIVE!! : " + this.currentHp + " maxHp: " + maxHp);
                alive = true;
            },
            takeDamage : function(amountHit){
                //console.log("I'VE BEEN HIT FOR: " + amountHit);
                this.currentHp -= amountHit;
                healthWidth = ((this.currentHp / this.maxHp) * 200);
                panelHealthbarCurrent.graphics.clear().beginFill("#CC453D").drawRect(0, 0, healthWidth, 40);
                healthBarWidthToHeal = this.currentHp + 2;
                if(this.currentHp <= 0){
                    alive = false;
                 currentGameState = "GAME_OVER";   
                }
            },
            playAnimation : function(action){
                sprite.gotoAndPlay(action);
            },
            addClover: function(clover){
               
                if(clover.power >= 0){
                
                    if(clover.power === 0){
                    collectedClovers.blue+=1;  
                    blueCount.text = " x  " + collectedClovers.blue;
                    if( (speed + poweredSpeed) <= 10)
                    speed = (speed + poweredSpeed);
                    //console.log("SPEED IS: " + speed);
                    }
                    else if(clover.power === 1){
                    collectedClovers.white+=1; 
                    whiteCount.text = " x  " + collectedClovers.white; 
                    // this.currentHp = this.maxHp;
                    healthWidth = ((this.currentHp / this.maxHp) * 200);
                    panelHealthbarCurrent.graphics.clear().beginFill("#CC453D").drawRect(0, 0, healthWidth, 40);
                    }
                    else if(clover.power === 2){
                    collectedClovers.red+=1;  
                    redCount.text = " x  " + collectedClovers.red;
                    // poweredDamage = (damage);
                    damage = (damage + poweredDamage);
                    console.log("DAMAGE IS: " + damage);
                    }
                    if(jamieButton === false)
                    clover.active = true;
                    currentPowerUps.push(clover);
                }
                else{
                 collectedClovers.green+=1;
                    greenCount.text = " x  " + collectedClovers.green;
                }
                //console.log(collectedClovers);
            },
            setVisible : function(visibility){
              this.sprite.visible = visibility;  
            },
            draw: function(){
                sprite.x = x;
                sprite.y = y;
            },
            update: function(){
            if(attackTimer > 0){
                attackTimer--;
                console.log(attackTimer);
            }
            if(this.visible && this.alive)this.setVisible(true);
            var hasCollided = false;
            if(getKeyState(KEY_UP)){
                this.y -= speed;
                if(!attackTimer > 0){
                    sprite.gotoAndPlay("standUp");
                }
                this.direction = "UP";
            }
            if(getKeyState(KEY_RIGHT))
            {
                this.x += speed;
                if(!attackTimer > 0){
                    sprite.gotoAndPlay("standRight");
                }
               this.direction = "RIGHT";
            }
            if(getKeyState(KEY_DOWN))
            {
                this.y += speed;
                if(!attackTimer > 0){
                    sprite.gotoAndPlay("standDown");
                }
                this.direction = "DOWN";
            }     
            if(getKeyState(KEY_LEFT)){
                this.x -= speed;
                if(!attackTimer > 0){
                    sprite.gotoAndPlay("standLeft");
                }
                this.direction = "LEFT";
            }
            if(keyPressed[KEY_SPACE]){
               // console.log("key space");
                switch(this.direction){
                    case "UP":
                        sprite.gotoAndPlay("attackUp");
                        break;
                    case "LEFT":
                        sprite.gotoAndPlay("attackLeft");
                        break;
                    case "DOWN":
                        sprite.gotoAndPlay("attackDown");
                        break;
                    case "RIGHT":
                        sprite.gotoAndPlay("attackRight");
                        break;
                }
                if(attackTimer <= 1){
                    attackTimer = 10;
                    console.log("ATTACK");
                    for(var i = 0; i < enemies.length; i++){
                       if(isFacing(this, enemies[i])){
    //                       console.log("facing");
                            attack(); 
                       }
                    }
                }
                keyPressed[KEY_SPACE] = false;
            }
            pos.x = this.x;
            pos.y = this.y;
    
            var screen = snManager.getCurrentScreen();             
            var obstacles = screen.getAllObstacles();
            for(var m = 0; m < obstacles.length; m++){
                if(obstacles[m].isSolid){
               hasCollided = collides(pos, obstacles[m]);
                if (hasCollided)break;
            }
            }
         if(!hasCollided){
            for(var m = 0; m < enemies.length; m++){
                if(enemies[m].alive){
               hasCollided = collides(pos, enemies[m]);
                if (hasCollided)break;
                }
            }
         }
            var cloveArray = screen.getAllClovers();
                for(var m = 0; m < cloveArray.length; m++){
                if(collides(mainCharacter,cloveArray[m]) && cloveArray[m].visible){
                       
                        cloveArray[m].sprite.visible = false;
                        cloveArray[m].visible =false;
                        mainCharacter.addClover(cloveArray[m]);
                         screen.removeClover(cloveArray[m]);
                       
                          
                    }
                }
           
            
                //console.log("has collided?: " + hasCollided);
                if(hasCollided){
                    pos.x = sprite.x
                    pos.y = sprite.y;
                    this.x = sprite.x;
                    this.y = sprite.y;
//                    x = sprite.x;
//                    y = sprite.y;
                }
                else{
                 sprite.x = this.x;
                sprite.y = this.y;  
//                this.x = x;
//                this.y = y;
                }
            if(this.currentPowerUps.length > 0){
                var clover = undefined;
                for(var i=0; i < this.currentPowerUps.length; i++){
                    clover = this.currentPowerUps[i];

                if(clover.power === 0) {
                    powerUpHeight = (this.currentPowerUps[i].currentTime / this.currentPowerUps[i].timeDuration) * 100;
                    panelBlueActive.graphics.clear().beginFill("#87C7D9").drawRect(0, 100, 40, -1 * (100 - powerUpHeight));
                }
                else if(clover.power === 1) {
                    powerUpHeight = (this.currentPowerUps[i].currentTime / this.currentPowerUps[i].timeDuration) * 100;
                    panelWhiteActive.graphics.clear().beginFill("#CBD6D9").drawRect(0, 100, 40, -1 * (100 - powerUpHeight));

                    healthWidth = (this.currentHp / this.maxHp) * 200;
                    panelHealthbarCurrent.graphics.beginFill("#CC453D").drawRect(healthWidth, 0, 200 - healthWidth, 40);
                }
                else if(clover.power === 2) {
                    powerUpHeight = (this.currentPowerUps[i].currentTime / this.currentPowerUps[i].timeDuration) * 100;
                    panelRedActive.graphics.clear().beginFill("#FF7A73").drawRect(0, 100, 40, -1 * (100 - powerUpHeight));
                }
                    
                    this.currentPowerUps[i].update(); //incrementing time here
                    //console.log(this.currentPowerUps[i].currentTime);
                   if(this.currentPowerUps[i].active) clover = this.currentPowerUps[i];
                        if(clover != undefined && clover.currentTime >= clover.timeDuration){
                            
                            clover.active = false;
                            if(clover.power === 0){
                                //console.log("speed: " + speed + " power:" + poweredSpeed);
                                speed = 5; 
                                panelBlueActive.graphics.clear();
                                console.log("BACK TO REGULAR SPEED: " + speed);

                            }
                            else if (clover.power === 1) {
                                panelWhiteActive.graphics.clear();
                            }
                            else if(clover.power === 2){
                                damage = (damage - poweredDamage);
                                panelRedActive.graphics.clear();
                                console.log('BACK TO REGULAR DAMAGE: ' + this.damage);
                                
                            }
                            this.currentPowerUps.unset(clover);
                            clover = undefined;
                            
                    }
             
            }
                //Clayton, grab the currentHp from here
                //console.log("what is currenthp? " + this.currentHp);
//                console.log("what is speed? " + this.speed);
            
            }
        }
    }
    }
    
    function PowerUp(sprite, posx, posy){
        var sprite = sprite;
        var active = false;
        var timeDuration = 100;
        var x = posx || 0;
        var y = posy || 0;
        var width = 30;
        var height = 30;
        var currentTime = 0;
        var power = -1;
        var visible = true;
        var healSpeed = 15;
        
        return{
            active : active,
            currentTime: currentTime,
            timeDuration: timeDuration,
            sprite : sprite,
            width: width,
            height: height,
            power: power,
            init: function(power2, posX, posY){
                this.power = power2;
                if(power2 < 0){
                    this.active = false;
                    sprite.gotoAndPlay("greenClover");
                    sprite.visible = true;
                    sprite.x = posX;
                    sprite.y = posY;
                    stage.addChild(sprite);
                }
                else{ 
                    switch(power2){
                        case 0:
                            sprite.gotoAndPlay("blueClover");
                            break;
                        case 1:
                            sprite.gotoAndPlay("whiteClover");
                            break;
                        case 2:
                            sprite.gotoAndPlay("redClover");
                            break;
                    }
                    
                    }
            },
            setVisibleFalse : function(){
              this.sprite.visible = visibility;  
            },
            setVisibleDepending: function(visibility){
                if(this.visible)this.sprite.visible = visibility;
            },
            draw: function(){
                if(visible){
                    sprite.x = x;
                    sprite.y = y;
                }
                else sprite.visible =false;
            },
            update: function(){
                    sprite.x = x;
                    sprite.y = y;
                    this.x = x;
                    this.y = y;
                    if(this.active || jamieButton && this.power === 1){
                        this.currentTime++;
                        if(this.power === 1 && this.currentTime%healSpeed === 0 && mainCharacter.currentHp < mainCharacter.maxHp){                      
                            mainCharacter.currentHp += 1;
                        }
                    }
                    
//                      if(collides(mainCharacter,this) && this.sprite.visible){
//                        this.sprite.visible = false;
//                        this.visible =false;
//                        mainCharacter.addClover(this);
//                        var currentScreen = snManager.getCurrentScreen();
//                          var cloverArray = currentScreen.getAllClovers();
//                          cloverArray.unset(this);
//                    }
                }
                     
            }
            
        }
    
        function Enemy(sprite, x, y){
        var sprite = sprite;
        var pos = {x: x, y: y};
        var damage = 1;
        var currentHp = 10;
        var maxHp = 10;
        var range = 3;
        var width = SQUARE;
        var height = SQUARE;
        var name = "";
        var currentPowerUps = [];
        var x = x;
        var y = y;
        var speed = 1;
        var direction;
        var alive = true;
        var currentState = "NORMAL";
        var difficulty = "MED";
        var SPEEDRATE = 25;
        
        function detect(){
            var isDetected = false;
          var distance = Math.floor( (Math.sqrt( Math.pow( (sprite.y - mainCharacter.y), 2 ) + Math.pow( (sprite.x - mainCharacter.x), 2 ) ))/2);
            if(distance <= 100){
                isDetected = true;
            }
            return isDetected;
        }
        return{
            name: name,
            x: this.x,
            y: this.y,
            currentHp: currentHp,
            maxHp: maxHp,
            damage : damage,
            sprite: sprite,
            speed : speed,
            alive: true,
            width: width,
            height: height,
            speedRate : 15,
            currentState:currentState,
            difficulty: difficulty,
            init: function(){
                sprite.x = 300;
                sprite.y = 300;
                sprite.visible = true;
                this.x = 300;
                this.y = 300;
                x = 300;
                y = 300;
            },
            init: function(difficulty){
                switch(difficulty){
                case 'MED':
                        speed = 2;
                        damage = 2;
                        currentHp = 16;
                        maxHp = 10;
                        this.speedRate = 16;
                break;
                case 'HARD':  
                        speed = 2;
                        damage = 3
                        maxHp = 20;
                        currentHp =20;
                        this.speedRate = 10;
                break;
                case 'BOSS':
                        speed = 3;
                        damage = 1;
                        maxHp = 26;
                        currentHp = 26;
                        this.speedRate = 5;
                break;
                default:
                //easy level already set
                break;
                }
            },
            takeDamage : function(amountHit){
                this.currentHp-=amountHit;
                console.log('OUCH HIT FOR: ' + amountHit);
                console.log("enemy hp: " + this.currentHp);
            },
            attack: function(){
                if(collidesAttack(this, mainCharacter,direction)){
                    //console.log("DAMAGE: " + damage);
                    mainCharacter.takeDamage(damage);   
                }
            },
            dropClover: function(){
                var rand = 0;
                var multiplier = 0;
                var cloverColor;
                var incrementX = -40;
                var incrementY = 0;
                switch(difficulty){
                    case "EASY":
                        for(var m = 0; m < 3; m++){
                        rand = getRandomArbitrary(1, 101);

                            if(rand < 85)cloverColor = GREEN;
                            else if(rand >= 85){
                             rand = getRandomArbitrary(1,16); 
                                if(rand <5)cloverColor = BLUE;
                                else if(rand < 10)cloverColor = RED;
                                else cloverColor = WHITE;
                            }
                        var clover = new PowerUp(new createjs.Sprite(cloverSheet), this.x+incrementX, this.y);
                            incrementX += 40;
                        clover.init(cloverColor);
                        currentScreen.addClover(clover, this.x+incrementX, this.y+incrementY);
                        }
                        break;
          
                    default:
                        for(var m = 1; m < 7; m++){
                            if(m%3 ==0){
                                incrementX = -40;
                                incrementY +=40;
                            }
                        rand = getRandomArbitrary(1, 101);

                            if(rand < 75)cloverColor = GREEN;
                            else if(rand >= 75){
                             rand = getRandomArbitrary(1,16); 
                                if(rand <5)cloverColor = BLUE;
                                else if(rand < 10)cloverColor = RED;
                                else cloverColor = WHITE;
                            }
                        var clover = new PowerUp(new createjs.Sprite(cloverSheet), this.x+incrementX, this.y + incrementY);
                            incrementX += 40;
                            clover.init(cloverColor);
                            var currentScreen = snManager.getCurrentScreen();
                            currentScreen.addClover(clover, this.x+incrementX, this.y+incrementY);
                        }
                        
                        break;
                }
            },
            playAnimation : function(action){
                sprite.gotoAndPlay(action);
            },
            setVisible : function(visibility){
              this.sprite.visible = visibility;  
              this.sprite.visible = visibility;  
            },
            updateCoordinates : function(posX, posY){
                this.x = posX || this.x;
                this.y = posY || this.y;
            },
            draw: function(){
                if(this.visible){
                 sprite.x = x;
                sprite.y = y;
                }
                else{
                    sprite.visible = false;   
                }
            },
            update: function(){
           
                if(this.alive){
                if(detect()){
                var xDistance = (mainCharacter.x - this.x);
                var yDistance = (mainCharacter.y - this.y);
                //console.log('Difference between x: ' + xDistance + ' Difference between y: ' + yDistance);
                var travelTo = {x: xDistance, y: yDistance}
                var reachedX = false;
                var reachedY = false;
                    if(travelTo.x > mainCharacter.width){
                        direction = "RIGHT";
                        sprite.gotoAndPlay("standRight");
                        this.x+= speed;
                    }
                    else if(travelTo.x < -mainCharacter.width){
                        direction = "LEFT";
                        sprite.gotoAndPlay("standLeft");
                        this.x -=speed;
                    }
                    else reachedX = true;
                    if(travelTo.y > mainCharacter.height){
                        direction = "DOWN";
                        sprite.gotoAndPlay("standDown");
                        this.y+= speed;
                    }
                    else if(travelTo.y < -mainCharacter.height){
                        direction = "UP";
                            sprite.gotoAndPlay("standUp");
                            this.y-=speed;
                    }
                    else reachedY = true;
                    
                    if(frames%this.speedRate==0){ //determines how fast the enemy hits
                    if(reachedX && reachedY){
                        this.attack(); 
                    }
                    }
                    
                }
                var hasCollided = false;
                var screen = snManager.getCurrentScreen();             
                var obstacles = screen.getAllObstacles();
                for(var m = 0; m < obstacles.length; m++){
                    if(obstacles[m].isSolid){
                       hasCollided = collides(this, obstacles[m]);
                        if (hasCollided)break;
                    }
                }
                if(hasCollided){
                 this.x = sprite.x;
                this.y =sprite.y;
                }else{
                sprite.x = this.x;
                sprite.y = this.y;
                }
//                this.x = x;
//                this.y =y;
//                y = y;
//                x = x;
                if(this.currentHp <=0 && currentState == "NORMAL"){
                    this.alive= false;
                    this.visible = false;
                    this.setVisible(false);
                    this.dropClover();
                    currentState = "DEAD";
                    //enemies.unset(this);
//                    var index = enemies.indexOf(this);
//                    if(index !=-1)
//                    enemies.splice(index, 1);
                }
                }else{
                this.visible = false;
                this.setVisible(false);
                }
            }
        }
    }
    
    function ScreenManager(){
        var screens = {};
        var numberScreens = [];
        return{
            currentScreen : "undefined",
            addScreen : function(id, screen){
                screens[id] = screen;
                numberScreens.push(screen);
            },
            getScreen : function(id){
                return screens[id];
            },
            getCurrentScreen : function(){
                return this.currentScreen;
            },
            getAllScreens : function(){
                return numberScreens;
            },
            switchScreen : function(id){
                for(var x = 0; x < numberScreens.length; x++){
                    numberScreens[x].visible = false;
                }
                screens[id].visible = true;
                this.currentScreen = screens[id];
            }
        }
    }

     
    function Screen(bg, left,top,animate,loop){
        var visible = false;
        var loop = loop;
//        var tween;
        var obstacles = new Array();
        if(bg != undefined){
        var image = new createjs.Bitmap(bg);
        image.x = left || 0;
        image.y = top || 0;
        if(animate !== "true")
            stage.addChild(image); 
        }
        
        var btns = new Array();
        var txt = new Array();
        var objects = new Array();
        var cloverArray = new Array();
        var lookObj = {};
        
        return {
            visible : false,
            draw : function (){
                
            },
            update: function (){
                if(this.visible){
                    image.visible = true;
                    for(var y = 0; y<btns.length;y++){
                        btns[y].visible = true;
                    }
                    for(var i = 0; i < txt.length; i++){
                        txt[i].visible = true;   
                    }
                    for(var i = 0; i < objects.length; i++){
                        if(objects[i].visible)
                        objects[i].setVisible(true);   
                    }
                     for(var i = 0; i <  obstacles.length; i++){
                     obstacles[i].visible = true;   
                    }
                     for(var i = 0; i <  cloverArray.length; i++){
                     cloverArray[i].setVisibleDepending(true);   
                    }
                }
                else{
                    if(image != undefined)
                    image.visible = false;
                    for(var y = 0; y<btns.length;y++){
                        //console.log(btns[y].visible);
                        btns[y].visible = false;
                    }
                    for(var i = 0; i < txt.length; i++){
                        txt[i].visible = false;   
                    }
                    for(var i = 0; i < objects.length; i++){
                        objects[i].setVisible(false);
                        
                    }
                    for(var i = 0; i <  obstacles.length; i++){
                     obstacles[i].visible = false;   
                    }
                     for(var i = 0; i <  cloverArray.length; i++){
                     cloverArray[i].setVisibleDepending(false);   
                    }
                 
                   
                }
            },
            addButton: function(x, y, action, sprite){
                var button;
                button = sprite;
                button.visible = false;
                button.x = x;
                button.y = y;
                
                
                btns.push(button);
                stage.addChild(button);
            },
            addContent: function(text, x, y, font, color){
                text.x = x || 0;
                text.y = y || 0;
                text.font = font || text.font || "19px Arial";
                text.color = color || text.color || "#f00";
                stage.addChild(text);
                txt.push(text);
            },
            addClover: function(obj, x, y){
                obj.x = x ||obj.x || 0;
                obj.y = y ||obj.y || 0;
                obj.visible= true;
                cloverArray.push(obj);
                if(obj.sprite != undefined){
                    obj.sprite.x = obj.x;
                    obj.sprite.y = obj.y;
                    stage.addChild(obj.sprite);
                }
                else console.error('Tried to add an object that does not have a sprite or image attached.');
            },
            removeClover: function(cloverObj){
                cloverArray.unset(cloverObj);
            },
            getAllClovers: function(){
              return cloverArray;  
            },
            addObstacle: function(imgObj, x, y){ //add anything apart of bg here, that isSolid and stuff
                imgObj.x = x ||imgObj.x || 0;
                imgObj.y = y ||imgObj.y || 0;
                imgObj.setVisible = function(visible){
                  this.visible = visible;  
                };
                imgObj.update = function(){
                  if(this.visible)this.visible= true;
                    else this.visible = false;
                };
                obstacles.push(imgObj);
                stage.addChild(imgObj);
            },
            getAllObstacles: function(){
                return obstacles;
            },
            addObject: function(id, obj, x, y){ //add enemies, anything moving here
                
                obj.x = x ||obj.x || 0;
                obj.y = y ||obj.y || 0;
                obj.visible= false;
                objects.push(obj);
                lookObj[id] = obj;
                if(obj.sprite === undefined && obj.image != undefined){
                    obj.image.x = x;
                    obj.image.y = y;
                 stage.addChild(obj.image);   
                }
                else if(obj.sprite != undefined)stage.addChild(obj.sprite);
                else console.error('Tried to add an object that does not have a sprite or image attached.');
            },
            getObject: function(id){
                return lookObj[id];
            },
            getAllObjects: function(){
                return objects;   
            },
            removeAllObjects: function(){
                lookObj = {};
                while(objects.length > 0) {
                    objects.pop();
                }
            },
            setAllObjectsVisible: function(visibility){
                for(var m = 0; m < objects.length; m++){
                 objects[m].setVisible(visibility);   
                objects[m].visible = visibility;
                }
            },
            playTween : function(){
//                image.visible = true;
//                tween = createjs.Tween.get(image, {loop:false}).to({x:image.x, y:CANVAS_HEIGHT-395},1500, createjs.Ease.bounceOut).wait(1200).
//                to({x:image.x,y:-400},1000,createjs.Ease.bounceOut).call(handleComplete);   
//                
//                stage.addChild(image);
            }
        }
    }
    
    function callJamieButton(){
        if(keyPressed[KEY_J]){
            if(jamieButton === false){
                console.log('jamiebutton ON');
                jamieButton = true;
        var redClover = new PowerUp(new createjs.Sprite(cloverSheet));
//        redClover.timeDuration = 999999;
        redClover.init(RED);
        redClover.visible = false;
//        redClover.setVisible(false);
        var blueClover = new PowerUp(new createjs.Sprite(cloverSheet));
//        blueClover.timeDuration = 999999;
        blueClover.init(BLUE);
                blueClover.visible = false;
//        blueClover.setVisible(false);
        var whiteClover = new PowerUp(new createjs.Sprite(cloverSheet));
//        whiteClover.timeDuration = 999999;
        whiteClover.init(WHITE);
                whiteClover.visible= false;
//        whiteClover.setVisible(false);
        mainCharacter.addClover(blueClover);
        mainCharacter.addClover(redClover);
        mainCharacter.addClover(whiteClover);
            keyPressed[KEY_J] = false;
            }
            else{
                console.log('jamiebutton OFF');
        jamieButton = false;
        
         var powers = mainCharacter.currentPowerUps;  
              for(var m = 0; m < powers.length;m++){
                  powers[m].currentTime = powers[m].timeDuration;
                    powers[m].active = true;
              }
             keyPressed[KEY_J] = false;
            }
        }
    }
    
    gamestates = {
        "START" : function(){
            if(previousGameState !== currentGameState){
                
            }
        },
        "TITLE" : function(){
            
            if(previousGameState !== currentGameState){             
                snManager.switchScreen("title");
                previousGameState = currentGameState;
                panelContainer.visible = true;
                createjs.Sound.stop();
               var musicPreGame = createjs.Sound.play("musicPreGame");
            }
            
            var length = snManager.getAllScreens().length;
            var list = snManager.getAllScreens()
            
            for(var x = 0; x < length; x++){
                var m = list[x];
                m.update();   
            }
            stage.update();
            
        },
        "PLAYING" : function(){      
            if(previousGameState !== currentGameState){
//                var lvl = snManager.getScreen("tween");
//                lvl.visible = true;
//                lvl.playTween();
                previousGameState = currentGameState;
                panelContainer.visible = true;
                //snManager.switchScreen("gamePlay");
                createjs.Sound.stop();
               var musicForestLevel = createjs.Sound.play("musicForestLevel");

            }
            roomDefiner.roomManager.updateRoom();
             var gameScreen = snManager.getCurrentScreen();
            
             var list = snManager.getAllScreens();
            
            for(var x = 0; x < list.length; x++){
                var m = list[x];
                m.update();   
            }
            var objects = gameScreen.getAllObjects();
            var allClovers = gameScreen.getAllClovers();
            var objlength = objects.length;
            for(var x = 0; x < objlength; x++){
                objects[x].update();
                stage.update();
            }
            if(trackingBoss){
                console.log(roomDefiner.roomManager.getCurrentRoom().checkEnemiesLeft());
                if(roomDefiner.roomManager.getCurrentRoom().checkEnemiesLeft() == false){
                    gameWin();
                }
            }
//            for(var x = 0; x < allClovers.length; x++){
//                allClovers[x].update();
//                stage.update();
//            }
            
//            gamePoints.text = 'Score: ' + score;
            stage.update();
            if(getKeyState(KEY_J))callJamieButton();

        },
        "INSTRUCTIONS" : function () {
            if(previousGameState !== currentGameState){
                previousGameState = currentGameState;
            }
            else{
                
            }
            var length = snManager.getAllScreens().length;
            var list = snManager.getAllScreens()
            
            for(var x = 0; x < length; x++){
                var m = list[x];
                m.update();   
            }
        },
        "LEVEL" : function() {
            if(previousGameState !== currentGameState){
//                var lvl = snManager.getScreen("tween");
//                lvl.visible = true;
//                lvl.playTween();
               // grid.init();
               // grid.set(HERO,mainCharacter.x,mainCharacter.y);
                
               // setObject(ENEMY,4);
                
                previousGameState = currentGameState;
            }
        },
        "GAME_OVER" : function(){
            if(previousGameState !== currentGameState){
                snManager.switchScreen("gameover");
                resetGame();
                previousGameState = currentGameState;
                createjs.Sound.stop();
                var length = snManager.getAllScreens().length;
                var list = snManager.getAllScreens()
            
                for(var x = 0; x < length; x++){
                    var m = list[x];
                    m.update();   
                }
                
                resetGame();
               var musicGameOver = createjs.Sound.play("musicGameOver");
                }
        },
            "CREDITS" : function(){
                 if(previousGameState !== currentGameState){
                     previousGameState = currentGameState;
                var length = snManager.getAllScreens().length;
                var list = snManager.getAllScreens()     
                    for(var x = 0; x < length; x++){
                        var m = list[x];
                        m.update();   
                    }
                }
            },
        "WIN" : function(){
            if(previousGameState !== currentGameState){
                snManager.switchScreen("gameWin");
                resetGame();
                previousGameState = currentGameState;
                createjs.Sound.stop();
                var length = snManager.getAllScreens().length;
                var list = snManager.getAllScreens()
            
                for(var x = 0; x < length; x++){
                    var m = list[x];
                    m.update();   
                }
                
                resetGame();
//                var musicGameOver = createjs.Sound.play("musicGameOver");
                }
        },
            

        }
    
    
    function resetGame(){
        var screen = snManager.getScreen('gamePlay');
        redTally = 0;
        mainCharacter.collectedClovers.red = redTally;
        redCount.text = " x  " + mainCharacter.collectedClovers.red;
        blueTally = 0;
        mainCharacter.collectedClovers.blue = blueTally;
        blueCount.text = " x  " + mainCharacter.collectedClovers.blue;
        greenTally = 0;
        mainCharacter.collectedClovers.green = greenTally;
        greenCount.text = " x  " + mainCharacter.collectedClovers.green;
        whiteTally = 0;
        mainCharacter.collectedClovers.white = whiteTally;
        whiteCount.text = " x  " + mainCharacter.collectedClovers.white;
        mainCharacter.currentHp = mainCharacter.maxHp;
        healthWidth = ((mainCharacter.currentHp / mainCharacter.maxHp) * 200);
        panelHealthbarCurrent.graphics.clear().beginFill("#CC453D").drawRect(0, 0, healthWidth, 40);
       // screen.removeAllObjects();
//        while(enemies.length > 0) {
//                    enemies.pop();
//        }
        mainCharacter.init();
        trackingBoss = false;


    }
    
    function handleClick(event) {  
        currentGameState = "PLAYING";
        var screen = snManager.getScreen("gamePlay");
        screen.removeAllObjects();
        screen.setAllObjectsVisible("true");
        snManager.switchScreen("gamePlay");
        displaySprites();
    }
    function menuClick(event){
        currentGameState = "TITLE";
        snManager.switchScreen("title");
    }
    function instructClick(event){
        currentGameState = "INSTRUCTIONS";   
        snManager.switchScreen("instructions");
    }
    function creditsClick(event){
        currentGameState = "CREDITS";
        snManager.switchScreen("creditScreen");
    }
    function gameWin(){
        currentGameState = "WIN";
    }
    function handleComplete(tween) {
        console.log('ANIMATION COMPLETED');
        //runGameTimer();
    }
    function resetGameTimer(){
        frames = 0;
        theTimer = 0;        
    }
    function pauseGameTimer(num){
        console.log('PAUSED TIME:' + num);
        pauseTimer= num + .1;   
    }
    function runGameTimer(){
        frames += 1;
        date = new Date();
    }
    
    function loadFiles(){
        queue = new createjs.LoadQueue(true, "assets/images/");
        queue.installPlugin(createjs.Sound);
        queue.on("complete", loadComplete, this);
        queue.loadManifest(fileManifest);
    }
    
    function loadComplete(evt){
        
        var buttonSheet = new createjs.SpriteSheet({
            images: [queue.getResult("menuButtons")],
            frames: [[0,0,155,76,0,88.5,38.05],[155,0,155,76,0,88.5,38.05],[310,0,155,76,0,88.5,38.05],[0,76,155,76,0,88.5,38.05],[155,76,155,76,0,88.5,38.05],[310,76,155,76,0,88.5,38.05],[0,152,155,76,0,88.5,38.05],[155,152,155,76,0,88.5,38.05]],
            animations: {
                play: [0, 0, "play"],
                playHover: [1, 1, "playHover"],
                instruct: [2, 2, "instruct"],
                instructHover: [3, 3, "instructHover"],
                menu: [4, 4, "menu"],
                menuHover: [5, 5, "menuHover"],
                credit: [6,6, "credit"],
                creditHover: [7,7, "creditHover"]
            }
        });
        
        var briSheet = new createjs.SpriteSheet({
            images: [queue.getResult("bri")],
            frames: [[0,0,40,39,0],[40,0,32,44,0],[72,0,40,36,0],[0,44,50,36,0],[50,44,37,38,0],[0,82,49,35,0],[49,82,35,37,0],[84,82,29,41,0]],
            animations: {
                standDown: [0, 0, "standDown"],
                attackDown: [1, 1, "attackDown"],
                standRight: [2, 2, "standRight"],
                attackRight: [3, 3, "attackRight"],
                standLeft: [4, 4, "standLeft"],
                attackLeft: [5, 5, "attackLeft"],
                standUp: [6, 6, "standUp"],
                attackUp: [7, 7, "attackUp"]
            }
        });
        
        var enemySheet = new createjs.SpriteSheet({
        images: [queue.getResult("F1_enemy")],
            frames: [[0,0,42,49,0],[42,0,49,43,0],[91,0,42,49,0],[133,0,49,43,0]],
            animations: {
                standUp: [0, 0, "standUp"],
                standRight: [1, 1, "standRight"],
                standDown: [2,2,"standDown"],
                standLeft: [3,3,"standLeft"]
            }   
        });
        
        cloverSheet = new createjs.SpriteSheet({
        images: [queue.getResult("all_clovers")],
        frames: [[0,0,31,31,0],[31,0,31,31,0],[0,31,31,31,0],[31,31,30,31,0]],
        animations: {
            greenClover: [0,0, "greenClover"],
            whiteClover: [2,2, "whiteClover"],
            redClover: [1,1, "redClover"],
            blueClover: [3,3, "blueClover"]
        }
        });
        
        
        mainCharacter = new Character(new createjs.Sprite(briSheet),CANVAS_WIDTH/2, 500);
        menu = new createjs.Sprite(buttonSheet);
        gameMenu = new createjs.Sprite(buttonSheet);
        var gameMenu2 = new createjs.Sprite(buttonSheet);
        var gameMenu3 = new createjs.Sprite(buttonSheet);
        var temp2 = new createjs.Sprite(buttonSheet);
        instructions = new createjs.Sprite(buttonSheet);
        creditButton = new createjs.Sprite(buttonSheet);
        menuClone = new createjs.Sprite(buttonSheet);
        
        
        var helper6 = new createjs.ButtonHelper(menuClone, "menu", "menuHover");
        var helper = new createjs.ButtonHelper(menu, "play", "playHover");
        var helper2 = new createjs.ButtonHelper(gameMenu, "menu", "menuHover");
        var helper3 = new createjs.ButtonHelper(instructions, "instruct", "instructHover");
        var helper4 = new createjs.ButtonHelper(gameMenu2, "menu", "menuHover");
        var helper5 = new createjs.ButtonHelper(creditButton, "credit", "creditHover");
        var helper6 = new createjs.ButtonHelper(gameMenu3, "menu", "menuHover");
        
        menu.addEventListener("click", handleClick);
        gameMenu.addEventListener("click", menuClick);
        gameMenu2.addEventListener("click", menuClick);
        gameMenu3.addEventListener("click", menuClick);
        instructions.addEventListener("click", instructClick);
        menuClone.addEventListener("click", menuClick);
        creditButton.addEventListener("click", creditsClick);
        
        
        var title = Screen(queue.getResult("title_screen"));
        var game_over = Screen(queue.getResult("gameover_screen"));
        var game_win = Screen(queue.getResult("gameWinScreen"));
        var instruct = Screen(queue.getResult("instructions"));
        var creditScreen = Screen(queue.getResult("creditPic"));
        var gamePlay = Screen();
        
        var shape = new createjs.Shape();
//        var tween = Screen(queue.getResult("level"), 100, 0,"true");
        
        snManager = new ScreenManager();
//        snManager.addScreen("tween", tween);
        snManager.addScreen("title", title);
        snManager.addScreen("gameover", game_over);
        snManager.addScreen("gameWin", game_win);
        snManager.addScreen("instructions", instruct);
        snManager.addScreen("creditScreen", creditScreen);
        snManager.addScreen("gamePlay", gamePlay);
        
        
        title.addButton(120,300, handleClick, menu);    
        title.addButton(280,300, instructClick, instructions);
        title.addButton(500, 50, creditsClick, creditButton);
        game_win.addButton(245, 375, menuClick, gameMenu3);
        game_over.addButton(245, 400, menuClick, gameMenu);
        instruct.addButton(245, 550, menuClick, gameMenu2);
        creditScreen.addButton(500, 550, menuClick, menuClone);
        
        
//        var creditTitle = new createjs.Text("Credits: ", "50px Arial", "#000");
//        creditScreen.addContent(creditTitle, 200, 30);
//        mousePos = new createjs.Text("Mouse", "20px Arial", "#f00");
//        textTime = new createjs.Text("Time: ", "20px Arial", "#f00");
//        gamePoints = new createjs.Text("Score: " + score, "30px Arial", "#fff");
//        gamePoints2 = new createjs.Text("Score: " + score, "30px Arial", '#fff');
        
        //gamePlay.addContent(mousePos);
        //gamePlay.addContent(textTime, CANVAS_WIDTH-190);
//        gamePlay.addContent(gamePoints, 60, CANVAS_HEIGHT-30);
//        game_over.addContent(gamePoints2, CANVAS_WIDTH/2-90, CANVAS_HEIGHT/2-90);
        
        currentGameState = "TITLE";
        startLoop();
        thePanel = createSidePanel();
        console.log("loadComplete");
    }
    
        function collides(a, b) {
//        console.log("a.x: " + a.x  + "< b.x + b.width: " + (b.x + b.width) );
//        console.log("a.x < b.x + b.width: " + (a.x < (b.x + b.width)));
//        console.log("a.x + a.width: " + ((a.x + a.width))  + "> b.x: " + (b.x) );
//      console.log("a.x + a.width > b.x: " + ((a.x + a.width) > b.x ));
//        console.log("a.y: " + a.y  + "< b.y + b.height: " + (b.y + b.height) );
//        console.log("a.y < b.y + b.height: " + (a.y < (b.y + b.height) ));
//        console.log("a.y + a.height: " + (a.y + a.height)  + "> b.y: " + (b.y) );
//        console.log("a.y + a.height > b.y: " + ((a.y + a.height) > b.y) );
        return a.x < (b.x + b.width) &&
        (a.x + a.width) > b.x &&
        a.y < (b.y + b.height) &&
        (a.y + a.height) > b.y;
    }
    
        function collidesAttack(a, b, direction) {
            var buffer = 8;
            var aX = a.x, aY = a.y, aH = a.height, aW = a.width;
            
            switch(direction){
            case "UP":
                aY  -= buffer;
                break;
            case "RIGHT":
                aX += buffer;
                break;
            case "DOWN":
                aY += buffer;
                break;
            case "LEFT":
                aX -= buffer;
                break;
            }
        return aX < (b.x + b.width) &&
        (aX + aW) > b.x &&
        aY < (b.y + b.height) &&
        (aY + aH) > b.y;
    }
    
    function isFacing(a,b){
        var dir = a.direction;
        //console.log('direction inside: ' + dir);
        var result = false;
        switch(dir){
            case "UP":
                result = (a.y > b.y);
                break;
            case "RIGHT":
                result = (a.x < b.x);
                break;
            case "DOWN":
                result = (a.y < b.y);
                break;
            case "LEFT":
                result = (a.x > b.x);
                break;
        }
                return result;
    }
    
    function startBossTracking(){
        trackingBoss = true;
    }
    
    function setup(){
        canvas = document.getElementById("game");
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);

        currentGameState = "TITLE";
        
    }
//    var oldXY = {x:0, y:0};
    function loop(){
//        var diff = oldXY.x - mainCharacter.x;
//        var diffY = oldXY.y - mainCharacter.y;
//        oldXY.x = mainCharacter.x;
//        oldXY.y = mainCharacter.y;
        //console.log("diffX: " + diff + " diffY: " + diffY);

        frames++;
        stage.update();
        gamestates[currentGameState]();
    }
    //This creates the loop that workes like setInterval
    function startLoop() {       
        createjs.Ticker.addEventListener("tick", loop);
        createjs.Ticker.setFPS(FPS);      
    }
    
    function init(){
        setup();
        loadFiles();
    }
   
        
    Array.prototype.unset = function(value) {
        if(this.indexOf(value) != -1) { // Make sure the value exists
            this.splice(this.indexOf(value), 1);
        }   
    }
    function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
    }
    
    return {
        Screen: Screen,
        Enemy: Enemy,
        cloverSheet: cloverSheet,
        PowerUp : PowerUp,
        startBossTracking: startBossTracking,
        setRoomManager : function setRoomManager(rmManager){
            this.roomManager = rmManager;
        },
        getRoomManager : function getRoomManager(){
            return this.roomManager;
        },
        setEnemies : function (enemyList){
            enemies = enemyList;
        },
        playGame : function playGame(){
            init();          
        },
        getQueue : function (){
            return queue;
        },
        getScreenManager : function (){
            return snManager
        },
        getMainCharacter : function (){
            return mainCharacter;
        },
        updatePanelAreaName: updatePanelAreaName,
        updatePanelAreaIcon: updatePanelAreaIcon
    }
    
    })();

(function(){
    game_template.playGame();
})();
