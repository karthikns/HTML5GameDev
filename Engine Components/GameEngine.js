function GameEngine()
{
}

GameEngine.prototype.initialize = function(masterAssetFile, callback, collisionHandler)
{
    gInputEngine.setup();
    gPhysicsEngine.init();
    gPhysicsEngine.setCollisionHandler(collisionHandler);
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

GameObject.prototype._id = null;
GameObject.prototype._x = 0;
GameObject.prototype._y = 0;
GameObject.prototype._width = 0;
GameObject.prototype._height = 0;
GameObject.prototype._properties = null;

GameObject.prototype.setId = function (id)
{
    this._id = id;
}

GameObject.prototype.getId = function ()
{
    return this._id;
}

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
    if(gameObject === undefined)
    {
        return;
    }

    //update game object x & y
    gameObject._x = physicsObject.m_xf.position.x * scale;
    gameObject._y = physicsObject.m_xf.position.y * scale;

    if(gameObject.imageRenderer !== undefined)
    {
        gameObject.imageRenderer.x = physicsObject.m_xf.position.x * scale;
        gameObject.imageRenderer.y = physicsObject.m_xf.position.y * scale;
    }

}

GameObject.prototype.setKeyValue = function(key, value)
{
    if(this._properties == null)
    {
        this._properties = new Object();
    }

    this._properties[key] = value;
}

GameObject.prototype.getKeyValue = function(key)
{
    return this._properties[key];
}

GameObject.prototype.removeObject = function()
{
}

function RenderPhysicsObject()
{

}

RenderPhysicsObject.prototype = new GameObject();
RenderPhysicsObject.prototype.categoryBits = 1;
RenderPhysicsObject.prototype.maskBits = 1;

RenderPhysicsObject.prototype.setCategoryBits = function (categoryBits)
{
    this.categoryBits = categoryBits;
}

RenderPhysicsObject.prototype.setMaskBits = function(maskBits)
{
    this.maskBits = maskBits;
}



function Wall()
{
}

Wall.prototype = new RenderPhysicsObject();

Wall.prototype.initialize = function()
{
    //-----Debug data---------------
    var user_data = new Object();
    user_data.fill_color = 'rgba(2,100,0,0.3)';
    user_data.border_color = '#555';
    //------------------------------
    this.physicsBody = gPhysicsEngine.addBody("wall", "static", this._x/scale, this._y/scale, this._width/scale, this._height/scale, user_data, this, this.physicsUpdate, this.categoryBits, this.maskBits);
}

function Ship()
{
    this._guns = new Array();
    this._bullets = new Array();
}

Ship.prototype = new RenderPhysicsObject();
Ship.prototype._bullets = null;
Ship.prototype._width = 0;
Ship.prototype._height = 0;
Ship.prototype._imageId = null;
Ship.prototype._velocity = 5;
Ship.prototype._guns = null;

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
    this.physicsBody = gPhysicsEngine.addBody("ship", "dynamic", this._x/scale, this._y/scale, this._width/scale, this._height/scale, user_data, this, this.physicsUpdate, this.categoryBits, this.maskBits);
}

Ship.prototype.removeObject = function()
{
    renderPool.removeObject(this.imageRenderer);
    gPhysicsEngine.removeObjectsQueue.push(this.physicsBody);
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

Ship.prototype.addGun = function(gun)
{
    this._guns[this._guns.length] = gun;
}

Ship.prototype.fire = function()
{
    for(var gunIndex = 0; gunIndex < this._guns.length; ++gunIndex)
    {
        var gun = this._guns[gunIndex];

        if(gun)
        {
            this._bullets[this._bullets.length] = gun.fire(this._x, this._y);
        }
    }
}

function PlayerShip()
{
}

PlayerShip.prototype = new Ship();
PlayerShip.prototype._fireDuration = 1000; // 100ms for each bullet
PlayerShip.prototype._lastFireTime = 0;   // in ms

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

PlayerShip.prototype.setFireKey = function(keyCode)
{
    gInputEngine.bind(keyCode, this.userFire, null, this);
}

PlayerShip.prototype.setFireRate = function(fireRate)
{
    if(fireRate == 0)
    {
        this._fireDuration = 9999999999999;
    }
    else
    {
        this._fireDuration = 1000 / fireRate;
    }
}

PlayerShip.prototype.userFire = function()
{
    var date = new Date();
    var currentTime = date.getTime();

    if(currentTime - this._lastFireTime > this._fireDuration)
    {
        this.fire();
        this._lastFireTime = currentTime;
    }
}


function Bullet()
{
}

Bullet.prototype = new RenderPhysicsObject();

Bullet.prototype._imageId = null;
Bullet.prototype._velocityX = 0;
Bullet.prototype._velocityY = 0;

Bullet.prototype.setImage = function(imageId)
{
    this._imageId = imageId;
}

Bullet.prototype.setMoveVelocity = function(x, y)
{
    this._velocityX = x;
    this._velocityY = y;
}

Bullet.prototype.initialize = function()
{
    this.imageRenderer = new ImageRenderer(this._imageId, 5);
    this.imageRenderer.x = this._x;
    this.imageRenderer.y = this._y;
    renderPool.addObject(this.imageRenderer);

    //-----Debug data---------------
    var user_data = new Object();
    user_data.fill_color = 'rgba(2,100,0,0.3)';
    user_data.border_color = '#555';
    //------------------------------
    this.physicsBody = gPhysicsEngine.addBody("bullet", "dynamic", this._x/scale, this._y/scale, this._width/scale, this._height/scale, user_data, this, this.physicsUpdate, this.categoryBits, this.maskBits);

    gPhysicsEngine.setMoveVelocity(this.physicsBody, {x: this._velocityX, y: this._velocityY} );
}

Bullet.prototype.removeObject = function()
{
    renderPool.removeObject(this.imageRenderer);
    //gPhysicsEngine.removeBody(this.physicsBody);
    gPhysicsEngine.removeObjectsQueue.push(this.physicsBody);
}

function Gun()
{
}

Gun.prototype = new GameObject();

Gun.prototype._bulletImageId = null;
Gun.prototype._bulletWidth = null;
Gun.prototype._bulletHeight = null;

Gun.prototype._bulletVelocityX = 0;
Gun.prototype._bulletVelocityY = 5;

Gun.prototype._bulletType = null;

Gun.prototype.setBulletType = function(bulletType)
{
    this._bulletType = bulletType;
}

Gun.prototype.setBulletImage = function(imageId)
{
    this._bulletImageId = imageId;
}

Gun.prototype.setBulletWidthHeight = function(w, h)
{
    this._bulletWidth = w;
    this._bulletHeight = h;
}

Gun.prototype.setBulletVelocity = function(x, y)
{
    this._bulletVelocityX = x;
    this._bulletVelocityY = y;
}

Gun.prototype.fire = function(holderX, holderY)
{
    var bullet = new Bullet();

    bullet.setPosition(holderX + this._x, holderY + this._y);
    bullet.setWidthHeight(this._bulletWidth, this._bulletHeight);

    bullet.setImage(this._bulletImageId);
    bullet.setMoveVelocity(this._bulletVelocityX, this._bulletVelocityY);

    if(this._bulletType == "player")
    {
        bullet.setId("playerBullet");
        bullet.setCategoryBits(8);
        bullet.setMaskBits(5);
    }
    else if(this._bulletType == "enemy")
    {
        bullet.setId("enemyBullet");
        bullet.setCategoryBits(16);
        bullet.setMaskBits(3);
    }

    bullet.initialize();

    return bullet;
}
