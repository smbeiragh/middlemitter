/**
 * Created by sajjad on 11/24/17.
 */

import chai, {expect, assert} from 'chai';
import { MiddlEmitter } from './../src';

const delay = (ms) => new Promise((resolve, reject) => {
  setTimeout(() => { resolve(); }, ms);
});

//var assert = require('assert');
describe('MiddlEmitter basic functionality', function() {
  describe('#on', function() {
    it('should add listener', function() {
      const emitter = new MiddlEmitter();
      let called = false;
      emitter.on('test', () => { called = true; });
      return emitter.emit('test').then(()=>{
        expect(called).to.equal(true);
      });
    });
    it('should add isolate different events', function() {
      const emitter = new MiddlEmitter();
      let test1Called = false;
      let test2Called = false;
      emitter.on('test1', () => { test1Called = true; });
      emitter.on('test2', () => { test2Called = true; });
      return emitter.emit('test1').then(()=>{
        expect(test2Called).to.equal(false);
        test1Called = false;
        return emitter.emit('test2').then(()=> {
          expect(test1Called).to.equal(false);
        });
      });
    });
  });

  describe('#off', function() {
    it('should remove listener', function() {
      const emitter = new MiddlEmitter();
      let called = false;
      const listener = emitter.on('test', () => { called = true; });
      emitter.off('test', listener);
      return emitter.emit('test').then(()=>{
        expect(called).to.equal(false);
      });
    });
  });

  describe('#once', function() {
    it('should call one time', function() {
      const emitter = new MiddlEmitter();
      let callCounter = 0;
      const listener = emitter.once('test', () => { callCounter += 1; });
      return emitter.emit('test')
        .then(() => emitter.emit('test'))
        .then(()=>{ expect(callCounter).to.equal(1); });
    });
  });

  describe('#off', function() {
    it('should remove listener added via once using returned listener', function() {
      const emitter = new MiddlEmitter();
      let called = false;
      const listener = emitter.once('test', () => { called = true; });
      emitter.off('test', listener);
      return emitter.emit('test').then(()=>{
        expect(called).to.equal(false);
      });
    });
    it('should remove listener added via once using listener itself', function() {
      const emitter = new MiddlEmitter();
      let called = false;
      const listener = () => { called = true; };
      emitter.once('test', listener);
      emitter.off('test', listener);
      return emitter.emit('test').then(()=>{
        expect(called).to.equal(false);
      });
    });
  });

  describe('#emit', function() {
    it('should pass many parameters to listeners', function() {
      const emitter = new MiddlEmitter();
      let receivedParams;
      emitter.once('test', (...params) => {
        receivedParams = params;
      });
      return emitter.emit('test',1,2,3).then(()=>{
        expect(receivedParams).to.deep.equal([1,2,3]);
      });
    });

    it('should execute listeners on order', function() {
      const emitter = new MiddlEmitter();
      let calls = [];
      emitter.on('test', () => {
        calls.push(1);
      });
      emitter.on('test', () => {
        calls.push(2);
      });
      return emitter.emit('test').then(() => {
        expect(calls).to.deep.equal([1,2]);
      });
    });
  });

  describe('#use', function() {
    it('should apply middleware', function() {
      const emitter = new MiddlEmitter();
      let receivedParams;
      emitter.on('test', (...params) => {
        receivedParams = params;
      });
      emitter.use('test', async (params, next) => {
        params.map((item, i) => params[i] = item + 1);
        await next();
      });
      return emitter.emit('test',1,2,3).then(()=>{
        expect(receivedParams).to.deep.equal([2,3,4]);
      });
    });
  });
});
