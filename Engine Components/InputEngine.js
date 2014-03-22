PointClass = function()
{
}

PointClass.prototype.x = 0;
PointClass.prototype.y = 0;
PointClass.prototype.bindings = new Object();

function InputEngineClass()
{
}

InputEngineClass.prototype.mouse = new PointClass();
InputEngineClass.prototype.bindings = new Object();
InputEngineClass.prototype.actions = new Object();

InputEngineClass.prototype.setup = function()
{
	document.addEventListener('keydown', this.onKeyDown );
	document.addEventListener('keyup', this.onKeyUp);
}

InputEngineClass.prototype.onKeyUp = function(event) 
{
	var action = gInputEngine.bindings[event.keyCode];

	if (action)
	{
		gInputEngine.actions[action] = false;
		console.log("Key Up: " + action);
	}
}

InputEngineClass.prototype.onKeyDown = function(event)
{
	var action = gInputEngine.bindings[event.keyCode];

	if (action)
	{
		gInputEngine.actions[action] = true;
		console.log("Key Down: " + action);
	}
}

InputEngineClass.prototype.bind = function(key, action)
{
	this.bindings[key] = action;
}

gInputEngine = new InputEngineClass();
