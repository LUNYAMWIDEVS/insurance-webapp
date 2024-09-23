import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const FirePolicyContext = createContext({
    policy: null,
    policies: null
});


function firePolicyReducer(state, action) {
    switch (action.type) {
        case 'CREATE_FIRE_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_FIRE_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_FIRE_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_FIRE_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_FIRE_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_FIRE_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_FIRE_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function FirePolicyProvider(props) {
    const [state, dispatch] = useReducer(firePolicyReducer, initialState);

    function createFirePolicy(policyData) {
        dispatch({
            type: 'CREATE_FIRE_POLICY',
            payload: policyData,
        })

    }
    function updateFirePolicy(policyData) {
        dispatch({
            type: 'UPDATE_FIRE_POLICY',
            payload: policyData,
        })

    }
    function updateFireProperty(policyData) {
        dispatch({
            type: 'UPDATE_FIRE_PROPERTY',
            payload: policyData,
        })

    }
    function getFirePolicies(policyData) {
        dispatch({
            type: 'GET_FIRE_POLICIES',
            payload: policyData,
        })

    }
    function getFirePolicy(policyData) {
        dispatch({
            type: 'GET_FIRE_POLICY',
            payload: policyData,
        })

    }
    
    function getFireProperty(policyData) {
        dispatch({
            type: 'GET_FIRE_PROPERTY',
            payload: policyData,
        })

    }
    function deleteFirePolicies(policyData) {
        dispatch({
            type: 'DELETE_FIRE_POLICY',
            payload: policyData,
        })

    }

    return (
        <FirePolicyContext.Provider
            value={{ user: state.user, 
                createFirePolicy,updateFirePolicy,
                updateFireProperty,getFirePolicies,
                getFirePolicy,getFireProperty,deleteFirePolicies, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { FirePolicyContext, FirePolicyProvider }
