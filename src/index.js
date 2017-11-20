/**
 * Created by sajjad on 11/15/17.
 */

import {createListenerHandler} from './listener_handler';

function getHandler(map, eventName) {
  if (eventName in map) {
    return map[eventName];
  } else {
    return map[eventName] = createListenerHandler();
  }
}

async function applyMiddleWare(middleWares, params) {
  const itr = middleWares.values();

  const next = async() => {
    const middleWare = itr.next();

    if (middleWare.value) {
      await middleWare.value(params, next);
    }
  };

  await next();
}

export class MiddlEmitter {
  constructor() {
    this.meta = {events:{}, middleWares:{}};
  }
  on(eventName, fn, priority) {
    const handler = getHandler(this.meta.events, eventName);
    return handler.add(fn, priority);
  }
  once(eventName, fn, priority) {
    const handler = this.on(eventName, (...params) => {
      this.off(eventName, handler);
      return fn(...params);
    }, priority);
    return handler;
  }
  off(eventName, fn) {
    const handler = getHandler(this.meta.events, eventName);
    return handler.remove(fn);
  }
  async emit(eventName, ...params) {
    const handler = getHandler(this.meta.events, eventName);
    const middleWares = getHandler(this.meta.middleWares, eventName);

    if(!middleWares.isEmpty()) {
      await applyMiddleWare(middleWares, params);
    }

    const itr = handler.values();

    let nextListener;

    let hasListeners = false;

    const next = () => {
      return new Promise((resolve, reject) => {
        setImmediate(async()=> {
          try {
            nextListener = itr.next();
            const fn = nextListener.value;
            if (fn) {
              hasListeners = true;
              const result = fn(...params);
              if (result && typeof result.then === 'function') {
                await result;
              }
              await next();
              resolve(hasListeners);
            } else {
              resolve(hasListeners);
            }
          } catch (err) {
            reject(err);
          }
        });
      });
    };

    return next();
  }
  use(eventName, fn, priority) {
    const handler = getHandler(this.meta.middleWares, eventName);
    return handler.add(fn, priority);
  }
}
