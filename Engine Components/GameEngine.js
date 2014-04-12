function GameObject(x, y, width, height)
{	
	this._x = x;
	this._y = y;
}

GameObject.prototype._x = 0;
GameObject.prototype._y = 0;

function Ship(imageId)
{
	this._width = 10;
	this._height = 10;

	this.imageRenderer = new ImageRenderer(imageId);
	renderPool.addObject(imageRenderer);
}

Ship.prototype = new GameObject();
Ship.prototype._bullets = new Array();
Ship.prototype._width = 0;
Ship.prototype._height = 0;

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
	this._bullets[this.bullets.length] = new Bullet(bulletImageId, velocity);
	this._bullets[this.bullets.length - 1].x = this.x;
	this._bullets[this.bullets.length - 1].y = this.y;
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
