import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_MOTOR_POLICY } from '../../../queries';
import { useParams } from 'react-router-dom';
import PolicyAmendment from '..';

export default function EndorseNewPolicy() {
  const { policyId, amendment } = useParams();
  const { data: motorPolicyData, loading } = useQuery(GET_MOTOR_POLICY, {
    variables: { id: policyId },
  });
  if (loading) return null;
  return (
    <PolicyAmendment data={motorPolicyData.motorPolicy} amendment={amendment} />
  );
}
