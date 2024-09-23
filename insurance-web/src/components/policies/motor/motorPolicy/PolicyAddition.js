import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_POLICY_ADDITION } from '../../queries';
import MotorPolicy from './motorPolicy';
import { useParams } from 'react-router-dom';
import { useAmendedPolicy } from '../policyAmendment/context/AmendedPolicyContext';

function PolicyAddition() {
  const { policyId } = useParams();

  const { loading, data } = useQuery(GET_POLICY_ADDITION, {
    variables: { id: policyId },
  });

  const { setAmendedPolicy } = useAmendedPolicy();
  
  useEffect(() => {
    if (data?.policyAddition) {
      setAmendedPolicy({
        ...data.policyAddition,
        ...data.policyAddition?.policy,
      });
    }
  // eslint-disable-next-line
  }, [data]);

  if (loading) return null;
  return (
    <MotorPolicy motorPolicy={data?.policyAddition || {}} loading={loading} />
  );
}

export default PolicyAddition;
