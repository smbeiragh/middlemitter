/**
 * Created by sajjad on 11/16/17.
 */

import { MiddlEmitter } from './../build';

const delay = (ms) => new Promise((resolve, reject) => {
    setTimeout(() => { resolve(); }, ms);
  });

const emitter = new MiddlEmitter();

emitter.on('test', (a,b,c) => {
  console.log('>>',10);
}, 10);

const removed = emitter.on('test', async (a,b,c) => {
  console.log('>>',12, 0);
}, 12);

emitter.on('test',async (a,b,c) => {
  await delay(3000);
  console.log('>>',12, 1, a,b,c);
}, 12);

emitter.on('test', async (a,b,c) => {
  await delay(3000);
  console.log('>>',13, 1, a,b,c);
}, 13);

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

emitter.emit('test', 1, 2, 3).then(()=>{console.log('ok 1')});
emitter.emit('test', 0, 0, 0).then(()=>{console.log('ok 2')});

