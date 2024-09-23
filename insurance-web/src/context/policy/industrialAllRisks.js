import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const IndustrialAllRisksContext = createContext({
    policy: null,
    policies: null
});


function industrialAllRisksReducer(state, action) {
    switch (action.type) {
        case 'CREATE_INDUSTRIAL_ALL_RISKS_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_INDUSTRIAL_ALL_RISKS_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_INDUSTRIAL_ALL_RISKS_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_INDUSTRIAL_ALL_RISKS_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_INDUSTRIAL_ALL_RISKS_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_INDUSTRIAL_ALL_RISKS_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_INDUSTRIAL_ALL_RISKS_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function IndustrialAllRisksProvider(props) {
    const [state, dispatch] = useReducer(industrialAllRisksReducer, initialState);

    function createIndustrialAllRisks(policyData) {
        dispatch({
            type: 'CREATE_INDUSTRIAL_ALL_RISKS_POLICY',
            payload: policyData,
        })

    }
    function updateIndustrialAllRisks(policyData) {
        dispatch({
            type: 'UPDATE_INDUSTRIAL_ALL_RISKS_POLICY',
            payload: policyData,
        })

    }
    function updateIndustrialAllRisksty(policyData) {
        dispatch({
            type: 'UPDATE_INDUSTRIAL_ALL_RISKS_PROPERTY',
            payload: policyData,
        })

    }
    function getIndustrialAllRiskses(policyData) {
        dispatch({
            type: 'GET_INDUSTRIAL_ALL_RISKS_POLICIES',
            payload: policyData,
        })

    }
    function getIndustrialAllRisks(policyData) {
        dispatch({
            type: 'GET_INDUSTRIAL_ALL_RISKS_POLICY',
            payload: policyData,
        })

    }
    
    function getIndustrialAllRisksty(policyData) {
        dispatch({
            type: 'GET_INDUSTRIAL_ALL_RISKS_PROPERTY',
            payload: policyData,
        })

    }
    function deleteIndustrialAllRiskses(policyData) {
        dispatch({
            type: 'DELETE_INDUSTRIAL_ALL_RISKS_POLICY',
            payload: policyData,
        })

    }

    return (
        <IndustrialAllRisksContext.Provider
            value={{ user: state.user, 
                createIndustrialAllRisks,updateIndustrialAllRisks,
                updateIndustrialAllRisksty,getIndustrialAllRiskses,
                getIndustrialAllRisks,getIndustrialAllRisksty,deleteIndustrialAllRiskses, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { IndustrialAllRisksContext, IndustrialAllRisksProvider }
