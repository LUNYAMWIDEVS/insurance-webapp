import React from "react";
import { Item, Table } from "semantic-ui-react";
import moment from "moment";

function EndorsementDetails({ policy }) {
  return (
    <>
      <Table.Cell>{policy.debitNoteNo}</Table.Cell>

      <Table.Cell>{policy.startDate}</Table.Cell>
      <Table.Cell>{policy.endDate}</Table.Cell>
      <Table.Cell>
        {policy.premiums
          ? policy.premiums.totalPremiums
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : null}
      </Table.Cell>

      <Table.Cell>
        {policy.value
          ? policy.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : "null"}
      </Table.Cell>
      <Table.Cell>
        {moment(policy.transactionDate).format("Do MMM YYYY")}
      </Table.Cell>
      <Table.Cell>
        {policy.premiums
          ? policy.premiums.netPremiums
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : null}
      </Table.Cell>
      <Table.Cell>
        {policy.calculateTotal
          ? policy.calculateTotal
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : "null"}
      </Table.Cell>
      <Table.Cell>
        {policy.calculateBalance
          ? policy.calculateBalance
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : "null"}
      </Table.Cell>
      <Table.Cell>
        {policy.premiums
          ? policy.premiums.grossCommission
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : null}
      </Table.Cell>
      <Table.Cell>
        {policy.premiums
          ? policy.premiums.withholdingTax
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : null}
      </Table.Cell>
      <Table.Cell>
        {policy.premiums
          ? policy.premiums.netCommission
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : null}
      </Table.Cell>
    </>
  );
}

export default EndorsementDetails;
