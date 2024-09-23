import React, { useReducer, createContext } from 'react';

const initialState = {
    policy: null,
    polices: null,
}


const GoodsTransitContext = createContext({
    policy: null,
    policies: null
});


function goodsTransitReducer(state, action) {
    switch (action.type) {
        case 'CREATE_GOODS_TRANSIT_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_GOODS_TRANSIT_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'UPDATE_GOODS_TRANSIT_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_GOODS_TRANSIT_POLICIES':
            return {
                ...state,
                policies: action.payload
            }
        case 'GET_GOODS_TRANSIT_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        case 'GET_GOODS_TRANSIT_PROPERTY':
            return {
                ...state,
                policy: action.payload
            }
        case 'DELETE_GOODS_TRANSIT_POLICY':
            return {
                ...state,
                policy: action.payload
            }
        default:
            return state;
    }
}

function GoodsTransitProvider(props) {
    const [state, dispatch] = useReducer(goodsTransitReducer, initialState);

    function createGoodsTransit(policyData) {
        dispatch({
            type: 'CREATE_GOODS_TRANSIT_POLICY',
            payload: policyData,
        })

    }
    function updateGoodsTransit(policyData) {
        dispatch({
            type: 'UPDATE_GOODS_TRANSIT_POLICY',
            payload: policyData,
        })

    }
    function updateGoodsTransitty(policyData) {
        dispatch({
            type: 'UPDATE_GOODS_TRANSIT_PROPERTY',
            payload: policyData,
        })

    }
    function getGoodsTransites(policyData) {
        dispatch({
            type: 'GET_GOODS_TRANSIT_POLICIES',
            payload: policyData,
        })

    }
    function getGoodsTransit(policyData) {
        dispatch({
            type: 'GET_GOODS_TRANSIT_POLICY',
            payload: policyData,
        })

    }
    
    function getGoodsTransitty(policyData) {
        dispatch({
            type: 'GET_GOODS_TRANSIT_PROPERTY',
            payload: policyData,
        })

    }
    function deleteGoodsTransites(policyData) {
        dispatch({
            type: 'DELETE_GOODS_TRANSIT_POLICY',
            payload: policyData,
        })

    }

    return (
        <GoodsTransitContext.Provider
            value={{ user: state.user, 
                createGoodsTransit,updateGoodsTransit,
                updateGoodsTransitty,getGoodsTransites,
                getGoodsTransit,getGoodsTransitty,deleteGoodsTransites, 
                policy: state.policy, policies:state.policies }}
            {...props}
        />
    )
}

export { GoodsTransitContext, GoodsTransitProvider }
