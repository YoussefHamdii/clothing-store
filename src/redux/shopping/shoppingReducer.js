import * as actionTypes from './shoppingTypes';

const INITIAL_STATE = {
    products:[],
    cart:[],
    currentItem: null
}

const shoppingReducer = (state = INITIAL_STATE, {type, payload}) =>{
    switch(type){
        case actionTypes.ADD_TO_CART:
            return{}
        case actionTypes.REMOVE_FROM_CART:
            return{}
        case actionTypes.ADJUST_QTY:
            return{}
        case actionTypes.ADD_PRODUCTS:
            return{...state, products: payload};
        default:
            return state;
    }
};

export default shoppingReducer;