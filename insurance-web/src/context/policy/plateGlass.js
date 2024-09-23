import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const PlateGlassContext = createContext({
    policy: null,
    policies: null
});


function plateGlassReducer(state, action) {
    switch (action.type) {
        case 'CREATE_PLATE_GLASS_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_PLATE_GLASS_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_PLATE_GLASS_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_PLATE_GLASS_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_PLATE_GLASS_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_PLATE_GLASS_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_PLATE_GLASS_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function PlateGlassProvider(props) {
    const [state, dispatch] = useReducer(plateGlassReducer, initialState);

    function createPlateGlass(policyData) {
        dispatch({
            type: 'CREATE_PLATE_GLASS_POLICY',
            payload: policyData,
        })

    }
    function updatePlateGlass(policyData) {
        dispatch({
            type: 'UPDATE_PLATE_GLASS_POLICY',
            payload: policyData,
        })

    }
    function updatePlateGlassty(policyData) {
        dispatch({
            type: 'UPDATE_PLATE_GLASS_PROPERTY',
            payload: policyData,
        })

    }
    function getPlateGlasses(policyData) {
        dispatch({
            type: 'GET_PLATE_GLASS_POLICIES',
            payload: policyData,
        })

    }
    function getPlateGlass(policyData) {
        dispatch({
            type: 'GET_PLATE_GLASS_POLICY',
            payload: policyData,
        })

    }
    
    function getPlateGlassty(policyData) {
        dispatch({
            type: 'GET_PLATE_GLASS_PROPERTY',
            payload: policyData,
        })

    }
    function deletePlateGlasses(policyData) {
        dispatch({
            type: 'DELETE_PLATE_GLASS_POLICY',
            payload: policyData,
        })

    }

    return (
        <PlateGlassContext.Provider
            value={{ user: state.user, 
                createPlateGlass,updatePlateGlass,
                updatePlateGlassty,getPlateGlasses,
                getPlateGlass,getPlateGlassty,deletePlateGlasses, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { PlateGlassContext, PlateGlassProvider }
