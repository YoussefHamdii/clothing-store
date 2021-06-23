import { Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function NavigationBar() {
  return (
      
    <Navbar  scrolling expand="md" fixed={window.location.pathname === '/'?"top":""}>
        <Navbar.Brand href="/"><span className={window.location.pathname === '/'?"navbarhome brandname":"navbar brandname"}>𝕯𝕽𝕴𝕻</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
            <Nav.Link href="/"><span className={window.location.pathname === '/'?"navbarhome":"navbar"}>Home</span></Nav.Link>
            <Nav.Link href="/Featured"><span className={window.location.pathname === '/'?"navbarhome":"navbar"}>Featured</span></Nav.Link>
            <Nav.Link href="#pricing"><span className={window.location.pathname === '/'?"navbarhome":"navbar"}>Pricing</span></Nav.Link>
        </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
