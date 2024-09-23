import React, { useReducer, createContext, useState, useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { REFRESH_TOKEN_MUTATION } from '../components/auth/queries'
const initialState = {
    user: null,
    systemAlert: null,
    staff: null,
    profile: null
}

if (localStorage.getItem('loggedInUser')) {
    initialState.user = JSON.parse(localStorage.getItem('loggedInUser'))
}

const AuthContext = createContext({
    user: null,
    staff: null,
    profile: null
});


function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'REGISTER_ADMIN':
            return {
                ...state,
                user: action.payload,
                systemAlert: action.message
            }

        case 'REGISTER_STAFF':
            return {
                ...state,
                staff: action.payload,
            }
        case 'USER_PROFILE':
            return {
                ...state,
                profile: action.payload,
            }

        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}
function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [expiredToken, setExpiredToken] = useState("");

    const [refreshToken, { loading, data: tokenData }] = useMutation(REFRESH_TOKEN_MUTATION, {
        onError(err) {
            try {
                setUser(null)
                setToken(null)
            } catch (e) {
                setUser(null)
                setToken(null)
            }

        }, variables: { token: expiredToken }
    })

    let _token = localStorage.getItem('jwtToken') || null;

    const getExpirationDate = (jwtToken) => {

        if (!jwtToken) {
            return null;
        }

        const jwt = JSON.parse(atob(jwtToken.split('.')[1]));

        // multiply by 1000 to convert seconds into milliseconds
        return jwt && jwt.exp ? jwt.exp * 1000 : null;
    };

    const isExpired = (exp) => {

        if (!exp) {
            return false;
        }

        return Date.now() > exp;
    };

    const getToken = useCallback(() => {
        if (!_token) {
            return null;
        }
        if (isExpired(getExpirationDate(_token))) {
            setExpiredToken(_token);
            refreshToken()
        }
        return _token;
    }, [_token, refreshToken])

    const isLoggedIn = () => {

        return !!_token;
    };
    let observers = [];

    const subscribe = (observer) => {

        observers.push(observer);
    };

    const unsubscribe = (observer) => {
        observers = observers.filter(_observer => _observer !== observer);
    };

    const notify = () => {
        const isLogged = isLoggedIn();
        observers.forEach(observer => observer(isLogged));
    };

    const setUser = useCallback((user) => {
        if (user) { localStorage.setItem("loggedInUser", JSON.stringify(user)) }
        else { localStorage.removeItem("loggedInUser") }
    }, [])
    const setToken = useCallback((token) => {
        if (token) { localStorage.setItem("jwtToken", token) }
        else { localStorage.removeItem("jwtToken") }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        _token = token
        notify()

    }, [])
    useEffect(() => {
        if (!loading && tokenData) {
            setToken(tokenData.refreshToken.token)
        }
        if (!getToken() && !window.location.pathname.includes("reset-password")) {
            setToken(null)
        }

    }, [loading, tokenData, refreshToken, setToken, getToken])

    function login(userData) {
        setToken(userData.tokenAuth.token)
        setUser(userData.tokenAuth.user)

        dispatch({
            type: 'LOGIN',
            payload: userData
        })

    }

    const useAuth = () => {
        const [isLogged, setIsLogged] = useState(isLoggedIn());

        useEffect(() => {
            const listener = (newIsLogged) => {
                setIsLogged(newIsLogged);
            };

            subscribe(listener);
            return () => {
                unsubscribe(listener);
            };
        }, []);

        return isLogged;
    };

    function registerAdmin(userData) {

        dispatch({
            type: 'REGISTER_ADMIN',
            payload: userData,
        })

    }

    function registerStaff(userData) {

        dispatch({
            type: 'REGISTER_STAFF',
            payload: userData,
        })

    }
    function userProfile(userData) {
        dispatch({
            type: 'USER_PROFILE',
            payload: userData,
        })

    }

    function logout() {
        setToken(null)
        setUser(null)
        AuthContext.user = null;

        dispatch({
            type: 'LOGOUT'
        })

    }

    return (
        <AuthContext.Provider
            value={{
                user: state.user, profile: state.profile, login, logout, registerAdmin,
                userProfile, registerStaff, useAuth, getToken, setToken
            }}
            {...props}
        />
    )
}

export { AuthContext, AuthProvider }
