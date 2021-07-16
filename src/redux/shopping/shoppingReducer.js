import * as actionTypes from './shoppingTypes';

const INITIAL_STATE = {
    products:[],
    cart:[],
    currentItem: null
}

const shoppingReducer = (state = INITIAL_STATE, {type, payload}) =>{
    switch(type){
        case actionTypes.ADD_TO_CART:
            const inCart = state.cart.find((item)=> item.item.id === payload.item.id? true:false);
            return{...state, cart: inCart? state.cart.map((item) => item.item.id === payload.item.id? {...item, qty:item.qty+1}:item) : [...state.cart, {...payload, qty:1}]};
        case actionTypes.REMOVE_FROM_CART:
            return{...state, cart: state.cart.filter((item) => item.item.id !== payload.id) };
        case actionTypes.ADJUST_QTY:
            return{...state, cart: state.cart.map((item) => item.item.id === payload.id? {...item, qty:payload.qty}:item) };
        case actionTypes.ADD_PRODUCTS:
            return{...state, products: payload};
        default:
            return state;
    }
};

export default shoppingReducer;