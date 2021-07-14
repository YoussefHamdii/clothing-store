import {useSelector} from 'react-redux';

function Cart () {
    const list = useSelector(state=> state.shop.cart);
    console.log(list);
    return(
        <div>hello</div>
    );
}

export default (Cart);