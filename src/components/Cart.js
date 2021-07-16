import {useSelector} from 'react-redux';
import CartTable from './CartTable';


function Cart () {
    const cart = useSelector(state=> state.shop.cart);
    console.log(cart);
    return(
        <div className="cart__container">
        <div className="cart">
        <h2>Shopping Cart</h2>
        <CartTable cart={cart}/>
        </div>
        </div>
    );
}

export default Cart;