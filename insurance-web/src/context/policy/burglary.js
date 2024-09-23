import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const BurglaryPolicyContext = createContext({
    policy: null,
    policies: null
});


function burglaryPolicyReducer(state, action) {
    switch (action.type) {
        case 'CREATE_BURGLARY_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_BURGLARY_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_BURGLARY_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_BURGLARY_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_BURGLARY_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_BURGLARY_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_BURGLARY_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function BurglaryPolicyProvider(props) {
    const [state, dispatch] = useReducer(burglaryPolicyReducer, initialState);

    function createBurglaryPolicy(policyData) {
        dispatch({
            type: 'CREATE_BURGLARY_POLICY',
            payload: policyData,
        })

    }
    function updateBurglaryPolicy(policyData) {
        dispatch({
            type: 'UPDATE_BURGLARY_POLICY',
            payload: policyData,
        })

    }
    function updateBurglaryProperty(policyData) {
        dispatch({
            type: 'UPDATE_BURGLARY_PROPERTY',
            payload: policyData,
        })

    }
    function getBurglaryPolicies(policyData) {
        dispatch({
            type: 'GET_BURGLARY_POLICIES',
            payload: policyData,
        })

    }
    function getBurglaryPolicy(policyData) {
        dispatch({
            type: 'GET_BURGLARY_POLICY',
            payload: policyData,
        })

    }
    
    function getBurglaryProperty(policyData) {
        dispatch({
            type: 'GET_BURGLARY_PROPERTY',
            payload: policyData,
        })

    }
    function deleteBurglaryPolicies(policyData) {
        dispatch({
            type: 'DELETE_BURGLARY_POLICY',
            payload: policyData,
        })

    }

    return (
        <BurglaryPolicyContext.Provider
            value={{ user: state.user, 
                createBurglaryPolicy,updateBurglaryPolicy,
                updateBurglaryProperty,getBurglaryPolicies,
                getBurglaryPolicy,getBurglaryProperty,deleteBurglaryPolicies, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { BurglaryPolicyContext, BurglaryPolicyProvider }
