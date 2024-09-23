import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const ElectronicEquipmentContext = createContext({
    policy: null,
    policies: null
});


function electronicEquipmentReducer(state, action) {
    switch (action.type) {
        case 'CREATE_ELECTRONIC_EQUIPMENT_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_ELECTRONIC_EQUIPMENT_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_ELECTRONIC_EQUIPMENT_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_ELECTRONIC_EQUIPMENT_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_ELECTRONIC_EQUIPMENT_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_ELECTRONIC_EQUIPMENT_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_ELECTRONIC_EQUIPMENT_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function ElectronicEquipmentProvider(props) {
    const [state, dispatch] = useReducer(electronicEquipmentReducer, initialState);

    function creatElectronicEquipment(policyData) {
        dispatch({
            type: 'CREATE_ELECTRONIC_EQUIPMENT_POLICY',
            payload: policyData,
        })

    }
    function updatElectronicEquipment(policyData) {
        dispatch({
            type: 'UPDATE_ELECTRONIC_EQUIPMENT_POLICY',
            payload: policyData,
        })

    }
    function updatElectronicEquipmentty(policyData) {
        dispatch({
            type: 'UPDATE_ELECTRONIC_EQUIPMENT_PROPERTY',
            payload: policyData,
        })

    }
    function geElectronicEquipments(policyData) {
        dispatch({
            type: 'GET_ELECTRONIC_EQUIPMENT_POLICIES',
            payload: policyData,
        })

    }
    function geElectronicEquipment(policyData) {
        dispatch({
            type: 'GET_ELECTRONIC_EQUIPMENT_POLICY',
            payload: policyData,
        })

    }
    
    function geElectronicEquipmentty(policyData) {
        dispatch({
            type: 'GET_ELECTRONIC_EQUIPMENT_PROPERTY',
            payload: policyData,
        })

    }
    function deletElectronicEquipments(policyData) {
        dispatch({
            type: 'DELETE_ELECTRONIC_EQUIPMENT_POLICY',
            payload: policyData,
        })

    }

    return (
        <ElectronicEquipmentContext.Provider
            value={{ user: state.user, 
                creatElectronicEquipment,updatElectronicEquipment,
                updatElectronicEquipmentty,geElectronicEquipments,
                geElectronicEquipment,geElectronicEquipmentty,deletElectronicEquipments, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { ElectronicEquipmentContext, ElectronicEquipmentProvider }
