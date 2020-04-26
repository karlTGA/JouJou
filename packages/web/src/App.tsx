import * as React from "react";
import AddOrEditEntryButton from "./components/AddOrEditEntryButton";
import EntryEditor from "./components/EntryEditor";
import Overview from "./components/Overview";
import EntryView from "./components/EntryView";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";

const App = () => (
  <Router>
    <AddOrEditEntryButton />
    <Switch>
      <Route path="/overview">
        <Overview />
      </Route>
      <Route path="/entry/:entryId">
        <EntryView />
      </Route>
      <Route path="/editor/:entryId">
        <EntryEditor />
      </Route>
      <Route path="/">
        <Overview />
      </Route>
    </Switch>
  </Router>
);

export default App;
