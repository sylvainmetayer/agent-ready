# Agent Ready, an Ingress Story

Gamebook ("Livre-jeu") game ([Startup files](http://deepnight.net/iut/))

IUT de Bordeaux - 2016-2017

## Authors

- Tiphaine GIRARDOT
- Sylvain METAYER

## Requirements

- Node.js >=4
- git

## Install

Clone the repository on your machine
```console
$ git clone https://github.com/sylvainmetayer/agent-ready.git && cd agent-ready
```

Install the global dependencies
```console
$ npm install --global gulp-cli
```

Install the local dependencies
```console
$ npm install
```

## Commands

Run the dev server
```console
$ gulp serve
```

Build the project
```console
$ gulp
```

Preview of the build
```console
$ gulp serve:dist
```

Publish build on github-pages. (**require a gh-pages branch**)
[How to setup gh-pages branch ?](https://github.com/yeoman/generator-webapp/blob/master/docs/recipes/gh-pages.md#3-ensure-that-your-repository-is-on-github-and-that-origin-is-set)
```console
$ gulp deploy
```

## Online version 

https://sylvainmetayer.github.io/agent-ready/

## "Customization"

The game has some "customization" available to offer a custom experience.

This customization is available in the `resources` folder. This folder contains some files that are described below.

#### `navigation.json`

This file contains configuration for keyboard interaction.

It is divided in 2 parts : 

- `navigate_between_section` is the object that represent keys that are used to navigate between sections.
- `keys_allowed_for_cheat_code` is the object that contains all keys used for cheats codes. It prevent from false positive, such as a click on ALT or CTRL keys. 

#### `cheats.json`

This file contains some configuration for cheats codes. 

- `ban_time` is the time (in ms) that player will have to wait when he is banned.   
- `max_attempt_before_ban` is the number of attempt that the player have before ban.
- `codes` Contains configuration of cheats codes. A sample cheat code **must** look like this:
```console
"1": {
      "name": "nameOfMyCheatCode",
      "keys": [
        73,
        78,
        71,
        82,
        69,
        83,
        83,
        13
      ], // Key that the player have to press (in that order) to enable the cheat code.
      "cpt": 0, // Private counter. Leave it like this.
      "success": "function () { alert('You are ready, agent. Go out, and fight for your faction.. Which will obviously be the Resistance :) !'); location.href = 'https://goo.gl/ADym2f'; }"
      // Function that will be executed when cheat code is valid. Must be an anonymous function. Be careful, this function can put the game in a unstable state if the function contains errors.
    },
```

#### `randomName.json`

Contains a list of random name, that will be used if the player don't want to set one.

#### `glyph.json`

Contains all glyph sequences that will be used in the glyph game. You can defined new sequences here.

Please keep in mind that pictures are stored in `img/glyph` folder.

## Sources

All images belong to their respective authors.

- [Glyph images](http://ingress.wikia.com/wiki/Glyphs)

- [Cheaters images](https://imgflip.com/memegenerator)

- Screenshot of the game [Ingress](https://ingress.com)
