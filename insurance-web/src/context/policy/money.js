import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const MoneyContext = createContext({
    policy: null,
    policies: null
});


function moneyReducer(state, action) {
    switch (action.type) {
        case 'CREATE_MONEY_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_MONEY_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_MONEY_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_MONEY_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_MONEY_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_MONEY_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_MONEY_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function MoneyProvider(props) {
    const [state, dispatch] = useReducer(moneyReducer, initialState);

    function createMoney(policyData) {
        dispatch({
            type: 'CREATE_MONEY_POLICY',
            payload: policyData,
        })

    }
    function updateMoney(policyData) {
        dispatch({
            type: 'UPDATE_MONEY_POLICY',
            payload: policyData,
        })

    }
    function updateMoneyty(policyData) {
        dispatch({
            type: 'UPDATE_MONEY_PROPERTY',
            payload: policyData,
        })

    }
    function getMoneyes(policyData) {
        dispatch({
            type: 'GET_MONEY_POLICIES',
            payload: policyData,
        })

    }
    function getMoney(policyData) {
        dispatch({
            type: 'GET_MONEY_POLICY',
            payload: policyData,
        })

    }
    
    function getMoneyty(policyData) {
        dispatch({
            type: 'GET_MONEY_PROPERTY',
            payload: policyData,
        })

    }
    function deleteMoneyes(policyData) {
        dispatch({
            type: 'DELETE_MONEY_POLICY',
            payload: policyData,
        })

    }

    return (
        <MoneyContext.Provider
            value={{ user: state.user, 
                createMoney,updateMoney,
                updateMoneyty,getMoneyes,
                getMoney,getMoneyty,deleteMoneyes, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { MoneyContext, MoneyProvider }
