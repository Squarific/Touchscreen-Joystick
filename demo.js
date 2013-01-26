SQUARIFIC.TouchControlDemo = function (elem, name, settings) {
	"use strict";
	var self = this, Player;
	if (!settings) {
		settings = {};
	}
	if (!settings.player) {
		settings.player = {};
	}
	Player = function (elem, settings) {
		var selfPlayer = this, joystick, keysPressed = [];
		if (!settings) {
			settings = {};
		}
		if (isNaN(settings.width)) {
			settings.width = 49;
		}
		if (isNaN(settings.height)) {
			settings.height = 63;
		}
		if (isNaN(settings.moveSpeed)) {
			settings.moveSpeed = 0.12;
		}
		this.init = function () {
			document.addEventListener("keydown", selfPlayer.handleKeyDown);
			document.addEventListener("keyup", selfPlayer.handleKeyUp);
			if (SQUARIFIC.framework && SQUARIFIC.framework.TouchControl) {
				joystick = new SQUARIFIC.framework.TouchControl(document.getElementById(name + "_joystick"), {
					pretendArrowKeys: true,
					mindistance: 25,
					maxdistance: 75,
					middleLeft: 25,
					middleTop: 25
				});
				joystick.on("pretendKeydown", selfPlayer.handleKeyDown);
				joystick.on("pretendKeyup", selfPlayer.handleKeyUp);
			} else {
				console.log("Framework or TouchControl not available");
			}
			elem.style.position = "absolute";
			elem.style.width = settings.width + "px";
			elem.style.height = settings.height + "px";
			this.x = (settings.fieldWidth - settings.width) / 2;
			this.y = (settings.fieldHeight - settings.height) / 2;
		};
		this.newFieldDim = function (width, height) {
			settings.fieldWidth = width;
			settings.fieldHeight = height;
		}
		this.update = function () {
			var key, now = Date.now(), timePassed = now - selfPlayer.lastUpdate, deltaX = 0, deltaY = 0;
			selfPlayer.lastUpdate = now;
			for (key = 0; key < keysPressed.length; key ++) {
				switch (keysPressed[key]) {
					case 37:
						deltaX = timePassed * -settings.moveSpeed;
					break;
					case 38:
						deltaY = timePassed * -settings.moveSpeed;
					break;
					case 39:
						deltaX = timePassed * settings.moveSpeed;
					break;
					case 40:
						deltaY = timePassed * settings.moveSpeed;
					break;
				}
			}
			selfPlayer.x = selfPlayer.x + deltaX;
			selfPlayer.y = selfPlayer.y + deltaY;
			if (selfPlayer.x < 0) {
				selfPlayer.x = 0;
			}
			if (selfPlayer.y < 0) {
				selfPlayer.y = 0;
			}
			if (selfPlayer.x > settings.fieldWidth) {
				selfPlayer.x = settings.fieldWidth;
			}
			if (selfPlayer.y > settings.fieldHeight) {
				selfPlayer.y = settings.fieldHeight;
			}
		};
		this.render = function () {
			elem.style.left = selfPlayer.x + "px";
			elem.style.top = selfPlayer.y + "px";
		};
		this.handleKeyDown = function (event) {
			selfPlayer.handleKeyUp(event);
			keysPressed.push(event.keyCode);
		};
		this.handleKeyUp = function (event) {
			var key;
			for (key = 0; key < keysPressed.length; key ++) {
				if (keysPressed[key] === event.keyCode) {
					keysPressed.splice(key, 1);
				}
			}
		};
		this.init();
	};
	this.init = function () {
		var joystick = document.createElement("joystick"), joystickbackground = document.createElement("joystickbackground"), joystickhitzone = document.createElement("joystickhitzone"), player = document.createElement("player");

		document.addEventListener("resize", self.handleResize);
		self.handleResize();

		settings.player.fieldWidth = settings.width;
		settings.player.fieldHeight = settings.height;

		elem.style.position = "relative";
		joystick.id = name + "_joystick";
		player.id = name + "_player";
		joystickhitzone.appendChild(joystick);
		joystickbackground.appendChild(joystickhitzone);
		elem.appendChild(joystickbackground);
		elem.appendChild(player);

		self.player = new Player(player, settings.player);
		self.start();
	};
	this.loop = function () {
		self.update();
		self.render();
		if (settings.run) {
			window.requestAnimationFrame(self.loop);
		}
	};
	this.update = function () {
		self.player.update();
	};
	this.render = function () {
		self.player.render();
	};
	this.start = function () {
		if (!settings.run) {
			settings.run = true;
			window.requestAnimationFrame(self.loop);
		}
	};
	this.stop = function () {
		settings.run = false;
	};
	this.handleResize = function (event) {
		settings.width = elem.offsetWidth;
		settings.height = elem.offsetHeight;
		if (self.player) {
			self.player.newFieldDim(settings.width, settings.height);
		}
	};
	this.init();
};
