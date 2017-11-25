import chai, { expect, assert } from 'chai';
import { MiddlEmitter } from './../src';

const delay = ms => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

describe('MiddlEmitter Basic test', function () {
  const emitter = new MiddlEmitter();
  describe('#on', function () {
    it('should be a function', function () {
      expect(emitter.on, 'expect #on be a function').to.be.a('function');
    });
    it('should return the listener', function () {
      const emitter = new MiddlEmitter();
      const listener = () => {
      };
      const returnValue = emitter.on('test', listener);
      expect(returnValue, 'expect #on return listener function').to.equal(listener);
    });
  });

  describe('#once', function () {
    it('should be a function', function () {
      expect(emitter.once, 'expect #once be a function').to.be.a('function');
    });
    it('should return the listener', function () {
      const emitter = new MiddlEmitter();
      const listener = () => {
      };
      const returnValue = emitter.once('test', listener);
      expect(returnValue, 'expect #once return listener function').to.equal(listener);
    });
  });

  describe('#off', function () {
    it('should be a function', function () {
      expect(emitter.off, 'expect #off be a function').to.be.a('function');
    });
  });

  describe('#emit', function () {
    it('should be a function', function () {
      expect(emitter.emit, 'expect #emit be a function').to.be.a('function');
    });
    it('should return promise', function () {
      const emitter = new MiddlEmitter();
      const returnValue = emitter.emit('test');
      expect(returnValue && returnValue.then, 'expect #emit return Promise').to.be.a('function');
    });
  });

  describe('#use', function () {
    it('should be a function', function () {
      expect(emitter.use, 'expect #use be a function').to.be.a('function');
    });
    it('should return middleware reference', function () {
      const emitter = new MiddlEmitter();
      const listener = async (params, next) => {
        await next();
      };
      const returnValue = emitter.use('test', listener);
      expect(returnValue, 'expect #user return middleware reference').to.equal(listener);
    });
  });
});
