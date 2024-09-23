import React from "react";
import { Dropdown } from "semantic-ui-react";

export default function Clients({
  handleOnClientSearch,
  handleOnClientChange,
  clients: data,
  selected,
  disable,
  multiple = false,
  loading
}) {
  let allClients = [{ key: "None", text: "None", value: "" }];
  data.forEach((client) => {
    allClients.push({
      key: client.id,
      text:
        client.firstName + " " + client.lastName + " [" + client.email + "]",
      value: client.id,
    });
  });
  return (
    <div>
      {allClients && (
        <Dropdown
          placeholder="Select Client"
          fluid
          search
          clearable
          multiple={multiple}
          selection
          required
          defaultValue={selected}
          onChange={handleOnClientChange}
          onSearchChange={handleOnClientSearch}
          options={allClients}
          disabled={disable}
          loading={loading}
        />
      )}
    </div>
  );
}
