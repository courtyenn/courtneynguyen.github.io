(function(window) {
boss_Min = function() {
	this.initialize();
}
boss_Min._SpriteSheet = new createjs.SpriteSheet({images: ["boss.png"], frames: [[0,0,185,97,0,234.95,165.85],[0,97,143,100,0,217.95,165.85],[0,197,143,100,0,217.95,165.85],[0,297,153,97,0,214.95,165.85]]});
var boss_Min_p = boss_Min.prototype = new createjs.Sprite();
boss_Min_p.Sprite_initialize = boss_Min_p.initialize;
boss_Min_p.initialize = function() {
	this.Sprite_initialize(boss_Min._SpriteSheet);
	this.paused = false;
}
window.boss_Min = boss_Min;
}(window));

