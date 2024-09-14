import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';

function App() {

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        {isAuthenticated ? (
          <Route path="/" component={Layout} />
        ) : (
          <Route path="/" exact component={Login} />
        )}
        
      </Switch>
    </Router>
  );
}

export default App;
