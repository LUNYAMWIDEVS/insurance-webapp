import React from "react";
import { Dropdown } from "semantic-ui-react";

export default function CorporateClients({
  handleOnCorporateClientSearch,
  handleOnCorporateClientChange,
  corporateClients: data,
  selected,
  disable,
  multiple = false,
  loading
}) {
  let allClients = [{ key: "None", text: "None", value: "" }];
  data.forEach((client) => {
    allClients.push({
      key: client.id,
      text: client.name + " [" + client.email + "]",
      value: client.id,
    });
  });
  return (
    <div>
      {allClients && (
        <Dropdown
          placeholder="Select Corporate Client"
          fluid
          search
          clearable
          multiple={multiple}
          selection
          required
          defaultValue={selected}
          onChange={handleOnCorporateClientChange}
          onSearchChange={handleOnCorporateClientSearch}
          options={allClients}
          disabled={disable}
          loading={loading}
        />
      )}
    </div>
  );
}
