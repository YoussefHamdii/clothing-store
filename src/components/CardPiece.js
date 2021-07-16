import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDispatch} from 'react-redux';
import * as actions from '../redux/shopping/shoppingActions';
import { useState } from 'react';




function CardPiece(props) {

  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  function addToCart(){
    dispatch(actions.addToCart(props.prod));
    setMessage('Item added to cart');
  }

  return (
       
  <Card className="card">
    <Card.Img className="img" variant="top" src={props.prod.image} />
    <Card.Body>
      <Card.Title>{props.prod.title}</Card.Title>
      <Card.Text style={{textAlign: 'center'}}>
        Price: {props.prod.price}$
      </Card.Text>
      <p style={{textAlign: 'center'}}>{message}</p>
    </Card.Body>
    
    <Button variant="dark" onClick={() => addToCart()}>Add to cart</Button>
  </Card>

    
  );
}

export default CardPiece;
