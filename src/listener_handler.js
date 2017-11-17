/**
 * Created by sajjad on 11/16/17.
 */

export function createListenerHandler() {
  const listeners = [];

  return {
    isEmpty() {
      return listeners.length === 0;
    },
    add(fn, priority = 0) {
      const priorityListeners = listeners[priority] || (listeners[priority] = []);
      priorityListeners.push(fn);
      fn.priority = priority;
      fn.index = priorityListeners.length - 1;
      return fn;
    },
    remove(fn) {
      if(!'priority' in fn) {
        return;
      }
      const { priority, index } = fn;
      const priorityListeners = listeners[priority] || (listeners[priority] = []);
      if (index >=0) {
        priorityListeners[index] = undefined;
      }
    },
    values() {
      return this[Symbol.iterator]();
    },
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