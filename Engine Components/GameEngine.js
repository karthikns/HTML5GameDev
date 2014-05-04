function GameEngine()
{
}

GameEngine.prototype.initialize = function(masterAssetFile, callback)
{
    gInputEngine.setup();
    gPhysicsEngine.init();
    imageRepository.initialize(masterAssetFile, callback);
}

GameEngine.prototype.setCanvas = function(canvasElement)
{
    var canvasContext = canvasElement.getContext('2d');
    renderPool.context = canvasContext;
    renderPool.canvas = canvasElement;
}

GameEngine.prototype.beginGame = function()
{
    renderPool.render();
    setTimeout(render, 1000/60); //60FPS
    window.setInterval(gPhysicsEngine.update, 1000/60);
}

gGameEngine = new GameEngine();

function GameObject(x, y, width, height)
{	
	this._x = x;
	this._y = y;
    this._width = width;
    this._height = height;
}

GameObject.prototype._x = 0;
GameObject.prototype._y = 0;
GameObject.prototype._width = 0;
GameObject.prototype._height = 0;

GameObject.prototype.setPosition = function(x,y)
{
    this._x = x;
    this._y = y;
}

GameObject.prototype.setWidthHeight = function(w,h)
{
    this._width = w;
    this._height = h;
}

GameObject.prototype.physicsUpdate = function(gameObject, physicsObject)
{
    if(gameObject === undefined) {
        return;
    }

    //update game object x & y
    gameObject._x = physicsObject.m_xf.position.x * scale;
    gameObject._y = physicsObject.m_xf.position.y * scale;
    if(gameObject.imageRenderer !== undefined) {
        gameObject.imageRenderer.x = physicsObject.m_xf.position.x * scale;
        gameObject.imageRenderer.y = physicsObject.m_xf.position.y * scale;
    }

}

function Ship()
{

}

Ship.prototype = new GameObject();
Ship.prototype._bullets = new Array();
Ship.prototype._width = 0;
Ship.prototype._height = 0;
Ship.prototype._imageId = null;
Ship.prototype._velocity = 1;

Ship.prototype.setImage = function(imageId)
{
    this._imageId = imageId;
}

Ship.prototype.initialize = function()
{
    this.imageRenderer = new ImageRenderer(this._imageId, 10);
    this.imageRenderer.x = this._x;
    this.imageRenderer.y = this._y;
    renderPool.addObject(this.imageRenderer);

    //-----Debug data---------------
    var user_data = new Object();
    user_data.fill_color = 'rgba(2,100,0,0.3)';
    user_data.border_color = '#555';
    //------------------------------
    this.physicsBody = gPhysicsEngine.addBody("ship", "dynamic", this._x/scale, this._y/scale, this._width/scale, this._height/scale, user_data, this, this.physicsUpdate);

    this.setMoveVelocity(5);
}

Ship.prototype.setMoveVelocity = function(velocity)
{
    this._velocity = velocity;
}

Ship.prototype.setZeroVelocity = function()
{
    gPhysicsEngine.setMoveVelocity(this.physicsBody, {x:0, y:0});
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
	this._bullets[this._bullets.length] = new Bullet();
    this._bullets[this._bullets.length - 1]._x = this.x;
    this._bullets[this._bullets.length - 1]._y = this.y;
    this._bullets[this._bullets.length-1].setImage(imageId);
    this.setMoveVelocity(velocity);
    this.initialize();

}

function PlayerShip()
{
}

PlayerShip.prototype = new Ship();

PlayerShip.prototype.setLeftKey = function(keyCode)
{
    gInputEngine.bind(keyCode, this.moveLeft, this.setZeroVelocity, this);
}

PlayerShip.prototype.setRightKey = function(keyCode)
{
    gInputEngine.bind(keyCode, this.moveRight, this.setZeroVelocity, this);
}

PlayerShip.prototype.setUpKey = function(keyCode)
{
    gInputEngine.bind(keyCode, this.moveUp, this.setZeroVelocity, this);
}

PlayerShip.prototype.setDownKey = function(keyCode)
{
    gInputEngine.bind(keyCode, this.moveDown, this.setZeroVelocity, this);
}

function Bullet()
{
}

Bullet.prototype = new GameObject();

Bullet._imageId = null;
Bullet._velocity = 0;

Bullet.prototype.setImage = function(imageId)
{
    this._imageId = imageId;
}

Bullet.prototype.setMoveVelocity = function (x,y)
{
    gPhysicsEngine.setMoveVelocity(this.physicsBody, {x:x, y:y} );
}

Bullet.prototype.initialize = function()
{
    this.imageRenderer = new ImageRenderer(this._imageId, 5);
    renderPool.addObject(this.imageRenderer);

    //-----Debug data---------------
    var user_data = new Object();
    user_data.fill_color = 'rgba(2,100,0,0.3)';
    user_data.border_color = '#555';
    //------------------------------
    this.physicsBody = gPhysicsEngine.addBody("bullet", "dynamic", 100/scale, 50/scale, this._width/scale, this._height/scale, user_data, this, this.physicsUpdate);
    this.setMoveVelocity(this._velocity.x, this._velocity.y);
}