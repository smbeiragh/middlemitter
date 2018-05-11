/**
 * Created by sajjad on 11/16/17.
 */

function getListenerMeta(fn, name) {
  if (!('me' in fn)) {
    const meta = {};
    fn.me = { [name]: meta }; // eslint-disable-line no-param-reassign
    return meta;
  }

  const { me } = fn;
  if (!(name in me)) {
    const meta = {};
    me[name] = meta;
    return meta;
  }

  return me[name];
}

function ListenerHandler(name) {
  this.listeners = [];
  this.name = name;
}

Object.assign(ListenerHandler.prototype, {
  isEmpty() {
    // TODO: provide a more reliable and efficient solution
    return this.listeners.length === 0;
  },
  add(fn, priority = 0) {
    const { listeners, name } = this;
    const priorityListeners = listeners[priority] || (listeners[priority] = []);
    priorityListeners.push(fn);
    const meta = getListenerMeta(fn, name);
    meta.priority = priority;
    meta.index = priorityListeners.length - 1;
    return fn;
  },
  remove(fn) {
    const { listeners, name } = this;
    const meta = getListenerMeta(fn, name);
    if (!('me' in fn)) {
      return;
    }
    const { priority, index } = meta;
    const priorityListeners = listeners[priority] || (listeners[priority] = []);
    if (index >= 0) {
      priorityListeners[index] = undefined;
    }
  },
  values() {
    return this[Symbol.iterator]();
  },
  // TODO: provide a more performance efficient solution
  [Symbol.iterator]() {
    const { listeners } = this;
    let stepI = -1;
    let stepJ = 0;
    const next = () => {
      if (stepI === -1) {
        stepI = listeners.length - 1;
      }
      for (let i = stepI; i >= 0; i -= 1) {
        if (listeners[i]) {
          for (let j = stepJ; j < listeners[i].length; j += 1) {
            stepJ = j + 1;
            if (listeners[i][j]) {
              return { value: listeners[i][j], done: false };
            }
          }
          stepJ = 0;
        }
        stepI = i - 1;
      }
      return { value: undefined, done: true };
    };

    return { next };
  },
});

// TODO: provide more performance/memory efficient solution (a priority queue)
export default function createListenerHandler({ name }) {
  return new ListenerHandler(name);
}
