import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const ComputerElectronicContext = createContext({
    policy: null,
    policies: null
});


function computerElectronicReducer(state, action) {
    switch (action.type) {
        case 'CREATE_COMPUTER_ELECTRONIC_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_COMPUTER_ELECTRONIC_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_COMPUTER_ELECTRONIC_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_COMPUTER_ELECTRONIC_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_COMPUTER_ELECTRONIC_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_COMPUTER_ELECTRONIC_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_COMPUTER_ELECTRONIC_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function ComputerElectronicProvider(props) {
    const [state, dispatch] = useReducer(computerElectronicReducer, initialState);

    function createComputerElectronicPolicy(policyData) {
        dispatch({
            type: 'CREATE_COMPUTER_ELECTRONIC_POLICY',
            payload: policyData,
        })

    }
    function updateComputerElectronicPolicy(policyData) {
        dispatch({
            type: 'UPDATE_COMPUTER_ELECTRONIC_POLICY',
            payload: policyData,
        })

    }
    function updateComputerElectronicProperty(policyData) {
        dispatch({
            type: 'UPDATE_COMPUTER_ELECTRONIC_PROPERTY',
            payload: policyData,
        })

    }
    function getComputerElectronicPolicies(policyData) {
        dispatch({
            type: 'GET_COMPUTER_ELECTRONIC_POLICIES',
            payload: policyData,
        })

    }
    function getComputerElectronicPolicy(policyData) {
        dispatch({
            type: 'GET_COMPUTER_ELECTRONIC_POLICY',
            payload: policyData,
        })

    }
    
    function getComputerElectronicProperty(policyData) {
        dispatch({
            type: 'GET_COMPUTER_ELECTRONIC_PROPERTY',
            payload: policyData,
        })

    }
    function deleteComputerElectronicPolicies(policyData) {
        dispatch({
            type: 'DELETE_COMPUTER_ELECTRONIC_POLICY',
            payload: policyData,
        })

    }

    return (
        <ComputerElectronicContext.Provider
            value={{ user: state.user, 
                createComputerElectronicPolicy,updateComputerElectronicPolicy,
                updateComputerElectronicProperty,getComputerElectronicPolicies,
                getComputerElectronicPolicy,getComputerElectronicProperty,deleteComputerElectronicPolicies, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { ComputerElectronicContext, ComputerElectronicProvider }
