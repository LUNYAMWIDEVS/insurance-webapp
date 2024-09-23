import React, { useReducer, createContext } from 'react';

const initialState = {
    user:null,
    receipt: null,
    receipts: null,
    
}



const ReceiptContext = createContext({
    user:null,
    receipt: null,
    receipts:null,
});

function receiptReducer(state, action) {
    switch (action.type) {
        case 'CREATE_RECEIPT':
            return {
                ...state,
                user: action.payload,
            }
        case 'GET_RECEIPTS':
            return {
                ...state,
                receipts: action.payload
            }
        case 'GET_RECEIPT':
            return {
                ...state,
                receipt: action.payload
            }
        
        default:
            return state;
    }
}

function ReceiptProvider(props) {
    const [state, dispatch] = useReducer(receiptReducer, initialState);

    function createReceipt(userData) {

        dispatch({
            type: 'CREATE_RECEIPT',
            payload: userData,
        })

    }
    function getReceipt(userData) {

        dispatch({
            type: 'GET_RECEIPT',
            payload: userData,
        })

    }
    function getReceipts(userData) {

        dispatch({
            type: 'GET_RECEIPTS',
            payload: userData,
        })

    }
    
    return (
        <ReceiptContext.Provider
            value={{ user:state.user, receipt: state.receipt, receipts: state.receipts,
                createReceipt, getReceipt, getReceipts}}
            {...props}
        />
    )
}

export { ReceiptContext, ReceiptProvider }
