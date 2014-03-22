imageRepository = new function ImageRepository()
{
	this.images = new Object();
	
	function imageLoadCallback()
	{
		console.log("Image loaded: " + key);
	}

	var key = "ship";
	this.images[key] = new Image();
	this.images[key].onload = function() { imageLoadCallback(key) };
	this.images[key].src = "imgs/ship.png";

	this.getImage = function(imageName)
	{
		if(this.images[imageName])
		{
			return this.images[imageName];
		}
		else
		{
			return null;
		}
	}
}

renderPool = new function RenderPool()
{
	this.context = null;
	this.pool = new Array();
	
	this.addObject = function(obj)
	{
		this.pool[this.pool.length] = obj;
	}

	//TODO: Test this function
	function removeObject(obj)
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

	this.render = function()
	{
		for(index = 0; index < this.pool.length; ++index)
		{
			this.pool[index].render(this.context);
		}	
	}
}

function ImageRenderer(imageName)
{
	this.x = 0;
	this.y = 0;
	this.image = imageRepository.getImage(imageName);
}

ImageRenderer.prototype.x = 0;
ImageRenderer.prototype.y = 0;
ImageRenderer.prototype.image = null;

ImageRenderer.prototype.render = function(context)
{
	context.drawImage(this.image, this.x, this.y);
}

//TODO: Test AnnimRenderer
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