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
            <Route exact path="/" component={()=><Home />} />
            <Route path="/Featured" component={()=><Featured />} />
          </Switch>
      </div>
    </Router>
  );
}

export default App;
