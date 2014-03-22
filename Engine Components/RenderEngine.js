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
	this.images = new Array(imageNames.length);

	for(var index = 0; index < imageNames.length; ++index)
	{
		this.images[index] = imageRepository.getImage(imageNames[index]);
	}

	this.frameRate = frameRate;
	this.frameDuration =  Math.floor(1000 / frameRate); // milliseconds
	this.totalAnimTime = imageNames.length * this.frameDuration; // milliseconds
}

AnimRenderer.prototype.x = 0;
AnimRenderer.prototype.y = 0;
AnimRenderer.prototype.images = null;

AnimRenderer.prototype.isAnimStarted = false;
AnimRenderer.prototype.frameRate = 0;		// FPS
AnimRenderer.prototype.lastStartTime = 0; 	// milliseconds
AnimRenderer.prototype.frameDuration = 0;	// milliseconds
AnimRenderer.prototype.totalAnimTime = 0;	// milliseconds

AnimRenderer.prototype.startAnimation = function()
{
	var date = new Date();
	this.lastStartTime = date.getTime();
	this.isAnimStarted = true;
}

AnimRenderer.prototype.stopAnimation = function()
{
	this.isAnimStarted = false;
}

AnimRenderer.prototype.render = function(context)
{
	var image = this.images[0];

	if(this.isAnimStarted == true)
	{
		var date = new Date();
		var currentTime = date.getTime();

		var animationsElapsed = Math.floor((currentTime - this.lastStartTime) / this.totalAnimTime);
		this.lastStartTime = this.lastStartTime +  animationsElapsed * this.totalAnimTime;
		var currentFrame = Math.floor( (currentTime - this.lastStartTime) / this.frameDuration );
		
		image = this.images[currentFrame];
	}

	context.drawImage(image, this.x, this.y);
}

function AnimManager()
{
}