import React from "react";
import { Dropdown } from "semantic-ui-react";

export default function PolicyTypes({
  handleOnPolicyTypeChange,
  policyTypes: data,
  selected,
  handleOnPolicyTypeSearch
}) {
  let allPolicyTypes = [];
  data.forEach((type) => {
    allPolicyTypes.push({
      key: type.id,
      text: type.name,
      value: type.id,
    });
  });
  return (
    <div>
      {allPolicyTypes && (
        <Dropdown
          placeholder="Select Policy Type"
          fluid
          search
          clearable
          selection
          defaultValue={selected}
          onChange={handleOnPolicyTypeChange}
          options={allPolicyTypes}
          onSearchChange={handleOnPolicyTypeSearch}
        />
      )}
    </div>
  );
}
