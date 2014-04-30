var game = new Game();

function init()
{
	if(game.init())
	{
		game.start();
	}
}

var imageRepository = new function()
{
	this.background = new Image();
	this.ship = new Image();
	this.bullet = new Image();
	this.enemy = new Image();
	this.enemyBullet = new Image();
	this.audio = new Audio();

	var imagesLoaded = 0;
	var totalImages = 3;

	function imageLoaded()
	{
		++imagesLoaded;
		
		if(imagesLoaded == 3)
		{
			console.log("init load");
			window.init();
		}
	}
	
	this.background.onload = function() { imageLoaded(); };
	this.ship.onload = function() { imageLoaded(); };
	this.bullet.onload = function() { imageLoaded(); };
	this.enemy.onload = function() { imageLoaded(); };
	this.enemyBullet.onload = function() { imageLoaded(); };

	this.background.src = "imgs/bg.png";
	this.ship.src = "imgs/ship.png";
	this.bullet.src = "imgs/bullet.png";
	this.enemy.src = "imgs/enemy.png";
	this.enemyBullet.src = "imgs/bullet_enemy.png";
}

function Drawable()
{
	this.init = function(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};
	
	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	
	this.draw = function()
	{
	};
}

function Background()
{
	this.speed = 1;
	
	this.draw = function()
	{
		this.y += this.speed;
		this.context.drawImage(imageRepository.background, this.x, this.y);
		this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

		if(this.y >= this.canvasHeight)
		{
			this.y = 0;
		}
	};
}

Background.prototype = new Drawable();

function Bullet(type)
{
	this.alive = false;
	this.type = type;
	
	this.spawn = function(x, y, speed)
	{
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	}
	
	this.draw = function()
	{
		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.y -= this.speed;

		if(this.y <= 0 - this.height || this.y >= this.canvasHeight)
		{
			return true;
		}

		else
		{
			if(this.type == "bullet")
			{
				this.context.drawImage(imageRepository.bullet, this.x, this.y);
			}
			else if(this.type == "enemyBullet")
			{
				this.context.drawImage(imageRepository.enemyBullet, this.x, this.y);
			}

			return false;
		}
	}
	
	this.clear = function()
	{
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
	}
}

Bullet.prototype = new Drawable();

function Pool(maxSize)
{
	var size = maxSize;
	var pool = new Array();
	
	this.init = function(type)
	{
		var ClassType = null;
		var image = null;
		var param = type;
		
		if(type == "bullet")
		{
			ClassType = Bullet;
			image = imageRepository.bullet;
		}
		else if(type == "enemyBullet")
		{
			ClassType = Bullet;
			image = imageRepository.enemyBullet;
		}
		else if(type == "enemy")
		{
			ClassType = Enemy;
			image = imageRepository.enemy;
		}
	
		for(var index = 0; index < size; ++index)
		{
			var object = new ClassType(param);
			object.init(0, 0, image.width, image.height);
			pool[index] = object;
		}
	}
	
	this.get = function(x, y, speed)
	{
		if(!pool[size-1].alive)
		{
			pool[size-1].spawn(x, y, speed);
			pool.unshift(pool.pop());
		}
	}
	
	this.getTwo = function(x1, y1, speed1, x2, y2, speed2)
	{
		if(!pool[size-1].alive && !pool[size-2].alive)
		{
			this.get(x1, y1, speed1);
			this.get(x2, y2, speed2);
		}
	}
	
	this.animate = function()
	{
		for(var index = 0; index < size; ++index)
		{
			if(pool[index].alive)
			{
				if(pool[index].draw())
				{
					pool[index].clear();
					pool.push((pool.splice(index, 1))[0]);
				}
			}
			else
			{
				break;
			}
		}
	}
}

function Enemy()
{
	var percentFire = 0.01;
	var chance = 0

	this.spawn = function(x, y, speed)
	{
		this.x = x;
		this.y = y;
		this.speed = speed;
		
		this.speedX = 0;
		this.speedY = speed;
		
		this.leftEdge   = this.x - 90;
		this.rightEdge  = this.x + 130;
		this.bottomEdge = this.y + 140;
		
		this.alive = true;
	};
	
	this.draw = function()
	{
		this.context.clearRect(this.x-1, this.y, this.width+1, this.height);

		this.y += this.speedY;
		this.x += this.speedX;

		if(this.y >= this.bottomEdge)
		{
			this.y -= this.speedY;
			this.speedY = 0;
			this.speedX = 1;
		}
		else if(this.x >= this.rightEdge || this.x <= this.leftEdge)
		{
			this.speedX = -this.speedX;
		}

		this.context.drawImage(imageRepository.enemy, this.x, this.y);

		var chance = Math.floor(Math.random()*101);
		if (chance/100 < percentFire)
		{
			this.fire();
		}

		return false;
	};

	this.fire = function()
	{
		game.enemyBulletPool.get(this.x + this.width / 2, this.y + this.height, -2.5);
	}
}

Enemy.prototype = new Drawable();

function Ship()
{
	this.speed = 3;
	this.bulletPool = new Pool(7);
	this.bulletPool.init("bullet");
	this.bulletSpeed = 3;
	
	var fireRate = 15;
	var counter = 0;
	
	this.draw = function()
	{
		this.context.drawImage(imageRepository.ship, this.x, this.y);
	}
	
	this.move = function()
	{
		counter++;

		if(KEY_STATUS.left || KEY_STATUS.right || KEY_STATUS.up || KEY_STATUS.down)
		{
			this.context.clearRect(this.x, this.y, this.width, this.height);
			
			if(KEY_STATUS.left)
			{
				this.x -= this.speed;
				
				if(this.x < 0)
				{
					this.x = 0;
				}
			}
			else if(KEY_STATUS.right)
			{
				this.x += this.speed;
				
				if(this.x > this.canvasWidth - this.width)
				{
					this.x = this.canvasWidth - this.width;
				}
			}

			this.draw();
		}
		
		if(KEY_STATUS.space && counter >= fireRate)
		{
			this.bulletPool.getTwo(this.x + 6, this.y, this.bulletSpeed, this.x + 33, this.y, this.bulletSpeed);
			counter = 0;
		}
	}
}

Ship.prototype = new Drawable();

function Game()
{
	this.init = function()
	{
		this.bgCanvas = document.getElementById("background");
		this.shipCanvas = document.getElementById("ship");
		this.mainCanvas = document.getElementById("main");
		
		if(this.bgCanvas.getContext)
		{
			this.bgContext = this.bgCanvas.getContext('2d');
			this.shipContext = this.shipCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');

			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			
			this.background = new Background();
			this.background.init(0, 0);

			
			Ship.prototype.context = this.shipContext;
			Ship.prototype.canvasWidth = this.shipCanvas.width;
			Ship.prototype.canvasHeight = this.shipCanvas.height;
			
			this.ship = new Ship();
			var shipStartX = this.shipCanvas.width / 2 - imageRepository.ship.width;
			var shipStartY = this.shipCanvas.height - imageRepository.ship.height * 1.5;
			this.ship.init(shipStartX, shipStartY, imageRepository.ship.width, imageRepository.ship.height);

			Bullet.prototype.context = this.mainContext;
			Bullet.prototype.canvasWidth = this.mainCanvas.width;
			Bullet.prototype.canvasHeight = this.mainCanvas.height;

			Enemy.prototype.context = this.mainContext;
			Enemy.prototype.canvasWidth = this.mainCanvas.width;
			Enemy.prototype.canvasHeight = this.mainCanvas.height;

			this.enemyPool = new Pool(30);
			this.enemyPool.init("enemy");
			
			var height = imageRepository.enemy.height;
			var width  = imageRepository.enemy.width;
			
			var ySpacer = height * 1.5;
			var xSpacer = width + 25;
			
			var xCount = 6;
			var yCount = 3;
			
			var xInit = 100;
			var yInit = -height;

			for(var yIndex = 0; yIndex < yCount; ++yIndex)
			{
				var y = yInit - yIndex * ySpacer;
				for(var xIndex = 0; xIndex < xCount; ++xIndex)
				{
					var x = xInit + xIndex * xSpacer;
					
					this.enemyPool.get(x, y, 2);
				}
			}

			this.enemyBulletPool = new Pool(50);
			this.enemyBulletPool.init("enemyBullet");
			
			return true;
		}
		else
		{
			return false;
		}
	};
	
	this.start = function()
	{
		this.ship.draw();
		animate();
	};
}

function animate()
{
	requestAnimFrame(animate);
	game.background.draw();
	game.ship.move();
	game.ship.bulletPool.animate();
	game.enemyPool.animate();
	game.enemyBulletPool.animate();
}

window.requestAnimFrame = (function()
{
	return window.requestAnimationFrame		||
		window.webkitRequestAnimationFrame 	||
		window.mozRequestAnimationFrame		||
		window.oRequestAnimationFrame		||
		window.msRequestAnimationFrame		||
		function(callback, element)
		{
			window.setTimeout(callback, 1000 / 60);
		};
})();

KEY_CODES =
{
	32: 'space',
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'bottom',
}

KEY_STATUS = {};

for(code in KEY_CODES)
{
	KEY_STATUS[ KEY_CODES[ code ]] = false;
}

document.onkeydown = function(event)
{
	var keyCode = (event.keyCode) ? event.keyCode : event.charCode;
	if(KEY_CODES[keyCode])
	{
		event.preventDefault();
		KEY_STATUS[ KEY_CODES[ keyCode ]] = true;
	}
}

document.onkeyup = function(event)
{
	var keyCode = (event.keyCode) ? event.keyCode : event.charCode;
	if(KEY_CODES[keyCode])
	{
		event.preventDefault();
		KEY_STATUS[ KEY_CODES[ keyCode ]] = false;
	}
}
