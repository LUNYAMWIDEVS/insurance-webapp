import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const MachineryBreakDownContext = createContext({
    policy: null,
    policies: null
});


function machineryBreakdownReducer(state, action) {
    switch (action.type) {
        case 'CREATE_MACHINERY_BREAKDOWN_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_MACHINERY_BREAKDOWN_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_MACHINERY_BREAKDOWN_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_MACHINERY_BREAKDOWN_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_MACHINERY_BREAKDOWN_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_MACHINERY_BREAKDOWN_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_MACHINERY_BREAKDOWN_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function MachineryBreakdownProvider(props) {
    const [state, dispatch] = useReducer(machineryBreakdownReducer, initialState);

    function createMachineryBreakDown(policyData) {
        dispatch({
            type: 'CREATE_MACHINERY_BREAKDOWN_POLICY',
            payload: policyData,
        })

    }
    function updateMachineryBreakDown(policyData) {
        dispatch({
            type: 'UPDATE_MACHINERY_BREAKDOWN_POLICY',
            payload: policyData,
        })

    }
    function updateMachineryBreakDownty(policyData) {
        dispatch({
            type: 'UPDATE_MACHINERY_BREAKDOWN_PROPERTY',
            payload: policyData,
        })

    }
    function getMachineryBreakDownes(policyData) {
        dispatch({
            type: 'GET_MACHINERY_BREAKDOWN_POLICIES',
            payload: policyData,
        })

    }
    function getMachineryBreakDown(policyData) {
        dispatch({
            type: 'GET_MACHINERY_BREAKDOWN_POLICY',
            payload: policyData,
        })

    }
    
    function getMachineryBreakDownty(policyData) {
        dispatch({
            type: 'GET_MACHINERY_BREAKDOWN_PROPERTY',
            payload: policyData,
        })

    }
    function deleteMachineryBreakDownes(policyData) {
        dispatch({
            type: 'DELETE_MACHINERY_BREAKDOWN_POLICY',
            payload: policyData,
        })

    }

    return (
        <MachineryBreakDownContext.Provider
            value={{ user: state.user, 
                createMachineryBreakDown,updateMachineryBreakDown,
                updateMachineryBreakDownty,getMachineryBreakDownes,
                getMachineryBreakDown,getMachineryBreakDownty,deleteMachineryBreakDownes, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { MachineryBreakDownContext, MachineryBreakdownProvider }
