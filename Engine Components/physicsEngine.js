var scale = 10;
var b2Vec2;
var b2AABB;
var b2BodyDef;
var b2Body;
var b2FixtureDef;
var b2Fixture;
var b2World;
var b2PolygonShape;
var b2DebugDraw;
var b2ContactListener;

function PhysicsEngine(){
		
	this.world = null;
}

PhysicsEngine.prototype.world = null;
PhysicsEngine.prototype.ctx = null;
PhysicsEngine.prototype.PHYSICS_LOOP_HZ = 1.0/60;

PhysicsEngine.prototype.collisionCallbackHandler = null;
PhysicsEngine.prototype.removeObjectsQueue = [];

PhysicsEngine.prototype.init = function () {
	
	b2Vec2 = Box2D.Common.Math.b2Vec2;
	b2AABB = Box2D.Collision.b2AABB;
	b2BodyDef = Box2D.Dynamics.b2BodyDef;
	b2Body = Box2D.Dynamics.b2Body;
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	b2Fixture = Box2D.Dynamics.b2Fixture;
	b2World = Box2D.Dynamics.b2World;
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	b2ContactListener = Box2D.Dynamics.b2ContactListener;
	
	//parameter1: gravity vector
	//parameter2: allowing sleep (true) or disallowing sleep (false)
	this.world = new b2World(new b2Vec2(0,0), true);
    var canvas = document.getElementById("physics_canvas");
    this.ctx = canvas.getContext("2d");

	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(this.ctx);
    debugDraw.SetDrawScale(scale);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
     
    this.world.SetDebugDraw(debugDraw);
	
	//window.setInterval(this.update, 1000/60);
}

PhysicsEngine.prototype.draw_world = function() {
    //first clear the canvas
    this.ctx.clearRect( 500 , 0 , 1000, 300 );
     
    this.ctx.fillStyle = '#FFFFF';
    this.ctx.fillRect(500,0, 1000, 300);
         
    //convert the canvas coordinate directions to cartesian
    this.ctx.save();
    this.ctx.translate(0 , 0);
    this.ctx.scale(1 , 1);
    gPhysicsEngine.world.DrawDebugData();
    this.ctx.restore();
}

PhysicsEngine.prototype.removeBodiesInQueue = function() {

    if(gPhysicsEngine.removeObjectsQueue != null && gPhysicsEngine.removeObjectsQueue.length > 0 ) {
        for(var i=0; i<gPhysicsEngine.removeObjectsQueue.length; i++) {
            gPhysicsEngine.removeBody(gPhysicsEngine.removeObjectsQueue[i]);
        }
        gPhysicsEngine.removeObjectsQueue.length = 0;
    }
}

PhysicsEngine.prototype.update = function () {
	//var start = Date.now();
    gPhysicsEngine.removeBodiesInQueue();
	gPhysicsEngine.world.Step(gPhysicsEngine.PHYSICS_LOOP_HZ, 8, 3);
	gPhysicsEngine.world.ClearForces();
	gPhysicsEngine.draw_world();
	//return(Date.now() - start);
}

PhysicsEngine.prototype.registerBody = function (bodyDef) {
	var body = gPhysicsEngine.world.CreateBody(bodyDef);
	return body;
}

PhysicsEngine.prototype.addBody = function (id, type, x, y, w, h, userData, userObject, userFunc, categoryBits, maskBits) {
    var bodyDef = new b2BodyDef();

    bodyDef.userObject = userObject;
    bodyDef.userFunction = userFunc;
	if(type == 'static') {
		bodyDef.type = b2Body.b2_staticBody;
	} else {
		bodyDef.type = b2Body.b2_dynamicBody;
	}

    bodyDef.userData = userData;

	bodyDef.position.x = x;
	bodyDef.position.y = y;
	bodyDef.linearDamping = 0.0;
	bodyDef.angularDamping = 0.0;
    bodyDef.fixedRotation = true;

	var body = this.registerBody(bodyDef);
	var fixtureDefinition = new b2FixtureDef();

    fixtureDefinition.density = 10;
    fixtureDefinition.friction = 0.0;
    fixtureDefinition.restitution = 1;
    //fixtureDefinition.filter.groupIndex = 10;
    fixtureDefinition.filter.categoryBits = categoryBits;
    fixtureDefinition.filter.maskBits = maskBits;

	// Now we define the shape of this object as a box
	fixtureDefinition.shape = new b2PolygonShape();
	fixtureDefinition.shape.SetAsBox(w/2, h/2);
	body.CreateFixture(fixtureDefinition);

	return body;
}

PhysicsEngine.prototype.removeBody = function (obj) {
	gPhysicsEngine.world.DestroyBody(obj);
}

PhysicsEngine.prototype.setMoveVelocity = function (pBody, velocity) {
    pBody.SetAwake(true);
    pBody.SetLinearVelocity(new b2Vec2(velocity.x,velocity.y));
    //pBody.ApplyImpulse( new b2Vec2(velocity.x,velocity.y),  pBody.GetWorldCenter() );
}

PhysicsEngine.prototype.setCollisionHandler = function(handler) {
    this.collisionCallbackHandler = handler;
    b2ContactListener.prototype.BeginContact = function (contact)
    {
        //now come action time
        var a = contact.GetFixtureA().GetBody();
        var b = contact.GetFixtureB().GetBody();

        gPhysicsEngine.collisionCallbackHandler(a.userObject, b.userObject);

    };
}
	
var gPhysicsEngine = new PhysicsEngine();