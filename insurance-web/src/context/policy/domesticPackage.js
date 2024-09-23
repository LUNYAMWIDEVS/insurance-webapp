import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const DomesticPackagePolicyContext = createContext({
    policy: null,
    policies: null
});


function domesticPackagePolicyReducer(state, action) {
    switch (action.type) {
        case 'CREATE_DOMESTIC_PACKAGE_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_DOMESTIC_PACKAGE_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_DOMESTIC_PACKAGE_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_DOMESTIC_PACKAGE_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_DOMESTIC_PACKAGE_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_DOMESTIC_PACKAGE_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_DOMESTIC_PACKAGE_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function DomesticPackagePolicyProvider(props) {
    const [state, dispatch] = useReducer(domesticPackagePolicyReducer, initialState);

    function createDomesticPackagePolicy(policyData) {
        dispatch({
            type: 'CREATE_DOMESTIC_PACKAGE_POLICY',
            payload: policyData,
        })

    }
    function updateDomesticPackagePolicy(policyData) {
        dispatch({
            type: 'UPDATE_DOMESTIC_PACKAGE_POLICY',
            payload: policyData,
        })

    }
    function updateDomesticPackageProperty(policyData) {
        dispatch({
            type: 'UPDATE_DOMESTIC_PACKAGE_PROPERTY',
            payload: policyData,
        })

    }
    function getDomesticPackagePolicies(policyData) {
        dispatch({
            type: 'GET_DOMESTIC_PACKAGE_POLICIES',
            payload: policyData,
        })

    }
    function getDomesticPackagePolicy(policyData) {
        dispatch({
            type: 'GET_DOMESTIC_PACKAGE_POLICY',
            payload: policyData,
        })

    }
    
    function getDomesticPackageProperty(policyData) {
        dispatch({
            type: 'GET_DOMESTIC_PACKAGE_PROPERTY',
            payload: policyData,
        })

    }
    function deleteDomesticPackagePolicies(policyData) {
        dispatch({
            type: 'DELETE_DOMESTIC_PACKAGE_POLICY',
            payload: policyData,
        })

    }

    return (
        <DomesticPackagePolicyContext.Provider
            value={{ user: state.user, 
                createDomesticPackagePolicy,updateDomesticPackagePolicy,
                updateDomesticPackageProperty,getDomesticPackagePolicies,
                getDomesticPackagePolicy,getDomesticPackageProperty,deleteDomesticPackagePolicies, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { DomesticPackagePolicyContext, DomesticPackagePolicyProvider }
