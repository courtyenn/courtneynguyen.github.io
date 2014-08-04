(function(window) {
MenuButtons = function() {
	this.initialize();
}
MenuButtons._SpriteSheet = new createjs.SpriteSheet({images: ["menuButtons.png"], frames: [[0,0,155,76,0,88.5,38.05],[155,0,155,76,0,88.5,38.05],[310,0,155,76,0,88.5,38.05],[0,76,155,76,0,88.5,38.05],[155,76,155,76,0,88.5,38.05],[310,76,155,76,0,88.5,38.05],[0,152,155,76,0,88.5,38.05],[155,152,155,76,0,88.5,38.05]]});
var MenuButtons_p = MenuButtons.prototype = new createjs.Sprite();
MenuButtons_p.Sprite_initialize = MenuButtons_p.initialize;
MenuButtons_p.initialize = function() {
	this.Sprite_initialize(MenuButtons._SpriteSheet);
	this.paused = false;
}
window.MenuButtons = MenuButtons;
}(window));

