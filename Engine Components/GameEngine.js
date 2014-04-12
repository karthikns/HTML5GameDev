function GameObject(x, y, width, height)
{	
	this._x = x;
	this._y = y;
}

GameObject.prototype._x = 0;
GameObject.prototype._y = 0;

GameObject.prototype.physicsUpdate = function(gameObject, physicsObject)
{
    if(gameObject === undefined) {
        return;
    }
    var outputString = gameObject.str + "( " + physicsObject.m_xf.position.x + " , " + physicsObject.m_xf.position.y + " )";
    console.log(outputString);

    //update game object x & y
    gameObject.x = physicsObject.m_xf.position.x;
    gameObject.y = physicsObject.m_xf.position.y;

}

function Ship(imageId)
{
	this._width = 10;
	this._height = 10;

	this.imageRenderer = new ImageRenderer(imageId);
	renderPool.addObject(imageRenderer);

    //-----Debug data---------------
    var user_data = new Object();
    user_data.fill_color = 'rgba(2,100,0,0.3)';
    user_data.border_color = '#555';
    //------------------------------
    this.physicsBody = gPhysicsEngine.addBody("ship", "dynamic", 20/scale, 200/scale, this._width/scale, this._height/scale, user_data, this, this.physicsUpdate);
}

Ship.prototype = new GameObject();
Ship.prototype._bullets = new Array();
Ship.prototype._width = 0;
Ship.prototype._height = 0;
Ship.prototype._velocity = 0;


Ship.prototype.setMoveVelocity = function(velocity)
{
    this._velocity = velocity;
}

Ship.prototype.moveLeft = function()
{
    gPhysicsEngine.setMoveVelocity(this.physicsBody, {x: -this._velocity, y:0} );

}

Ship.prototype.moveRight = function()
{
    gPhysicsEngine.setMoveVelocity(this.physicsBody, {x: this._velocity, y:0} );
}

Ship.prototype.moveUp = function()
{
    gPhysicsEngine.setMoveVelocity(this.physicsBody, {x: 0, y:-this._velocity} );
}

Ship.prototype.moveDown = function()
{
    gPhysicsEngine.setMoveVelocity(this.physicsBody, {x: 0, y:this._velocity} );
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
    gInputEngine.bind(keyCode, this.moveLeft);
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
    this._width = 5;
    this._height = 10;

    this.imageRenderer = new ImageRenderer(imageId);
    renderPool.addObject(imageRenderer);

    //-----Debug data---------------
    var user_data = new Object();
    user_data.fill_color = 'rgba(2,100,0,0.3)';
    user_data.border_color = '#555';
    //------------------------------
    this.physicsBody = gPhysicsEngine.addBody("bullet", "dynamic", 100/scale, 50/scale, this._width/scale, this._height/scale, user_data, this, this.physicsUpdate);
    this.setMoveVelocity(velocity.x, velocity.y);
}

Bullet.prototype = new GameObject();

Bullet.prototype.setMoveVelocity = function (x,y)
{
    gPhysicsEngine.setMoveVelocity(this.physicsBody, {x:x, y:y} );
}