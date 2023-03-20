import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "../css/header.css";

export default class Header extends Component {
  render() {
    return (
        <header>
          <h1>FEM</h1>
            <nav>
              <ul>
                <li>
                  <Link className='link' to="/">Home</Link>
                </li>
                <li>
                  <Link className='link' to="/solve">Solve</Link>
                </li>
                <li>
                  <Link className='link' to="/help">Help</Link>
                </li>
              </ul>
            </nav>
        </header>
    )
  }
}
