import React, { useReducer, createContext } from 'react';

const initialState = {
    user: null,
    contacts: null,
}



const ContactPersonContext = createContext({
    contacts: null,
    user: null
});

function contactPersonReducer(state, action) {
    switch (action.type) {
        case 'REGISTER_CONTACT_PERSON':
            return {
                ...state,
                user: action.payload,
                systemAlert: action.message
            }
        case 'GET_CONTACT_PERSONS':
            return {
                ...state,
                contacts: action.payload
            }
        case 'GET_CONTACT_PERSON':
            return {
                ...state,
                contact: action.payload
            }
        default:
            return state;
    }
}

function ContactPersonProvider(props) {
    const [state, dispatch] = useReducer(contactPersonReducer, initialState);

    function registerContactPerson(userData) {

        dispatch({
            type: 'REGISTER_CONTACT_PERSON',
            payload: userData,
        })

    }
    function getContactPerson(userData) {

        dispatch({
            type: 'GET_CONTACT_PERSON',
            payload: userData,
        })

    }
    function getContactPersons(userData) {

        dispatch({
            type: 'GET_CONTACT_PERSONS',
            payload: userData,
        })

    }

    return (
        <ContactPersonContext.Provider
            value={{ user: state.user, contacts: state.contacts, registerContactPerson, getContactPerson, getContactPersons }}
            {...props}
        />
    )
}

export { ContactPersonContext, ContactPersonProvider }
