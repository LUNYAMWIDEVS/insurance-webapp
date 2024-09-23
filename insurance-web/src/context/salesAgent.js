import React, { useReducer, createContext } from 'react';

const initialState = {
    message: null,
    messages: null,
}



const salesAgentContext = createContext({
    message: null,
    messages: null,
});

function SalesAgentReducer(state, action) {
    switch (action.type) {
        case 'ASSIGN_SALES_AGENT':
            return {
                ...state,
                message: action.payload,
            }
        default:
            return state;
    }
}

function SalesAgentProvider(props) {
    const [state, dispatch] = useReducer(SalesAgentReducer, initialState);

    function assignSalesAgent(userData) {

        dispatch({
            type: 'ASSIGN_SALES_AGENT',
            payload: userData,
        })

    }
    
    return (
        <salesAgentContext.Provider
            value={{
                message: state.message, messages: state.messages,
                assignSalesAgent,
            }}
            {...props}
        />
    )
}

export { salesAgentContext, SalesAgentProvider }
