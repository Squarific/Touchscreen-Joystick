#Touchscreen-Joystick#
======================

This small javascript class turns a dom element into a joystick for touchscreens.

##Feature##
===========

* Easy and fast integration thanks to pretendKeydown
* Supports all touchscreen devices
* Small and high performance
* Much styling can be done without changing the source code
* Normaly doesn't break anything

##Demo##
========

http://squarific.github.com/Touchscreen-Joystick/ (official)

Integrated in projects: (feel free to add yours)
http://nurgak.github.com/Cube-engine/ (Press joystick to show it, you can use chrome to emulate touchevents)

##License##
===========

> You can use this however you want, edit it, publish it, use it, send it to other people, etc. but you have to either mention my name, my website or this github (Filip Smets or squarific.com, does not have to be clickable, or github.com/Squarific/Touchscreen-Joystick).

##How to use ##
===============
```javascript
  var joystick = new SQUARIFIC.framework.TouchControl(elem, settings); //e.g. elem = document.getElementById("joystick"); settings is explained later
	joystick.on("pretendKeydown", function (event) {console.log(event)});
```

##Settings##
============

_*Not yet implemented*_

Settings is an object containing the following:
```javascript
	{
		pretendArrowKeys: boolean, //Should it simulate keypresses of the arrows, default true
		mindistance: number, //Distance the joystick needs to move before an action should be taken
		maxdistance: number, //The maximum distance the joystick may move
		middleLeft: number, //Amount of pixels to the middle of the joystick from the left
		middleTop: number //Amount of pixels to the middle of the joystick from the top
	}
```

##Event##
=========

The returned event object only contains keyCode at this moment. E.g.:
```javascript
//pretendKeydown, pretendKeyup
	{
		keyCode: 38;
	}
//joystickMove
	{
		distance: number, //The distance from the beginpoint to the mouse
		angle: angle, //The angle between the x-axis and the line from the beginpoint to the mouse, up = -, down = +, left 180, right 0
		deltaX: deltaX, //The difference from the beginpoint to the mouse over the x-axis
		deltaY: deltaY //The difference from the beginpoint to the mouse over the y-axis
	}
```

The following events are available:
* pretendKeydown
* pretendKeyup
* joystickMove
