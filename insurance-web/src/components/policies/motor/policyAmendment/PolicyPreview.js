import React, { memo, useEffect, useMemo } from 'react';
import { Modal, Grid, Button, Tab, Menu } from 'semantic-ui-react';
import MotorPolicyDetails from '../motorPolicyComponents/MotorPolicyDetails';
import PremiumDetails from '../motorPolicyComponents/PremiumDetails';
import useAmendment from './hooks/useAmendment';

function PolicyPreview({
  values,
  policyOpts,
  openModal,
  setOpenModal,
  setResponseErrors,
  setLoading,
  premiumsData,
  clientsData,
  amendment,
}) {
  const [variables, setVariables] = React.useState({});
  const { policyAmendment } = useAmendment(
    amendment,
    setResponseErrors,
    setLoading
  );

  const {
    newProperties,
    policyDetailSet,
    corporateClient,
    insuranceCompany,
    ...others
  } = values;

  const swapKeyValues = (optionsObject) =>
    Object.keys(optionsObject ?? {}).length &&
    Object.entries(optionsObject).reduce(
      (acc, [key, val]) => ({ ...acc, [val]: key }),
      {}
    );

  const benefitChoices = useMemo(
    () =>
      policyOpts ? swapKeyValues(policyOpts.additional_benefit_options) : [],
    [policyOpts]
  );

  const classChoices = useMemo(
    () => (policyOpts ? swapKeyValues(policyOpts.insurance_class_options) : []),
    [policyOpts]
  );

  useEffect(() => {
    // newProperties: {'motor': {0: {field, value}, 1: {field, value}}, 'type2': {...}}
    // fetched sets: [{name: 'motor', fields: [{field, value}, {field, value}]}, {set2}, {set3}]
    let updatedPolicyDetailSet;
    let newValue = values?.value;
    if (!policyDetailSet && !Object.keys(newProperties).length)
      updatedPolicyDetailSet = [];
    updatedPolicyDetailSet = [...(policyDetailSet || [])].map((set) => {
      // fields like __typename, id, are not in the mutation types
      const cleanFields = set?.fields?.length
        ? set.fields.map(({ field, value }) => ({ field, value }))
        : [];
      return {
        name: set?.name,
        fields: Object.keys(newProperties || {}).includes(set.name)
          ? [...cleanFields, ...Object.values(newProperties[set.name])]
          : cleanFields,
      };
    });

    setVariables({
      ...others,
      policyDetailSet: updatedPolicyDetailSet,
      insuranceCompany: insuranceCompany?.id,
      insuranceClass: classChoices[values?.insuranceClass],
      corporateClient: !!corporateClient ? corporateClient.id : null,
      value: newValue,
    });
  // eslint-disable-next-line
  }, [newProperties, values]);

  useEffect(() => {
    if (values.additionalBenefits) {
      // mutation --> 'name' field should be 'benefit'
      const benefits = [...values.additionalBenefits].map(
        ({ name, ...otherProps }) => {
          return {
            ...otherProps,
            minimumAmount:
              otherProps?.minimumAmount || otherProps?.amount || '',
            benefit: benefitChoices[name],
          };
        }
      );
      setVariables((prev) => ({ ...prev, additionalBenefits: benefits }));
    }
  }, [benefitChoices, values.additionalBenefits]);

  const panes = [
    {
      menuItem: <Menu.Item key="policy">Motor Policy Details</Menu.Item>,
      render: () => {
        return (
          <Tab.Pane>
            {
              <MotorPolicyDetails
                values={values}
                clientsData={clientsData}
                policyDetails={policyDetailSet}
                newProperties={newProperties}
              />
            }
          </Tab.Pane>
        );
      },
    },
    {
      menuItem: <Menu.Item key="premiums">Premiums Details</Menu.Item>,
      render: () => {
        return (
          <Tab.Pane>
            {
              <PremiumDetails
                values={values}
                commissionRate={values.commissionRate}
                minimumPremiumAmount={values.minimumPremiumAmount}
                premiumsData={premiumsData}
              />
            }
          </Tab.Pane>
        );
      },
    },
  ];
  return (
    <Modal
      dimmer={'blurring'}
      closeIcon
      open={openModal}
      onClose={() => setOpenModal(false)}
    >
      <Modal.Header>Policy Preview</Modal.Header>
      <Modal.Content>
        <Grid container padded>
          <Grid.Column>
            <Tab panes={panes} />
          </Grid.Column>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          onClick={() => {
            policyAmendment({ variables });
            setOpenModal(false);
          }}
        >
          Amend
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default memo(PolicyPreview);
