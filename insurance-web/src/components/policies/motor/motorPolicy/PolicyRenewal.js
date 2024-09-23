import { useQuery } from '@apollo/react-hooks';
import React, { useEffect } from 'react';
import { GET_POLICY_RENEWAL } from '../../queries';
import MotorPolicy from './motorPolicy';
import { useParams } from 'react-router-dom';
import { useAmendedPolicy } from '../policyAmendment/context/AmendedPolicyContext';

function PolicyRenewal({ props }) {
  const { policyId } = useParams();

  const { loading, data } = useQuery(GET_POLICY_RENEWAL, {
    variables: { id: policyId },
  });

  const { setAmendedPolicy } = useAmendedPolicy();
  
  useEffect(() => {
    if (data?.policyRenewal) {
      setAmendedPolicy({
        ...data.policyRenewal,
        ...data.policyRenewal?.policy,
      });
    }
  // eslint-disable-next-line
  }, [data]);

  if (loading) return null;
  return (
    <MotorPolicy motorPolicy={data?.policyRenewal || {}} loading={loading} />
  );
}

export default PolicyRenewal;
