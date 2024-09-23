import React, { useReducer, createContext } from 'react';

const initialState = {
    message: null,
    messages: null,
}



const WhatsAppMessageContext = createContext({
    message: null,
    messages: null,
});

function WhatsAppMessageReducer(state, action) {
    switch (action.type) {
        case 'SEND_WHATSAPP_MESSAGE':
            return {
                ...state,
                message: action.payload,
            }
        case 'GET_WHATSAPP_MESSAGE':
            return {
                ...state,
                message: action.payload,
            }
        case 'GET_WHATSAPP_MESSAGES':
            return {
                ...state,
                messages: action.payload
            }
        default:
            return state;
    }
}

function WhatsAppMessageProvider(props) {
    const [state, dispatch] = useReducer(WhatsAppMessageReducer, initialState);

    function sendWhatsAppMessage(userData) {

        dispatch({
            type: 'SEND_WHATSAPP_MESSAGE',
            payload: userData,
        })

    }
    function getWhatsAppMessage(userData) {

        dispatch({
            type: 'GET_WHATSAPP_MESSAGE',
            payload: userData,
        })

    }
    function getWhatsAppMessages(userData) {

        dispatch({
            type: 'GET_WHATSAPP_MESSAGES',
            payload: userData,
        })

    }

    return (
        <WhatsAppMessageContext.Provider
            value={{
                message: state.message, messages: state.messages,
                sendWhatsAppMessage, getWhatsAppMessage, getWhatsAppMessages
            }}
            {...props}
        />
    )
}

export { WhatsAppMessageContext, WhatsAppMessageProvider }
