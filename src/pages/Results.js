import React, { Component } from 'react';
import bmd from "../assets/results/bmd.png";
import sfd from "../assets/results/sfd.png";
import def from "../assets/results/def.png";
import Header from '../components/Header';

export default class Results extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className='results-container'>
            <img src={bmd} alt="Not found"/>
            <img src={sfd} alt="Not found"/>
            <img src={def} alt="Not found"/>
        </div>
      </div>
    )
  }
}
