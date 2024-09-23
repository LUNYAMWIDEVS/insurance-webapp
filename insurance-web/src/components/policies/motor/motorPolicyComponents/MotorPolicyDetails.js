import { startCase } from "lodash";
import React, { memo } from "react";
import {
  Container,
  Header,
  Divider,
  Item,
  Segment,
  Grid,
} from "semantic-ui-react";

function setRenewalDate(inputDate) {
  if (!Date.parse(inputDate)) return null;

  const formattedInputDate = new Date(inputDate);

  if (isNaN(formattedInputDate.getTime())) return null;

  formattedInputDate.setDate(formattedInputDate.getDate() + 0);
  const result = formattedInputDate.toISOString().split("T");
  return result[0];
}

function MotorPolicyDetails({
  values,
  clientsData,
  policyDetails,
  newProperties = {},
}) {
  return (
    <Container>
      <Grid container columns={2} divided relaxed stackable>
        <Grid.Column>
          <Segment>
            <Header as="h3">Client Details</Header>
          </Segment>
          <Item.Group>
            <Item>
              <Item.Content>
                <Divider horizontal>Basic Information</Divider>
                {values.individualClient && (
                  <Item.Description>
                    <b>Name: </b>
                    <span className="price">
                      {clientsData
                        ? `${clientsData.individualClient.firstName} ${
                            clientsData.individualClient.lastName
                          } ${clientsData.individualClient?.surname || ""}`
                        : ""}
                    </span>
                    <br />
                    <b>Email: </b>
                    <span className="price">
                      {clientsData ? clientsData.individualClient.email : ""}
                    </span>
                    <br />
                    <b>Phone Number: </b>
                    <span className="price">
                      {clientsData
                        ? clientsData.individualClient.phoneNumber
                        : ""}
                    </span>
                    <br />
                    <b>ID Number: </b>
                    <span className="price">
                      {clientsData ? clientsData.individualClient.idNumber : ""}
                    </span>
                    <br />
                    <b>KRA Pin: </b>
                    <span className="price">
                      {clientsData ? clientsData.individualClient.kraPin : ""}
                    </span>
                    <br />
                  </Item.Description>
                )}
                {values.corporateClient && (
                  <Item.Description>
                    <b>Name: </b>
                    <span className="price">{values.corporateClient.name}</span>
                    <br />
                    <b>Email: </b>
                    <span className="price">
                      {values.corporateClient.email}
                    </span>
                    <br />
                    <b>Phone Number: </b>
                    <span className="price">
                      {values.corporateClient.phoneNumber}
                    </span>
                    <br />
                    <b>kra Pin: </b>
                    <span className="price">
                      {values.corporateClient.kraPin}
                    </span>
                    <br />
                  </Item.Description>
                )}
              </Item.Content>
            </Item>
            <Item>
              <Item.Content>
                <Divider horizontal>Policy Information</Divider>
                <Item.Description>
                  <b>Policy Number: </b>
                  <span className="price">{values.policyNo}</span>
                  <br />
                  <b>Insurance Class: </b>
                  <span className="price">{values.insuranceClass}</span>
                  <br />
                  <b>Insurance Company: </b>
                  <span className="price">
                    {values?.insuranceCompany?.name || ""}
                  </span>
                  <br />
                  <b>Transaction Type: </b>
                  <span className="price">{values.transactionType}</span>
                  <br />
                  <b>Start Date: </b>
                  <span className="price">{values.startDate}</span>
                  <br />
                  <b>End Date: </b>
                  <span className="price">{values.endDate}</span>
                  <br />
                  <b>Renewal Date: </b>
                  <span className="price">
                    {setRenewalDate(values.endDate)}
                  </span>
                  <br />
                  <b>Transaction Date: </b>
                  <span className="price">{values.transactionDate}</span>
                  <br />
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column>
          <Segment>
            <Header as="h3">Policy Details</Header>
          </Segment>
          <Item.Group>
            {policyDetails?.length
              ? policyDetails.map((detailSet, idx) => (
                  <Item key={detailSet?.id || idx}>
                    <Item.Content>
                      <Header as="h4">
                        Policy Type:{" "}
                        {/* in policyDetailSet, policyType is an object, in policyDetails, it's a string */}
                        {typeof detailSet?.name === "object"
                          ? detailSet.name?.name || ""
                          : detailSet.name}
                      </Header>
                      <br />
                      <Item.Description>
                        {/* renewing policy fields */}
                        {!!detailSet?.fields?.length &&
                          detailSet.fields.map((detail, idx) => (
                            <div key={detail?.id || idx}>
                              <b>
                                {/* in policyDetailSet, field is an object, in policyDetails, field is a string */}
                                {startCase(
                                  typeof detail?.field === "object"
                                    ? detail.field?.field || ""
                                    : detail.field
                                )}
                                :{" "}
                              </b>
                              <span className="price">{detail.value}</span>
                              <br />
                            </div>
                          ))}
                        {/* newly added policy fields */}
                        {newProperties[detailSet.name] &&
                          Object.values(newProperties[detailSet.name]).map(
                            (detail, idx) => (
                              <div key={detail?.id || idx}>
                                <b>{startCase(detail?.field)}: </b>
                                <span className="price">{detail.value}</span>
                                <br />
                              </div>
                            )
                          )}
                      </Item.Description>
                      <Divider />
                    </Item.Content>
                  </Item>
                ))
              : "No details."}
          </Item.Group>
        </Grid.Column>
      </Grid>
      {values.remarks && (
        <Grid container columns={1} divided relaxed stackable>
          <Grid.Column>
            <Segment>
              <Header as="h3">Remarks</Header>
            </Segment>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Item.Description>
                    <div dangerouslySetInnerHTML={{ __html: values.remarks }} />
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
          </Grid.Column>
        </Grid>
      )}
    </Container>
  );
}

export default memo(MotorPolicyDetails);
