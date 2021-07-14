import './App.scss';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Featured from './components/Featured';
import Cart from './components/Cart'; 
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="body">
          <NavigationBar />
          <Switch>
            <Route exact path="/" component={()=><Home />} />
            <Route path="/Featured" component={()=><Featured />} />
            <Route path="/Cart" component={()=><Cart />} />
          </Switch>
      </div>
    </Router>
  );
}

export default App;
