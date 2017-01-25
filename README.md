# Agent Ready, an Ingress Story

Gamebook ("Livre-jeu") game ([Startup files](http://deepnight.net/iut/))

IUT de Bordeaux - 2016-2017

## Authors

- Tiphaine GIRARDOT
- Sylvain METAYER

## Game

It is necessary to have a local server to run the game because some AJAX calls are made.

### Run in local

A NodeJS example is avaible on this repository. 

See `server.js` for details and run `node server.js` to run the server.

Others way to run the game in local (not exhaustive)

```console
$ php -S localhost:8080
$ python -m SimpleHTTPServer 8080
$ ...
```

See online version : https://sylvainmetayer.github.io/agent-ready/

## "Customization"

The game offers some "customization" to offer a custom experience.

This customization is available in the `resources` folder. This folder contains some files that are described below.

#### `allowed_keys.json`

This file allow to set the allowed keys for cheat code and keyboard navigation. It prevent from false positive, such as a click on ALT or CTRL keys.
 
Please keep in mind that the alphabet should always be defined here, as it is used to navigate between section using keyboard.
 
#### `cheatImages.json`

This file is used when a cheater is detected. After  multiple attempt of cheating, the player will have some surprise :)

You can customize in this file pictures that will be displayed.

#### `colorArray.json`

Depreciated. Will probably be removed soon.

#### `glyph.json`

Contains all glyph sequences that will be used in the glyph game. You can defined new sequences here.

Please keep in mind that pictures are stored in `img/glyph` folder.

## Sources

All images belong to their respective authors.

- [Glyph images](http://ingress.wikia.com/wiki/Glyphs)

- [Cheaters images](https://imgflip.com/memegenerator)

- Screenshot of the game [Ingress](https://ingress.com)