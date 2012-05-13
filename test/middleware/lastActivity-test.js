var vows = require('vows');
var assert = require('assert');
var util = require('util');
var IQ = require('junction').elements.IQ;
var XMLElement = require('junction').XMLElement;
var StanzaError = require('junction').StanzaError;
var lastActivity = require('middleware/lastActivity');


vows.describe('lastActivity').addBatch({

  'middleware': {
    topic: function() {
      return lastActivity();
    },
    
    'when handling an activity request': {
      topic: function(lastActivity) {
        var self = this;
        var req = new IQ('juliet@capulet.com', 'romeo@montague.net/orchard', 'get');
        req.id = 'last1';
        req.c(new XMLElement('query', { xmlns: 'jabber:iq:last' }));
        req = req.toXML();
        req.type = req.attrs.type;
        var res = new XMLElement('iq', { id: req.attrs.id,
                                           to: req.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(null, res);
        }
        function next(err) {
          self.callback(new Error('should not call next'));
        }
        setTimeout(function() {
          lastActivity(req, res, next);
        }, 1000);
      },
      
      'should not call next' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call send' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="last1" to="romeo@montague.net/orchard" type="result"><query xmlns="jabber:iq:last" seconds="1"/></iq>');
      },
    },
    
    'when handling an activity result': {
      topic: function(lastActivity) {
        var self = this;
        var res = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com', 'result');
        res.id = 'last1';
        res.c('query', { xmlns: 'jabber:iq:last', seconds: 903 }).t('Heading Home');
        res = res.toXML();
        res.type = res.attrs.type;
        
        res.send = function() {
          self.callback(new Error('should not call send'));
        }
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          lastActivity(res, null, next)
        });
      },
      
      'should not call send' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call next' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
    },
    
    'when handling a non-IQ-get activity request': {
      topic: function(lastActivity) {
        var self = this;
        var req = new IQ('juliet@capulet.com', 'romeo@montague.net/orchard', 'set');
        req.id = 'last1';
        req.c(new XMLElement('query', { xmlns: 'jabber:iq:last' }));
        req = req.toXML();
        req.type = req.attrs.type;
        var res = new XMLElement('iq', { id: req.attrs.id,
                                           to: req.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(new Error('should not call send'));
        }
        function next(err) {
          self.callback(err, req);
        }
        process.nextTick(function () {
          lastActivity(req, res, next)
        });
      },
      
      'should indicate an error' : function(err, stanza) {
        assert.instanceOf(err, StanzaError);
        assert.equal(err.type, 'modify');
        assert.equal(err.condition, 'bad-request');
      },
    },
    
    'when handling an IQ stanza that is not an activity request': {
      topic: function(lastActivity) {
        var self = this;
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq = iq.toXML();
        iq.type = iq.attrs.type;
        var res = new XMLElement('iq', { id: iq.attrs.id,
                                           to: iq.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(new Error('should not call send'));
        }
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          lastActivity(iq, res, next)
        });
      },
      
      'should not call send' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call next' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
    },
  },
  
  'middleware with function': {
    topic: function() {
      return lastActivity(function() { return 5; });
    },
    
    'when handling an activity request': {
      topic: function(lastActivity) {
        var self = this;
        var req = new IQ('juliet@capulet.com', 'romeo@montague.net/orchard', 'get');
        req.id = 'last1';
        req.c(new XMLElement('query', { xmlns: 'jabber:iq:last' }));
        req = req.toXML();
        req.type = req.attrs.type;
        var res = new XMLElement('iq', { id: req.attrs.id,
                                           to: req.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(null, res);
        }
        function next(err) {
          self.callback(new Error('should not call next'));
        }
        process.nextTick(function () {
          lastActivity(req, res, next)
        });
      },
      
      'should not call next' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call send' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="last1" to="romeo@montague.net/orchard" type="result"><query xmlns="jabber:iq:last" seconds="5"/></iq>');
      },
    },
  },

}).export(module);
