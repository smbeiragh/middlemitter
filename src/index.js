/**
 * Created by sajjad on 11/15/17.
 */
import createListenerHandler from './listener_handler';

function ensurePromise(value) {
  if (typeof value !== 'undefined' && typeof value.then === 'function') {
    return value;
  }
  return Promise.resolve(value);
}

function getHandler(map, eventName) {
  if (eventName in map) {
    return map[eventName];
  }
  const handler = createListenerHandler({ name: eventName });
  map[eventName] = handler; // eslint-disable-line no-param-reassign
  return handler;
}

function immediate() {
  return new Promise(resolve => (setImmediate || setTimeout)(() => resolve(), 0));
}

function applyMiddleWare(middleWares, params) {
  const itr = middleWares.values();

  const next = () => {
    const middleWare = itr.next();

    if (middleWare.value) {
      return ensurePromise(middleWare.value(params, next));
    }

    return Promise.resolve();
  };

  return next();
}

function applyListeners(listeners, params) {
  const itr = listeners.values();

  let nextListener;

  let hasListeners = false;

  const next = () => (
    immediate() // clear up call-stack & make sync listeners execution call like async one
      .then(() => {
        let res;
        nextListener = itr.next();
        const fn = nextListener.value;
        if (fn) {
          hasListeners = true;
          const result = fn(...params);
          res = ensurePromise(result).then(() => next());
        }
        return res;
      }));

  return next().then(() => hasListeners);
}

function getListenerWrapperOfEvent(fn, eventName) {
  if (!('wrappers' in fn)) {
    return null;
  }
  return fn.wrappers[eventName] || null;
}

function setListenerWrapperOfEvent(fn, eventName, wrapper) {
  if (!('wrappers' in fn)) {
    const wrappers = {};
    wrappers[eventName] = wrapper;
    fn.wrappers = wrappers; // eslint-disable-line no-param-reassign
  } else {
    fn.wrappers[eventName] = wrapper; // eslint-disable-line no-param-reassign
  }
}

function MiddlEmitter() {
  this.meta = { events: {}, middleWares: {} };
}

Object.assign(MiddlEmitter.prototype, {
  on(eventName, fn, priority) {
    eventName.split(' ').forEach((eName) => {
      const handler = getHandler(this.meta.events, eName);
      handler.add(fn, priority);
    });
    return fn;
  },
  once(eventName, fn, priority) {
    eventName.split(' ').forEach((eName) => {
      const wrapper = this.on(eName, (...params) => {
        this.off(eName, wrapper);
        return fn(...params);
      }, priority);
      setListenerWrapperOfEvent(fn, eName, wrapper);
    });
    return fn;
  },
  off(eventName, fn) {
    const handler = getHandler(this.meta.events, eventName);
    const wrapper = getListenerWrapperOfEvent(fn, eventName);
    handler.remove(wrapper || fn);
  },
  emit(eventName, ...params) {
    const handler = getHandler(this.meta.events, eventName);
    const middleWares = getHandler(this.meta.middleWares, eventName);

    if (!handler.isEmpty()) {
      if (!middleWares.isEmpty()) {
        return applyMiddleWare(middleWares, params).then(() => applyListeners(handler, params));
      }
      return applyListeners(handler, params);
    }

    return Promise.resolve();
  },
  use(eventName, fn, priority = 0) {
    let fns;
    let finalPriority = priority;
    const args = [...arguments]; // eslint-disable-line prefer-rest-params
    if (priority.constructor !== Number) {
      fns = Array.prototype.slice.apply(args, [1, args.length - 1]);
      const lastArg = args[args.length - 1];
      if (typeof lastArg === 'number') {
        finalPriority = lastArg;
      } else {
        finalPriority = 0;
        fns.push(args[args.length - 1]);
      }
    }
    const handler = getHandler(this.meta.middleWares, eventName);

    if (fns) {
      fns.forEach((aFn) => {
        handler.add(aFn, finalPriority);
      });
    } else {
      handler.add(fn, priority);
    }

    return fn;
  },
});

// TODO: add factory pattern support
export default MiddlEmitter;
export { MiddlEmitter };
