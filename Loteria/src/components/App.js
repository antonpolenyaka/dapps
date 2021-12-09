import React, { Component } from 'react';
import './App.css';
import { Container } from 'semantic-ui-react';
import Header from './Header';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Tokens from './Tokens';
import Loteria from './Loteria';
import Premios from './Premios';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Container>
          <Header />
          <main>
            <Routes>
              <Route exact path='/' component={Tokens} />
              <Route exact path='/loteria' component={Loteria} />
              <Route exact path='/premios' component={Premios} />
            </Routes>
          </main>
        </Container>
      </BrowserRouter>
    );
  }
}

export default App;
