import { gql } from 'apollo-boost';
import * as React from 'react';
import { Query } from 'react-apollo';
import AddEntryButton from './components/AddEntryButton';
import Login from './components/Login';
import Overview from './components/Overview';
// import EntryEditor from './components/EntryEditor';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const LOCAL_HELLO = gql`
  query localHello($subject: String) {
    localHello(subject: $subject) @client
  }
`;

const SERVER_HELLO = gql`
  query serverHello($subject: String) {
    hello(subject: $subject)
  }
`;

const LocalHello = () => (
  <Query query={LOCAL_HELLO} variables={{ subject: 'World' }}>
    {({ loading, error, data }) => {
      if (loading) {
        return 'Loading...';
      }

      return <h2>Local Salutation: {error ? error.message : data.localHello}</h2>;
    }}
  </Query>
);

const ServerHello = () => (
  <Query query={SERVER_HELLO} variables={{ subject: 'World' }}>
    {({ loading, error, data }) => {
      if (loading) {
        return 'Loading...';
      }

      return (
        <h2>
          Server Salutation:&nbsp;
          {error
            ? error.message + '. You probably don`t have GraphQL Server running at the moment - thats okay'
            : data.hello}
        </h2>
      );
    }}
  </Query>
);

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
      <Route path="/editor">{/* <EntryEditor /> */}</Route>
      <Route path="/">
        <Overview />
      </Route>
    </Switch>
  </Router>
);

export default App;
