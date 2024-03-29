import * as actionTypes from './shoppingTypes';

export const addToCart = (item) =>{
    return{
        type: actionTypes.ADD_TO_CART,
        payload: {
            item: item
        }
    }
};

export const removeFromCart = (itemID) =>{
    return{
        type: actionTypes.REMOVE_FROM_CART,
        payload: {
            id: itemID
        }
    }
};

export const adjustQty = (itemID, value) => {
    return{
        type: actionTypes.ADJUST_QTY,
        payload: {
            id: itemID,
            qty: value
        }
    }
};

export const addProducts = (products) => {
    return{
        type: actionTypes.ADD_PRODUCTS,
        payload: products
    }
};