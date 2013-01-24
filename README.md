#Touchscreen-Joystick#
======================

This small javascript class turns a dom element into a joystick for touchscreens.

##Feature##
===========

* Easy integration thanks to pretendKeydown

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
	}
```

##Event##
=========

The returned event object only contains keyCode at this moment. E.g.:
```javascript
  {
		keyCode: 38;
	}
```
