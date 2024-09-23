import React, { useReducer, createContext } from "react";

const initialState = {
  user: null,
  systemAlert: null,
  policy: null,
};

const PolicyContext = createContext({
  user: null,
  policy: null,
});

function policyReducer(state, action) {
  switch (action.type) {
    case "CREATE_POLICY":
      return {
        ...state,
        policy: action.payload,
        systemAlert: action.message,
      };
    default:
      return state;
  }
}

function PolicyProvider(props) {
  const [state, dispatch] = useReducer(policyReducer, initialState);

  function createPolicy(policyData) {
    dispatch({
      type: "CREATE_POLICY",
      payload: policyData,
    });
  }

  return (
    <PolicyContext.Provider
      value={{ user: state.user, createPolicy, policy: state.policy }}
      {...props}
    />
  );
}

export { PolicyContext, PolicyProvider };
