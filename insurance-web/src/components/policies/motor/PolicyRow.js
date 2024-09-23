import { startCase } from "lodash";
import moment from "moment";
import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Table } from "semantic-ui-react";

// put commas on a number
export const formatThousands = (num) => {
  num = num.toString();
  if (num[0] === "-") {
    num = num.slice(1);
  }
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// puts parens on a negative number
export const formatNumber = (num) => {
  if (num) {
    let newValue = formatThousands(num);
    return num < 0 ? "(" + newValue + ")" : newValue;
  }
};

const NavigateButton = ({ transaction, id }) => {
  return (
    <Link
      to={`/staff/dashboard/policies/general/motor/details/${transaction}/${id}`}
    >
      <Button icon>
        <Icon name="external alternate" />
      </Button>
    </Link>
  );
};

function RenderRow({
  policy,
  transactionType,
  individualClient,
  corporateClient,
  index,
}) {
  const [detailsType, setDetailsType] = useState("new");

  useEffect(() => {
    const type = policy["__typename"];
    if (type === "PolicyDeletionObjectType") setDetailsType("credit-note");
    if (type === "PolicyRenewalObjectType") setDetailsType("renewal");
    if (type === "PolicyAdditionObjectType") setDetailsType("addition");
  }, [policy]);

  if (!policy) return null;
  const alignPolicyDetailSet = (sets) => {
    const newObject = [...(sets || [])].map((set) => {
      // {id, fields, name: {id, name, ...}}
      const name = set.name?.name || "";
      const simpleFields = set.fields.map((property) => {
        // {id, value, field: {field,id....}}
        const field = property.field.field;
        return { ...property, field };
      });
      return { ...set, name, fields: simpleFields };
    });
    return newObject;
  };

  const policyDetails = policy?.policyDetailSet?.length
    ? alignPolicyDetailSet(policy.policyDetailSet)
    : policy.policyDetails;

  return (
    <>
      <Table.Row>
        <Table.Cell>{index}</Table.Cell>
        <Table.Cell>
          {individualClient && (
            <span style={{ fontSize: ".9rem" }}>
              {individualClient.firstName} {individualClient.lastName}
            </span>
          )}
          {corporateClient && (
            <span style={{ fontSize: ".9rem" }}>{corporateClient.name}</span>
          )}
        </Table.Cell>
        <Table.Cell>
          {individualClient && (
            <span style={{ fontSize: ".9rem" }}>
              {individualClient.clientNumber}
            </span>
          )}
          {corporateClient && (
            <span style={{ fontSize: ".9rem" }}>
              {corporateClient.clientNumber}
            </span>
          )}
        </Table.Cell>
        <Table.Cell>
          {policy.policyNo?.length > 30
            ? policy.policyNo.substring(0, 30) + "..."
            : policy.policyNo}
        </Table.Cell>
        <Table.Cell>
          {policy.debitNoteNo?.length > 13
            ? policy.debitNoteNo.substring(0, 13) + "..."
            : policy.debitNoteNo}
        </Table.Cell>
        <Table.Cell>
          <span style={{ fontSize: ".9rem" }}>
            {policy.insuranceCompany?.name}
          </span>
        </Table.Cell>
        <Table.Cell>
          <span style={{ fontSize: ".9rem" }}>{policy.insuranceClass}</span>
        </Table.Cell>
        <Table.Cell>
          <span style={{ fontSize: ".9rem" }}>
            {policyDetails?.length ? policyDetails[0]?.name : ""}
          </span>
        </Table.Cell>
        <Table.Cell>
          <div style={{ minWidth: "max-content" }}>
            {!!policyDetails?.length
              ? policyDetails.map((set, key) => (
                  <div key={key}>
                    {/* only show the policy type when there's more than 1 policy type. otherwise just show the fields */}
                    {policyDetails.length > 1 && (
                      <>
                        <span style={{ fontSize: ".9rem" }}>
                          <b>{startCase(set.name)}</b>
                        </span>
                        <br />
                      </>
                    )}
                    {set.fields.length ? (
                      set.fields.map((property, idx) => (
                        <span key={property?.id || idx}>
                          <b>{startCase(property.field)}</b> : {property.value}
                          <br />
                        </span>
                      ))
                    ) : (
                      <span>No fields.</span>
                    )}
                    <br />
                  </div>
                ))
              : "-"}
          </div>

          {/* <div>
            {policy.policyDetailSet.length > 0 &&
              policy.policyDetailSet.map((fieldType, key) => (
                <span style={{ fontSize: '.9rem' }} key={key}>
                  {fieldType.fields.map((field, i) => (
                    <div key={i}>
                      {fieldType.fields[i].field.field === 'registration_number'
                        ? fieldType.fields[i].value
                        : ''}
                    </div>
                  ))}
                </span>
              ))}
          </div> */}
        </Table.Cell>
        <Table.Cell>
          <b>{transactionType}</b>
        </Table.Cell>
        <Table.Cell>
          {moment(policy.startDate).format("MMM Do YYYY")}
        </Table.Cell>
        <Table.Cell>{moment(policy.endDate).format("MMM Do YYYY")}</Table.Cell>
        <Table.Cell>
          {policy.premiums ? formatNumber(policy.premiums.totalPremiums) : null}
        </Table.Cell>

        <Table.Cell>
          {policy.value ? formatNumber(policy.value) : "null"}
        </Table.Cell>
        <Table.Cell>
          {moment(policy.transactionDate).format("MMM Do YYYY")}
        </Table.Cell>
        <Table.Cell>
          {policy?.premiums && formatNumber(policy.premiums?.netPremiums)}
        </Table.Cell>
        <Table.Cell>
          {policy?.calculateTotal && formatNumber(policy.calculateTotal)}
        </Table.Cell>
        <Table.Cell>
          {policy?.calculateBalance && formatNumber(policy.calculateBalance)}
        </Table.Cell>
        <Table.Cell>
          {policy?.premiums && formatNumber(policy.premiums?.grossCommission)}
        </Table.Cell>
        <Table.Cell>
          {policy.premiums
            ? formatNumber(policy.premiums.withholdingTax)
            : null}
        </Table.Cell>
        <Table.Cell>
          {policy.premiums ? formatNumber(policy.premiums.netCommission) : null}
        </Table.Cell>

        <Table.Cell>
          <NavigateButton transaction={detailsType} id={policy.id} />
        </Table.Cell>
      </Table.Row>
    </>
  );
}

const PolicyRow = memo(RenderRow);
export default PolicyRow;
