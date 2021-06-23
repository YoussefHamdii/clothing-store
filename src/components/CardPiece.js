import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';




function CardPiece(props) {

  return (
    <div className="">
        
  <Card>
    <Card.Img className="img" variant="top" src={props.prod.image} />
    <Card.Body>
      <Card.Title>{props.prod.title}</Card.Title>
      <Card.Text>
        {props.prod.description}
      </Card.Text>
    </Card.Body>
  </Card>

    </div>
  );
}

export default CardPiece;
