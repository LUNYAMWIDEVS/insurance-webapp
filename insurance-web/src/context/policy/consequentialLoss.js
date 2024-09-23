import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const ConsequentialLossContext = createContext({
    policy: null,
    policies: null
});


function consequentialLossReducer(state, action) {
    switch (action.type) {
        case 'CREATE_CONSEQUENTIAL_LOSS_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_CONSEQUENTIAL_LOSS_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_CONSEQUENTIAL_LOSS_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_CONSEQUENTIAL_LOSS_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_CONSEQUENTIAL_LOSS_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_CONSEQUENTIAL_LOSS_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_CONSEQUENTIAL_LOSS_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function ConsequentialLossProvider(props) {
    const [state, dispatch] = useReducer(consequentialLossReducer, initialState);

    function createConsequentialLossPolicy(policyData) {
        dispatch({
            type: 'CREATE_CONSEQUENTIAL_LOSS_POLICY',
            payload: policyData,
        })

    }
    function updateConsequentialLossPolicy(policyData) {
        dispatch({
            type: 'UPDATE_CONSEQUENTIAL_LOSS_POLICY',
            payload: policyData,
        })

    }
    function updateConsequentialLossProperty(policyData) {
        dispatch({
            type: 'UPDATE_CONSEQUENTIAL_LOSS_PROPERTY',
            payload: policyData,
        })

    }
    function getConsequentialLossPolicies(policyData) {
        dispatch({
            type: 'GET_CONSEQUENTIAL_LOSS_POLICIES',
            payload: policyData,
        })

    }
    function getConsequentialLossPolicy(policyData) {
        dispatch({
            type: 'GET_CONSEQUENTIAL_LOSS_POLICY',
            payload: policyData,
        })

    }
    
    function getConsequentialLossProperty(policyData) {
        dispatch({
            type: 'GET_CONSEQUENTIAL_LOSS_PROPERTY',
            payload: policyData,
        })

    }
    function deleteConsequentialLossPolicies(policyData) {
        dispatch({
            type: 'DELETE_CONSEQUENTIAL_LOSS_POLICY',
            payload: policyData,
        })

    }

    return (
        <ConsequentialLossContext.Provider
            value={{ user: state.user, 
                createConsequentialLossPolicy,updateConsequentialLossPolicy,
                updateConsequentialLossProperty,getConsequentialLossPolicies,
                getConsequentialLossPolicy,getConsequentialLossProperty,deleteConsequentialLossPolicies, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { ConsequentialLossContext, ConsequentialLossProvider }
