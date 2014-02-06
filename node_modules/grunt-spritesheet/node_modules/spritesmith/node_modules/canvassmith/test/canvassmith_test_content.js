// Load in parts to make our content
var smith = require('../lib/canvassmith'),
    extend = require('obj-extend'),
    commonTest = require('spritesmith-engine-test').content;

// Duck punch over test items
module.exports = extend({}, commonTest, {
  'canvassmith': function () {
    this.smith = smith;

    var expectedDir = __dirname + '/expected_files/';
    this.expectedFilepaths = [expectedDir + '/multiple.png'];
  }
});