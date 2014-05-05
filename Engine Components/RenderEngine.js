imageRepository = new function ImageRepository()
{
	this.images = new Object();

	this.initialize = function(configFile, callback)
	{
		var xmlHttpRequest = new XMLHttpRequest();

		xmlHttpRequest.onreadystatechange = function()
		{
			if(xmlHttpRequest.readyState == 4) // Ready
			{
				if(xmlHttpRequest.status == 200) // OK
				{
					try
					{
						var renderConfig = JSON.parse(xmlHttpRequest.responseText);
						loadImages(renderConfig);
					}
					catch(e)
					{
						alert("Error in render configuration JSON");
					}
				}
				else
				{
					alert("There was a problem retrieving the render configuration data: " + req.statusText);
				}
			}
		}

		xmlHttpRequest.open("GET", configFile, false);
		xmlHttpRequest.send();

		function loadImages(renderConfig)
		{
			console.log(Object.keys(renderConfig).length);

			var imagesLoaded = 0;
			var numberOfImages = Object.keys(renderConfig).length;
			
			function imageLoadCallback()
			{
				++imagesLoaded;

				if(imagesLoaded === numberOfImages)
				{
					callback();
				}
			}

			for(var key in renderConfig)
			{
				imageRepository.images[key] = new Image();
				imageRepository.images[key].onload = function() { imageLoadCallback() };
				imageRepository.images[key].src = renderConfig[key];
			}
		}
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
	this.canvas = null;
	this.pool = new Array();
	
	this.addObject = function(obj)
	{
		var insertIndex = 0;
		for(insertIndex = 0; insertIndex < this.pool.length; ++insertIndex)
		{
			if(this.pool[insertIndex].zIndex >= obj.zIndex)
			{
				break;
			}
		}

		this.pool.splice(insertIndex, 0, obj);
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
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for(index = 0; index < this.pool.length; ++index)
		{
			this.pool[index].render(this.context);
		}	
	}
}

function RenderObject()
{
}

RenderObject.prototype.x = 0;
RenderObject.prototype.y = 0;
RenderObject.prototype.halfWidth = 0;
RenderObject.prototype.halfHeight = 0;
RenderObject.prototype.zIndex = 0;

function ImageRenderer(imageName, zIndex)
{
	this.image = imageRepository.getImage(imageName);

	this.halfWidth = this.image.width / 2;
	this.halfHeight = this.image.height / 2;

	this.zIndex = zIndex;
}

ImageRenderer.prototype = new RenderObject();
ImageRenderer.prototype.image = null;

ImageRenderer.prototype.render = function(context)
{
	context.drawImage(this.image, this.x - this.halfWidth, this.y - this.halfHeight);
}

function ImageRendererScroll(imageName, frameRate, zIndex)
{
	this._image = imageRepository.getImage(imageName);	
	this.halfWidth = this._image.width / 2;
	this.halfHeight = this._image.height / 2;
	this.zIndex = zIndex;

	this._frameDuration =  Math.floor(1000 / frameRate); // milliseconds
}

ImageRendererScroll.prototype = new RenderObject();
ImageRendererScroll.prototype._image = null;
ImageRendererScroll.prototype._frameDuration = 0;
ImageRendererScroll.prototype._scrollAmount = 0;
ImageRendererScroll.prototype._lastStartTime = 0; 	// milliseconds
ImageRendererScroll.prototype._isScrolling = false; 	// milliseconds

ImageRendererScroll.prototype.startScroll = function()
{
	var date = new Date();
	this._lastStartTime = date.getTime();
	this._isScrolling = true;
	this._scrollAmount = 0;
}

ImageRendererScroll.prototype.stopScroll = function()
{
	this._isScrolling = false;
}

ImageRendererScroll.prototype.render = function(context)
{
	if(this._isScrolling == true)
	{
		// Bottom Image: ORIGINAL
		context.drawImage(this._image,
			0, 0, this._image.width, this._image.height - this._scrollAmount,
			this.x - this.halfWidth, this.y + this._scrollAmount - this.halfHeight, this._image.width, this._image.height - this._scrollAmount);

		// Top Image
		if(this._scrollAmount != 0)
		{
			context.drawImage(this._image,
				0, this._image.height - this._scrollAmount, this._image.width, this._scrollAmount,
				this.x - this.halfWidth, this.y - this.halfHeight, this._image.width, this._scrollAmount);
		}

		var date = new Date();
		var currentTime = date.getTime();

		var totalScrollAmount = Math.floor((currentTime - this._lastStartTime) / this._frameDuration);
		this._scrollAmount = totalScrollAmount % this._image.height;
	}
	else
	{
		context.drawImage(this._image, this.x - this.halfWidth, this.y - this.halfHeight);
	}
}

function AnimRenderer(imageNames, frameRate, zIndex)
{
	this.images = new Array(imageNames.length);

	for(var index = 0; index < imageNames.length; ++index)
	{
		this.images[index] = imageRepository.getImage(imageNames[index]);
	}

	this.halfWidth = this.images[0].width / 2;
	this.halfHeight = this.images[0].height / 2;

	this.zIndex = zIndex;

	this.frameRate = frameRate;
	this.frameDuration =  Math.floor(1000 / frameRate); // milliseconds
	this.totalAnimTime = imageNames.length * this.frameDuration; // milliseconds
}

AnimRenderer.prototype = new RenderObject();

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

	context.drawImage(image, this.x - this.halfWidth, this.y - this.halfHeight);
}

// TODO: Test this
function AnimManager(zIndex)
{
	this.zIndex = zIndex;
}

AnimManager.prototype.x = 0;
AnimManager.prototype.y = 0;
AnimManager.prototype.zIndex = 0;

AnimManager.prototype.currentAnim = null;
AnimManager.prototype.animations = new Object();

AnimManager.prototype.addAnimation = function(animName, imageNames, frameRate)
{
	this.animations[animName] = new AnimRenderer(imageNames, frameRate, this.zIndex);
}

AnimManager.prototype.playAnimation = function(animName)
{
	if(typeof this.animations[animName] === "undefined")
	{
		return;
	}
	
	this.currentAnim = animName;
	this.animations[this.currentAnim].startAnimation();
}

AnimManager.prototype.stopAnimation = function()
{
	this.currentAnim = null;
}

AnimManager.prototype.updateFrameRate = function(animName, frameRate)
{
}

AnimManager.prototype.render = function(context)
{
	if(this.currentAnim == null || typeof this.animations[this.currentAnim] === "undefined")
	{
		return;
	}

	this.animations[this.currentAnim].x = this.x;
	this.animations[this.currentAnim].y = this.y;
	this.animations[this.currentAnim].render(context);
}
