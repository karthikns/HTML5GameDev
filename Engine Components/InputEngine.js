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

	if(exist)
	{
	    var action = gInputEngine.actions[event.keyCode];

	    if(action.startAction != null)
	    {
		    clearInterval(action.intervalId);
		    action.intervalId = null;
		}

		if(action.stopAction != null)
		{
        	action.stopAction.call(action.obj);
    	}
    }
}

InputEngineClass.prototype.onKeyDown = function(event)
{
	var exist = gInputEngine.bindings[event.keyCode];

	if (exist)
	{
	    var action = gInputEngine.actions[event.keyCode];

    	if(action.startAction != null)
    	{
			action.startAction.call(action.obj);

			if(action.intervalId == null)
			{
			    action.intervalId = setInterval(gInputEngine.update, 100, action.startAction, action.obj);
			}
		}
	}
}

InputEngineClass.prototype.update = function(method, obj)
{
	method.call(obj);
}

InputEngineClass.prototype.bind = function(key, startAction, stopAction, obj)
{
	this.bindings[key] = true;
    this.actions[key] = new Object();
    this.actions[key].startAction = startAction;
    this.actions[key].stopAction = stopAction;
    this.actions[key].obj = obj;
}

gInputEngine = new InputEngineClass();
