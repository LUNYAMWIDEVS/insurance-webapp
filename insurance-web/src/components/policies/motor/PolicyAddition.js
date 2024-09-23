import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Grid,
  Container,
  Header,
  Icon,
  Form,
  Input,
  Button,
  Divider,
  Message,
  Modal,
  Tab,
  Menu,
  Item,
  Segment,
  Label,
} from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import * as yup from "yup";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { MotorPolicyContext } from "../../../context/policy/motor";
import {
  GET_MOTOR_POLICY,
  GET_MOTOR_POLICY_OPTS,
  POLICY_ADDITION,
} from "../queries";
import PremiumTypes from "../premiumTypes";
import { GET_CLIENT_QUERY } from "../../clients/queries";
import PremiumDetails from "./motorPolicyComponents/PremiumDetails";
import MotorPolicyDetails from "./motorPolicyComponents/MotorPolicyDetails";

export default function PolicyAddition({ props }) {
  const policyId = props.computedMatch.params.policyId;

  const [responseErrors, setResponseErrors] = useState([]);
  const [errors, setErrors] = useState({
    errorPaths: [],
    errors: [],
  });
  const [policyOpts, setPolicyOpts] = useState();
  const [addBenefits, setAddBenefits] = useState({});
  const [addPremiums, setAddPremiums] = useState({});
  const [policyFields, setPolicyFields] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [fieldSet, setFieldSet] = useState([]);

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
    afterSubmit: false,
    done: false,
    fetched: false,
    updated: false,
    id: "",
    debitNoteNo: "",
    policyNo: "",
    individualClient: "",
    transactionDate: "",
    insuranceCompany: "",
    startDate: "",
    endDate: "",
    renewalDate: "",
    minimumPremiumAmount: null,
    value: null,
    insuranceClass: "",
    transactionType: "", //Addition
    remarks: "",
    commissionRate: 3.75,
    premiumType: "Basic Premium",
    withholdingTax: 10,
    additionalBenefits: {},
    additionalPremiums: {},
    policyDetails: [],
    policyDetailSet: [],
    fields: [],
    fieldSet: [],
  });
  const [additionalFetched, setAdditionalFetched] = useState(false);
  const [addPremiumCount, setAddPremiumCount] = useState([1]);
  const [addBenefitCount, setAddBenefitCount] = useState([0]);
  const [endorsed, setEndorsed] = useState(false);
  const [policyDetailSet, setPolicyDetailSet] = useState([]);
  const [fieldsIdLookUp, setFieldsIdLookUp] = useState({});

  let schema = yup.object().shape({
    debitNoteNo: yup.string().required(""),
    insuranceClass: yup.string().required(""),
    transactionDate: yup.date().required(""),
    startDate: yup.date().required(""),
    endDate: yup.date().required(""),
    minimumPremiumAmount: yup.number().required(""),
    commissionRate: yup.number().required(""),
    policyCommissionRate: yup.number().required(""),
  });

  const context = useContext(MotorPolicyContext);
  let history = useHistory();
  const policyDetailSetCount = [1];

  const validate = useCallback(
    (values) => {
      schema
        .validate(values, { abortEarly: false })
        .then((valid) => setErrors({ errorPaths: [], errors: [] })) //called if the entire form is valid
        .catch((err) => {
          setErrors({
            errors: err.errors,
            errorPaths: err.inner.map((i) => i.path),
          });
        });
    },
    [schema]
  );
  const { data: motorPolicyData } = useQuery(GET_MOTOR_POLICY, {
    variables: { id: policyId },
  });

  useEffect(() => {
    if (!values.fetched && motorPolicyData) {
      console.log("motorpolicy", motorPolicyData);
      let data = motorPolicyData.motorPolicy;
      let currentAddBen = {};
      let currentAddPrem = {};
      let currentPolicyFields = {};
      let fieldsArray = [];
      let fieldIds = {};

      data.additionalBenefits.forEach((benefit, key) => {
        let fieldName;
        if (data.premiums.AdditionalBenefits[key]) {
          fieldName = data.premiums.AdditionalBenefits[key].name;
        }
        currentAddBen[key + 1] = {
          benefit: benefit.benefit,
          commissionRate: benefit.commissionRate,

          minimumAmount: fieldName.toUpperCase().includes(benefit.benefit)
            ? data.premiums.AdditionalBenefits[key].amount
            : benefit.amount,
        };
      });
      // filtering out the stamp duty
      //    .filter((premium) => premium.premium !== "STAMPD")

      data.additionalPremiums.forEach((premium, key) => {
        currentAddPrem[key + 1] = {
          premium: premium.premium,
          commissionRate: premium.commissionRate,
          minimumAmount: data.premiums.AdditionalPremiums[key].name.includes(
            premium.premium.split("LEVY")[0]
          )
            ? data.premiums.AdditionalPremiums[key].amount
            : premium.minimumAmount,
        };
      });

      setAddPremiums(currentAddPrem);
      setAddBenefits(currentAddBen);
      let newSet = {};

      data.policyDetailSet.forEach((item) => {
        item.fields.forEach((item) => {
          fieldIds[item.field.field] = item.field.id;
          currentPolicyFields[item.field.field] = item.value;
          let id = item.field.id;
          newSet[id] = { field: item.field.field, value: item.value };
        });
      });

      setFieldsIdLookUp(fieldIds);
      setPolicyFields(currentPolicyFields);
      setFieldSet(newSet);

      let individualClient = data.individualClient
        ? data.individualClient.id
        : null;
      let insuranceCompany = data.insuranceCompany
        ? data.insuranceCompany.name
        : null;

      if (!additionalFetched) {
        let additionalBens = data.additionalBenefits.length;
        let additionalPrems = data.additionalPremiums.length;
        let newAddBen = [];
        let newAddPrem = [];
        for (let i = 1; i <= additionalBens; i++) {
          newAddBen.push(i);
        }
        for (let i = 1; i <= additionalPrems; i++) {
          newAddPrem.push(i);
        }
        setAddBenefitCount(newAddBen);
        setAddPremiumCount(newAddPrem);
        setAdditionalFetched(true);
      }
      setValues({
        ...values,
        ...data,
        fetched: true,
        minimumPremiumAmount: data.premiums
          ? data.premiums.basicPremium.amount
          : null,
        insuranceCompany,
        individualClient,
        ...data.vehicleDetails,
        id: policyId,
        transactionType: "Renewal",
        fieldSet: data.policyDetailSet.fields,
      });
    }
  }, [motorPolicyData, values, policyId, addPremiums, addBenefits]);


  useEffect(() => {
    let val = 0;

    Object.entries(policyFields).forEach(([k, v]) => {
      if (!k.startsWith("-") && Number(v["field"]) === 0) {
        val = Number(v.value);
      }
    });

    if (values.minimumPremiumAmount && val && calculated.updated) {
      let data = {};
      let netPremium = ((+values.commissionRate / 100) * +val).toFixed(0);
      if (+values.minimumPremiumAmount > +netPremium) {
        netPremium = parseFloat(values.minimumPremiumAmount).toFixed(0);
      }
      let grossPremium = netPremium;
      for (const [key, value] of Object.entries(addBenefits)) {
        let amount = 0;
        if (!value.commissionRate && value.benefit && value.minimumAmount) {
          amount = value.minimumAmount;
          grossPremium = +amount + +grossPremium;
        }
        if (value.benefit && value.commissionRate && value.minimumAmount) {
          amount = parseFloat(
            (grossPremium * +value.commissionRate) / 100
          ).toFixed(0);
          if (+value.minimumAmount > +amount) {
            amount = +value.minimumAmount;
          }
          grossPremium = +amount + +grossPremium;
          addBenefits[key].amount = +amount;
        }
        netPremium = +amount + +netPremium;
      }
      data["netPremium"] = netPremium;
      let totalLevies = 0;
      for (const [key, value] of Object.entries(addPremiums)) {
        let amount = 0;
        if (!value.commissionRate) {
          amount = value.minimumAmount;
        }
        if (value.commissionRate) {
          amount = parseFloat(
            (grossPremium * +value.commissionRate) / 100
          ).toFixed(0);
          grossPremium = +amount + +grossPremium;
          addPremiums[key].amount = amount;
        }
        if (
          !value.commissionRate &&
          values.transactionType &&
          values.transactionType === "NEW"
        ) {
          grossPremium = +value.minimumAmount + +grossPremium;
        }
        totalLevies += parseInt(amount);
      }
      data["grossPremium"] = grossPremium;
      data["totalLevies"] = totalLevies;
      if (values.policyCommissionRate) {
        let grossCommission = (
          (netPremium * parseFloat(values.policyCommissionRate)) /
          100
        ).toFixed(0);
        let withholdingTax = (grossCommission * 0.1).toFixed(0);
        let netCommission = +grossCommission - +withholdingTax;
        data["grossCommission"] = grossCommission;
        data["withholdingTax"] = withholdingTax;
        data["netCommission"] = netCommission;
      }
      setCalculated({ ...calculated, ...data, updated: false });
    } else if (!val && values.minimumPremiumAmount && calculated.updated) {
      let data = {};
      let netPremium = values.minimumPremiumAmount;
      if (+values.minimumPremiumAmount > +netPremium) {
        netPremium = parseFloat(values.minimumPremiumAmount).toFixed(0);
      }
      let grossPremium = netPremium;
      for (const [key, value] of Object.entries(addBenefits)) {
        let amount = 0;
        if (!value.commissionRate && value.benefit && value.minimumAmount) {
          amount = value.minimumAmount;
          grossPremium = +amount + +grossPremium;
        }
        if (value.benefit && value.commissionRate && value.minimumAmount) {
          amount = parseFloat(
            (grossPremium * +value.commissionRate) / 100
          ).toFixed(0);
          if (+value.minimumAmount > +amount) {
            amount = +value.minimumAmount;
          }
          grossPremium = +amount + +grossPremium;
          addBenefits[key].amount = +amount;
        }
        netPremium = +amount + +netPremium;
      }
      data["netPremium"] = netPremium;
      let totalLevies = 0;
      for (const [key, value] of Object.entries(addPremiums)) {
        let amount = 0;
        if (!value.commissionRate) {
          amount = value.minimumAmount;
        }
        if (value.commissionRate) {
          amount = parseFloat(
            (grossPremium * +value.commissionRate) / 100
          ).toFixed(0);
          grossPremium = +amount + +grossPremium;
          addPremiums[key].amount = amount;
        }
        if (
          !value.commissionRate &&
          values.transactionType &&
          values.transactionType === "NEW"
        ) {
          grossPremium = +value.minimumAmount + +grossPremium;
        }
        totalLevies += parseInt(amount);
      }
      data["grossPremium"] = grossPremium;
      data["totalLevies"] = totalLevies;
      if (values.policyCommissionRate) {
        let grossCommission = (
          (netPremium * parseFloat(values.policyCommissionRate)) /
          100
        ).toFixed(0);
        let withholdingTax = (grossCommission * 0.1).toFixed(0);
        let netCommission = +grossCommission - +withholdingTax;
        data["grossCommission"] = grossCommission;
        data["withholdingTax"] = withholdingTax;
        data["netCommission"] = netCommission;
      }
      setCalculated({ ...calculated, ...data, updated: false });
    }
  }, [calculated, values, addPremiums, addBenefits]);

  // fetch policy options data
  const { data: policyOptsData } = useQuery(GET_MOTOR_POLICY_OPTS);
  useEffect(() => {
    if (policyOptsData) {
      setPolicyOpts(policyOptsData.motorPolicyOptions);
    }
  }, [policyOptsData, policyOpts]);

  //fetch clients data
  const { data: clientsData } = useQuery(GET_CLIENT_QUERY, {
    variables: values.individualClient ? { id: values.individualClient } : "",
  });

  const onPreview = (event) => {
    event.preventDefault();
    validate(values);
    setValues({ ...values, afterSubmit: true });
    setOpenModal(true);
    if (Object.keys(values).length > 7 && !errors.errors.length) {
      setOpenModal(true);
    }
    setEndorsed(true);
  };

  let additionValues;

  // takes a value and returns its key as in the policyOPts object
  const getPolicyOptionKey = (optionsObject, value) => {
    return Object.entries(optionsObject).filter(
      (item) => item[1] === value
    )[0][0];
  };

  if (endorsed && values && policyOpts) {
    const premiumTypeOption = getPolicyOptionKey(
      policyOpts.premium_type_options,
      values.premiumType
    );
    const transactionTypeOption = getPolicyOptionKey(
      policyOpts.transaction_type_options,
      values.transactionType
    );

    const {
      policyNo,
      debitNoteNo,
      transactionDate,
      startDate,
      endDate,
      renewalDate,
      minimumPremiumAmount,
      remarks,
      commissionRate,
      policyCommissionRate,
      additionalBenefits,
      additionalPremiums,
      withholdingTax,
      fieldSet,
    } = values;

    additionValues = {
      policyNo,
      debitNoteNo,
      transactionDate,
      startDate,
      endDate,
      renewalDate,
      minimumPremiumAmount,
      transactionType: transactionTypeOption,
      remarks,
      commissionRate,
      premiumType: premiumTypeOption,
      policyCommissionRate,
      policyId: policyId,
      calculated,
      additionalBenefits,
      additionalPremiums,
      withholdingTax,
      fieldSet,
      value: policyFields["value"],
    };
  }

  const onChange = useCallback(
    (event, { name, value }) => {
      setValues({ ...values, [name]: value, updated: true });
      setCalculated({ ...calculated, updated: true });
    },
    [values, calculated]
  );

  const [policyAddition, { loading }] = useCallback(
    useMutation(POLICY_ADDITION, {
      update(_, result) {
        
        context.endorsePolicyAddition(result.data);
        let pol = result.data.createPolicyAddition.policyAddition;

        context.endorsePolicyAddition(
          result.data.createPolicyAddition.policyAddition
        );
        history.push({
          pathname: `/staff/dashboard/policies/general/motor/details/${pol.policy.id}`,
          state: { motorPolicy: pol },
        });
      },
      onError(err) {
        console.log(
          err.graphQLErrors && err.graphQLErrors[0]
            ? err.graphQLErrors[0].message
            : err.networkError && err.networkError.result
            ? err.networkError.result.errors
            : err
        );
        try {
          if (err.networkError.result) {
            setResponseErrors(err.networkError.result.errors[0].message);
          }
          if (err.graphQLErrors) {
            setResponseErrors(err.graphQLErrors[0].message);
          }

          if (err.networkError !== null && err.networkError !== "undefined") {
            setResponseErrors(err.networkError.result.errors[0]);
          } else if (
            err.graphQLErrors !== null &&
            err.networkError !== "undefined"
          ) {
            setResponseErrors(err.graphQLErrors.result.errors[0]);
          }
        } catch (e) {
          console.log(e);
        }
      },
      variables: additionValues,
    })
  );

  const handleOnAddPremTypesChange = (e, { value }) => {
    e.preventDefault();
    let key = e.target.name ? e.target.id : value.split("_")[1];
    if (!e.target.name) {
      let data = { premium: value.split("_")[0] };
      if (Object.keys(addPremiums).length > 0) {
        setAddPremiums((prevAddPrem) => ({
          ...prevAddPrem,
          [key]: { ...prevAddPrem[key], ...data },
        }));
      } else {
        let newPrem = { ...addPremiums, [key]: data };
        setAddPremiums(newPrem);
      }
    } else {
      if (Object.keys(addPremiums).length > 0) {
        let data = { [e.target.name]: value };
        setAddPremiums((prevAdsPrem) => ({
          ...prevAdsPrem,
          [key]: { ...prevAdsPrem[key], ...data },
        }));
      } else {
        let newVal = {
          ...addPremiums,
          [key]: { ...addPremiums[key], [e.target.name]: value },
        };
        setAddPremiums(newVal);
      }
    }
    setValues({ ...values, updated: true });
  };

  const handleRemoveAdditionalPremium = useCallback(
    (event) => {
      event.preventDefault();
      const newArr = addPremiumCount.filter(
        (e) => e !== Number(event.target.id)
      );
      setAddPremiumCount(newArr);
      if (Object.keys(addPremiums).length > 0) {
        delete addPremiums[event.target.id];
      }
    },
    [addPremiums, addPremiumCount]
  );

  const handleAddAdditionalBenefit = useCallback(
    (e) => {
      e.preventDefault();
      if (addBenefitCount.length) {
        setAddBenefitCount([
          ...addBenefitCount,
          addBenefitCount[addBenefitCount.length - 1] + 1,
        ]);
      } else {
        setAddBenefitCount([1]);
      }
    },
    [addBenefitCount]
  );

  const handleOnAddBenefitTypesChange = (e, { value }) => {
    e.preventDefault();
    let key = e.target.name ? e.target.id : value.split("_")[1];
    if (!e.target.name) {
      let data = { benefit: value.split("_")[0], amount: 0 };
      if (Object.keys(addBenefits).length > 0) {
        setAddBenefits((prevAddBen) => ({
          ...prevAddBen,
          [key]: { ...prevAddBen[key], ...data },
        }));
      } else {
        let newBenefit = { ...addBenefits, [key ? key : 0]: data };
        setAddBenefits(newBenefit);
      }
    } else {
      if (Object.keys(addBenefits).length > 0) {
        let data = { [e.target.name]: value, amount: 0 };
        setAddBenefits((prevAddBen) => ({
          ...prevAddBen,
          [key]: { ...prevAddBen[key], ...data },
        }));
      } else {
        let newVal = {
          ...addBenefits,
          [key]: { ...addBenefits[key], [e.target.name]: value, amount: 0 },
        };
        setAddBenefits(newVal);
      }
    }
    setValues((values) => {
      return {
        ...values,
        updated: true,
        additionalBenefits: Object.values(addBenefits),
      };
    });
    setCalculated({ ...calculated, updated: true });
  };

  const handleRemoveAdditionalBenefit = useCallback(
    (event) => {
      event.preventDefault();
      const newArr = addBenefitCount.filter(
        (e) => e !== Number(event.target.id)
      );
      setAddBenefitCount(newArr);
      if (Object.keys(addBenefits).length > 0) {
        delete addBenefits[event.target.id];
      }
      setValues({ ...values, updated: true });
      setCalculated({ ...calculated, updated: true });
    },
    [addBenefitCount, addBenefits, calculated, values]
  );

  const handleOnPolicyFieldSetChange = (e, { value }) => {
    e.preventDefault();
    let key = e.target.name ? e.target.id : value;

    if (!e.target.name) {
      let data = { field: value, value: e.target.value };
      if (Object.keys(fieldSet).length > 0) {
        setFieldSet((prevPolicyField) => ({
          ...prevPolicyField,
          [key]: { ...prevPolicyField[key], ...data },
        }));
      } else {
        let newField = { ...fieldSet, [key ? key : 0]: data };
        setFieldSet(newField);
      }
    } else {
      if (Object.keys(fieldSet).length > 0) {
        
        let data = { field: e.target.name, value: e.target.value };
        setFieldSet((prevPolicyField) => ({
          ...prevPolicyField,
          [key]: { ...prevPolicyField[key], ...data },
        }));
      } else {
        let newVal = {
          ...fieldSet,
          [key]: { ...fieldSet[key], [e.target.name]: value },
        };
       
        setFieldSet(newVal);
      }
    }
   
    setValues({ ...values, updated: true });
    setCalculated({ ...calculated, updated: true });
  };

  useEffect(() => {
    if (values.updated) {
      const polDetails = [];
      const fieldSetArray = [];

      const polDetailSet = [];

      const pickFields = [];
      const pickValues = [];

      Object.entries(fieldSet).forEach(([k, v]) => {
        if (k.startsWith("-")) {
          pickFields.push(k);
          pickValues.push(v.value);
        } else {
          pickValues.push(v.value);
        }

        Object.keys(pickFields).forEach((i) => {
          fieldSetArray[i] = Object.assign({
            field: pickFields[i],
            value: pickValues[i],
          });
        });
      });
      Object.entries(fieldSet).forEach(([k, v]) => {
        policyFields[v.field] = v.value;
      });
      const polId = values.policyDetailSet[0]?.name;

      if (polId) {
        polDetailSet[polId.id] = Object.assign(
          { name: polId.id },
          { fields: fieldSetArray }
        );
      }
      setValues({
        ...values,
        fieldSet: Object.values(fieldSet),
        policyDetails: polDetails,
        additionalBenefits: Object.values(addBenefits),
        additionalPremiums: Object.values(addPremiums),
        updated: false,
      });
      if (values.afterSubmit) {
        validate(values);
      }
      setOpenModal(false);
    }
  }, [values, addBenefits, addPremiums, validate]);


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
                fieldSet={fieldSet}
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
                policy={values}
                policyOpts={policyOpts}
                additionalPremiums={Object.values(addPremiums)}
                additionalBenefits={Object.values(addBenefits)}
                commissionRate={values.commissionRate}
                minimumPremiumAmount={values.minimumPremiumAmount}
                premiums={calculated}
              />
            }
          </Tab.Pane>
        );
      },
    },
  ];

  //the form
  return (
    <Container>
      <Grid container padded columns={2}>
        <Grid.Column>
          <div className="content-wrapper">
            <Header as="h3">
              <Icon name="settings" />
              <Header.Content>
                <a href="/staff/dashboard/overview">Policy Records</a> {">"}{" "}
                <a href="/staff/dashboard/policies/general/motor">Policies</a>{" "}
                {">"}{" "}
                <Link
                  to={`/staff/dashboard/policies/general/motor/details/${policyId}`}
                >
                  {" "}
                  Policy{" "}
                </Link>{" "}
                {">"} Policy Addition
                <Header.Subheader>
                  Fill this form to make an addition to a policy
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
            className={loading ? "loading" : ""}
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
              <Form.Field
                required
                error={errors.errorPaths.includes("individualClient")}
              >
                <label>Client</label>
                <Input
                  fluid
                  name="clientName"
                  value={
                    clientsData
                      ? `${clientsData.individualClient.firstName} ${clientsData.individualClient.lastName} [${clientsData.individualClient.email}]`
                      : ""
                  }
                />
              </Form.Field>
              <Form.Field required>
                <label>Policy Number</label>
                <Input fluid name="policyNo" value={values.policyNo} />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("debitNoteNo")}
              >
                <label>Debit Note Number</label>
                <Input
                  fluid
                  placeholder="Debit Note Number"
                  name="debitNoteNo"
                  onChange={onChange}
                  value={values.debitNoteNo}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                required
                error={errors.errorPaths.includes("insuranceCompany")}
              >
                <label>Insurance Company</label>
                <Input
                  fluid
                  name="insuranceCo"
                  value={values.insuranceCompany}
                />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("transactionType")}
              >
                <label>Transaction Type</label>

                <Input
                  fluid
                  name="transactionType"
                  value={values.transactionType}
                />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("insuranceClass")}
              >
                <label>Insurance class</label>
                {policyOpts && policyOpts.insurance_class_options && (
                  <Input
                    fluid
                    name="insurance class"
                    value={values.insuranceClass}
                  />
                )}
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field required>
                <label> Transaction Date</label>
                <Input
                  fluid
                  name="transactionDate"
                  type="date"
                  onChange={onChange}
                  value={values.transactionDate}
                />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("startDate")}
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
                error={errors.errorPaths.includes("endDate")}
              >
                <label>End Date</label>
                <Input
                  fluid
                  name="endDate"
                  type="date"
                  value={values.endDate}
                  onChange={onChange}
                />
              </Form.Field>
            </Form.Group>
            <div>
              <br />
              <Divider horizontal>Policy Details</Divider>

              {policyDetailSetCount.map((key) => (
                <Grid.Column key={key} width={8}>
                  <Form.Group widths="equal" key={key}>
                    <Form.Field>
                      <label>Policy Type</label>
                      <Input
                        fluid
                        name="policyType"
                        value={
                          values.policyDetailSet[0]
                            ? values.policyDetailSet[0].name.name
                            : ""
                        }
                      />
                    </Form.Field>
                  </Form.Group>
                  <div className="ui equal width grid">
                    <div className="column">
                      {fieldSet &&
                        Object.entries(fieldSet)
                          .slice(0, 4)
                          .map(([k, v]) => (
                            <div key={k} className="ui ">
                              <Form.Field inline>
                                <label>{v.field}</label>
                                <Input
                                  fluid
                                  name={v.field}
                                  id={k}
                                  value={v.value}
                                  onChange={handleOnPolicyFieldSetChange}
                                />
                              </Form.Field>{" "}
                            </div>
                          ))}
                    </div>
                    <div className=" column">
                      {fieldSet &&
                        Object.keys(fieldSet).length > 8 &&
                        Object.entries(fieldSet)
                          .slice(4, 8)
                          .map(([k, v]) => (
                            <div key={k} className="ui ">
                              <Form.Field inline>
                                <label>{v.field}</label>
                                <Input
                                  fluid
                                  name={v.field}
                                  id={k}
                                  value={v.value}
                                  onChange={handleOnPolicyFieldSetChange}
                                />
                              </Form.Field>{" "}
                            </div>
                          ))}
                    </div>
                    <div className="column">
                      {policyFields &&
                        Object.keys(fieldSet).length > 8 &&
                        Object.entries(fieldSet)
                          .slice(8, Object.keys(fieldSet).length)
                          .map(([k, v]) => (
                            <div key={k} className="ui ">
                              <Form.Field inline>
                                <label>{v.field}</label>
                                <Input
                                  fluid
                                  name={v.field}
                                  id={k}
                                  value={v.value}
                                  onChange={handleOnPolicyFieldSetChange}
                                />
                              </Form.Field>{" "}
                            </div>
                          ))}
                    </div>
                  </div>
                </Grid.Column>
              ))}
            </div>
            <br />
            <Divider horizontal>Basic Premium Details</Divider>
            <br />
            <Form.Group widths="equal">
              <Form.Field
                required
                error={errors.errorPaths.includes("premiumType")}
              >
                <label>Premium Type</label>
                {policyOpts && policyOpts.premium_type_options && (
                  <Input name="basicPremium" fluid value={values.premiumType} />
                )}
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("minimumPremiumAmount")}
              >
                <label>Minimum Premium Amount</label>
                <Input
                  fluid
                  name="minimumPremiumAmount"
                  label="+"
                  type="number"
                  onChange={onChange}
                  placeholder="0"
                />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("commissionRate")}
              >
                <label>Commission Rate</label>
                <Input
                  fluid
                  placeholder="Commission Rate"
                  name="commissionRate"
                  type="number"
                  step="any"
                  onChange={onChange}
                  value={values.commissionRate}
                />
              </Form.Field>
            </Form.Group>
            <br />
            <Divider horizontal>Additional Benefits</Divider>
            <Form.Group widths="equal">
              <Form.Field>
                <Button
                  icon
                  floated="right"
                  onClick={handleAddAdditionalBenefit}
                >
                  <Icon name="plus square outline" />
                </Button>
              </Form.Field>
            </Form.Group>
            <br />
            {addBenefitCount.map((key) => (
              <Form.Group widths="equal" key={key}>
                <Form.Field>
                  <label>Additional Benefit Type</label>
                  {policyOpts && policyOpts.additional_benefit_options && (
                    <PremiumTypes
                      premiumTypes={policyOpts.additional_benefit_options}
                      placeholder="Select Additional Benefit Type"
                      id={key}
                      selected={
                        addBenefits[key] ? addBenefits[key].benefit : ""
                      }
                      handleOnPremiumTypesChange={handleOnAddBenefitTypesChange}
                    />
                  )}
                </Form.Field>
                <Form.Field>
                  <label>Minimum Benefit Amount</label>
                  <Input
                    fluid
                    placeholder="Minimum Additional Benefit Amount"
                    id={key}
                    name="minimumAmount"
                    type="number"
                    onChange={handleOnAddBenefitTypesChange}
                    value={
                      addBenefits[key] && addBenefits[key].minimumAmount
                        ? addBenefits[key].minimumAmount
                        : ""
                    }
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
                        id={key}
                        onChange={handleOnAddBenefitTypesChange}
                        value={
                          addBenefits[key] && addBenefits[key].commissionRate
                            ? addBenefits[key].commissionRate
                            : ""
                        }
                      />
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <Button
                        id={key}
                        key={key}
                        icon
                        floated="right"
                        onClick={handleRemoveAdditionalBenefit}
                        size="small"
                      >
                        <Icon name="trash alternate" id={key} key={key} />
                      </Button>
                    </Grid.Column>
                  </Grid>
                </Form.Field>
              </Form.Group>
            ))}
            <br />
            <Divider horizontal>Additional Levies</Divider>
            <br />
            {addPremiumCount.map((key) => (
              <Form.Group widths={2} key={key}>
                <Form.Field>
                  <label>Levy Type</label>
                  {policyOpts && policyOpts.premium_type_options && (
                    <Input
                      fluid
                      name="premiumType"
                      value={
                        policyOpts.premium_type_options[
                          addPremiums[key]?.premium
                        ]
                      }
                    />
                  )}
                </Form.Field>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Form.Field>
                  <label>Minimum Premium Amount</label>
                  <Input
                    fluid
                    placeholder="Minimum Premium Amount"
                    name="minimumAmount"
                    type="number"
                    id={key}
                    onChange={handleOnAddPremTypesChange}
                    value={
                      addPremiums[key] && addPremiums[key].minimumAmount
                        ? addPremiums[key].minimumAmount
                        : ""
                    }
                  />
                </Form.Field>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {addPremiums[key]?.commissionRate ? (
                  <Form.Field>
                    <label className="ui center aligned">Levy Rate (%)</label>
                    <Input
                      fluid
                      placeholder="Levy Rate"
                      name="commissionRate"
                      type="number"
                      step="any"
                      id={key}
                      onChange={handleOnAddPremTypesChange}
                      value={
                        addPremiums[key] ? addPremiums[key].commissionRate : ""
                      }
                    />
                  </Form.Field>
                ) : (
                  <Form.Field></Form.Field>
                )}
                <Form.Field>
                  <label className="ui center aligned">Levy Amount</label>
                  <Grid>
                    <Grid.Row centered width={4}>
                      <Label size="large">
                        {addPremiums[key] && addPremiums[key].amount
                          ? addPremiums[key].amount
                          : addPremiums[key]?.minimumAmount
                          ? addPremiums[key].minimumAmount
                          : "0"}
                      </Label>
                    </Grid.Row>
                  </Grid>
                </Form.Field>
              </Form.Group>
            ))}

            <br />
            <Divider horizontal>Totals</Divider>
            <br />
            <Form.Group widths="equal">
              <Form.Field width="11">
                <label>Net Premium</label>
                <Label size="large">
                  {calculated.netPremium
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Label>
              </Form.Field>
              <Form.Field>
                <label>Total Levies</label>
                <Label size="large">
                  {calculated.totalLevies
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Label>
              </Form.Field>
              <Form.Field>
                <label>Gross Premium</label>
                <Label size="large">
                  {calculated.grossPremium
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Label>
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("policyCommissionRate")}
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
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Gross Commission</label>
                <Label size="large">
                  {calculated.grossCommission
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Label>
              </Form.Field>
              <Form.Field>
                <label>Withholding Tax</label>
                <Label size="large">
                  {calculated.withholdingTax
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Label>
              </Form.Field>
              <Form.Field>
                <label>Net Commission</label>
                <Label size="large">
                  {calculated.netCommission
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
      {!!calculated.netCommission && (
        <Modal
          dimmer={"blurring"}
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
                policyAddition();
                setOpenModal(false);
                setResponseErrors([]);
              }}
            >
              Endorse
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </Container>
  );
}
