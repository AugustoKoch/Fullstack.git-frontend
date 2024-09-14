import React from 'react';
import { Switch, Link } from 'react-router-dom';
import LivroList from './LivroList';
import UsuarioList from './UsuarioList';
import Home from './Home';
import PrivateRoute from './PrivateRoute';
import '../App.css'

const Layout = () => {
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/livros">Gerenciar Livros</Link>
          </li>
          <li>
            <Link to="/usuarios">Gerenciar Usuários</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <PrivateRoute path="/livros" component={LivroList} />
        <PrivateRoute path="/usuarios" component={UsuarioList} />
        <PrivateRoute path="/" exact component={Home} />
      </Switch>
    </div>
  );
};

export default Layout;
