import CardPiece from './CardPiece';
import {Spinner} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Footer from './Footer';


function Featured() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchData(){
    const result = await axios.get('https://fakestoreapi.com/products');
    setData(result.data);
    setLoading(false);
  }

  useEffect(() => fetchData(), []);

  return (
    <div>
      {loading? <Spinner className="spinner" size="lg" animation="grow" />:<div><div className="container">
      
      <div className="card__group">
        {
          data.map(product => <CardPiece prod={product}/>)
        }
      </div>
  </div>
  <Footer /></div>}
    
    </div>
  );
}

export default Featured;
