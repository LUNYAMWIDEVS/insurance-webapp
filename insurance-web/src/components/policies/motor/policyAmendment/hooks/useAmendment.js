import { useMutation } from '@apollo/react-hooks';
import { useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { MotorPolicyContext } from '../../../../../context/policy/motor';
import {
  POLICY_ADDITION,
  POLICY_DELETION,
  RENEW_MOTOR_POLICY,
} from '../../../queries';

//========================= custom hook for policy amendments graphql function =====================================

const useAmendment = (amendment, setResponseErrors, setLoading) => {
  const history = useHistory();

  const amendmentMutations = {
    deletion: POLICY_DELETION,
    addition: POLICY_ADDITION,
    renew: RENEW_MOTOR_POLICY,
  };

  let action = amendmentMutations[amendment];
  const context = useContext(MotorPolicyContext);

  const [policyAmendment, { loading }] = useCallback(
    useMutation(action, {
      update(_, result) {
        let pol;
        let location;
        let endorseFunction;
        setResponseErrors([]);
        setLoading(loading);
        if (amendment === 'deletion') {
          endorseFunction = context.endorsePolicyDeletion;
          pol = result.data.createPolicyDeletion.policyDeletion;
          location = 'credit-note';
        } else if (amendment === 'addition') {
          endorseFunction = context.endorsePolicyAddition;
          pol = result.data.createPolicyAddition.policyAddition;
          location = 'addition';
        } else if (amendment === 'renew') {
          endorseFunction = context.renewPolicy;
          pol = result.data.createPolicyRenewal.policyRenewal;
          location = 'renewal';
        }

        if (endorseFunction && pol && location) {
          endorseFunction(pol);
          history.push({
            pathname: `/staff/dashboard/policies/general/motor/details/${location}/${pol.id}`,
            state: { motorPolicy: pol },
          });
        }
      },
      onError(err) {
        if (err.graphQLErrors && err.graphQLErrors.length > 0) {
          setResponseErrors(err.graphQLErrors[0].message);
        } else if (
          err.networkError &&
          err.networkError.result.errors.length > 0
        ) {
          setResponseErrors(err.networkError.result.errors[0].message);
        } else {
          setResponseErrors(err.message);
        }
      },
    }),
    []
  );
  return { policyAmendment };
};

export default useAmendment;
