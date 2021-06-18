import './App.css';
import { Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="backk">
      
      <Navbar  scrolling expand="md" fixed="top" >
    <Navbar.Brand href="#home"><span className="navbar brandname">𝕯𝕽𝕴𝕻</span></Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="#home"><span className="navbar">Home</span></Nav.Link>
      <Nav.Link href="#features"><span className="navbar">Features</span></Nav.Link>
      <Nav.Link href="#pricing"><span className="navbar">Pricing</span></Nav.Link>
    </Nav>
  </Navbar>
        <img src={process.env.PUBLIC_URL+"/assets/i1.jpg"} alt="middle" className="center"/>
        
    </div>
  );
}

export default App;
