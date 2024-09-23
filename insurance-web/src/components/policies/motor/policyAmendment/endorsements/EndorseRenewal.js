import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_POLICY_RENEWAL } from '../../../queries';
import { useParams } from 'react-router-dom';
import PolicyAmendment from '..';

export default function EndorseRenewal() {
  const { policyId } = useParams();
  const { data, loading } = useQuery(GET_POLICY_RENEWAL, {
    variables: { id: policyId },
  });

  if (loading) return null;
  return (
    <PolicyAmendment
      data={{ ...data?.policyRenewal, ...data?.policyRenewal?.policy }}
      amendment="renew"
    />
  );
}
