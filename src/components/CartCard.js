import { Card } from 'react-bootstrap';
import {Button} from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDispatch} from 'react-redux';
import * as actions from '../redux/shopping/shoppingActions';




function CartCard(props) {

  const dispatch = useDispatch();

  function addToCart(item){
    dispatch(actions.addToCart(item.id));
  }

  return (
       
  <Card className="card">
    <Card.Img className="img" variant="top" src={props.prod.image} />
    <Card.Body>
      <Card.Title>{props.prod.title}</Card.Title>
      <Card.Text>
        Price: {props.prod.price}$
        Quantity: {props.qty}
      </Card.Text>
    </Card.Body>

    <div>
    <Button variant="outlined">+</Button>
    
    <Button variant="outlined">-</Button>
    </div>
    
  </Card>

    
  );
}

export default CartCard;
