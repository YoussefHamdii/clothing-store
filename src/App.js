import './App.css';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Featured from './components/Featured';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="body">
          <NavigationBar />
          <Switch>
            <Route exact path="/">
            <Home />
            </Route>
            <Route path="/Featured">
              <Featured />
            </Route>
          </Switch>
      </div>
    </Router>
  );
}

export default App;
