import React, { useReducer, createContext } from 'react';

const initialState = {
    message: null,
    messages: null,
}



const MessageContext = createContext({
    message: null,
    messages: null,
});

function messageReducer(state, action) {
    switch (action.type) {
        case 'SEND_MESSAGE':
            return {
                ...state,
                message: action.payload,
            }
        case 'GET_MESSAGE':
            return {
                ...state,
                message: action.payload,
            }
        case 'GET_MESSAGES':
            return {
                ...state,
                messages: action.payload
            }
        default:
            return state;
    }
}

function MessageProvider(props) {
    const [state, dispatch] = useReducer(messageReducer, initialState);

    function sendMessage(userData) {

        dispatch({
            type: 'SEND_MESSAGE',
            payload: userData,
        })

    }
    function getMessage(userData) {

        dispatch({
            type: 'GET_MESSAGE',
            payload: userData,
        })

    }
    function getMessages(userData) {

        dispatch({
            type: 'GET_MESSAGES',
            payload: userData,
        })

    }

    return (
        <MessageContext.Provider
            value={{
                message: state.message, messages: state.messages,
                sendMessage, getMessage, getMessages
            }}
            {...props}
        />
    )
}

export { MessageContext, MessageProvider }
