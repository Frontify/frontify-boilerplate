# canvassmith [![Build status](https://travis-ci.org/twolfson/canvassmith.png?branch=master)](https://travis-ci.org/twolfson/canvassmith)

[node-canvas][canvas] engine for [spritesmith][spritesmith].

[canvas]: https://github.com/learnboost/node-canvas
[spritesmith]: https://github.com/Ensighten/spritesmith

## Requirements
Due to dependance on [node-canvas](https://github.com/learnboost/node-canvas), you must install [Cairo](http://cairographics.org/).

Instructions on how to do this are provided in the [node-canvas wiki](https://github.com/LearnBoost/node-canvas/wiki/_pages).

Additionally, you will need to install [node-gyp](https://github.com/TooTallNate/node-gyp/)
```shell
sudo npm install -g node-gyp
```

## Getting Started
Install the module with: `npm install canvassmith`

```javascript
// Convert images into canvassmith objects
var images = ['img1.jpg', 'img2.png'];
canvassmith.createImages(this.images, function handleImages (err, imgs) {
  // Create a canvas to draw onto (200 pixels wide, 300 pixels tall)
  canvassmith.createCanvas(200, 200, function (err, canvas) {
    // Add each image at a specific location (upper left corner = {x, y})
    var coordinatesArr = [{x: 0, y: 0}, {x: 50, y: 50}];
    imgs.forEach(function (img, i) {
      var coordinates = coordinatesArr[i];
      canvas.addImage(img, coordinates.x, coordinates.y);
    }, canvas);

    // Export canvas to image
    canvas['export']({format: 'png'}, function (err, result) {
      result; // Binary string representing a PNG image of the canvas
    });
  });
});
```

## Documentation
This module was built to the specification for all spritesmith modules.

https://github.com/twolfson/spritesmith-engine-test

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint using [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## License
Copyright (c) 2013 Todd Wolfson

Licensed under the MIT license.