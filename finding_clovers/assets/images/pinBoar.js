(function(window) {
PinBoar_small = function() {
	this.initialize();
}
PinBoar_small._SpriteSheet = new createjs.SpriteSheet({images: ["pinBoar.png"], frames: [[0,0,51,40,0,179.25,120.5],[51,0,61,36,0,184.25,117.5],[0,40,50,39,0,179.25,119.5],[50,40,61,36,0,184.25,117.5]]});
var PinBoar_small_p = PinBoar_small.prototype = new createjs.Sprite();
PinBoar_small_p.Sprite_initialize = PinBoar_small_p.initialize;
PinBoar_small_p.initialize = function() {
	this.Sprite_initialize(PinBoar_small._SpriteSheet);
	this.paused = false;
}
window.PinBoar_small = PinBoar_small;
}(window));

