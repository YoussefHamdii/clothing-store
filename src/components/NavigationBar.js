import { Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {IoCartOutline} from 'react-icons/io5';
import {Link, useLocation } from "react-router-dom";


function NavigationBar() {
  let loc = useLocation();
  return (
      
    <Navbar  scrolling expand="md" fixed={loc.pathname === '/'?"top":""}>
        <Navbar.Brand href=""><Link to="/" style={{ textDecoration: 'none' }}><span className={loc.pathname === '/'?"navbarhome brandname":"navbar brandname"}>𝕯𝕽𝕴𝕻</span></Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
            <Link to="/"  style={{ textDecoration: 'none' }}><span className={loc.pathname === '/'?"navbarhome":"navbar"}>Home</span></Link>
            <Link to="/Featured"  style={{ textDecoration: 'none' }}><span className={loc.pathname === '/'?"navbarhome":"navbar"}>Featured</span></Link>
            <Link to="/Cart"  style={{ textDecoration: 'none' }}><span className={loc.pathname === '/'?"navbarhome":" cart__icon"}><IoCartOutline/></span></Link>
        </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
