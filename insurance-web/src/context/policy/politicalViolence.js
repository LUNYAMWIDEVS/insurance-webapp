import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const PoliticalViolenceContext = createContext({
    policy: null,
    policies: null
});


function politicalViolenceReducer(state, action) {
    switch (action.type) {
        case 'CREATE_POLITICAL_VIOLENCE_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_POLITICAL_VIOLENCE_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_POLITICAL_VIOLENCE_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_POLITICAL_VIOLENCE_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_POLITICAL_VIOLENCE_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_POLITICAL_VIOLENCE_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_POLITICAL_VIOLENCE_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function PoliticalViolenceProvider(props) {
    const [state, dispatch] = useReducer(politicalViolenceReducer, initialState);

    function createPoliticalViolence(policyData) {
        dispatch({
            type: 'CREATE_POLITICAL_VIOLENCE_POLICY',
            payload: policyData,
        })

    }
    function updatePoliticalViolence(policyData) {
        dispatch({
            type: 'UPDATE_POLITICAL_VIOLENCE_POLICY',
            payload: policyData,
        })

    }
    function updatePoliticalViolencety(policyData) {
        dispatch({
            type: 'UPDATE_POLITICAL_VIOLENCE_PROPERTY',
            payload: policyData,
        })

    }
    function getPoliticalViolencees(policyData) {
        dispatch({
            type: 'GET_POLITICAL_VIOLENCE_POLICIES',
            payload: policyData,
        })

    }
    function getPoliticalViolence(policyData) {
        dispatch({
            type: 'GET_POLITICAL_VIOLENCE_POLICY',
            payload: policyData,
        })

    }
    
    function getPoliticalViolencety(policyData) {
        dispatch({
            type: 'GET_POLITICAL_VIOLENCE_PROPERTY',
            payload: policyData,
        })

    }
    function deletePoliticalViolencees(policyData) {
        dispatch({
            type: 'DELETE_POLITICAL_VIOLENCE_POLICY',
            payload: policyData,
        })

    }

    return (
        <PoliticalViolenceContext.Provider
            value={{ user: state.user, 
                createPoliticalViolence,updatePoliticalViolence,
                updatePoliticalViolencety,getPoliticalViolencees,
                getPoliticalViolence,getPoliticalViolencety,deletePoliticalViolencees, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { PoliticalViolenceContext, PoliticalViolenceProvider }
