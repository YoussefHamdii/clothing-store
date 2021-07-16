import { Card } from 'react-bootstrap';
import {Button} from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDispatch} from 'react-redux';
import {IoTrashOutline} from 'react-icons/io5';
import * as actions from '../redux/shopping/shoppingActions';




function CartCard(props) {

    const qty = props.qty;
  const dispatch = useDispatch();

  function addQty(){
    dispatch(actions.adjustQty(props.prod.id, qty+1));
  }

  function removeQty(){
    dispatch(actions.adjustQty(props.prod.id, qty-1));
  }

  function removeItem(){
      dispatch(actions.removeFromCart(props.prod.id));
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
    <Button variant="outlined" size="small" onClick={() => removeQty()}>-</Button>
    <span className="quantity">{qty}</span>
    <Button variant="outlined" size="small" onClick={() => addQty()}>+</Button>
    </div>
    <Button variant="outlined" onClick={() => removeItem()}><IoTrashOutline/></Button>
  </Card>

    
  );
}

export default CartCard;
