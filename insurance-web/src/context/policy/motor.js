import React, { useReducer, createContext } from "react";

const initialState = {
  policy: null,
  polices: null,
};

const MotorPolicyContext = createContext({
  policy: null,
  policies: null,
});

function motorPolicyReducer(state, action) {
  switch (action.type) {
    case "CREATE_MOTOR_POLICY":
      return {
        ...state,
        policy: action.payload,
      };
    case "RENEW_MOTOR_POLICY":
      return {
        ...state,
        policy: action.payload
      };
    case "POLICY_ADDITION":
      return {
        ...state,
        policy: action.payload
      };
    case "POLICY_DELETION":
        return {
          ...state,
          policy: action.payload
        };
    case "GET_MOTOR_POLICY":
      return {
        ...state,
        policy: action.payload,
      };
    case "LIST_MOTOR_POLICY":
      return {
        ...state,
        policies: action.payload,
      };
    default:
      return state;
  }
}

function MotorPolicyProvider(props) {
  const [state, dispatch] = useReducer(motorPolicyReducer, initialState);

  function createPolicy(policyData) {
    dispatch({
      type: "CREATE_MOTOR_POLICY",
      payload: policyData,
    });
  }
  function renewPolicy(policyData){
    dispatch({
      type: "RENEW_MOTOR_POLICY",
      payload: policyData
    })
  }
  function endorsePolicyAddition(policyData){
    dispatch({
      type: "POLICY_ADDITION",
      payload: policyData
    })
  }
  function endorsePolicyDeletion(policyData){
    dispatch({
      type: "POLICY_DELETION",
      payload: policyData
    })
  }
  function getPolicy(policyData) {
    dispatch({
      type: "GET_MOTOR_POLICY",
      payload: policyData,
    });
  }
  function listPolicies(policyData) {
    dispatch({
      type: "LIST_MOTOR_POLICY",
      payload: policyData,
    });
  }
  function updatePolicy(policyData) {
    dispatch({
      type: "UPDATE_MOTOR_POLICY",
      payload: policyData,
    });
  }

  return (
    <MotorPolicyContext.Provider
      value={{
        user: state.user,
        createPolicy,
        renewPolicy,
        endorsePolicyAddition,
        endorsePolicyDeletion,
        getPolicy,
        updatePolicy,
        listPolicies,
        policy: state.policy,
        policies: state.policies,
      }}
      {...props}
    />
  );
}

export { MotorPolicyContext, MotorPolicyProvider };

