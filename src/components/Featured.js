import CardPiece from './CardPiece';
import {CardColumns} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import axios from 'axios';


function Featured() {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
    .then(response => setData(response.data))
    
  }, []);



  return (
    <div className="container">
        <CardColumns>
          {
            data.map(product => <CardPiece prod={product}/>)
          }
        </CardColumns>
    </div>
  );
}

export default Featured;
