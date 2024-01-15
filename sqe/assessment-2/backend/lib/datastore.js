const _ = require('lodash');
const assert = require('http-assert-plus');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const seed = require('../seed');

const filePath = path.resolve(__dirname, '../../data.json');

const db = Object.create({}, {
  data: {
    enumerable: true,
    writable: true,
    value: [],
  },
  read: {
    enumerable: true,
    async value() {
      try {
        const contents = await new Promise((resolve, reject) => {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(JSON.parse(data));
            }
          });
        });

        this.data = contents;
      } catch (err) {
        if (err.code === 'ENOENT') {
          this.data = _.cloneDeep(seed);
        } else {
          reject(err);
        }
      }
    },
  },
  write: {
    enumerable: true,
    async value() {
      await new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(this.data, null, 2), err => {
          if (err) {
            reject(err)
          } else {
            resolve();
          }
        });
      });
    },
  },
});

const initialised = new Promise(async resolve => {
  await db.read();
  resolve();
});

let writeLock = undefined;
/**
 * @template T
 * @param {(() => T) | (() => Promise<T>)} fn
 * @returns {Promise<T>}
 */
async function withWriteLock(fn) {
  assert(typeof fn === 'function', 'Expected argument to be a function');

  await writeLock;
  let resolveWriteLock = undefined;
  writeLock = new Promise(resolve => resolveWriteLock = resolve);
  assert(typeof resolveWriteLock === 'function', 'Failed to secure writelock');

  try {
    const result = await fn();
    return result;
  } finally {
    resolveWriteLock();
  }
}

module.exports = {
  createId: () => crypto.randomUUID(),
  async find(where, { filters, limit } = {}) {
    await initialised;
    assert(_.isPlainObject(where) && typeof where.type === 'string', 'Expected where to have a type');

    let results = _.filter(db.data, where);

    if (Array.isArray(filters) && filters.length) {
      results = filters.filter(f => typeof f === 'function').reduce((es, f) => es.filter(f), results);
    }

    if (typeof limit === 'number') {
      results = results.slice(0, limit);
    }

    return results;
  },
  async findOne(where) {
    await initialised;
    assert(_.isPlainObject(where) && typeof where.type === 'string', 'Expected where to have a type');
    return _.find(db.data, where);
  },

  async insertOne(record) {
    await initialised;
    assert(_.isPlainObject(record) && typeof record.type === 'string', 'Expected record to have a type');

    record.id = typeof record.id === 'string' ? record.id : crypto.randomUUID();

    await withWriteLock(async () => {
      db.data.push(record);
      await db.write();
    });

    return {
      inserted: 1,
      insertedId: record.id,
    };
  },
  async insertMany(records) {
    await initialised;
    assert(Array.isArray(records), 'Expected records to be an array of records');
    records.forEach(record => {
      assert(_.isPlainObject(record) && typeof record.type === 'string', 'Expected record to have a type');
      record.id = typeof record.id === 'string' ? record.id : crypto.randomUUID();
    });

    await withWriteLock(async () => {
      db.data.push(...records);
      await db.write();
    });

    return {
      inserted: records.length,
      insertedIds: records.map(({ id }) => id),
    };
  },

  async updateOne(where, update) {
    await initialised;
    assert(_.isPlainObject(where) && typeof where.type === 'string', 'Expected where to have a type');
    assert(_.isPlainObject(update), 'Expected update to be a plain object');

    await withWriteLock(async () => {
      const i = _.findIndex(db.data, where);
      if (i >= 0) {
        db.data[i] = { ...db.data[i], ...update };
      }
      await db.write();
    });

    return {
      updated: i >= 0 ? 1 : 0,
    };
  },
  async updateMany(where, update) {
    await initialised;
    assert(_.isPlainObject(where) && typeof where.type === 'string', 'Expected where to have a type');
    assert(_.isPlainObject(update), 'Expected update to be a plain object');

    const is = await withWriteLock(async () => {
      const whereMatches = _.matches(where);
      const indexes = db.data.reduce((list, entry, i) => {
        if (whereMatches(entry)) {
          list.push(i);
        }
        return list;
      }, []);

      indexes.forEach(i => db.data[i] = { ...db.data[i], ...update });

      await db.write();

      return indexes;
    });

    return {
      updated: is.length,
    };
  },

  async deleteOne(where) {
    await initialised;
    assert(_.isPlainObject(where) && typeof where.type === 'string', 'Expected where to have a type');

    let i = -1;

    await withWriteLock(async () => {
      const i = _.findIndex(db.data, where);
      if (i >= 0) {
        db.data.splice(i, 1);
      }

      await db.write();
    });

    return {
      deleted: i >= 0 ? 1 : 0,
    };
  },
  async deleteMany(where) {
    await initialised;
    assert(_.isPlainObject(where) && typeof where.type === 'string', 'Expected where to have a type');

    let deletedCount = 0;

    await withWriteLock(async () => {
      const whereMatches = _.matches(where);
      const indexes = db.data.reduce((list, entry, i) => {
        if (whereMatches(entry)) {
          list.push(i);
        }
        return list;
      }, []);

      for (const i = indexes.length; i >= 0; i--) {
        db.data.splice(i, 1);
      }

      await db.write();

      deletedCount = indexes.length;
    });

    return {
      deleted: deletedCount,
    };
  },
};
