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
PhysicsEngine.prototype.PHYSICS_LOOP_HZ = 1.0/60;

PhysicsEngine.prototype.create = function () {
	
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
	
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(ctx);
    debugDraw.SetDrawScale(scale);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
     
    this.world.SetDebugDraw(debugDraw);
	
	//window.setInterval(this.update, 1000/60);
}

PhysicsEngine.prototype.draw_world = function() {
    //first clear the canvas
    ctx.clearRect( 0 , 0 , 600, 360 );
     
    ctx.fillStyle = '#FFF4C9';
    ctx.fillRect(0,0, 600, 360);
         
    //convert the canvas coordinate directions to cartesian
    ctx.save();
    ctx.translate(0 , 360);
    ctx.scale(1 , -1);
    gPhysicsEngine.world.DrawDebugData();
    ctx.restore();
}

PhysicsEngine.prototype.update = function () {
	//var start = Date.now();        
	gPhysicsEngine.world.Step(this.PHYSICS_LOOP_HZ, 8, 3);	
	gPhysicsEngine.world.ClearForces();
	gPhysicsEngine.draw_world();
	//return(Date.now() - start);
}

PhysicsEngine.prototype.registerBody = function (bodyDef) {
	var body = gPhysicsEngine.world.CreateBody(bodyDef);
	return body;
}

PhysicsEngine.prototype.addBody = function (entityDef) {
	var bodyDef = new b2BodyDef();

	var id = entityDef.id;

	if(entityDef.type == 'static') {
		bodyDef.type = b2Body.b2_staticBody;
	} else {
		bodyDef.type = b2Body.b2_dynamicBody;
	}

	var user_data = new Object();
    user_data.fill_color = 'rgba(2,100,0,0.3)';
    user_data.border_color = '#555';
    
    bodyDef.userData = user_data;
    
	bodyDef.position.x = entityDef.x;
	bodyDef.position.y = entityDef.y;
	bodyDef.linearDamping = entityDef.info.linearDamping;
	bodyDef.angularDamping = entityDef.info.angularDamping;
	
	var body = this.registerBody(bodyDef);
	var fixtureDefinition = new b2FixtureDef();

	if(entityDef.useBouncyFixture) {
		fixtureDefinition.density = entityDef.info.density;
		fixtureDefinition.friction = entityDef.info.friction;
		fixtureDefinition.restitution = entityDef.info.restitution;
		
	}

	// Now we define the shape of this object as a box
	fixtureDefinition.shape = new b2PolygonShape();
	fixtureDefinition.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight);
	body.CreateFixture(fixtureDefinition);

	return body;
}

PhysicsEngine.prototype.removeBody = function (obj) {
	gPhysicsEngine.world.DestroyBody(obj);
}
	
var gPhysicsEngine = new PhysicsEngine();