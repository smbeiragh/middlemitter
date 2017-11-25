/**
 * Created by sajjad on 11/24/17.
 */

import chai, {expect, assert} from 'chai';
import { MiddlEmitter } from './../src';

const delay = (ms) => new Promise((resolve, reject) => {
  setTimeout(() => { resolve(); }, ms);
});

//var assert = require('assert');
describe('MiddlEmitter priority', function() {
  describe('#on', function() {
    it('should add listeners with different priority', function() {
      const emitter = new MiddlEmitter();
      const calls = [];
      emitter.on('test', () => { calls.push(6) });
      emitter.on('test', () => { calls.push(5) }, 10);
      emitter.on('test', () => { calls.push(2) }, 20);
      emitter.on('test', () => { calls.push(3) }, 20);
      emitter.on('test', () => { calls.push(4) }, 15);
      emitter.on('test', () => { calls.push(1) }, 30);

      return emitter.emit('test', () => { }).then(() => {
        expect(calls).to.deep.equal([1,2,3,4,5,6]);
      });
    });
  });

  describe('#once', function() {
    it('should add listeners with different priority', function() {
      const emitter = new MiddlEmitter();
      const calls = [];
      emitter.on('test', () => { calls.push(6) });
      emitter.on('test', () => { calls.push(5) }, 10);
      emitter.on('test', () => { calls.push(2) }, 20);
      emitter.on('test', () => { calls.push(3) }, 20);
      emitter.on('test', () => { calls.push(4) }, 15);
      emitter.on('test', () => { calls.push(1) }, 30);

      return emitter.emit('test', () => { }).then(() => {
        expect(calls).to.deep.equal([1,2,3,4,5,6]);
      });
    });
  });

  describe('#off', function() {
    it('should remove listener with priority', function () {
      const emitter = new MiddlEmitter();
      let called = false;
      const listener = emitter.on('test', () => {
        called = true;
      });
      emitter.off('test', listener);
      return emitter.emit('test').then(() => {
        expect(called).to.equal(false);
      });
    });
  });

  describe('async listeners', function() {
    it('should await on async listeners', function() {
      const emitter = new MiddlEmitter();
      const calls = [];
      let start;
      let finish;
      emitter.on('test', () => {
        start = +(new Date());
      });

      emitter.on('test', async () => {
        await delay(200);
      });

      emitter.on('test', async () => {
      });

      emitter.on('test', async () => {
        await delay(200);
      });

      emitter.on('test', () => {
        finish = +(new Date());
      });

      return emitter.emit('test', () => { }).then(() => {
        expect((finish - start) >= 400).to.equal(true);
      });
    });
  });

});
