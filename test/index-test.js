var vows = require('vows');
var assert = require('assert');
var lastactivity = require('index');


vows.describe('junction-lastactivity').addBatch({
  
  'module': {
    'should export middleware': function () {
      assert.isFunction(lastactivity);
      assert.isFunction(lastactivity.lastActivity);
      assert.isFunction(lastactivity.lastActivityResultParser);
    },
  },
  
}).export(module);
