import React from "react";
import { Grid, Divider, Segment, Header } from "semantic-ui-react";
import { formatNumber } from "../PolicyRow";

function Totals({ premiums }) {
  return (
    <div>
      <br />
      <br />
      <Segment>
        <Header as="h3" size="medium" textAlign="center">
          Policy Premium Totals
        </Header>
      </Segment>
      <Grid columns="equal" container divided relaxed stackable>
        <Grid.Row>
          <Grid.Column>
            <b>Net Premium:</b>
            {premiums.netPremiums && (
              <span className="price">
                Ksh{" "}
                {formatNumber(premiums.netPremiums)}{" "}
              </span>
            )}
            {premiums.netPremium && (
              <span className="price">
                Ksh{" "}
                {formatNumber(premiums.netPremium)}{" "}
              </span>
            )}
            <br />
          </Grid.Column>
          <Grid.Column>
            <b>Total Levies:</b>
            <span className="price">
              Ksh{" "}
              {formatNumber(premiums.totalLevies)}{" "}
            </span>
            <br />
          </Grid.Column>
          <Grid.Column>
            <b>Gross Premium:</b>
            {premiums.totalPremiums && (
              <span className="price">
                Ksh{" "}
                {formatNumber(premiums.totalPremiums)}{" "}
              </span>
            )}
            {premiums.grossPremium && (
              <span className="price">
                Ksh{" "}
                {formatNumber(premiums.grossPremium)}{" "}
              </span>
            )}
            <br />
            <br />
          </Grid.Column>
        </Grid.Row>
        <Divider clearing />
        <Grid.Row>
          <Grid.Column>
            <b>Gross Commission:</b>
            <span className="price">
              Ksh{" "}
              {formatNumber(premiums.grossCommission)}{" "}
            </span>
            <br />
          </Grid.Column>
          <Grid.Column>
            <b>Withholding Tax:</b>
            <span className="price">
              Ksh{" "}
              {formatNumber(premiums.withholdingTax)}{" "}
            </span>
            <br />
          </Grid.Column>
          <Grid.Column>
            <b>Net Commission:</b>
            <span className="price">
              Ksh{" "}
              {formatNumber(premiums.netCommission)}{" "}
            </span>
            <br />
            <br />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default Totals;
