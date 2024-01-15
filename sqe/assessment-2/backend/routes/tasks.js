const assert = require('http-assert-plus');
const express = require('express');
const yup = require('yup');

const datastore = require('../lib/datastore');

const router = module.exports = express.Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: List all tasks
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
router.get('/', async (req, res, next) => {
  try {
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
      filters.push(entry => entry.id === query.id);
    }
    if (query.ids) {
      const ids = query.ids.split(',').map(s => s.trim());
      filters.push(entry => ids.includes(entry.id));
    }
    if (query.completed) {
      filters.push(entry => {
        if (query.completed === true) {
          return (entry.completedAt instanceof Date);
        } else {
          return entry.completedAt === null || entry.completedAt === undefined || !(entry.completedAt instanceof Date);
        }
      });
    }
    if (query.due) {
      filters.push(entry => {
        if (query.due === true) {
          return (entry.dueAt instanceof Date);
        } else {
          return entry.dueAt === null || entry.dueAt === undefined || !(entry.dueAt instanceof Date);
        }
      });
    }

    let entries = await datastore.find({ type: 'task' }, { filters });

    res.status(200).json({ data: entries });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { data } = yup.object().required()
      .shape({
        data: yup.object().required().shape({
          listId: yup.string().uuid().required(),
          title: yup.string().required(),
          notes: yup.string().nullable(),
          url: yup.string().nullable(),
          dueAt: yup.date().nullable(),
        }),
      })
      .validateSync(req.body);

    const entry = {
      type: 'task',
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

router.patch('/:taskId', async (req, res, next) => {
  try {
    const { taskId } = req.params;
    assert(taskId, 404, 'Missing { taskId } param from req', {
      code: 'TASK_NOT_FOUND',
      userMessage: 'Task not found',
    });

    let entry = await datastore.findOne({ type: 'task', id: taskId });
    assert(entry?.id, 404, 'Task not found', {
      code: 'TASK_NOT_FOUND',
      userMessage: 'Task not found',
      meta: { taskId },
    });

    const { data } = yup.object().required()
      .shape({
        data: yup.object().required().shape({
          listId: yup.string().uuid(),
          title: yup.string(),
          notes: yup.string().nullable(),
          url: yup.string().nullable(),
          dueAt: yup.date().nullable(),
          completedAt: yup.date().nullable(),
        }),
      })
      .validateSync(req.body);

    const updatedAt = new Date();

    await datastore.updateOne({ type: 'task', id: entry.id }, {
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

router.delete('/:taskId', async (req, res, next) => {
  try {
    const { taskId } = req.params;
    assert(taskId, 404, 'Missing { taskId } param from req', {
      code: 'TASK_NOT_FOUND',
      userMessage: 'Task not found',
    });

    let entry = await datastore.findOne({ type: 'task', id: taskId });
    assert(entry?.id, 404, 'Task not found', {
      code: 'TASK_NOT_FOUND',
      userMessage: 'Task not found',
      meta: { taskId },
    });

    await datastore.deleteOne({ type: 'task', id: entry.id });

    res.status(200).json({
      data: true,
    });
  } catch (err) {
    next(err);
  }
});
