// import { useEffect, useReducer } from 'react';
import { Nav, Navbar } from "react-bootstrap";
import { Link, createHashRouter, RouterProvider } from "react-router-dom";

import * as Homepage from './pages/Home';
import * as Listpage from './pages/List';

import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

const router = createHashRouter([
  {
    path: '/',
    loader: Homepage.loader,
    element: <Homepage.render/>,
  },
  {
    path: '/list/:listId',
    loader: Listpage.loader,
    element: <Listpage.render/>,
  },
]);

function App() {
  return (
    <>
      <header>
        <Navbar className="rounded-bottom" bg="dark" variant="dark">
          <div className="container">
            <Navbar.Brand href="#/">T3</Navbar.Brand>
            <Nav className="ml-auto">
              <Nav.Link href="#/">All lists</Nav.Link>
            </Nav>
          </div>
        </Navbar>
      </header>
      <main className="container pt-5">
        <RouterProvider router={router}/>
      </main>
    </>
  )
}

export default App
