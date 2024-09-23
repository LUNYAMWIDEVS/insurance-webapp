import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_POLICY_ADDITION } from '../../../queries';
import { useParams } from 'react-router-dom';
import PolicyAmendment from '..';

export default function EndorseAddition() {
  const { policyId } = useParams();
  const { data, loading } = useQuery(GET_POLICY_ADDITION, {
    variables: { id: policyId },
  });

  if (loading) return null;
  return (
    <PolicyAmendment
      data={{ ...data?.policyAddition, ...data?.policyAddition?.policy }}
      amendment="addition"
    />
  );
}
