import * as React from 'react';
import AddEntryButton from './components/AddEntryButton';
import EntryEditor from './components/EntryEditor';
import Login from './components/Login';
import Overview from './components/Overview';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const App = () => (
  <Router>
    <AddEntryButton />
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/overview">
        <Overview />
      </Route>
      <Route path="/editor">
        <EntryEditor />
      </Route>
      <Route path="/">
        <Overview />
      </Route>
    </Switch>
  </Router>
);

export default App;
