import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const ContractorsRiskContext = createContext({
    policy: null,
    policies: null
});


function contractorsRiskReducer(state, action) {
    switch (action.type) {
        case 'CREATE_CONTRACTORS_RISK_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_CONTRACTORS_RISK_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_CONTRACTORS_RISK_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_CONTRACTORS_RISK_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_CONTRACTORS_RISK_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_CONTRACTORS_RISK_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_CONTRACTORS_RISK_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function ContractorsRiskProvider(props) {
    const [state, dispatch] = useReducer(contractorsRiskReducer, initialState);

    function createContractorsRisk(policyData) {
        dispatch({
            type: 'CREATE_CONTRACTORS_RISK_POLICY',
            payload: policyData,
        })

    }
    function updateContractorsRisk(policyData) {
        dispatch({
            type: 'UPDATE_CONTRACTORS_RISK_POLICY',
            payload: policyData,
        })

    }
    function updateContractorsRiskty(policyData) {
        dispatch({
            type: 'UPDATE_CONTRACTORS_RISK_PROPERTY',
            payload: policyData,
        })

    }
    function getContractorsRiskes(policyData) {
        dispatch({
            type: 'GET_CONTRACTORS_RISK_POLICIES',
            payload: policyData,
        })

    }
    function getContractorsRisk(policyData) {
        dispatch({
            type: 'GET_CONTRACTORS_RISK_POLICY',
            payload: policyData,
        })

    }
    
    function getContractorsRiskty(policyData) {
        dispatch({
            type: 'GET_CONTRACTORS_RISK_PROPERTY',
            payload: policyData,
        })

    }
    function deleteContractorsRiskes(policyData) {
        dispatch({
            type: 'DELETE_CONTRACTORS_RISK_POLICY',
            payload: policyData,
        })

    }

    return (
        <ContractorsRiskContext.Provider
            value={{ user: state.user, 
                createContractorsRisk,updateContractorsRisk,
                updateContractorsRiskty,getContractorsRiskes,
                getContractorsRisk,getContractorsRiskty,deleteContractorsRiskes, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { ContractorsRiskContext, ContractorsRiskProvider }
