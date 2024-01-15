import axios from 'axios';
import { ListGroup } from 'react-bootstrap';
import { Link, useLoaderData } from "react-router-dom";

export async function loader() {
  const res = await axios.get('/api/lists');
  return {
    lists: Array.isArray(res.data?.data) ? res.data.data : [],
  };
}

export function render() {
  const { lists } = useLoaderData();

  return (
    <ListGroup>
      {lists.map(list => (
        <ListGroup.Item>
          <Link className="stretched-link" to={`/list/${list.id}`}>{list.title}</Link>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
