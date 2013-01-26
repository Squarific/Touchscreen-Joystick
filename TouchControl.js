SQUARIFIC = {framework: {}};
SQUARIFIC.framework.TouchControl = function (elem, settings) {
	"use strict";
	var callbackList = [],
		self = this,
		originalStyle,
		originalX = 0,
		originalY = 0,
		fakeKeyspressed = [],
		multiple = 45,
		angleKeys = [
			{angle: 0, keyCodes: [39]},
			{angle: 45, keyCodes: [39, 40]},
			{angle: 90, keyCodes: [40]},
			{angle: 135, keyCodes: [40, 37]},
			{angle: 180, keyCodes: [37]},
			{angle: -180, keyCodes: [37]},
			{angle: -135, keyCodes: [37, 38]},
			{angle: -90, keyCodes: [38]},
			{angle: -45, keyCodes: [38, 39]}
		]; //Angle is in degrees and should be a multiple of the var "multiple",x-axis to the right = 0 left = 180, y-axis down = 90 up = -90, one angle can occur multiple times, e.g. {angle: 30, keyCodes: [1]}, {angle: 30, keyCodes: [2]} will fire 1 and 2, {angle: 30, keyCodes: [1, 1]} will fire 1 twice, -180 and 180 should both be added;
	if (!settings) {
		settings = {};
	}
	if (isNaN(settings.mindistance)) {
		settings.mindistance = 20;
	}
	if (isNaN(settings.middleLeft)) {
		settings.middleLeft = 0;
	}
	if (isNaN(settings.middleTop)) {
		settings.middleTop = 0;
	}
	if (!elem) {
		throw "Joystick Control: No element provided! Provided:" + elem;
	}
	this.on = function (name, callback) {
		callbackList.sort(function (a, b) {return a.id - b.id;}); //To get a unique id we need the highest id last
		if (callbackList.length < 1) {
			var next = 0;
		} else {
			var next = callbackList[callbackList.length - 1].id + 1;
		}
		callbackList.push({id: next, name: name, cb: callback});
		return next;
	};
	this.removeOn = function (id) {
		var i;
		for (i = 0; i < callbackList.length; i++) {
			if (callbackList[i].id === id) {
				callbackList.splice(id);
				return true;
			}
		}
		return false;
	};
	this.cb = function (name, arg) {
		var i;
		for (i = 0; i < callbackList.length; i++) {
			if (callbackList[i].name === name && typeof callbackList[i].cb == "function") {
				callbackList[i].cb(arg);
			}
		}
	};
	this.removeNonFakedKeys = function (keys) {
		for (var i = 0; i < fakeKeyspressed.length; i++) {
			if (!self.inArray(fakeKeyspressed[i], keys)) {
				self.cb("pretendKeyup", {keyCode: fakeKeyspressed[i]});
			}
		}
	};
	this.inArray = function (el, arr) {
		if (!arr) {
			return false;
		}
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === el) {
				return true;
			}
		}
		return false;
	};
	this.handleTouchStart = function (event) {
		if (event.changedTouches[0].target == elem) {
			originalStyle = {position: elem.style.position, top: elem.style.top, left: elem.style.left};
			originalX = event.changedTouches[0].clientX;
			originalY = event.changedTouches[0].clientY;
			elem.style.position = "fixed";
			elem.style.left = event.changedTouches[0].clientX - settings.middleLeft + "px";
			elem.style.top = event.changedTouches[0].clientY - settings.middleTop + "px";
			event.preventDefault();
		}
	};
	this.handleTouchStop = function (event) {
		if (event.changedTouches[0].target == elem) {
			elem.style.position = originalStyle.position;
			elem.style.top = originalStyle.top;
			elem.style.left = originalStyle.left;
			self.removeNonFakedKeys();
			event.preventDefault();
		}
	};
	this.handleTouchMove = function (event) {
		if (event.changedTouches[0].target == elem) {
			var i, k, keys = [], keyAngle, distance,
			deltaX = event.changedTouches[0].clientX - originalX,
			deltaY = event.changedTouches[0].clientY - originalY,
			angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
			distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
			event.preventDefault();
			if (distance < settings.mindistance) {
				self.removeNonFakedKeys();
			} else {
				if (settings.pretendArrowKeys) {
						keyAngle = multiple * Math.round(angle / multiple);
						for (i = 0; i < angleKeys.length; i++) {
							if (angleKeys[i].angle === keyAngle) {
								for (k = 0; k < angleKeys[i].keyCodes.length; k++) {
									keys.push(angleKeys[i].keyCodes[k]);
								}
							}
						}
						for (i = 0; i < keys.length; i++) {
							if (!self.inArray(keys[i], fakeKeyspressed)) {
								fakeKeyspressed.push(keys[i]);
							}
							self.cb("pretendKeydown", {keyCode: keys[i]});
						}
						self.removeNonFakedKeys(keys);
				} else {
					self.cb("joystickMove", {
						distance: distance,
						angle: angle,
						deltaX: deltaX,
						deltaY: deltaY
					});
				}
			}
			if (distance > settings.maxdistance) {
				elem.style.position = "relative";
				elem.style.left = settings.maxdistance * Math.cos(angle * Math.PI / 180) + "px";
				elem.style.top = settings.maxdistance * Math.sin(angle * Math.PI / 180) + "px";
				return;
			}
			elem.style.position = "fixed";
			elem.style.left = event.changedTouches[0].clientX - settings.middleLeft + "px";
			elem.style.top = event.changedTouches[0].clientY - settings.middleTop + "px";
		}
	};
	elem.addEventListener("touchstart", self.handleTouchStart);
	elem.addEventListener("touchend", self.handleTouchStop);
	elem.addEventListener("touchmove", self.handleTouchMove);
};
