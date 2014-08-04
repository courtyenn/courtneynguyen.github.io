var rooms = (function () {
    var NORTH = 0, EAST = 1, SOUTH = 2, WEST = 3;
    var BLOCK_WIDTH = 40, BLOCK_HEIGHT = 40;
    var GRID_SIZE = 15;
    var LOGO_SPRITE;
    
    return {
        north:NORTH,
        east:EAST,
        south:SOUTH,
        west:WEST,
        currentRoom: 0,
        RoomManager : function () {
            return {
                roomArray : {
                    length : 0,
                    addRoom : function (room, roomKey){
                        this[roomKey] = room;
                        length++;
                    },
                    getRoom : function (roomKey){
                        return this[roomKey];
                    },
                    getLength : function (){
                        return length;
                    }
                },
                startingRoomKey : "undefined",
                startingDirection : "undefined",
                setRoom : function (room, roomKey) {
                    if(this.roomArray.getRoom(roomKey) == "undefined"){
                        this.roomArray.addRoom(room, roomKey);
                    }else{
                        this.roomArray[roomKey] = room;
                    }
                },
                getRoom : function (roomKey) {
                    return(this.roomArray[roomKey]);
                },
                getCurrentRoom : function (){
                    return this.currentRoom;
                },
                moveToRoom : function (roomKey, entranceDirection) {
                    var room = this.getRoom(roomKey);
                    this.currentRoom = room;
                    room.roomScreen.removeAllObjects();
                    game_template.getScreenManager().switchScreen(roomKey);
                    game_template.setEnemies(room.enemies);
                    room.PlaceObjects();
                    room.placeObstacles();
                    if(!room.levelCleared)
                    room.placeClovers();
                    room.levelCleared = true;
                    room.handleObjectEnter(game_template.getMainCharacter(), entranceDirection);
                    room.roomScreen.setAllObjectsVisible(true);
                    game_template.updatePanelAreaName(this.currentRoom.level + " " + this.currentRoom.name); 
                    // game_template.updatePanelAreaIcon(this.currentRoom.)
                },
                setStart : function (roomKey, direction){
                    this.startingRoomKey = roomKey;
                    this.startingDirection = direction;
                },
                startRoom : function () {
                    this.moveToRoom(this.startingRoomKey, this.startingDirection);
                },
                updateRoom : function (){
                    //console.log("update called");
                    if(this.currentRoom != 0){
                        var playerExiting = this.currentRoom.checkObjectExiting(game_template.getMainCharacter());
                        if(playerExiting.isExiting === true){
                            this.currentRoom.handleObjectExit(game_template.getMainCharacter(), playerExiting.direction);
                        }
                    }
                }
            };
        }, 
        Room : function (screen, levelName, mapArray, lvl) { // ** NEW PARAM ** pass in your 2d mapobject
            return {
                name : levelName,
                grid : Utilities.createArray(GRID_SIZE, GRID_SIZE),
                overlay : Utilities.createArray(GRID_SIZE, GRID_SIZE),
                BLUE : 0,
                WHITE : 1, 
                RED : 2, 
                GREEN : -1, //POWER-UPS
                enemies : new Array(0),
                objects : new Array(0),
                cloverArray: new Array(0),
                roomScreen : screen,
                exits : new Array(0),
                levelCleared: false,
                level : lvl || 1,
                mapObject: mapArray,
                parseRoom: function(image, cloverSprite, transImg, enemySheet, bossSheet){ //pass in the object's bitmap image and a sprite
                var letter = 'X';
                var cloverSheet = new createjs.Sprite(cloverSprite);
                var enmySheet = new createjs.Sprite(enemySheet);
                var object = null;
                var img = new createjs.Bitmap(image);
                var trans = new createjs.Bitmap(transImg);
                if(this.mapObject != null){
                    for(var m=0; m < this.mapObject.length; m++){
                        for(var j=0; j< this.mapObject[m].length; j++){

                            letter = this.mapObject[j][m];

                            switch (letter){
                                case 'X': 
                                //do nothing
                                break;
                                case 'x':
                                trans.cache();                  
                                object = trans.clone();
                                object.isSolid=true;
                                this.AddObstacle(object, m, j);
                                break;
                                case 'O':    
                                img.cache();                  
                                object = img.clone();
                                object.isSolid=true;
                                this.AddObstacle(object, m, j);
                                break;
                                case 'o':
                                img.cache();                  
                                object = img.clone();
                                object.isSolid=false;
                                this.AddObstacle(object, m, j);
                                break;
                                case 'G':
                                cloverSheet.cache();
                                var clvrSprite = cloverSheet.clone();
                                 var clov = game_template.PowerUp(clvrSprite, j*40, m*40);
                                clov.init(this.GREEN); 
                                this.AddClover(clov, m, j);
                                break;
                                case 'W':
                                cloverSheet.cache();
                                var clvrSprite = cloverSheet.clone();
                                 var clov = game_template.PowerUp(clvrSprite, j*40, m*40);
                                clov.init(this.WHITE); 
                                this.AddClover(clov, m, j);
                                    break;
                                case 'B':
                              cloverSheet.cache();
                                var clvrSprite = cloverSheet.clone();
                                 var clov = game_template.PowerUp(clvrSprite, j*40, m*40);
                                clov.init(this.BLUE); 
                                this.AddClover(clov, m, j);
                                break;
                                case 'R':
                                cloverSheet.cache();
                                var clvrSprite = cloverSheet.clone();
                                 var clov = game_template.PowerUp(clvrSprite, j*40, m*40);
                                clov.init(this.RED); 
                                this.AddClover(clov, m, j);
                                break;
                                case 'EE':
                                enmySheet.cache();
                                var sprite = enmySheet.clone();
                                var test = game_template.Enemy(sprite, 200, 200);
                                test.init("EASY");
                                test.difficulty = "EASY";
                                this.AddEnemy(test, m, j);    
                                break;
                                case 'EM':
                                enmySheet.cache();
                                var sprite = enmySheet.clone();
                                var test = game_template.Enemy(sprite, 200, 200);
                                test.init("MED");
                                test.difficulty = "MED";
                                this.AddEnemy(test, m, j); 
                                break;
                                case 'EH':
                                enmySheet.cache();
                                var sprite = enmySheet.clone();
                                var test = game_template.Enemy(sprite, 200, 200);
                                test.init("HARD");
                                test.difficulty = "HARD";
                                this.AddEnemy(test, m, j); 
                                break;
                                case 'EB':
                                enmySheet.cache();
                                var sprite = enmySheet.clone();
                                var test = game_template.Enemy(sprite, 200, 200);
                                test.init("BOSS");
                                test.difficulty = "MED";
                                this.AddEnemy(test, m, j); 
                                break;
                                default:
                                    //do nothing
                                    break;
                            }
                        }
                    }
                }

            },
                createObject : function(){
                    return{
                        isSolid: true,
                        visible: true,
                        image: null,
                        x:0,
                        y:0,
                        width: BLOCK_WIDTH,
                        height: BLOCK_HEIGHT
                    }
                },
                AddEnemy : function (enemy, x, y) {
                    if(typeof this.grid[x][y] == "undefined" || typeof this.grid[x][y] === null){
                        this.enemies.push(enemy);
                        this.grid[x][y] = enemy;
                    }
                },
                AddObstacle : function (obstacle, x, y) {
                    if(typeof this.grid[x][y] == "undefined" || typeof this.grid[x][y] === null){
                        this.objects.push(obstacle);
                        this.grid[x][y] = obstacle;
                    }
                },
                AddClover : function (clover, x, y) {
                    if(typeof this.grid[x][y] == "undefined" || typeof this.grid[x][y] === null){
                        this.cloverArray.push(clover);
                        this.grid[x][y] = clover;
                    }
                },
                PlaceObjects : function () {
                    for(var x = 0; x < this.grid.length; x++){
                        for(var y = 0; y < this.grid[x].length; y++){
                            var target = this.grid[x][y];
                            if(typeof target != "undefined" && (this.enemies.indexOf(target) > -1)){
                                var posX = x*BLOCK_WIDTH;
                                var posY = y*BLOCK_HEIGHT;
                                this.roomScreen.addObject("enemy", target, posX, posY);
                                //roomScreen.addTarget(target);?
                            }
                        }
                    }
                },
                placeObstacles : function(){
                    for(var x = 0; x < this.grid.length; x++){
                        for(var y = 0; y < this.grid[x].length; y++){
                            var target = this.grid[x][y];
                            if(typeof target != "undefined" && this.objects.indexOf(target) > -1){
                                var posX = x*BLOCK_WIDTH;
                                var posY = y*BLOCK_HEIGHT;
                                target.width = BLOCK_WIDTH;
                                target.height =  BLOCK_HEIGHT;
                                this.roomScreen.addObstacle(target, posX, posY);
                                //roomScreen.addTarget(target);?
                            }
                        }
                    }
                },
                placeClovers : function(){
                    for(var x = 0; x < this.grid.length; x++){
                        for(var y = 0; y < this.grid[x].length; y++){
                            var target = this.grid[x][y];
                            if(typeof target != "undefined" && this.cloverArray.indexOf(target) > -1){
                                var posX = x*BLOCK_WIDTH;
                                var posY = y*BLOCK_HEIGHT;
                                target.width = 30; // dimensions of clover
                                target.height =  30;
                                this.roomScreen.addClover(target, posX, posY);
                            }
                        }
                    }
                },
                checkEnemiesLeft : function () {
                    var areEnemiesLeft = false;
                    for(var i = 0; i < this.enemies.length; i++){
                        if(this.enemies[i].alive){
                            areEnemiesLeft = true;
                            i = this.enemies.length + 1;
                        }
                    }
                    return areEnemiesLeft;
                },
                checkObjectExiting : function (obj) {
                    var result = {isExiting:false, direction:"undefined"};
                    if(obj.y+obj.height/2 < 0){
                        result.isExiting = true;
                        result.direction = NORTH;
                    }else if(obj.x+obj.width/2 < 0){
                        result.isExiting = true;
                        result.direction = WEST;
                    }else if(obj.y+obj.height/2 > GRID_SIZE*BLOCK_HEIGHT){
                        result.isExiting = true;
                        result.direction = SOUTH;
                    }else if(obj.x+obj.width/2 > GRID_SIZE*BLOCK_WIDTH){
                        result.isExiting = true;
                        result.direction = EAST;
                    }
                    return result;
                },
                handleObjectExit : function (obj, exit){
                    switch (exit){
                        case NORTH:
                            this.handleNorthExit(obj);
                            break;
                        case WEST:
                            this.handleWestExit(obj);
                            break;
                        case SOUTH:
                            this.handleSouthExit(obj);
                            break;
                        case EAST:
                            this.handleEastExit(obj);
                            break;
                        default:
                            console.log("Variable " + obj + " was not translatable to a side.");
                            break;
                    }
                },
                changeExitMethod : function (action, exit){
                    console.log("changing exit for " + exit);
                    switch (exit){
                        case NORTH:
                            this.handleNorthExit = action;
                            break;
                        case WEST:
                            this.handleWestExit = action;
                            break;
                        case SOUTH:
                            this.handleSouthExit = action;
                            break;
                        case EAST:
                            this.handleEastExit = action;
                            break;
                        default:
                            console.log("Variable " + obj + " was not translatable to a side.");
                            break;
                    }
                },
                handleEastExit : function (obj){
                    obj.x = (GRID_SIZE-1)*BLOCK_WIDTH;
                },
                handleSouthExit : function (obj){
                    obj.y = (GRID_SIZE-1)*BLOCK_HEIGHT;
                },
                handleWestExit : function (obj){
                    obj.x = obj.width/2 + 10;
                },
                handleNorthExit : function (obj){
                    obj.y = obj.height/2 + 10;
                },
                handleObjectEnter : function (obj, entrance){
//                    console.log(obj);
                    switch (entrance){
                        case NORTH:
                            this.handleNorthEntrance(obj);
                            break;
                        case WEST:
                            this.handleWestEntrance(obj);
                            break;
                        case SOUTH:
                            this.handleSouthEntrance(obj);
                            break;
                        case EAST:
                            this.handleEastEntrance(obj);
                            break;
                        default:
                            console.log("Variable " + entrance + " was not translatable to a side.");
                            break;
                    }
                },
                changeEntranceMethod : function (action, entrance){
                    switch (entrance){
                        case NORTH:
                            this.handleNorthEntrance = action;
                            break;
                        case WEST:
                            this.handleWestEntrance = action;
                            break;
                        case SOUTH:
                            this.handleSouthEntrance = action;
                            break;
                        case EAST:
                            this.handleEastEntrance = action;
                            break;
                        default:
                            console.log("Variable " + obj + " was not translatable to a side.");
                            break;
                    }
                },
                handleNorthEntrance : function (obj){
                    var x = Math.floor(((BLOCK_WIDTH*GRID_SIZE)/2));
                    var y = 0;
                    obj.x = x;
                    obj.y = y;
                    this.roomScreen.addObject("triangle", obj);
                    obj.visible = true;
                },
                handleWestEntrance : function (obj){
                    var x = Math.floor(obj.width/2 + 10);
                    var y = Math.floor(((BLOCK_HEIGHT*GRID_SIZE)/2));
                    obj.x = x;
                    obj.y = y;
                    this.roomScreen.addObject("triangle", obj);
                    obj.visible = true;
                },
                handleSouthEntrance : function (obj){
                    var x = Math.floor(((BLOCK_WIDTH*GRID_SIZE)/2)-(obj.width/2));
                    var y = Math.floor(((BLOCK_HEIGHT*GRID_SIZE)-(obj.height)+5));
                    obj.x = x;
                    obj.y = y;
                    this.roomScreen.addObject("triangle", obj, x, y);
                    obj.visible = true;
                },
                handleEastEntrance : function (obj){
                    var x = Math.floor(((BLOCK_WIDTH*GRID_SIZE)-((obj.width/2)+10)));
                    var y = Math.floor(((BLOCK_HEIGHT*GRID_SIZE)/2));
                    obj.x = x;
                    obj.y = y;
                    this.roomScreen.addObject("triangle", obj);
                    obj.visible = true;
                },
            };
        }
    }})();

var roomDefiner = (function () {
    var FOREST = "f1";
    var FOREST_NAME = "Forest", FOREST2_NAME = "Forest_2", CAVE_ENTRANCE_NAME = "Cave_Entrance", CAVE_NAME = "Cave", LAVA_NAME = "Lava", PINK_NAME = "Pink", BOSS_NAME = "Boss";

    return {
        roomManager : rooms.RoomManager(),
        defineRooms : function(player) {
            var screenManager = game_template.getScreenManager();
            var queue = game_template.getQueue();
            
            /* 
                Loading Spritesheets
            **/
            var enemySheet = new createjs.SpriteSheet({
                images: [queue.getResult("F1_enemy")],
                    frames: [[0,0,29,40,0],[0,40,36,35,0],[0,75,29,37,0],[29,75,33,35,0]],
                    animations: {
                        standDown: [0, 0, "standDown"],
                        standLeft: [1, 1, "standLeft"],
                        standUp: [2,2,"standUp"],
                        standRight: [3,3,"standRight"]
                    }   
            });
            
            var pinBoarSheet = new createjs.SpriteSheet({
                images: [queue.getResult("pinBoar")],
                    frames: [[0,0,51,40,0],[51,0,61,36,0],[0,40,50,39,0],[50,40,61,36,0]],
                    animations: {
                        standDown: [0, 0, "standDown"],
                        standLeft: [1, 1, "standLeft"],
                        standUp: [2, 2, "standUp"],
                        standRight: [3, 3, "standRight"]
                    }
            });
            
            var bossSheet = new createjs.SpriteSheet({
                images: [queue.getResult("boss")],
                    frames: [[0,0,185,97,0],[0,97,143,100,0],[0,197,143,100,0],[0,297,153,97,0]],
                    animations: {
                        standDown: [0, 0, "standDown"],
                        standLeft: [1, 1, "standLeft"],
                        standRight: [2, 2, "standRight"],
                        standUp: [3, 3, "standUp"]
                    }
            });
            
            /* 
                Background Loading
            **/
             var f1_mapArray =  //define a new array for every level
                   [['O','O','O','O','O','O','X','X','X','X','O','O','O','O','O'],
                    ['o','G','G','G','X','X','X','X','X','X','X','X','X','B','O'],
                    ['O','G','G','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','G','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','G','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','O','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','EE','X','X','X','EE','X','X','O','O','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','R','O','O'],
                    ['O','W','X','X','O','O','O','O','O','O','O','X','X','O','O'],
                    ['O','X','X','X','X','X','X','EH','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','O','O','O','O','O','X','X','X','X','o','O','O','O','O']];
            var forestBackground = queue.getResult("forest_background");
            
            var F1_bush = queue.getResult("F1_obj");
            var all_clovers = queue.getResult("all_clovers");
            var cloverSheet = new createjs.SpriteSheet({
            images: [queue.getResult("all_clovers")],
              frames: [[0,0,31,31,0],[31,0,31,31,0],[0,31,31,31,0],[31,31,30,31,0]],
            animations: {
                greenClover: [0,0, "greenClover"],
                whiteClover: [2,2, "whiteClover"],
                redClover: [1,1, "redClover"],
                blueClover: [3,3, "blueClover"]
            }
            });
            /* 
                Forest Room 1
            **/
            var forestScreen = game_template.Screen(forestBackground);
            var forestRoom = rooms.Room(forestScreen, FOREST_NAME, f1_mapArray);
            forestRoom.name = "Blooming Forest";
            forestRoom.level = 1;
            var transparentImg = queue.getResult("trans");
            forestRoom.parseRoom(F1_bush, cloverSheet, transparentImg, enemySheet);
            //var F1_obj = this.createObject();
            //this.parseRoom(this.mapArray, forestRoom, F1_obj, F1_bush, cloverSheet);
            
//            var test = game_template.Enemy(new createjs.Sprite(enemySheet), 200, 200);
//            forestRoom.AddEnemy(test, 3, 4);
//            
//            var test2 = game_template.Enemy(new createjs.Sprite(enemySheet), 300, 400);
//            forestRoom.AddEnemy(test2, 10, 10);
            
            forestRoom.changeExitMethod(function(obj){
                    game_template.getRoomManager().moveToRoom(FOREST2_NAME, rooms.south);
                }, rooms.north);
             forestRoom.changeExitMethod(function(obj){
                    game_template.getRoomManager().moveToRoom(FOREST_NAME, rooms.south);
                }, rooms.west);
            this.roomManager.setRoom(forestRoom, FOREST_NAME);
            screenManager.addScreen(FOREST_NAME, forestScreen);
            
            /* 
                Forest Room 2
            **/
             var f2_mapArray =  //define a new array for every level

                   [['O','O','O','O','O','O','O','X','X','O','O','O','O','O','O'],
                    ['O','O','O','W','X','X','X','X','X','X','X','O','O','X','O'],
                    ['O','O','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','EB','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','EM','X','X','X','X','X','W','O'],
                    ['O','X','O','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','O','O','O','X','EM','X','X','X','EM','X','O','O','O','O'],
                    ['O','G','G','O','X','X','X','X','X','X','X','O','G','G','O'],
                    ['O','G','G','O','X','X','X','R','R','X','X','O','G','G','O'],
                    ['O','G','X','O','X','X','X','X','X','X','X','O','X','G','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','O','O','O','O','O','X','X','X','X','o','O','O','O','O']];
            var forest2Screen = game_template.Screen(forestBackground);
            var forest2Room = rooms.Room(forest2Screen, FOREST2_NAME, f2_mapArray);
            forest2Room.name = "Brush Realm";
            forest2Room.level = 1;
            forest2Room.changeExitMethod(function(obj){
                    game_template.getRoomManager().moveToRoom(FOREST_NAME, rooms.north);
                }, rooms.south);
            forest2Room.changeExitMethod(function(obj){
                    game_template.getRoomManager().moveToRoom(CAVE_ENTRANCE_NAME, rooms.south);
                }, rooms.north);
            forest2Room.parseRoom(F1_bush,cloverSheet, transparentImg, enemySheet);
            this.roomManager.setRoom(forest2Room, FOREST2_NAME);
            screenManager.addScreen(FOREST2_NAME, forest2Screen);
            //basic adding an enemy
//            var test = game_template.Enemy(new createjs.Sprite(enemySheet), 400, 400);
//            forest2Room.AddEnemy(test, 2, 2);
            
             /* 
                Cave Entrance 1
            **/       
             var ce1_mapArray =  //define a new array for every level
                   [['O','O','O','O','O','O','X','X','X','X','O','O','O','O','O'],
                    ['O','X','X','W','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','EE','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','EM','X','X','X','X','X','W','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','EM','X','X','X','EM','X','X','O','O','O'],
                    ['O','X','X','O','O','X','X','X','X','X','X','X','X','O','O'],
                    ['O','X','X','X','O','X','X','R','R','X','X','X','X','O','O'],
                    ['O','X','X','X','O','X','X','X','X','X','O','O','X','X','O'],
                    ['O','X','X','X','X','O','O','O','O','O','O','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','O','O','O','O','X','X','X','X','X','O','O','X','X','O']];
            var caveEntranceBackground = queue.getResult("cave_entrance_background");
            var caveEntranceScreen = game_template.Screen(caveEntranceBackground);
            var caveEntranceRoom = rooms.Room(caveEntranceScreen, CAVE_ENTRANCE_NAME, ce1_mapArray);
            var ce1_rock = queue.getResult("bigRock");
            caveEntranceRoom.name = "Cave Entrance";
            caveEntranceRoom.level = 2;
            caveEntranceRoom.changeExitMethod(function(obj){
                    game_template.getRoomManager().moveToRoom(CAVE_NAME, rooms.south);
                }, rooms.north);
            caveEntranceRoom.parseRoom(ce1_rock,cloverSheet, transparentImg, pinBoarSheet);
            this.roomManager.setRoom(caveEntranceRoom, CAVE_ENTRANCE_NAME);
            screenManager.addScreen(CAVE_ENTRANCE_NAME, caveEntranceScreen);
            /* 
                Cave Room 1
            **/
       var cave_mapArray =  //define a new array for every level
                   [['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
                    ['O','X','G','G','G','G','G','W','G','G','G','X','X','X','O'],
                    ['o','X','X','X','X','G','G','X','G','X','X','X','X','X','O'],
                    ['O','X','X','X','EH','X','EM','EM','X','EE','X','X','X','W','X'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['O','X','X','X','X','X','R','G','G','X','X','X','X','X','X'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','O','O','O','O','X','X','X','X','X','O','O','O','O','O']];
//            
            var caveBackground = queue.getResult("cave_background");    
            var caveLevelScreen = game_template.Screen(caveBackground);
            var caveRoom = rooms.Room(caveLevelScreen, CAVE_NAME, cave_mapArray);
            var C1_rock = queue.getResult("C1_rock"); 
            caveRoom.name = "Dark Cave";
            caveRoom.level = 3;        
            caveRoom.changeExitMethod(function(obj){
                    game_template.getRoomManager().moveToRoom(CAVE_ENTRANCE_NAME, rooms.north);
                }, rooms.south);
             caveRoom.changeExitMethod(function(obj){
                    game_template.getRoomManager().moveToRoom(LAVA_NAME, rooms.north);
                }, rooms.east);
             caveRoom.changeExitMethod(function(obj){
                    game_template.getRoomManager().moveToRoom(PINK_NAME, rooms.east);
                }, rooms.west);
             
            caveRoom.parseRoom(C1_rock, cloverSheet, transparentImg, enemySheet);
            
            this.roomManager.setRoom(caveRoom, CAVE_NAME);
            screenManager.addScreen(CAVE_NAME, caveLevelScreen);
            
            /* 
                Pink Room 1
            **/
       var pink_mapArray =  //define a new array for every level
                   [['X','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['x','x','x','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['x','X','X','x','X','X','X','X','X','X','X','X','X','X','X'],
                    ['x','X','X','X','x','x','O','x','O','x','O','x','x','x','O'],
                    ['x','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['x','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['x','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['x','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['x','X','X','X','X','X','O','x','O','x','O','x','x','x','O'],
                    ['x','X','X','X','X','x','X','X','X','X','X','X','X','X','X'],
                    ['x','X','X','X','x','X','X','X','X','X','X','X','X','X','X'],
                    ['x','x','x','x','X','X','X','X','X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
                    ['X','X','X','X','X','X','X','X','X','X','X','X','X','X','X']];
//            
            var pinkBackground = queue.getResult("pink_background");  
            var L1_rock = queue.getResult("L1_rock");
            var pinkLevelScreen = game_template.Screen(pinkBackground);
            var pinkRoom = rooms.Room(pinkLevelScreen, PINK_NAME, pink_mapArray);
//            var C1_rock = queue.getResult("C1_rock"); 
            pinkRoom.name = "Salmon Floyd";
            pinkRoom.level = 3;        
            pinkRoom.changeExitMethod(function(obj){
                    game_template.getRoomManager().moveToRoom(CAVE_NAME, rooms.west);
                }, rooms.east);
             
            pinkRoom.parseRoom(L1_rock, cloverSheet, transparentImg, enemySheet);
            
            this.roomManager.setRoom(pinkRoom, PINK_NAME);
            screenManager.addScreen(PINK_NAME, pinkLevelScreen);
            
              /* 
                Lava Room 1
            **/
       var lava_mapArray =  //define a new array for every level
                   [['O','O','O','O','O','X','X','X','X','X','O','O','O','O','O'],
                    ['O','X','X','W','EM','X','X','X','X','X','X','X','EH','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['x','x','x','x','x','x','X','X','X','x','x','x','x','x','O'],
                    ['x','x','x','x','x','x','X','X','X','x','x','x','x','x','x'],
                    ['x','X','X','X','X','x','X','X','X','x','X','X','X','X','x'],
                    ['x','X','X','X','X','x','X','X','X','x','X','X','X','X','x'],
                    ['x','x','x','x','x','x','X','X','X','x','x','x','x','x','x'],
                    ['O','X','X','X','EH','X','X','X','X','X','X','X','EH','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','EH','X','X','X','X','X','X','X','EM','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','O','O','O','O','X','X','X','X','X','O','O','O','O','O']];
//            
            var lavaBackground = queue.getResult("lava_background");    
            var lavaLevelScreen = game_template.Screen(lavaBackground);
            var lavaRoom = rooms.Room(lavaLevelScreen, LAVA_NAME, lava_mapArray);
             
            lavaRoom.name = "Lava Pit";
            lavaRoom.level = 4;        
            lavaRoom.changeExitMethod(function(obj){
                    game_template.getRoomManager().moveToRoom(CAVE_NAME, rooms.east);
                }, rooms.north);
             lavaRoom.changeExitMethod(function(obj){
                    game_template.getRoomManager().moveToRoom(BOSS_NAME, rooms.north);
                }, rooms.south);
             
            lavaRoom.parseRoom(L1_rock, cloverSheet, transparentImg, enemySheet);
            
            this.roomManager.setRoom(lavaRoom, LAVA_NAME);
            screenManager.addScreen(LAVA_NAME, lavaLevelScreen);
            
             /* 
                Boss Room 1
            **/
       var boss_mapArray =  //define a new array for every level
                   [['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
                    ['O','X','X','W','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','EB','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','EB','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','EB','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','X','X','X','X','X','X','X','X','X','X','X','X','X','O'],
                    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O']];
//            
            var bossBackground = queue.getResult("bossBackground");    
            var bossLevelScreen = game_template.Screen(bossBackground);
            var bossRoom = rooms.Room(bossLevelScreen, BOSS_NAME, boss_mapArray);
             
            bossRoom.name = "Boss Lair";
            bossRoom.level = 5;
             
            bossRoom.parseRoom(L1_rock, cloverSheet, transparentImg, bossSheet);
            bossRoom.changeEntranceMethod(function (obj){
                    var x = Math.floor(((40*15)/2));
                    var y = 50;
                    obj.x = x;
                    obj.y = y;
                    this.roomScreen.addObject("triangle", obj);
                    obj.visible = true;
                    game_template.startBossTracking();
                }, rooms.north);
            
            this.roomManager.setRoom(bossRoom, BOSS_NAME);
            screenManager.addScreen(BOSS_NAME, bossLevelScreen);
            
            /* 
                Wrap-up Code (make sure this stays at the end of the method, just to keep it easy to find).
            **/
            this.roomManager.setStart(FOREST_NAME, rooms.south);
            game_template.setRoomManager(this.roomManager);
        }
        
       
    }
})();