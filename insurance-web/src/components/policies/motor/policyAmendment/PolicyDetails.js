import { startCase } from 'lodash';
import React, { memo, useState } from 'react';
import { Button, Form, Grid, Icon, Input } from 'semantic-ui-react';

function PolicyDetails({
  policyDetails,
  newProperties,
  setNewProperties,
  setPolicyDetails,
  setValues,
}) {
  return (
    <div>
      {!!policyDetails?.length &&
        policyDetails.map((detailSet, idx) => (
          <PolicyDetailSet
            detailSet={detailSet}
            setPolicyDetails={setPolicyDetails}
            key={detailSet.id}
            idx={idx}
            newProperties={newProperties}
            setNewProperties={setNewProperties}
            allPolicyTypes={policyDetails}
            setValues={setValues}
          />
        ))}
    </div>
  );
}

export default memo(PolicyDetails);

function PolicyDetailSet({
  detailSet,
  setPolicyDetails,
  allPolicyTypes,
  idx,
  newProperties,
  setNewProperties,
  setValues,
}) {
  const [policyType] = useState(detailSet?.name);
  const [detailFields, setDetailFields] = useState(detailSet.fields);

  const handleChangeFieldValues = (event, { value }) => {
    event.preventDefault();
    if (value) {
      const newFields = detailFields.map((field) =>
        field.field === event.target.name ? { ...field, value } : field
      );
      setDetailFields(newFields);
      const newDetails = [...allPolicyTypes];
      newDetails[idx] = { ...detailSet, fields: newFields };
      setPolicyDetails(newDetails);
      if (event.target.name === 'value') {
        setValues((prev) => ({ ...prev, value }));
      }
    }
  };

  const handleAddPolicyFields = () => {
    // {'motor': {'0': {}, '1': {}}}
    if (Object.keys(newProperties).length) {
      if (newProperties[detailSet.name]) {
        let typeData = newProperties[detailSet.name]; // {'0': {}, '1': {}}
        typeData[Object.keys(typeData).length] = {}; // next empty item
        setNewProperties((prev) => ({ ...prev, [detailSet.name]: typeData }));
      } else {
        setNewProperties((prev) => ({ ...prev, [detailSet.name]: { 0: {} } })); // e.g. initialize motor, if it's not part of new properties
      }
    } else {
      setNewProperties({ [detailSet.name]: { 0: {} } }); // if newproperties is empty, initialize with the current type
    }
  };

  return (
    <>
      <Grid>
        <Grid.Column mobile={16} tablet={16} computer={16}>
          <Form.Group widths="equal">
            <Form.Field>
              <label> Policy Type</label>
              <Form.Field
                fluid
                required
                control={Input}
                placeholder="Policy Type"
                name={detailSet?.name || 'policyType'}
                value={policyType || ''}
              />
            </Form.Field>
            <Form.Field>
              <Grid.Column width={10}>
                {/* <Button type="button" icon floated="right" size="small">
                <Icon name="trash alternate" />
              </Button> */}
              </Grid.Column>
            </Form.Field>
          </Form.Group>
        </Grid.Column>
        <Grid.Column width={16}>
          <Button
            type="button"
            icon
            floated="right"
            onClick={handleAddPolicyFields}
          >
            <Icon name="plus" />
            New field
          </Button>
        </Grid.Column>
        {detailSet?.fields.map((field, idx) => (
          <Grid.Column
            key={field.id || idx}
            mobile={16}
            tablet={detailSet?.fields?.length > 1 ? 8 : 16}
            computer={
              detailSet?.fields?.length > 3
                ? 4
                : Math.round(16 / detailSet?.fields?.length)
            }
          >
            <Form.Field
              inline
              required
              control={Input}
              label={startCase(field.field)}
              fluid
              name={field.field}
              id={field.id}
              defaultValue={field.value}
              onChange={handleChangeFieldValues}
            />
          </Grid.Column>
        ))}
        {Object.entries(newProperties[detailSet?.name] || {}).map(
          ([id, property]) => (
            <NewPolicyFields
              key={id}
              idx={id}
              newProperties={newProperties}
              setNewProperties={setNewProperties}
              type={detailSet.name}
            />
          )
        )}
      </Grid>
    </>
  );
}

function NewPolicyFields({ newProperties, setNewProperties, idx, type }) {
  const handleNewFieldValue = ({ target }) => {
    const detailSet = newProperties[type]; // get the detail set of interest
    if (target.name === 'field') {
      detailSet[idx] = { ...detailSet[idx], field: target.value };
      setNewProperties((prev) => ({
        ...prev,
        [type]: detailSet,
      }));
    }
    if (target.name === 'value') {
      detailSet[idx] = { ...detailSet[idx], value: target.value };
      setNewProperties((prev) => ({
        ...prev,
        [type]: detailSet,
      }));
    }
  };

  const handleRemoveField = () => {
    const detailSet = newProperties[type]; // get the detail set of interest
    if (detailSet[idx]) {
      delete detailSet[idx];
      setNewProperties((prev) => ({
        ...prev,
        [type]: detailSet,
      }));
    }
  };
  return (
    <Grid.Column width={16}>
      <Form.Group>
        <Form.Field
          inline
          required
          control={Input}
          label="Field"
          name="field"
          width={7}
          fluid
          onChange={handleNewFieldValue}
        />
        <Form.Field
          inline
          required
          control={Input}
          label="Value"
          name="value"
          width={7}
          fluid
          onChange={handleNewFieldValue}
        />
        <Form.Field>
          <div style={{ display: 'grid', height: '100%', alignItems: 'end' }}>
            <Button
              icon
              type="button"
              floated="right"
              size="small"
              onClick={handleRemoveField}
            >
              <Icon name="trash alternate" />
            </Button>
          </div>
        </Form.Field>
      </Form.Group>
    </Grid.Column>
  );
}
