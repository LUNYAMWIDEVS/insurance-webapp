import React from "react";
import { Item, Divider, Segment, Header } from "semantic-ui-react";

function Benefits({ additionalBenefits, premiums }) {

  return (
    <>
      <Segment>
        <Header as="h3">Additional Benefits</Header>
      </Segment>
      <Item.Group>
        {additionalBenefits.map((benefit, i) => (
          <Item.Content key={i}>
            <Item>
              <Divider horizontal>.{i + 1}.</Divider>
              <Item.Description>
                <b>Benefit Type: </b>
                
                <span className="price">{benefit?.name} </span>
                
                <br />
                {/* additional benefits in the renewal come with keys in snake_case rather than camelCase for commission rate and minimum amount */}
                <b>Commission Rate: </b>
                <span className="price">
                  {benefit.commissionRate
                    ? benefit.commissionRate + "%"
                    : benefit.commission_rate
                    ? benefit.commission_rate + "%"
                    : ""}{" "}
                </span>
                <br />
                <span>
                  <b>Minimum Amount: </b>
                  {benefit.minimumAmount
                    ? `Ksh ${benefit.minimumAmount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    : benefit.minimum_amount
                    ? `Ksh ${benefit.minimum_amount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    : ""}{" "}
                </span>
                <br />
                <span>
                  <b>Amount: </b>
                  <span className="price">
                    {benefit.amount
                      ? `Ksh ${benefit.amount
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                      : premiums.additionalBenefits
                      ? `${premiums.AdditionalBenefits[i]?.amount
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                      : ""}
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

export default Benefits;
