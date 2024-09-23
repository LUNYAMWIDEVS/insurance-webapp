import React from 'react';
import { Form, Grid, Input, Label } from 'semantic-ui-react';

function AdditionalLevies({
  addLevies,
  setAddLevies,
  polOptions,
  polOptionsLoading,
}) {
  const handleOnAddPremTypesChange =
    (levy) =>
    ({ target }) => {
      setAddLevies((levies) => ({
        ...levies,
        [levy.premium]: {
          ...addLevies[levy.premium],
          commissionRate: target.value,
        },
      }));
    };

  if (polOptionsLoading) return null;
  return Object.values(addLevies ?? {}).map((levy, key) => (
    <Form.Group widths={2} key={key}>
      <Form.Field>
        <label>Levy Type</label>
        {!polOptionsLoading &&
          polOptions?.motorPolicyOptions?.premium_type_options && (
            <Input
              fluid
              name="premiumType"
              defaultValue={
                polOptions.motorPolicyOptions.premium_type_options[
                  levy?.premium
                ]
              }
            />
          )}
      </Form.Field>
      {levy?.commissionRate && (
        <Form.Field>
          <label className="ui center aligned">Levy Rate (%)</label>
          <Input
            fluid
            placeholder="Levy Rate"
            name="commissionRate"
            type="number"
            step="any"
            id={key}
            onChange={handleOnAddPremTypesChange(levy)}
            defaultValue={levy?.commissionRate || ''}
          />
        </Form.Field>
      )}
      <Form.Field>
        <label className="ui center aligned">Levy Amount</label>
        <Grid>
          <Grid.Row centered width={4}>
            <Label size="large">
              {levy?.amount || levy?.minimumAmount || '0'}
            </Label>
          </Grid.Row>
        </Grid>
      </Form.Field>
    </Form.Group>
  ));
}

export default AdditionalLevies;
