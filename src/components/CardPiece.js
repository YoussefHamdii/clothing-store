import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';




function CardPiece(props) {

  return (
       
  <Card className="card">
    <Card.Img className="img" variant="top" src={props.prod.image} />
    <Card.Body>
      <Card.Title>{props.prod.title}</Card.Title>
      <Card.Text>
        Price: {props.prod.price}$
      </Card.Text>
    </Card.Body>
  </Card>

    
  );
}

export default CardPiece;
