import * as React from "react";
import AddEntryButton from "./components/AddEntryButton";
import EntryEditor from "./components/EntryEditor";
import Overview from "./components/Overview";
import EntryView from "./components/EntryView";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => (
  <Router>
    <AddEntryButton />
    <Switch>
      <Route path="/overview">
        <Overview />
      </Route>
      <Route path="/entry/:entryId">
        <EntryView />
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
