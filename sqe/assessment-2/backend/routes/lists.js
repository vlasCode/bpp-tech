const assert = require('http-assert-plus');
const express = require('express');
const yup = require('yup');

const datastore = require('../lib/datastore');

const router = module.exports = express.Router();

/**
 * @swagger
 * /lists:
 *   get:
 *     tags:
 *       - Lists
 *     summary: List all Lists
 *     responses:
 *       200:
 *         description: The complete list of lists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       default:
 *         $ref: '#/components/responses/ErrDefault'
 */
router.get('/', async (req, res, next) => {
  try {
    const query = yup.object().required()
      .shape({
        id: yup.string(),
        ids: yup.string(),
      })
      .validateSync(req.query);

    const filters = [];

    if (query.id) {
      filters.push(entry => entry.id === query.id);
    }
    if (query.ids) {
      const ids = query.ids.split(',').map(s => s.trim());
      filters.push(entry => ids.includes(entry.id));
    }

    const now = new Date();

    const entries = await Promise.all((await datastore.find({ type: 'list' }, { filters })).map(async entry => {
      const items = (await datastore.find({ type: 'task', listId: entry.id }));
      return {
        ...entry,
        itemsCount: items.length,
        itemsDueAt: items.filter(item => item.dueAt && item.dueAt <= now).length,
      };
    }));

    res.status(200).json({ data: entries });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /lists/{listId}:
 *   get:
 *     tags:
 *       - Lists
 *     summary: Return a specific List
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       default:
 *         $ref: '#/components/responses/ErrDefault'
 */
router.get('/:listId', async (req, res, next) => {
  try {
    const { listId } = req.params;
    assert(listId, 404, 'Missing { listId } param from req', {
      code: 'LIST_NOT_FOUND',
      userMessage: 'List not found',
    });

    const entry = await datastore.findOne({ type: 'list', id: listId });
    assert(entry?.id, 404, 'List not found', {
      code: 'LIST_NOT_FOUND',
      userMessage: 'List not found',
      meta: { listId },
    });

    const query = yup.object().required()
      .shape({
        id: yup.string(),
        ids: yup.string(),
        completed: yup.boolean(),
        due: yup.boolean(),
      })
      .validateSync(req.query);

    const filters = [];

    if (query.id) {
      filters.push(item => item.id === query.id);
    }
    if (query.ids) {
      const ids = query.ids.split(',').map(s => s.trim());
      filters.push(item => ids.includes(item.id));
    }
    if (query.completed) {
      filters.push(item => {
        if (query.completed === true) {
          return (item.completedAt instanceof Date);
        } else {
          return item.completedAt === null || item.completedAt === undefined || !(item.completedAt instanceof Date);
        }
      });
    }
    if (query.due) {
      filters.push(item => {
        if (query.due === true) {
          return (item.dueAt instanceof Date);
        } else {
          return item.dueAt === null || item.dueAt === undefined || !(item.dueAt instanceof Date);
        }
      });
    }

    const items = await datastore.find({ type: 'task', listId }, { filters });

    res.status(200).json({
      data: {
        ...entry,
        items,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /lists:
 *   post:
 *     tags:
 *       - Lists
 *     summary: Create a new List
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       default:
 *         $ref: '#/components/responses/ErrDefault'
 */
router.post('/', async (req, res, next) => {
  try {
    const { data } = yup.object().required()
      .shape({
        data: yup.object().required().shape({
          title: yup.string().required(),
        }),
      })
      .validateSync(req.body);

    const entry = {
      type: 'list',
      id: datastore.createId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await datastore.insertOne(entry);

    res.status(200).json({
      data: entry,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /lists/{listId}:
 *   post:
 *     tags:
 *       - Lists
 *     summary: Update a List
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       default:
 *         $ref: '#/components/responses/ErrDefault'
 */
router.patch('/:listId', async (req, res, next) => {
  try {
    const { listId } = req.params;
    assert(listId, 404, 'Missing { listId } param from req', {
      code: 'LIST_NOT_FOUND',
      userMessage: 'List not found',
    });

    let entry = await datastore.findOne({ type: 'list', id: listId });
    assert(entry?.id, 404, 'List not found', {
      code: 'LIST_NOT_FOUND',
      userMessage: 'List not found',
      meta: { listId },
    });

    const { data } = yup.object().required()
      .shape({
        data: yup.object().required().shape({
          title: yup.string().required(),
        }),
      })
      .validateSync(req.body);

    const updatedAt = new Date();

    await datastore.updateOne({ type: 'list', id: entry.id }, {
      ...data,
      updatedAt,
    });

    entry = {
      ...entry,
      ...data,
      updatedAt,
    };

    res.status(200).json({
      data: entry,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /lists/{listId}:
 *   delete:
 *     tags:
 *       - Lists
 *     summary: Delete a List
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       default:
 *         $ref: '#/components/responses/ErrDefault'
 */
router.delete('/:listId', async (req, res, next) => {
  try {
    const { listId } = req.params;
    assert(listId, 404, 'Missing { listId } param from req', {
      code: 'LIST_NOT_FOUND',
      userMessage: 'List not found',
    });

    let entry = await datastore.findOne({ type: 'list', id: listId });
    assert(entry?.id, 404, 'List not found', {
      code: 'LIST_NOT_FOUND',
      userMessage: 'List not found',
      meta: { listId },
    });

    await datastore.deleteOne({ type: 'list', id: entry.id });
    await datastore.deleteMany({ type: 'task', listId: entry.id });

    res.status(200).json({
      data: true,
    });
  } catch (err) {
    next(err);
  }
});
