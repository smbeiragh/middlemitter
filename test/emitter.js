/**
 * Created by sajjad on 11/24/17.
 */
import 'babel-polyfill';
import { expect } from 'chai';
import { MiddlEmitter } from './../src';

const delay = ms => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

describe('MiddlEmitter advance features', () => {
  describe('#on', () => {
    it('should add listeners with different priority', () => {
      const emitter = new MiddlEmitter();
      const calls = [];
      emitter.on('test', () => {
        calls.push(6);
      });
      emitter.on('test', () => {
        calls.push(5);
      }, 10);
      emitter.on('test', () => {
        calls.push(2);
      }, 20);
      emitter.on('test', () => {
        calls.push(3);
      }, 20);
      emitter.on('test', () => {
        calls.push(4);
      }, 15);
      emitter.on('test', () => {
        calls.push(1);
      }, 30);

      return emitter.emit('test', () => {
      }).then(() => {
        expect(calls, 'expect to listeners execute from height to low priority an in order')
          .to.deep.equal([1, 2, 3, 4, 5, 6]);
      });
    });

    it('should add same listener to multiple events', () => {
      const emitter = new MiddlEmitter();
      const calls = [];
      const listener = (log) => {
        calls.push(log);
      };

      emitter.on('test1', listener);

      emitter.on('test2', listener);


      return emitter.emit('test1', 'test1 log')
        .then(() => emitter.emit('test2', 'test2 log'))
        .then(() => {
          expect(calls, 'expect to listener receive multiple emits').to.deep.equal(['test1 log', 'test2 log']);
        });
    });
  });

  describe('#once', () => {
    it('should add listeners with different priority', () => {
      const emitter = new MiddlEmitter();
      const calls = [];
      emitter.once('test', () => {
        calls.push(6);
      });
      emitter.once('test', () => {
        calls.push(5);
      }, 10);
      emitter.once('test', () => {
        calls.push(2);
      }, 20);
      emitter.once('test', () => {
        calls.push(3);
      }, 20);
      emitter.once('test', () => {
        calls.push(4);
      }, 15);
      emitter.once('test', () => {
        calls.push(1);
      }, 30);

      return emitter.emit('test', () => {
      }).then(() => {
        expect(calls, 'expect to call listeners from height to low priority an in order')
          .to.deep.equal([1, 2, 3, 4, 5, 6]);
      });
    });

    it('should add same listener to multiple events', () => {
      const emitter = new MiddlEmitter();
      let calls = [];
      const listener = (log) => {
        calls.push(log);
      };

      emitter.once('test1', listener);

      emitter.once('test2', listener);

      return emitter.emit('test1', 'test1 log')
        .then(() => emitter.emit('test2', 'test2 log'))
        .then(() => {
          expect(calls, 'expect to test1 & test2 received by listener').to.deep.equal(['test1 log', 'test2 log']);
          calls = [];
          return emitter.emit('test1', 'test1 log')
            .then(() => emitter.emit('test2', 'test2 log'))
            .then(() => {
              expect(calls, 'expect to listeners remove after one emit').to.deep.equal([]);
            });
        });
    });
  });

  describe('#off', () => {
    it('should remove listener with priority', () => {
      const emitter = new MiddlEmitter();
      let called = false;
      const listener = emitter.on('test', () => {
        called = true;
      }, 10);
      emitter.off('test', listener);
      return emitter.emit('test').then(() => {
        expect(called, 'expect to remove listeners with priority').to.equal(false);
      });
    });

    it('should remove listener when same listener attached to multiple events', () => {
      const emitter = new MiddlEmitter();
      const calls = [];
      const listener = (log) => {
        calls.push(log);
      };

      emitter.on('test1', listener);

      emitter.on('test2', listener);

      emitter.on('test3', listener);

      emitter.off('test2', listener);

      return emitter.emit('test1', 'test1 log')
        .then(() => emitter.emit('test2', 'test2 log'))
        .then(() => emitter.emit('test3', 'test3 log'))
        .then(() => {
          expect(calls, 'expect to remove listener from an event while it\'s attached to other events')
            .to.deep.equal(['test1 log', 'test3 log']);
        });
    });

    it('should remove listener when same listener attached to multiple events via once method', () => {
      const emitter = new MiddlEmitter();
      const calls = [];
      const listener = (log) => {
        calls.push(log);
      };

      emitter.once('test1', listener);

      emitter.on('test2', listener);

      emitter.once('test3', listener);

      emitter.off('test1', listener);

      return emitter.emit('test1', 'test1 log')
        .then(() => emitter.emit('test2', 'test2 log'))
        .then(() => emitter.emit('test3', 'test3 log'))
        .then(() => {
          expect(
            calls,
            'expect to remove listener from an event while it\'s attached via once and it\'s attached to other events',
          ).to.deep.equal(['test2 log', 'test3 log']);
        });
    });
  });

  describe('async listeners', () => {
    it('should await on async listeners', () => {
      const emitter = new MiddlEmitter();
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

      return emitter.emit('test', () => {
      }).then(() => {
        expect(
          (finish - start) >= 400,
          'expect to await on async listeners and execute next listener just after async listener exec finished',
        ).to.equal(true);
      });
    });
  });
});
