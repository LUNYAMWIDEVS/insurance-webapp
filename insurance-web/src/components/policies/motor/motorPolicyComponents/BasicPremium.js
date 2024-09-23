import React from 'react';
import { Item, Divider, Segment, Header } from 'semantic-ui-react';
import { formatNumber } from '../PolicyRow';

function BasicPremium({
  policy,
  commissionRate,
  minimumPremiumAmount,
  premiums,
}) {
  return (
    <>
      <Segment>
        <Header as="h3">Basic Premium</Header>
      </Segment>
      <Item.Group>
        <Item>
          <Item.Content>
            <Divider horizontal>Basic Premiums Info</Divider>
            <Item.Description>
              <b>Premium Type: </b>
              <span className="price">{policy.premiumType} </span>
              <br />
              <b>Premium Rate: </b>
              <span className="price">{commissionRate}% </span>
              <br />
              <b>Minimum Premium Amount: </b>
              <span className="price">
                Ksh {formatNumber(minimumPremiumAmount)}{' '}
              </span>
              <br />
              <span>
                <b>Amount: </b>
                {premiums.basicPremium && (
                  <span className="price">
                    Ksh {formatNumber(premiums.basicPremium.amount)}{' '}
                  </span>
                )}
                <br />
              </span>
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    </>
  );
}

export default BasicPremium;
