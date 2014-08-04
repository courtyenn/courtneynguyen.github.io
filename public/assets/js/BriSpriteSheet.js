(function(window) {
Bri_New_Min = function() {
	this.initialize();
}
Bri_New_Min._SpriteSheet = new createjs.SpriteSheet({images: ["BriSpriteSheet.png"], frames: [[0,0,40,39,0,13.2,1.7000000000000002],[40,0,32,44,0,1.1999999999999993,1.7000000000000002],[72,0,40,36,0,8.2,1.7000000000000002],[0,44,50,36,0,10.2,0.7000000000000002],[50,44,37,38,0,10.2,1.7000000000000002],[0,82,49,35,0,20.2,0.7000000000000002],[49,82,35,37,0,4.199999999999999,1.7000000000000002],[84,82,29,41,0,7.199999999999999,4.7]]});
var Bri_New_Min_p = Bri_New_Min.prototype = new createjs.Sprite();
Bri_New_Min_p.Sprite_initialize = Bri_New_Min_p.initialize;
Bri_New_Min_p.initialize = function() {
	this.Sprite_initialize(Bri_New_Min._SpriteSheet);
	this.paused = false;
}
window.Bri_New_Min = Bri_New_Min;
}(window));

