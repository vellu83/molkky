import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { GamePage } from './game/GamePage';
import { RulesPage } from './rules/RulesPage';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path='/rules'>
            <RulesPage />
          </Route>
          <Route exact path='/'>
            <GamePage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
