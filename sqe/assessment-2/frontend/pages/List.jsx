import axios from 'axios';
import { Form, ListGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';

import { TaskItem } from '../components/TaskItem';

export async function loader({ params }) {
  const res = await axios.get(`/api/lists/${params.listId}`);
  const list = res.data?.data?.id ? res.data.data : undefined;
  return {
    listId: params.listId,
    list: { ...list, items: undefined },
    tasks: Array.isArray(list?.items) ? list.items : [],
  };
}

export function render() {
  const [{ listId, list, tasks }, setState] = useState(useLoaderData());

  const newTask = useFormik({
    initialValues: {
      title: '',
    },
    async onSubmit({ title }) {
      const res = await axios.post('/api/tasks', {
        data: {
          listId,
          title,
        },
      });

      if (res.data?.data?.id) {
        tasks.push(res.data.data);
        setState({ listId, list, tasks });
        newTask.values.title = '';
      }
    },
  });

  async function deleteTask(e, taskId) {
    e.preventDefault();
    await axios.delete(`/api/tasks/${taskId}`);
    const i = tasks.findIndex(t => t.id === taskId);
    if (i >= 0) {
      tasks.splice(i, 1);
      setState({ listId, list, tasks });
    }
  }

  return (
    <>
      <div className="list-header">
        <h3>{list.title}</h3>
      </div>
      <ListGroup>
        {tasks.map(task => (
          <TaskItem task={task}
            onRemoveTask={e => deleteTask(e, task.id)}/>
        ))}
        <ListGroup.Item className="d-flex flex-row p-0">
          <form className="w-100" onSubmit={newTask.handleSubmit}>
            <Form.Control onChange={newTask.handleChange} value={newTask.values.title}
              id="title"
              className="border-0 add-new-task"
              placeholder="Add new"/>
          </form>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}
