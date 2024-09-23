import React, { useMemo } from 'react';
import { Button, Dropdown, Form, Grid, Icon, Input } from 'semantic-ui-react';

export default function AdditionalBenefits({
  newBenefits,
  setNewBenefits,
  polOptions,
  isLoading,
}) {
  const benefitOptions = useMemo(
    () =>
      polOptions
        ? Object.entries(
            polOptions?.motorPolicyOptions?.additional_benefit_options
          ).map(([key, value]) => ({ key, text: value, value }))
        : [],
    [polOptions]
  );

  const handleNewBenefit = () => {
    setNewBenefits((prev) => ({
      ...prev,
      [Object.keys(prev).length]: {},
    }));
  };
  const handledeleteBenefit = (idx) => {
    if (idx && newBenefits[idx]) {
      const updatedBenefits = { ...newBenefits };
      delete updatedBenefits[idx];
      setNewBenefits(updatedBenefits);
    }
  };

  if (isLoading) return null;
  return (
    <>
      <Form.Group widths="equal">
        <Form.Field width={16}>
          <Button type="button" icon floated="right" onClick={handleNewBenefit}>
            <Icon name="plus square outline" />
          </Button>
        </Form.Field>
      </Form.Group>
      <br />
      {Object.entries(newBenefits).map(([key, benefit]) => (
        <NewBenefitInput
          idx={key}
          key={key}
          setNewBenefits={setNewBenefits}
          newBenefits={newBenefits}
          deleteBenefit={handledeleteBenefit}
          benefitOptions={benefitOptions}
          benefit={benefit}
        />
      ))}
    </>
  );
}

function NewBenefitInput({
  benefitOptions,
  idx,
  setNewBenefits,
  newBenefits,
  deleteBenefit,
  benefit,
}) {
  const addBenefit = ({ target }) => {
    // name === 'commissionRate' | 'minimumAmount' | 'name'
    if (target.name) {
      setNewBenefits((prev) => ({
        ...prev,
        [idx]: { ...newBenefits[idx], [target.name]: target.value },
      }));
    }
  };

  const handleBenefitName = (event, result) => {
    // name === 'commissionRate' | 'minimumAmount' | 'name'
    if (result?.name) {
      setNewBenefits((prev) => ({
        ...prev,
        [idx]: { ...newBenefits[idx], name: result?.value },
      }));
    }
  };

  return (
    <Form.Group widths="equal">
      <Form.Field>
        <label>Additional Benefit Type</label>
        <Dropdown
          fluid
          search
          selection
          required
          name="name" // or benefit?
          onChange={handleBenefitName}
          options={benefitOptions}
          defaultValue={benefit?.name || benefit?.benefit || ''}
        />
      </Form.Field>
      <Form.Field>
        <label>Minimum Benefit Amount</label>
        <Input
          fluid
          placeholder="Minimum Additional Benefit Amount"
          name="minimumAmount"
          type="number"
          onChange={addBenefit}
          defaultValue={benefit?.amount || ''}
        />
      </Form.Field>
      <Form.Field>
        <Grid>
          <label>
            <b>Commission Rate</b>
          </label>
          <Grid.Column width={12}>
            <Input
              fluid
              placeholder="Commision Rate"
              name="commissionRate"
              type="number"
              step="any"
              onChange={addBenefit}
              defaultValue={benefit?.commissionRate || 0}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Button
              icon
              type="button"
              floated="right"
              onClick={() => deleteBenefit(idx)}
              size="small"
            >
              <Icon name="trash alternate" />
            </Button>
          </Grid.Column>
        </Grid>
      </Form.Field>
    </Form.Group>
  );
}
