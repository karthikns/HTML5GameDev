renderPool = function RenderPool(context)
{
	this.context = context;
}

RenderPool.prototype.canvas = null;
RenderPool.prototype.pool = new Array();

RenderPool.prototype.addObject = function(obj)
{
	this.pool[size] = obj;
}

RenderPool.prototype.removeObject = function(obj)
{
	var index;
	for(index = 0; index < this.pool.length; ++index)
	{
		if(this.pool[index] === obj)
		{
			break;
		}
	}
	
	// Found!
	if(index != this.pool.length)
	{
		this.pool.splice(index, 1);
	}
}

RenderPool.prototype.render()
{
	for(index = 0; index < this.pool.length; ++index)
	{
		this.pool[index].render(this.context);
	}	
}

function ImageRenderer(imageName)
{
	this.x = 0;
	this.y = 0;
	this.image = imageRepository.getImage(imageName);

	this.render = function(context)
	{
		context.drawImage(this.image, this.x, this.y);
	}
}

function AnimRenderer(imageNames, frameRate)
{
	this.x = 0;
	this.y = 0;
	this.images = new Array(imageNames.length);
	this.frameRate = frameRate;

	this.isAnimStarted = false;
	
	this.lastStartTime = 0; // milliseconds
	this.frameDuration =  1000 / frameRate; // milliseconds
	this.totalAnimTime = imageNames.length * frameDuration; // milliseconds
	
	for(var index = 0; index < imageName.length; ++index)
	{
		images[index] = imageRepository.getImage(imageNames[index]);
	}

	this.startAnimation = function()
	{
		this.lastStartTime = getTime(); // TODO: Find function
		this.isAnimStarted = true;
	}
	
	this.stopAnimation = function()
	{
		this.isAnimStarted = false;
	}
	
	this.render = function(context)
	{
		var image = this.images[0];
	
		if(isAnimStarted == true)
		{
			var currentTime = getTime(); // TODO: Find function
			
			var frame = (currentTime - lastStartTime) % totalAnimTime;
			this.lastStartTime = lastStartTime + (currentTime - lastStartTime) / totalAnimTime;
			
			image = this.images[frame];
		}

		context.drawImage(image, this.x, this.y);
	}
}

function AnimManager()
{
}