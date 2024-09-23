/* eslint-disable no-unused-vars */
import { useQuery } from '@apollo/react-hooks';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { capitalize } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button,
  Container,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  Message,
} from 'semantic-ui-react';
import * as yup from 'yup';
import { GET_CLIENT_QUERY } from '../../../clients/queries';
import { GET_MOTOR_POLICY_OPTS } from '../../queries';
import AdditionalBenefits from './AdditionalBenefits';
import AdditionalLevies from './AdditionalLevies';
import PolicyDetails from './PolicyDetails';
import PolicyInsuranceInfo from './PolicyInsuranceInfo';
import PolicyPreview from './PolicyPreview';
import { useAmendedPolicy } from './context/AmendedPolicyContext';

//========================== Policy Addition, Policy Deletion, Policy Renewal Component ================================

const schema = yup.object().shape({
  policyNo: yup.string().required('policy number is required'),
  insuranceCompany: yup.string().required('insurance company is required'),
  insuranceClass: yup.string().required('insurance class is required'),
  transactionType: yup.string().required('transaction type is required'),
  startDate: yup.date().required('start date is required'),
  endDate: yup.date().required('end date is required'),
  premiumType: yup.string().required('premium type is required'),
  minimumPremiumAmount: yup
    .number()
    .required('minimum premium amount is required'),
  commissionRate: yup.number().required('commission rate is required'),
  policyCommissionRate: yup
    .number()
    .required('policy commission rate is required'),
});

export default function PolicyAmendment({ data, amendment }) {
  const { policyId } = useParams();
  const { policy } = useAmendedPolicy();

  const [errors, setErrors] = useState({
    errorPaths: [],
    errors: [],
  });
  const [responseErrors, setResponseErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addBenefits, setAddBenefits] = useState({});
  const [addPremiums, setAddPremiums] = useState({
    IPHCFLEVY: {
      premium: 'IPHCFLEVY',
      commissionRate: 0.25,
      amount: 0,
    },
    TLEVY: {
      premium: 'TLEVY',
      commissionRate: 0.2,
      amount: 0,
    },
  });
  const [openModal, setOpenModal] = useState(false);
  const [addLevies, setAddLevies] = useState([]);

  const [calculated, setCalculated] = useState({
    netPremium: 0,
    grossPremium: 0,
    totalLevies: 0,
    grossCommission: 0,
    netCommission: 0,
    withholdingTax: 0,
    updated: false,
  });

  const [values, setValues] = useState({
    commissionRate: 3.75,
    premiumType: 'BASIC',
    withholdingTax: 10,
  });
  const [endorsed, setEndorsed] = useState(false);
  const [search, setSearch] = useState({ search: '' });

  const [newProperties, setNewProperties] = useState({}); // new fields/values for the renewing poliy type
  const [newBenefits, setNewBenefits] = useState([]);
  const [policyDetails, setPolicyDetails] = useState([]);

  const { data: polOptions, loading: polOptionsLoading } = useQuery(
    GET_MOTOR_POLICY_OPTS
  );

  const validate = useCallback((values) => {
    schema
      .validate(values, { abortEarly: false })
      .then((valid) => setErrors({ errorPaths: [], errors: [] }))
      .catch((err) => {
        setErrors({
          errors: err.errors,
          errorPaths: err.inner.map((i) => i.path),
        });
      });
  }, []);

  useEffect(() => {
    const policyData = !!data && Object.values(data).length > 0 ? data : policy;
    if (policyData) {
      if (policyData?.premiums?.AdditionalBenefits) {
        setNewBenefits(policyData.premiums.AdditionalBenefits);
      }
      if (policyData?.policyDetailSet?.length) {
        // policy type name and field.field are objects here
        const newObject = [...(policyData.policyDetailSet || [])].map((set) => {
          // {id, fields, name: {id, name, ...}}
          const name = set.name?.name || '';
          const simpleFields = set.fields.map((property) => {
            // {id, value, field: {field,id....}}
            const field = property.field.field;
            return { ...property, field };
          });
          return { ...set, name, fields: simpleFields };
        });
        setPolicyDetails(newObject);
      } else {
        setPolicyDetails(
          policyData?.policyDetails || policyData?.policy?.policyDetails || {}
        );
      }

      let individualClient = policyData.individualClient
        ? policyData.individualClient.id
        : null;
      setValues({
        ...values,
        commissionRate: policyData?.commissionRate,
        policyCommissionRate: policyData?.policyCommissionRate,
        corporateClient: policyData?.corporateClient || '',
        value: policyData?.value,
        policyNo: policyData?.policyNo,
        startDate: policyData.startDate,
        transactionDate: policyData.transactionDate,
        endDate: policyData.endDate,
        insuranceClass: policyData.insuranceClass,
        fetched: true,
        minimumPremiumAmount:
          policyData?.minimumPremiumAmount ||
          policyData?.premiums?.basicPremium?.minimumPremiumAmount ||
          policyData?.premiums?.basicPremium?.amount ||
          null,
        insuranceCompany: policyData?.insuranceCompany,
        individualClient,
        ...policyData.vehicleDetails,
        policyId: policyData?.policy?.id || policyId,
        transactionType: 'RENEW',
      });
    }
    setSearch({search:data?.insuranceCompany?.name})
  // eslint-disable-next-line
  }, [data, policy, policyId]);

  // calculate premiums
  useEffect(() => {
    let val = values?.value || 0;
    const policyFields = policyDetails[0]?.fields || [];
    policyFields.forEach((field) => {
      if (field?.field === 'value') {
        val = Number(field.value);
      }
    });
    if (values.minimumPremiumAmount && val) {
      let data = {};

      let netPremium = +((+values.commissionRate / 100) * +val);
      if (+values.minimumPremiumAmount > +netPremium) {
        netPremium = +(+values.minimumPremiumAmount);
      }
      let grossPremium = +netPremium;
      for (const [key, value] of Object.entries(newBenefits)) {
        let benefitAmount = 0;
        if (value.benefit && value.minimumAmount) {
          if (!value.commissionRate) {
            benefitAmount = value.minimumAmount;
            grossPremium += Number(benefitAmount);
          } else {
            const tempAmount = parseFloat(
              (grossPremium * +value.commissionRate) / 100
            );
            benefitAmount =
              +value.minimumAmount > tempAmount
                ? value.minimumAmount
                : tempAmount;

            grossPremium += +benefitAmount;
            setNewBenefits((prev) => ({
              ...prev,
              [key]: {
                ...newBenefits[key],
                amount: (+newBenefits[key].amount + +benefitAmount).toFixed(0),
              },
            }));
          }
        }

        netPremium += +benefitAmount;
      }

      data['netPremium'] = +(+netPremium).toFixed(0);
      let totalLevies = 0;

      // iterating through the levies
      let newPremiums = { ...addPremiums };
      for (const [key, value] of Object.entries(addPremiums)) {
        let amount = 0;
        if (!value.commissionRate) {
          amount = value.minimumAmount;
        } else {
          amount = parseFloat((grossPremium * +value.commissionRate) / 100);
          grossPremium += +amount;
          newPremiums = {
            ...newPremiums,
            [key]: { ...addPremiums[key], amount: (+amount).toFixed(0) },
          };
        }
        setAddLevies(newPremiums);

        if (!value.commissionRate && values?.transactionType === 'NEW') {
          grossPremium += +value.minimumAmount;
        }
        totalLevies += +amount;
      }
      data['grossPremium'] = parseFloat(grossPremium).toFixed(0);
      data['totalLevies'] = (+totalLevies).toFixed(0);

      if (values?.policyCommissionRate) {
        let grossCommission =
          (netPremium * parseFloat(values.policyCommissionRate)) / 100;
        let withholdingTax = grossCommission * 0.1;
        let netCommission = grossCommission - withholdingTax;

        data['grossCommission'] = (+grossCommission).toFixed(0);
        data['withholdingTax'] = (+withholdingTax).toFixed(0);
        data['netCommission'] = (+netCommission).toFixed(0);
      }
      setCalculated({ ...data, updated: false });
    } else if (!val && values.minimumPremiumAmount) {
      let data = {};
      let netPremium = values.minimumPremiumAmount;
      if (+values.minimumPremiumAmount > +netPremium) {
        netPremium = parseFloat(values.minimumPremiumAmount).toFixed(0);
      }
      let grossPremium = netPremium;
      for (const [key, value] of Object.entries(newBenefits)) {
        let amount = 0;
        if (!value.commissionRate && value.benefit && value.minimumAmount) {
          amount = value.minimumAmount;
          grossPremium = +amount + +grossPremium;
        }
        if (value.benefit && value.commissionRate && value.minimumAmount) {
          amount = parseFloat(
            (grossPremium * value.commissionRate) / 100
          ).toFixed(0);
          if (+value.minimumAmount > +amount) {
            amount = +value.minimumAmount;
          }
          grossPremium = +amount + +grossPremium;
          addBenefits[key].amount = +amount;
        }
        netPremium = +amount + +netPremium;
      }
      data['netPremium'] = netPremium;
      let totalLevies = 0;
      for (const [key, value] of Object.entries(addPremiums)) {
        let amount = 0;
        if (!value.commissionRate) {
          amount = value.minimumAmount;
        }

        if (value.commissionRate) {
          amount = parseFloat(
            (grossPremium * value.commissionRate) / 100
          ).toFixed(0);
          grossPremium = +amount + +grossPremium;
          addPremiums[key].amount = amount;
        }

        totalLevies += +amount;
      }
      data['grossPremium'] = grossPremium;
      data['totalLevies'] = totalLevies;
      if (values.policyCommissionRate) {
        let grossCommission = (
          (netPremium * parseFloat(values.policyCommissionRate)) /
          100
        ).toFixed(0);
        let withholdingTax = (grossCommission * 0.1).toFixed(0);
        let netCommission = +grossCommission - +withholdingTax;
        data['grossCommission'] = grossCommission;
        data['withholdingTax'] = withholdingTax;
        data['netCommission'] = netCommission;
      }
      setCalculated((prev) => ({ ...prev, ...data, updated: false }));
    } else {
      setAddLevies(addPremiums);
    }
  }, [
    values,
    newProperties,
    newBenefits,
    addPremiums,
    policyDetails,
    addBenefits,
  ]);

  useEffect(() => {
    if (Object.keys(newProperties).length) {
      Object.entries(newProperties).forEach(([type, properties]) => {
        Object.values(properties).forEach((prop) => {
          if ((prop.field || '').toLowerCase() === 'value') {
            setValues((prev) => ({ ...prev, value: prop?.value }));
          }
        });
      });
    }
  }, [newProperties]);

  const { data: clientsData } = useQuery(GET_CLIENT_QUERY, {
    variables: values.individualClient ? { id: values.individualClient } : '',
    skip: !values?.individualClient,
  });

  const onPreview = (event) => {
    event.preventDefault();
    validate({ ...values, insuranceCompany: values.insuranceCompany?.id });
    setValues({
      ...values,
      transactionDate: moment().format('YYYY-MM-DD'),
      additionalBenefits: Object.values(newBenefits),
      additionalPremiums: Object.values(addLevies),
      policyDetailSet: policyDetails,
      newProperties, // to be combined with policy details during final submission
      afterSubmit: true,
    });
    setOpenModal(true);
    if (Object.keys(values).length > 7 && !errors.errors.length) {
      setOpenModal(true);
    }
    setEndorsed(true);
  };

  const onChange = useCallback(
    (event, { name, value }) => {
      if (
        amendment === 'deletion' &&
        name === 'minimumPremiumAmount' &&
        value > 0
      ) {
        value = -value;
      }
      setValues({ ...values, [name]: value, updated: true });
      setCalculated({ ...calculated, updated: true });
    },
    [values, amendment, calculated]
  );


  if (!data && !policy) return null;
  return (
    <Container>
      <Grid container padded columns={2}>
        <Grid.Column>
          <div className="content-wrapper">
            <Header as="h3">
              <Icon name="settings" />
              <Header.Content>
                <a href="/staff/dashboard/overview">Policy Records</a> {'>'}{' '}
                <a href="/staff/dashboard/policies/general/motor">Policies</a>{' '}
                {'>'}{' '}
                <Link
                  to={`/staff/dashboard/policies/general/motor/details/${policyId}`}
                >
                  {' '}
                  Policy{' '}
                </Link>{' '}
                {'>'} Policy{' '}
                {amendment === 'renew' ? 'Renewal' : capitalize(amendment)}
                <Header.Subheader>
                  Fill this form to amend the policy
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>
      </Grid>
      <Grid container padded>
        <Grid.Column>
          <Form
            onSubmit={onPreview}
            noValidate
            className={loading ? 'loading' : ''}
          >
            <Form.Group>
              <Message
                visible={!!errors.errors.length || !!responseErrors.length}
                error
              >
                <Message.Header>
                  Please correct the following issues:
                </Message.Header>
                {!!responseErrors.length && <Message>{responseErrors}</Message>}
                <Message.List items={errors.errors} />
              </Message>
            </Form.Group>
            <Form.Group widths="equal">
              {values.individualClient && (
                <Form.Field
                  required
                  error={errors.errorPaths.includes('individualClient')}
                >
                  <label>Client</label>
                  <Input
                    fluid
                    name="clientName"
                    value={
                      clientsData
                        ? `${clientsData.individualClient.firstName} ${clientsData.individualClient.lastName} [${clientsData.individualClient.email}]`
                        : ''
                    }
                  />
                </Form.Field>
              )}
              {values.corporateClient && (
                <Form.Field
                  required
                  error={errors.errorPaths.includes('corporateClient')}
                >
                  <label>Corporate</label>
                  <Input
                    fluid
                    name="corporateName"
                    value={
                      values.corporateClient ? values.corporateClient.name : ''
                    }
                  />
                </Form.Field>
              )}
              <Form.Field
                required
                error={errors.errorPaths.includes('policyNo')}
              >
                <label>Policy No.</label>
                <Input
                  fluid
                  placeholder="Policy No."
                  name="policyNo"
                  // onChange={onChange}
                  value={values.policyNo || ''}
                />
              </Form.Field>
            </Form.Group>
            <PolicyInsuranceInfo
              search={search.search}
              errors={errors}
              insuranceClass={values.insuranceClass}
              insuranceCompany={values?.insuranceCompany}
              polOptions={polOptions}
              polOptionsLoading={polOptionsLoading}
            />
            <Form.Group widths="equal">
              <Form.Field
                required
                error={errors.errorPaths.includes('startDate')}
              >
                <label>Start Date</label>
                <Input
                  fluid
                  name="startDate"
                  type="date"
                  onChange={onChange}
                  defaultValue={values.startDate}
                />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes('endDate')}
              >
                <label>End Date</label>
                <Input
                  fluid
                  name="endDate"
                  type="date"
                  value={values.endDate || ''}
                  onChange={onChange}
                />
              </Form.Field>
            </Form.Group>
            <div>
              <br />
              <Divider horizontal>Policy Details</Divider>
              <PolicyDetails
                policyDetails={policyDetails}
                newProperties={newProperties}
                setNewProperties={setNewProperties}
                setPolicyDetails={setPolicyDetails}
                setValues={setValues}
              />{' '}
            </div>
            <br />
            <Divider horizontal>Basic Premium Details</Divider>
            <br />
            <Form.Group widths="equal">
              <Form.Field
                required
                error={errors.errorPaths.includes('premiumType')}
              >
                <label>Premium Type</label>
                <Input name="basicPremium" fluid value="Basic Pemium" />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes('minimumPremiumAmount')}
              >
                <label>Minimum Premium Amount</label>
                {amendment === 'deletion' ? (
                  <Input
                    fluid
                    name="minimumPremiumAmount"
                    label="-"
                    type="number"
                    onChange={onChange}
                    defaultValue={values?.minimumPremiumAmount}
                  />
                ) : (
                  <Input
                    fluid
                    name="minimumPremiumAmount"
                    type="number"
                    onChange={onChange}
                    defaultValue={values?.minimumPremiumAmount || ''}
                  />
                )}
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes('commissionRate')}
              >
                <label>Commission Rate</label>
                <Input
                  fluid
                  placeholder="Commission Rate"
                  name="commissionRate"
                  type="number"
                  step="any"
                  onChange={onChange}
                  defaultValue={values?.commissionRate}
                />
              </Form.Field>
            </Form.Group>
            <br />
            <Divider horizontal>Additional Benefits</Divider>
            <br />
            <AdditionalBenefits
              policy={data}
              insuranceClass={values.insuranceClass}
              newBenefits={newBenefits}
              setNewBenefits={setNewBenefits}
              polOptions={polOptions}
              isLoading={polOptionsLoading}
            />

            <br />
            <Divider horizontal>Additional Levies</Divider>
            <br />
            <AdditionalLevies
              polOptions={polOptions}
              polOptionsLoading={polOptionsLoading}
              addLevies={addLevies}
              setAddLevies={setAddPremiums}
            />

            <br />
            <Divider horizontal>Totals</Divider>
            <br />
            <Form.Group widths="equal">
              <Form.Field width="11">
                <label>Net Premium</label>
                <Label size="large">
                  {calculated.netPremium
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </Label>
              </Form.Field>
              <Form.Field>
                <label>Total Levies</label>

                <Label size="large">
                  {calculated.totalLevies
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </Label>
              </Form.Field>
              <Form.Field>
                <label>Gross Premium</label>
                <Label size="large">
                  {calculated.grossPremium
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </Label>
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes('policyCommissionRate')}
              >
                <label>Commission Rate (%)</label>
                <Input
                  fluid
                  placeholder="commission Rate"
                  name="policyCommissionRate"
                  type="number"
                  onChange={onChange}
                  value={
                    values.policyCommissionRate
                      ? values.policyCommissionRate
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : ''
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Gross Commission</label>
                <Label size="large">
                  {calculated.grossCommission
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </Label>
              </Form.Field>
              <Form.Field>
                <label>Withholding Tax</label>
                <Label size="large">
                  {calculated.withholdingTax
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </Label>
              </Form.Field>
              <Form.Field>
                <label>Net Commission</label>
                <Label size="large">
                  {calculated.netCommission
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </Label>
              </Form.Field>
            </Form.Group>
            <Divider horizontal>Remarks</Divider>
            <CKEditor
              editor={ClassicEditor}
              data={values.remarks}
              onChange={(event, editor) => {
                const data = editor.getData();
                setValues({ ...values, remarks: data });
              }}
            />
            <Divider horizontal>...</Divider>
            <Button type="submit" primary>
              Preview Policy
            </Button>
          </Form>
        </Grid.Column>
      </Grid>
      {!!openModal && (
        <PolicyPreview
          openModal={openModal}
          setOpenModal={setOpenModal}
          setResponseErrors={setResponseErrors}
          setLoading={setLoading}
          values={values}
          policyOpts={polOptions.motorPolicyOptions}
          premiumsData={{
            additionalPremiums: Object.values(addLevies),
            additionalBenefits: Object.values(newBenefits),
            premiums: calculated,
          }}
          clientsData={clientsData}
          amendment={amendment}
        />
      )}
    </Container>
  );
}
