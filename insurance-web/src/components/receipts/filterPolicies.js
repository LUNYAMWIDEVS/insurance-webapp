import React from "react";
import { Dropdown, Label } from "semantic-ui-react";

const StatusChip = ({ transactionType }) => {
  let color;

  switch (transactionType) {
    case "New Policy":
      color = "blue";
      break;
    case "Renewal":
      color = "pink";
      break;
    case "Existing Policy":
      color = "black";
      break;
    default:
      color = "black";
  }

  return (
    <Label color={color} horizontal>
      {transactionType}
    </Label>
  );
};

const IndividualClient = ({ firstName, lastName, policyNo }) => {
  return (
    <>
      {firstName} {lastName} {policyNo}
    </>
  );
};

const Company = ({ name, policyNo }) => {
  return (
    <>
      {name} {policyNo}
    </>
  );
};

export default function FilterPolicies({
  handleOnMotorPolicyChange,
  handleOnMotorPolicySearch,
  motorPoliciesOptions: data,
  selected,
}) {
  // Filter policies based on the selected insurance class
  const filteredPolicies = data.filter(
    (policy) => policy.insuranceClass === selected
  );

  let allMotorPolicies = [];
  filteredPolicies.forEach((policy, i) => {
    const textComponent = policy.individualClient ? (
      <IndividualClient
        {...policy.individualClient}
        policyNo={policy.policyNo}
      />
    ) : (
      <Company {...policy.corporateClient} policyNo={policy.policyNo} />
    );

    const statusType = policy.transactionType ? (
      <StatusChip transactionType={policy.transactionType} />
    ) : null;
    allMotorPolicies.push({
      key: i,
      text: (
        <>
          {policy.transactionDate} {textComponent} <span >{statusType}</span> 
        </>
      ),
      value: policy.id,
    });
  });
  return (
    <div>
      {allMotorPolicies && (
        <Dropdown
          placeholder="Select Policy"
          fluid
          search
          clearable
          selection
          onSearchChange={handleOnMotorPolicySearch}
          onChange={handleOnMotorPolicyChange}
          options={allMotorPolicies}
        />
      )}
    </div>
  );
}
