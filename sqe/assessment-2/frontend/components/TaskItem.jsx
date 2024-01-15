import { Form, ListGroup } from 'react-bootstrap';

export function TaskItem({ task, onOpenTask, onRemoveTask }) {
  return (
    <ListGroup.Item className="d-flex flex-row" key={task.id}>
      <Form.Check type="checkbox"/>
      <span className="flex-fill">{ task.title }</span>
      <a href="#" onClick={onOpenTask}><i className="bi-info-circle"/></a>
      <a className="pl-1" href="#" onClick={onRemoveTask}><i className="bi-x-circle"/></a>
    </ListGroup.Item>
  );
}
