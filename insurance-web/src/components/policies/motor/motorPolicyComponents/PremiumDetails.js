import React, { memo } from 'react';
import { Container, Grid } from 'semantic-ui-react';
import Benefits from './Benefits';
import Premiums from './Premiums';
import Totals from './Totals';
import BasicPremium from './BasicPremium';

function PremiumDetails({ values, premiumsData }) {
  const { additionalPremiums, additionalBenefits, premiums } = premiumsData;

  return (
    <Container>
      <Grid
        container
        columns={
          additionalPremiums && additionalBenefits.length
            ? 3
            : !!(additionalPremiums.length || additionalBenefits.length)
            ? 2
            : 1
        }
        divided
        relaxed
        stackable
      >
        <Grid.Column>
          <BasicPremium
            policy={values}
            commissionRate={values.commissionRate}
            minimumPremiumAmount={values.minimumPremiumAmount}
            premiums={premiums}
          />
        </Grid.Column>

        {!!additionalBenefits.length && (
          <Grid.Column>
            <Benefits
              additionalBenefits={additionalBenefits}
              premiums={premiums}
            />
          </Grid.Column>
        )}
        {!!additionalPremiums.length && (
          <Grid.Column>
            <Premiums
              additionalPremiums={additionalPremiums}
              premiums={premiums}
            />
          </Grid.Column>
        )}
      </Grid>

      <div>
        {premiums && Object.keys(premiums).length > 0 && (
          <Totals premiums={premiums} />
        )}
      </div>
    </Container>
  );
}

export default memo(PremiumDetails);
