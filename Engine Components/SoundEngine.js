soundrepository = new function SoundReposito0ry(){

	this.sounds = new Object();
	
	this.pair = new Object();
	
	this.pair["bgmusic"] = "sounds/music.ogg";
	this.pair["laser"] = "sounds/acdc.ogg";
	//this.pair["explosion"] = "sounds/explosion.wav";
	
	console.log(Object.keys(this.pair).length);

	var soundsLoaded = 0;
	var numberOfSounds = Object.keys(this.pair).length;

	function soundLoadCallback()
	{
		console.log("soundcallback");
		++soundsLoaded;

		if(soundsLoaded === numberOfSounds)
		{
			console.log("music.ogg");
			init();
		}
	}
		console.log(this.pair);

	for(var key in this.pair)
	{
		this.sounds[key] = new Audio();
		this.sounds[key].oncanplaythrough = function() { soundLoadCallback() };
		this.sounds[key].src = this.pair[key];
		console.log(this.sounds[key]);
		
	}
	
	this.getSound = function(soundName)
	{
		if(this.sounds[soundName])
		{
			return this.sounds[soundName];
		}
		else
		{
			return null;
		}
	}
}

function AudioPlayback(soundName){

	this.sound = soundrepository.getSound(soundName);
	console.log(this.sound);
}
AudioPlayback.prototype.isPlaying = false;
AudioPlayback.prototype.isLooping = false;

AudioPlayback.prototype.startPlayback = function()
{
	this.isPlaying = true;
	this.sound.play();
}


AudioPlayback.prototype.pausePlayback = function()
{
	this.isPlaying = false;
	this.sound.pause();
}

AudioPlayback.prototype.stopPlayback = function()
{
	this.isPlaying = false;
	this.sound.pause();
	this.sound.currentTime = 0;
}

AudioPlayback.prototype.setLooping = function()
{
	this.isLooping = true;
	this.sound.loop = true;
}

soundpool = new function SoundPool(){

	var MAXSIZE = 30;
	this.context = null;
	this.pool = new Array();
	
	this.init = function(object) {
		if (object == "laser") {
			for (var i = 0; i < size; i++) {
				laser = new Audio(pair["laser"]);
				laser.volume = .12;
				laser.load();
				pool[i] = laser;
			}
		}
		else if (object == "explosion") {
			for (var i = 0; i < size; i++) {
				var explosion = new Audio("sounds/explosion.wav");
				explosion.volume = .1;
				explosion.load();
				pool[i] = explosion;
			}
		}
	}

}
