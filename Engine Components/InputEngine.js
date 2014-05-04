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
InputEngineClass.prototype.stop = new Object();

InputEngineClass.prototype.setup = function()
{
	document.addEventListener('keydown', this.onKeyDown );
	document.addEventListener('keyup', this.onKeyUp);
}

InputEngineClass.prototype.onKeyUp = function(event) 
{
	var exist = gInputEngine.bindings[event.keyCode];
    var action = gInputEngine.actions[event.keyCode];
	if(exist) {
        gInputEngine.stop.method.call(gInputEngine.stop.obj);
    }
}

InputEngineClass.prototype.onKeyDown = function(event)
{
	var exist = gInputEngine.bindings[event.keyCode];
    var action = gInputEngine.actions[event.keyCode];
	if (exist)
	{
		action.method.call(action.obj);
		console.log("Key Down: " + action);
	}
}

InputEngineClass.prototype.bind = function(key, action, obj)
{
	this.bindings[key] = true;
    this.actions[key] = new Object();
    this.actions[key].method = action;
    this.actions[key].obj = obj;
    this.stop.method = obj.setZeroVelocity;
    this.stop.obj = obj;
}

gInputEngine = new InputEngineClass();
