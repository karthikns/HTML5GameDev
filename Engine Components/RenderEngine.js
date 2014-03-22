imageRepository = new function ImageRepository()
{
	this.images = new Object();
	
	this.pair = new Object();
	this.pair["ship"] = "imgs/ship.png";
	this.pair["b2"] = "imgs/bullet_enemy.png";
	this.pair["b1"] = "imgs/bullet.png";
	
	console.log(Object.keys(this.pair).length);

	var imagesLoaded = 0;
	var numberOfImages = Object.keys(this.pair).length;
	
	function imageLoadCallback()
	{
		++imagesLoaded;

		if(imagesLoaded === numberOfImages)
		{
			init();
		}
	}

	for(var key in this.pair)
	{
		this.images[key] = new Image();
		this.images[key].onload = function() { imageLoadCallback() };
		this.images[key].src = this.pair[key];
	}

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

	this.removeObject = function(obj)
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

function AnimRenderer(imageNames, frameRate)
{
	this.x = 0;
	this.y = 0;
	this.images = new Array(imageNames.length);
	this.frameRate = frameRate;

	this.isAnimStarted = false;
	
	this.lastStartTime = 0; // milliseconds
	this.frameDuration =  Math.floor(1000 / frameRate); // milliseconds
	this.totalAnimTime = imageNames.length * this.frameDuration; // milliseconds

	for(var index = 0; index < imageNames.length; ++index)
	{
		this.images[index] = imageRepository.getImage(imageNames[index]);
	}

	this.startAnimation = function()
	{
		var date = new Date();
		this.lastStartTime = date.getTime();
		this.isAnimStarted = true;
	}

	this.stopAnimation = function()
	{
		this.isAnimStarted = false;
	}

	this.render = function(context)
	{
		var image = this.images[0];
	
		if(this.isAnimStarted == true)
		{
			var date = new Date();
			var currentTime = date.getTime();
			
			this.lastStartTime = this.lastStartTime + Math.floor((currentTime - this.lastStartTime) / this.totalAnimTime) * this.totalAnimTime;
			var currentFrame = Math.floor( (currentTime - this.lastStartTime) / this.frameDuration );
			
			image = this.images[currentFrame];
		}

		context.drawImage(image, this.x, this.y);
	}
}

function AnimManager()
{
}