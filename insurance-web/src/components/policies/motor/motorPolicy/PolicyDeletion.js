import { useQuery } from '@apollo/react-hooks';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GET_POLICY_DELETION } from '../../queries';
import { useAmendedPolicy } from '../policyAmendment/context/AmendedPolicyContext';
import MotorPolicy from './motorPolicy';

function PolicyDeletion() {
  const { policyId } = useParams();

  const { loading, data } = useQuery(GET_POLICY_DELETION, {
    variables: { id: policyId },
  });

  const { setAmendedPolicy } = useAmendedPolicy();
  
  useEffect(() => {
    if (data?.policyDeletion) {
      setAmendedPolicy({
        ...data.policyDele,
        ...data.policyAddition?.policy,
      });
    }
  // eslint-disable-next-line
  }, [data]);

  if (loading) return null;
  return (
    <MotorPolicy motorPolicy={data?.policyDeletion || {}} loading={loading} />
  );
}

export default PolicyDeletion;
