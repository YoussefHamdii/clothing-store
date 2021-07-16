import { Card } from 'react-bootstrap';
import {Button} from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDispatch} from 'react-redux';
import {IoTrashOutline} from 'react-icons/io5';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import * as actions from '../redux/shopping/shoppingActions';




function CartTable(props) {

    const qty = props.qty;
  const dispatch = useDispatch();

  function addQty(item){
    dispatch(actions.adjustQty(item.item.id, item.qty+1));
  }

  function removeQty(item){
    dispatch(actions.adjustQty(item.item.id, item.qty-1));
  }

  function removeItem(id){
      dispatch(actions.removeFromCart(id));
  }

  return (
       
    <TableContainer >
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>PRODUCT DETAILS</TableCell>
          <TableCell align="right">QUANTITY</TableCell>
          <TableCell align="right">PRICE</TableCell>
          <TableCell align="right">TOTAL</TableCell>
          <TableCell align="right">REMOVE</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.cart.map((item) => (
          <TableRow className="table__text">
            <TableCell align="right">
              <div className="product__details">
                <img className="cart__image" src={item.item.image} />
                <span>{item.item.title}</span>
              </div>
            </TableCell>
            <TableCell align="right"><Button onClick={()=>addQty(item)}>+</Button><div className="table__text">{item.qty}</div>
            <Button onClick={()=>removeQty(item)}>-</Button>
            </TableCell>
            <TableCell align="right">{item.item.price} $</TableCell>
            <TableCell align="right">{item.item.price*item.qty} $</TableCell>
            <TableCell align="right"><Button onClick={()=>removeItem(item.item.id)}><IoTrashOutline/></Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

    
  );
}

export default CartTable;
