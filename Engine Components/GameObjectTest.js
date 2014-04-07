function TestGameObject()
{
	this.str = "Physics Engine Hookup Test, ( x , y ) = ";

	this.init = function()
	{
		// Create physics object here with the following:
		// 		User function as 'this.physicsUpdate'
		// 		User Object as 'this'
	}

	this.physicsUpdate = function(gameObject, physicsObject)
	{
		var outputString = gameObject.str + "( " + physicsObject.x + " , " + physicsObject.y + " )";
		console.log(outputString);
	};
}
