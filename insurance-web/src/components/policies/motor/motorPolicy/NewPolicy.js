import { useQuery } from '@apollo/react-hooks';
import React from 'react';
import { useParams } from 'react-router-dom';
import { GET_MOTOR_POLICY } from '../../queries';
import MotorPolicy from './motorPolicy';

function NewPolicy({ props }) {
  const { policyId } = useParams();

  const { loading, data: motorPolicyData } = useQuery(GET_MOTOR_POLICY, {
    variables: { id: policyId },
  });

  if (loading) return null;
  return (
    <MotorPolicy
      motorPolicy={motorPolicyData?.motorPolicy || {}}
      loading={loading}
    />
  );
}

export default NewPolicy;
