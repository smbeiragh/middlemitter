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
      fn(...params);
      this.off(eventName, handler);
    }, priority);
  }
  off(eventName, fn) {
    const handler = getHandler(this.meta.events, eventName);
    return handler.remove(fn);
  }
  async emit(eventName, ...params) {
    const handler = getHandler(this.meta.events, eventName);
    const middleWares = getHandler(this.meta.middleWares, eventName);

    if(!middleWares.isEmpty()) {

      const itr = middleWares.values();

      const next = async(...newParams) => {
        const middleWare = itr.next();

        if (newParams && newParams.length) {
          newParams.forEach((item, i)=> {
            params[i] = item
          });
        }

        if (middleWare.value) {
          await middleWare.value(params, next);
        }
      };

      await next();

    }

    for(let fn of handler) {
      fn(...params);
    }
  }
  use(eventName, fn, priority) {
    const handler = getHandler(this.meta.middleWares, eventName);
    return handler.add(fn, priority);
  }
}
