(function(window) {
goblin_cmin = function() {
	this.initialize();
}
goblin_cmin._SpriteSheet = new createjs.SpriteSheet({images: ["goblin.png"], frames: [[0,0,29,40,0,97.55,94.5],[0,40,36,35,0,100.55,92.5],[0,75,29,37,0,99.55,92.5],[29,75,33,35,0,97.55,92.5]]});
var goblin_cmin_p = goblin_cmin.prototype = new createjs.Sprite();
goblin_cmin_p.Sprite_initialize = goblin_cmin_p.initialize;
goblin_cmin_p.initialize = function() {
	this.Sprite_initialize(goblin_cmin._SpriteSheet);
	this.paused = false;
}
window.goblin_cmin = goblin_cmin;
}(window));

