/**
 * Created by sajjad on 11/16/17.
 */

// TODO: provide more performance/memory efficient solution (a priority queue)
export function createListenerHandler({name}) {
  const listeners = [];

  function getListenerMeta(fn){
    if (!('me' in fn)) {
      const meta = {};
      fn.me =  { [name] : meta };
      return meta;
    } else {
      const me = fn.me;
      if(!(name in me)) {
        const meta = {};
        me[name] = meta;
        return meta;
      } else {
        return me[name];
      }
    }
  }

  return {
    getListenerMeta(fn){
      return getListenerMeta(fn);
    },
    isEmpty() {
      // TODO: provide a more reliable and efficient solution
      return listeners.length === 0;
    },
    add(fn, priority = 0) {
      const priorityListeners = listeners[priority] || (listeners[priority] = []);
      priorityListeners.push(fn);
      const meta = getListenerMeta(fn);
      meta.priority = priority;
      meta.index = priorityListeners.length - 1;
      return fn;
    },
    remove(fn) {
      const meta = getListenerMeta(fn);
      if(!'me' in fn) {
        return;
      }
      const { priority, index } = meta;
      const priorityListeners = listeners[priority] || (listeners[priority] = []);
      if (index >=0) {
        priorityListeners[index] = undefined;
      }
    },
    values() {
      return this[Symbol.iterator]();
    },
    // TODO: provide a more performance efficient solution
    [Symbol.iterator]() {
      let stepI = -1;
      let stepJ = 0;
      const next = () => {
        if(stepI === -1) {
          stepI = listeners.length - 1;
        }
        for (let i = stepI; i >= 0; i -= 1) {
          if (listeners[i]) {
            for (let j = stepJ; j < listeners[i].length; j += 1) {
              stepJ = j + 1;
              if (listeners[i][j]) {
                return {value: listeners[i][j], done: false};
              }
            }
            stepJ = 0;
          }
          stepI = i - 1;
        }
        return {value: undefined, done: true};
      };

      return {next};
    }
  };
}