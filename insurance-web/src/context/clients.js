import React, { useReducer, createContext } from 'react';

const initialState = {
    user: null,
    clients: null,
    corporateClient: null,
    corporateClients: null
}



const ClientContext = createContext({
    clients: null,
    corporateClient: null,
    corporateClients:null,
    user: null
});

function clientReducer(state, action) {
    switch (action.type) {
        case 'REGISTER_CLIENT':
            return {
                ...state,
                user: action.payload,
            }
        case 'GET_CLIENTS':
            return {
                ...state,
                clients: action.payload
            }
        case 'GET_CLIENT':
            return {
                ...state,
                user: action.payload
            }
        case 'REGISTER_CORPORATE_CLIENT':
            return {
                ...state,
                corporateClient: action.payload,
            }
        case 'GET_CORPORATE_CLIENTS':
            return {
                ...state,
                corporateClients: action.payload
            }
        case 'GET_CORPORATE_CLIENT':
            return {
                ...state,
                corporateClient: action.payload
            }
        default:
            return state;
    }
}

function ClientProvider(props) {
    const [state, dispatch] = useReducer(clientReducer, initialState);

    function registerClient(userData) {

        dispatch({
            type: 'REGISTER_CLIENT',
            payload: userData,
        })

    }
    function getClient(userData) {

        dispatch({
            type: 'GET_CLIENT',
            payload: userData,
        })

    }
    function getClients(userData) {

        dispatch({
            type: 'GET_CLIENTS',
            payload: userData,
        })

    }
    function registerCorporateClient(userData) {

        dispatch({
            type: 'REGISTER_CORPORATE_CLIENT',
            payload: userData,
        })

    }
    function getCorporateClient(userData) {

        dispatch({
            type: 'GET_CORPORATE_CLIENT',
            payload: userData,
        })

    }
    function getCorporateClients(userData) {

        dispatch({
            type: 'GET_CORPORATE_CLIENTS',
            payload: userData,
        })

    }

    return (
        <ClientContext.Provider
            value={{ user: state.user, clients: state.clients,
                registerCorporateClient, getCorporateClient, getCorporateClients,
                registerClient, getClient, getClients }}
            {...props}
        />
    )
}

export { ClientContext, ClientProvider }
