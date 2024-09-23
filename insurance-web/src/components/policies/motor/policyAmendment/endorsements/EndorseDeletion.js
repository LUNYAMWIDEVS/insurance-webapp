import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_POLICY_DELETION } from '../../../queries';
import { useParams } from 'react-router-dom';
import PolicyAmendment from '..';

export default function EndorseDeletion() {
  const { policyId } = useParams();
  const { data, loading } = useQuery(GET_POLICY_DELETION, {
    variables: { id: policyId },
  });

  if (loading) return null;
  return (
    <PolicyAmendment
      data={{ ...data?.policyDeletion, ...data?.policyDeletion?.policy }}
      amendment="deletion"
    />
  );
}
