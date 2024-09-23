import React from "react";
import { Table, Icon, Button, Item } from "semantic-ui-react";
import { Link } from "react-router-dom";

function MainPolicyDetails({ rows, policy }) {
  return (
    <>
      <Table.Cell rowSpan={rows}>
        {policy.individualClient && (
          <span style={{ fontSize: ".9rem" }}>
            {policy.individualClient.firstName}{" "}
            {policy.individualClient.lastName}
          </span>
        )}
        {policy.corporateClient && (
          <span style={{ fontSize: ".9rem" }}>
            {policy.corporateClient.name}
          </span>
        )}
      </Table.Cell>
      <Table.Cell rowSpan={rows}>
        {policy.individualClient && (
          <span style={{ fontSize: ".9rem" }}>
            {policy.individualClient.clientNumber}
          </span>
        )}
        {policy.corporateClient && (
          <span style={{ fontSize: ".9rem" }}>
            {policy.corporateClient.clientNumber}
          </span>
        )}
      </Table.Cell>
      <Table.Cell rowSpan={rows}>
        {policy.policyNo.length > 30
          ? policy.policyNo.substring(0, 30) + "..."
          : policy.policyNo}
      </Table.Cell>
      <Table.Cell rowSpan={rows}>
        <span style={{ fontSize: ".9rem" }}>
          {policy.insuranceCompany.name}
        </span>
      </Table.Cell>
      <Table.Cell rowSpan={rows}>
        <div>
          {policy.policyDetails &&
            policy.policyDetails.map((fieldType, key) => (
              <Item key={key}>
                <b>
                  {/* {fieldType.length > 1
                                ? fieldType[key].name
                                : fieldType.name}{" "}
                              details */}
                  <br></br>
                </b>
                <Item.Content>
                  <Item.Description>
                    {fieldType.fields.map((field, i) => (
                      <div key={i}>
                        {/* <b>{fieldType.fields[i].field}: </b> */}
                        <span className="price">
                          {fieldType.fields[i].field === "registration_number"
                            ? fieldType.fields[i].field.value
                            : ""}{" "}
                        </span>
                        <br />
                      </div>
                    ))}
                  </Item.Description>
                </Item.Content>
              </Item>
            ))}
        </div>

        <div>
          {policy.policyDetailSet &&
            policy.policyDetailSet.map((fieldType, key) => (
              <Item key={key}>
                {/* <b>{fieldType.name.name} details</b> */}
                <br></br>
                <Item.Content>
                  <Item.Description>
                    <div key={key}>
                      {/* {fieldType.name.name === "motor" ? (
                                    <b>Registration Number: </b>
                                  ) : (
                                    <b>Details:</b>
                                  )} */}
                      {fieldType.fields.map((field, i) => (
                        <div key={i}>
                          {fieldType.fields[i].field.field ===
                          "registration_number" ? (
                            <span className="price">
                              {fieldType.fields[i].value}
                            </span>
                          ) : (
                            <span className="price"></span>
                          )}
                        </div>
                      ))}
                      <br />
                    </div>
                  </Item.Description>
                </Item.Content>
              </Item>
            ))}
        </div>
      </Table.Cell>
    </>
  );
}

export default MainPolicyDetails;
