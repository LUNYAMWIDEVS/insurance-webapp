import React from 'react';
import {
    Dropdown
} from 'semantic-ui-react';

export default function MotorPolicyList({ handleOnMotorPolicyChange, handleOnMotorPolicySearch, motorPoliciesOptions: data, selected }) {


    let allMotorPolicies = []
    data.forEach((policy, i) => {
        allMotorPolicies.push({
            key: i,
            text: policy.individualClient ? policy.transactionDate + " " + policy.individualClient.firstName + ' ' + policy.individualClient.lastName + " [" + policy.individualClient.email + "] -" + policy.policyNo : policy.transactionDate + " " + policy.corporateClient.name  + " [" + policy.corporateClient.email + "] -" + policy.policyNo,
            value: policy.id
        })
    })

    return (
        <div>
            {allMotorPolicies && <Dropdown
                placeholder='Select Motor Policy'
                fluid
                search
                clearable
                selection
                defaultValue={selected}
                onSearchChange={handleOnMotorPolicySearch}
                onChange={handleOnMotorPolicyChange}
                options={allMotorPolicies}
            />}
        </div>

    )
}
