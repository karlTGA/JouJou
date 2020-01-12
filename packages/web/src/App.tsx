import { gql } from 'apollo-boost';
import * as React from 'react';
import { Query } from 'react-apollo';
import { Layout } from 'antd';
import Timeline from './components/Timeline';
import AddEntryButton from './components/AddEntryButton';

const { Header, Content } = Layout;

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
  <Layout>
    <Header />
    <Content className="entry-overview-content">
      <Timeline />
    </Content>
    <AddEntryButton />
  </Layout>
);

export default App;
