/**
 * Created by sajjad on 11/24/17.
 */
/* eslint no-undef: 0 */
import 'babel-polyfill';
import { expect } from 'chai';
import { MiddlEmitter } from './../src';

describe('MiddlEmitter Basic test', () => {
  describe('#on', () => {
    it('should be a function', () => {
      const emitter = new MiddlEmitter();
      expect(emitter.on, 'expect #on be a function').to.be.a('function');
    });
    it('should return the listener', () => {
      const emitter = new MiddlEmitter();
      const listener = () => {};
      const returnValue = emitter.on('test', listener);
      expect(returnValue, 'expect #on return listener function').to.equal(listener);
    });
  });

  describe('#once', () => {
    it('should be a function', () => {
      const emitter = new MiddlEmitter();
      expect(emitter.once, 'expect #once be a function').to.be.a('function');
    });
    it('should return the listener', () => {
      const emitter = new MiddlEmitter();
      const listener = () => {
      };
      const returnValue = emitter.once('test', listener);
      expect(returnValue, 'expect #once return listener function').to.equal(listener);
    });
  });

  describe('#off', () => {
    it('should be a function', () => {
      const emitter = new MiddlEmitter();
      expect(emitter.off, 'expect #off be a function').to.be.a('function');
    });
  });

  describe('#emit', () => {
    it('should be a function', () => {
      const emitter = new MiddlEmitter();
      expect(emitter.emit, 'expect #emit be a function').to.be.a('function');
    });
    it('should return promise', () => {
      const emitter = new MiddlEmitter();
      const returnValue = emitter.emit('test');
      expect(returnValue && returnValue.then, 'expect #emit return Promise').to.be.a('function');
    });
  });

  describe('#use', () => {
    it('should be a function', () => {
      const emitter = new MiddlEmitter();
      expect(emitter.use, 'expect #use be a function').to.be.a('function');
    });
    it('should return middleware reference', () => {
      const emitter = new MiddlEmitter();
      const listener = async (params, next) => {
        await next();
      };
      const returnValue = emitter.use('test', listener);
      expect(returnValue, 'expect #user return middleware reference').to.equal(listener);
    });
  });
});
