import {useSelector} from 'react-redux';
import CartCard from './CartCard';

function Cart () {
    const cart = useSelector(state=> state.shop);
    console.log(cart);
    return(
        <div className="cart__container">
        <div className="cart">
        <h2>Cart</h2>
        {cart.cart.map(item => {
            const selected = cart.products.filter(prod => prod.id === item.id);
            return (<CartCard prod={selected[0]} qty={item.qty}/>);
        })}
        </div>
        <div className="">
        <h2>Checkout info</h2>
        
        </div>
        </div>
    );
}

export default Cart;