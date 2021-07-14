import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDispatch} from 'react-redux';
import * as actions from '../redux/shopping/shoppingActions';




function CardPiece(props) {

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
      </Card.Text>
    </Card.Body>
    <Button variant="dark" onClick={() => addToCart(props.prod)}>Add to cart</Button>
  </Card>

    
  );
}

export default CardPiece;
