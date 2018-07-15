import React, { Component } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Provider from './components/provider';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider />
      </BrowserRouter>
    );
  }
}

export default App;
