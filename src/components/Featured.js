import CardPiece from './CardPiece';
import {Spinner} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Footer from './Footer';
import * as action from '../redux/shopping/shoppingActions'
import {useDispatch} from 'react-redux';


function Featured() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  async function fetchData(){
    const result = await axios.get('https://fakestoreapi.com/products');
    setData(result.data);
    dispatch(action.addProducts(result.data));
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
