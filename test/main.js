/**
 * Created by sajjad on 11/16/17.
 */

import { MiddlEmitter } from './../build';

const emitter = new MiddlEmitter();

emitter.on('test', (a,b,c) => {
  console.log('>>',10);
}, 10);

const removed = emitter.on('test', (a,b,c) => {
  console.log('>>',12, 0);
}, 12);

emitter.on('test', (a,b,c) => {
  console.log('>>',12, 1, a,b,c);
}, 12);

emitter.once('test', (a,b,c) => {
  console.log('>> once');
}, 12);

emitter.off('test', removed);

emitter.use('test', async (params, next) => {
  params[0] += 1;
  params[1] += 1;
  params[2] += 1;
  await next();
});

emitter.use('test', async (params, next) => {
  params[0] *= 10;
  params[1] *= 10;
  params[2] *= 10;
  await next();
},2);

emitter.use('test', async ([a,b,c], next) => {
  await next(a+2,b+2,c+2);
},3);

emitter.emit('test', 1, 2, 3);
emitter.emit('test', 1, 2, 3);
