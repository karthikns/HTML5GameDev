function GameObject()
{	
}

GameObject.prototype.x = 0;
GameObject.prototype.y = 0;

function Ship(imageId)
{
	this.imageRenderer = new ImageRenderer(imageId);
	renderPool.addObject(imageRenderer);
}

Ship.prototype = new GameObject();
Ship.prototype.bullets = new Array();

Ship.prototype.setMoveVelocity = function(velocity)
{
}

Ship.prototype.moveLeft = function()
{
}

Ship.prototype.moveRight = function()
{
}

Ship.prototype.moveUp = function()
{
}

Ship.prototype.moveDown = function()
{
}

Ship.prototype.fire = function()
{
	var velocity = new Object();
	velocity.x = 10;
	velocity.y = 0;
	this.bullets[this.bullets.length] = new Bullet(bulletImageId, velocity);
	this.bullets[this.bullets.length - 1].x = this.x;
	this.bullets[this.bullets.length - 1].y = this.y;
}

function PlayerShip()
{
}

PlayerShip.prototype = new Ship();

PlayerShip.prototype.setLeftKey = function(keyCode)
{
}

PlayerShip.prototype.setRightKey = function(keyCode)
{
}

PlayerShip.prototype.setUpKey = function(keyCode)
{
}

PlayerShip.prototype.setDownKey = function(keyCode)
{
}

function Bullet(imageId, velocity)
{
}

Bullet.prototype = new GameObject();
