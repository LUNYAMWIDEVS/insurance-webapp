import React from "react";
import { Item, Divider, Segment, Header } from "semantic-ui-react";
import { formatNumber } from "../PolicyRow";
function Premiums({ additionalPremiums, premiums }) {
  return (
    <>
      <Segment>
        <Header as="h3">Additional Levies</Header>
      </Segment>
      <Item.Group>
        {additionalPremiums.map((premium, i) => (
          <Item.Content key={i}>
            <Item>
              <Divider horizontal>.{i + 1}.</Divider>
              <Item.Description>
                <b>Levy Type: </b>
                <span className="price">{premium.premium} </span>
                <br />
                {premium.commissionRate && (
                  <span>
                    <b>Levy Rate: </b>
                    <span className="price">
                      {premium.commissionRate + "%"}{" "}
                    </span>
                    <br />
                  </span>
                )}
                <br />

                <span>
                  <b>Amount: </b>
                  <span className="price">
                    Ksh{" "}
                    {premium.amount
                      ? formatNumber(premium.amount)
                      : premium.minimumAmount
                      ? formatNumber(premium.minimumAmount)
                      : "0"}{" "}
                  </span>
                  <br />
                </span>
              </Item.Description>
            </Item>
          </Item.Content>
        ))}
      </Item.Group>
    </>
  );
}

export default Premiums;
