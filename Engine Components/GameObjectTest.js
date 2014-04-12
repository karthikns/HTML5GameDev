
function TestGameObject()
{
	this.str = "Physics Engine Hookup Test, ( x , y ) = ";
    this.pBody;

	this.init = function()
	{
        // Create physics object here with the following:
		// 		User function as 'this.physicsUpdate'
		// 		User Object as 'this'

        var user_data = new Object();
        user_data.fill_color = 'rgba(2,100,0,0.3)';
        user_data.border_color = '#555';
        this.pBody = gPhysicsEngine.addBody("box", "dynamic", 20/scale, 200/scale, 40/scale, 40/scale, user_data, this, this.physicsUpdate);

        this.pBody.ApplyImpulse(
            new b2Vec2(10,0),
            this.pBody.GetWorldCenter()
        );

	}

	this.physicsUpdate = function(gameObject, physicsObject)
	{
        if(gameObject === undefined) {
            return;
        }
		var outputString = gameObject.str + "( " + physicsObject.m_xf.position.x + " , " + physicsObject.m_xf.position.y + " )";
		console.log(outputString);

        //update render object
        if(gameObject.ro !== undefined) {
            gameObject.ro.x = physicsObject.x;
            gameObject.ro.y = physicsObject.y;
        }
	};

}

var gameObjectTest = new TestGameObject();