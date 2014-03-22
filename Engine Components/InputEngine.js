PointClass = function()
{
}

PointClass.prototype.x = 0;
PointClass.prototype.y = 0;
// PointClass.prototype.bindings = new Object();

function InputEngineClass()
{
	this.bindings = new Object();
}

InputEngineClass.prototype.mouse = new PointClass();

InputEngineClass.prototype.setup = function(element)
{
	this.bind(87, 'move-up');
	this.bind(65, 'move-left');
	this.bind(83, 'move-down');
	this.bind(68, 'move-right');
	
	// element.addEventListener('keydown', this.onKeyDown);
	element.addEventListener('keydown', function(event) { alert("key down"); } );
	element.addEventListener('keyup', this.onKeyUp);
}

InputEngineClass.prototype.onKeyUp = function(event) 
{
	var action = this.bindings[event.keyID];

	if (action)
	{
		this.actions[action] = false;
	}
}

InputEngineClass.prototype.onKeyDown = function(event)
{
	var action = this.bindings[event.keyID];

	if (action)
	{
		this.actions[action] = true;
	}
	
	console.log("Key Down");
}

InputEngineClass.prototype.bind = function(key, action)
{
	this.bindings[key] = action;
}

gInputEngine = new InputEngineClass();
