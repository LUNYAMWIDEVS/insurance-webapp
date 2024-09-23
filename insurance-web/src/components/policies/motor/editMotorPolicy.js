import React, { useState, useContext, useEffect, useCallback } from "react";
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
} from "semantic-ui-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { MotorPolicyContext } from "../../../context/policy/motor";
import {
  DELETE_ADDITIONAL_PREM,
  DELETE_ADDITIONAL_BEN,
  UPDATE_MOTOR_POLICY,
  DELETE_MOTOR_POLICY,
  GET_MOTOR_POLICY,
  GET_MOTOR_POLICY_OPTS,
  FETCH_INSURANCE_COMP,
  GET_POLICY_TYPES,
} from "../queries";
import Clients from "../listClients";
import TransactionTypes from "../transactionTypes";
import PremiumTypes from "../premiumTypes";
import InsuranceCompanies from "../listInsuranceComps";
import { FETCH_CLIENTS_QUERY } from "../../clients/queries";
import * as yup from "yup";
import { Link, useHistory } from "react-router-dom";
import FieldsDropdown from "../listPolicyDetails";
import PolicyTypes from "../listPolicyTypes";
import DeleteModal from "../../modals/deletionModal";

export default function EditMotorPolicy({ props }) {
  const policyId = props.computedMatch.params.policyId;
  const [errors, setErrors] = useState({
    errorPaths: [],
    errors: [],
  });
  const [motorPolicy, setMotorPolicy] = useState({});
  let history = useHistory();

  const [responseErrors, setResponseErrors] = useState([]);
  const context = useContext(MotorPolicyContext);
  const [clients, setClients] = useState();
  const [toDelete, setToDelete] = useState({
    additionalPremiums: [],
    additionalBenefits: [],
    id: [],
  });
  const [policyOpts, setPolicyOpts] = useState();
  const [deleteBenItem, setDeleteBenItem] = useState({
    id: [],
    deleted: false,
  });
  const [deletePremItem, setDeletePremItem] = useState({
    id: [],
    deleted: false,
  });
  const [insuranceCos, setInsuranceCos] = useState();
  const [addBenefits, setAddBenefits] = useState({});
  const [addBenefitCount, setAddBenefitCount] = useState([1]);
  const [additionalFetched, setAdditionalFetched] = useState(false);
  const [addPremiumCount, setAddPremiumCount] = useState([1]);
  const [addPremiums, setAddPremiums] = useState({});
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState({ search: "" });
  const [usersFetched, setUsersFetched] = useState(false);
  const [typeSet, setTypeSet] = useState();
  const [detailSet, setDetailSet] = useState();
  const [policyDetails, setPolicyDetails] = useState([]);
  const [policyDetailSet, setPolicyDetailSet] = useState([]);
  const [fields, setPolicyFields] = useState([]);
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
  const [policyDetailsCount, setPolicyDetailsCount] = useState([0]);
  const [policyDetailSetCount, setPolicyDetailSetCount] = useState([0]);
  const [fieldsCount, setPolicyFieldsCount] = useState([0]);
  const [deletePolicyDetails, setDeletePolicyDetails] = useState({
    id: [],
    deleted: false,
  });
  const [fieldSetCount, setFieldSetCount] = useState([0]);

  const [values, setValues] = useState({
    afterSubmit: false,
    done: false,
    fetched: false,
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
    transactionType: "",
    remarks: "",
    commissionRate: 3.75,
    premiumType: "BASIC",
    additionalBenefits: {},
    additionalPremiums: {},
    policyDetails: [],
    policyDetailSet: [],
    fields: [],
    fieldSet: [],
  });

  let schema = yup.object().shape({
    policyNo: yup.string().required("Please provide a Policy Number"),
    individualClient: yup.string().nullable("Please select a client"),
    insuranceCompany: yup
      .string()
      .required("Please select an insurance company"),
    insuranceClass: yup.string().required("Please select an insurance class"),
    transactionType: yup.string().required("Please select a transaction type"),
    transactionDate: yup.date().required("Please select a transaction date"),
    startDate: yup.date().required("Please select a start date"),
    endDate: yup.date().required("Please select a end date"),
    premiumType: yup.string().required("Please select a premium type"),
    minimumPremiumAmount: yup
      .number()
      .required("Please provide the minimum premium amount"),
    commissionRate: yup
      .number()
      .required("Please provide the premium commission rate"),
  });

  const { data: motorPolicyData } = useQuery(GET_MOTOR_POLICY, {
    variables: { id: policyId },
  });

  const { data: typeSetData } = useQuery(GET_POLICY_TYPES, {
    variables: { search: search.searchString },
  });
  useEffect(() => {
    if (typeSetData) {
      setTypeSet(typeSetData.policyTypes.items);
    }
  }, [typeSetData, typeSet]);

  useEffect(() => {
    if (!values.fetched && motorPolicyData) {
      let data = motorPolicyData.motorPolicy;
      let currentAddBen = {};
      let currentAddPrem = {};
      let benefitIds = [];
      let premiumIds = [];
      data.additionalBenefits.forEach((benefit, key) => {
        currentAddBen[key + 1] = {
          benefit: benefit.benefit,
          commissionRate: benefit.commissionRate,
          minimumAmount: benefit.minimumAmount,
        };
        benefitIds.push(benefit.id);
      });
      data.additionalPremiums.forEach((premium, key) => {
        currentAddPrem[key + 1] = {
          premium: premium.premium,
          commissionRate: premium.commissionRate,
          minimumAmount: premium.minimumAmount,
        };
        premiumIds.push(premium.id);
      });
      setAddPremiums(currentAddPrem);
      setAddBenefits(currentAddBen);
      setToDelete({
        ...toDelete,
        additionalPremiums: premiumIds,
        additionalBenefits: benefitIds,
      });
      let individualClient = data.individualClient
        ? data.individualClient.id
        : null;
      let corporateClient = data.corporateClient
        ? data.corporateClient.id
        : null;
      let insuranceCompany = data.insuranceCompany
        ? data.insuranceCompany.id
        : null;
      if (!additionalFetched) {
        let addBens = data.additionalBenefits.length;
        let addPrems = data.additionalPremiums.length;
        let newAddBen = [];
        for (let i = 1; i <= addBens; i++) {
          newAddBen.push(i);
        }
        let newAddPrem = [];
        for (let i = 1; i <= addPrems; i++) {
          newAddPrem.push(i);
        }
        setAddBenefitCount(newAddBen);
        setAddPremiumCount(newAddPrem);
        setAdditionalFetched(true);
      }
      setToDelete({ ...toDelete, id: policyId });
      delete data.additionalBenefits;
      delete data.additionalPremiums;
      delete data.individualClient;
      delete data.corporateClient;
      setValues({
        ...values,
        ...data,
        update: true,
        fetched: true,
        insuranceCompany,
        individualClient,
        corporateClient,
        ...data.vehicleDetails,
        id: policyId,
      });
    }
  }, [
    motorPolicyData,
    context,
    addBenefitCount,
    additionalFetched,
    addPremiumCount,
    values,
    policyId,
    toDelete,
  ]);

  const { data: policyOptsData } = useQuery(GET_MOTOR_POLICY_OPTS);
  useEffect(() => {
    if (policyOptsData) {
      setPolicyOpts(policyOptsData.motorPolicyOptions);
    }
  }, [policyOptsData, policyOpts]);

  const { data: insuranceCosData } = useQuery(FETCH_INSURANCE_COMP, {
    variables: { search: search.searchString },
  });
  useEffect(() => {
    if (insuranceCosData) {
      setInsuranceCos(insuranceCosData.insuranceCompanies.items);
    }
  }, [insuranceCosData, insuranceCos]);
  const [deletePrem, { data: deletedPrem }] = useMutation(
    DELETE_ADDITIONAL_PREM,
    {
      onError(err) {
        try {
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
          setVisible(true);
        }
      },
      variables: { id: deletePremItem.id },
    }
  );
  const [deleteBen, { data: deletedBen }] = useMutation(DELETE_ADDITIONAL_BEN, {
    onError(err) {
      try {
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
        setVisible(true);
      }
    },
    variables: { id: deleteBenItem.id },
  });
  useEffect(() => {
    if (deletedPrem) {
      console.log(deletedPrem);
    }
    if (deletedBen) {
      console.log(deletedBen);
    }
  });

  const [fetchClients, { data: clientsData }] = useLazyQuery(
    FETCH_CLIENTS_QUERY,
    {
      variables: search,
    }
  );
  useEffect(() => {
    if (!usersFetched) {
      fetchClients();
    }
    if (clientsData) {
      setClients(clientsData.individualClients.items);
      setUsersFetched(true);
    }
  }, [clientsData, clients, fetchClients, usersFetched]);
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
  const [updatePolicy, { loading }] = useCallback(
    useMutation(UPDATE_MOTOR_POLICY, {
      update(_, result) {
        context.updatePolicy(result.data);
        setVisible(false);

        setMotorPolicy(result.data.updateMotorPolicy.motorPolicy);

        setValues({ ...values, done: true });
      },
      onError(err) {
        try {
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
          setVisible(true);
        }
      },
      variables: values,
    })
  );
  const onChange = useCallback(
    (event) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value,
        updated: true,
      });
    },
    [values]
  );

  const handleOnClientSearch = (e) => {
    setSearch({ search: e.target.value });
  };
  const handleOnClientChange = (e, { value }) => {
    e.preventDefault();
    setValues({ ...values, individualClient: value, updated: true });
    // validate()
  };
  const handleOnInsuranceCompChange = (e, { value }) => {
    e.preventDefault();
    setValues({ ...values, insuranceCompany: value, updated: true });
  };
  const handleOnTransactionTypesChange = (e, { value }) => {
    e.preventDefault();
    if (value === "RENEW") {
      history.push({
        pathname: `/staff/dashboard/policies/general/motor/edit/${policyId}`,
        state: { motorPolicy },
      });
    }
    setValues({ ...values, transactionType: value, updated: true });
  };

  const handleOnPremiumTypesChange = (e, { value }) => {
    e.preventDefault();
    if (!e.target.name) {
      let newValues = { ...values, premiumType: value, updated: true };
      setValues(newValues);
    } else {
      setValues({ ...values, [e.target.name]: e.target.value, updated: true });
    }
  };

  const handleOnPolicyDetailsChange = (e, { value }) => {
    e.preventDefault();
    let key = e.target.name ? e.target.id : value;
    if (!e.target.name) {
      let data = { name: value.split };
      if (Object.keys(policyDetails).length > 0) {
        setPolicyDetails((prevPolicyDetail) => ({
          ...prevPolicyDetail,
          [key]: { ...prevPolicyDetail[key], ...data },
        }));
      } else {
        let newBenefit = { ...policyDetails, [key ? key : 0]: data };
        setPolicyDetails(newBenefit);
      }
    } else {
      if (Object.keys(policyDetails).length > 0) {
        let data = { [e.target.name]: value };
        setPolicyDetails((prevPolicyDetail) => ({
          ...prevPolicyDetail,
          [key]: { ...prevPolicyDetail[key], ...data },
        }));
      } else {
        let newVal = {
          ...policyDetails,
          [key]: { ...policyDetails[key], [e.target.name]: value },
        };
        setPolicyDetails(newVal);
      }
    }
    setValues({ ...values, updated: true });
    setCalculated({ ...calculated, updated: true });
  };

  const handleOnPolicyDetailSetChange = (e, { value }) => {
    e.preventDefault();
    let key = e.target.name ? e.target.id : value;
    typeSet.forEach(function (type) {
      if (type.id === key) {
        setDetailSet(type.fields);
      }
    });

    if (!e.target.name) {
      let data = { name: value.split };
      if (Object.keys(policyDetailSet).length > 0) {
        setPolicyDetailSet((prevPolicyDetail) => ({
          ...prevPolicyDetail,
          [key]: { ...prevPolicyDetail[key], ...data },
        }));
      } else {
        let newBenefit = { ...policyDetailSet, [key ? key : 0]: data };
        setPolicyDetailSet(newBenefit);
      }
    } else {
      if (Object.keys(policyDetailSet).length > 0) {
        let data = { [e.target.name]: value };
        setPolicyDetailSet((prevPolicyDetail) => ({
          ...prevPolicyDetail,
          [key]: { ...prevPolicyDetail[key], ...data },
        }));
      } else {
        let newVal = {
          ...policyDetailSet,
          [key]: { ...policyDetailSet[key], [e.target.name]: value },
        };
        setPolicyDetailSet(newVal);
      }
    }
    setValues({ ...values, updated: true });
    setCalculated({ ...calculated, updated: true });
  };

  const [deletePolicyDet, { data: deletedPolicy }] = useMutation(
    DELETE_MOTOR_POLICY,
    {
      onError(err) {
        try {
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
          setVisible(true);
        }
      },
      variables: { id: [policyId] },
    }
  );
  useEffect(() => {
    if (deletedPolicy) {
      console.log(deletedPolicy);
    }
  });

  const [open, setOpen] = useState(false);
  const deletePolicy = (e) => {
    e.preventDefault();
    setOpen(false);
    if (deletePolicyDetails.id) {
      setDeletePolicyDetails({ id: policyId, deleted: true });
    }
    window.location.reload(true);
  };
  useEffect(() => {
    if (deletePolicyDetails.deleted && deletePolicyDetails.id) {
      deletePolicyDet();
      setDeletePolicyDetails({ ...deletePolicyDetails, deleted: true, id: [] });
    }
  }, [deletePolicyDet, deletePolicyDetails]);

  const handleOnPolicyFieldsChange = (e, { value }) => {
    e.preventDefault();
    let key = e.target.name ? e.target.id : value;
    if (!e.target.name) {
      let data = { field: value[0], value: value[1] };
      if (Object.keys(fields).length > 0) {
        setPolicyFields((prevPolicyField) => ({
          ...prevPolicyField,
          [key]: { ...prevPolicyField[key], ...data },
        }));
      } else {
        let newField = { ...fields, [key ? key : 0]: data };
        setPolicyFields(newField);
      }
    } else {
      if (Object.keys(fields).length > 0) {
        let data = { [e.target.name]: value };
        setPolicyFields((prevPolicyField) => ({
          ...prevPolicyField,
          [key]: { ...prevPolicyField[key], ...data },
        }));
      } else {
        let newVal = {
          ...fields,
          [key]: { ...fields[key], [e.target.name]: value },
        };
        setPolicyFields(newVal);
      }
    }
    setValues({ ...values, updated: true });
    setCalculated({ ...calculated, updated: true });
  };

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

  const handleOnInsuranceClassChange = (e, { value }) => {
    e.preventDefault();
    let newValues = { ...values, insuranceClass: value, updated: true };
    setValues(newValues);
  };

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

  const handleOnAddBenefitTypesChange = (e, { value }) => {
    e.preventDefault();
    let key = e.target.name ? e.target.id : value.split("_")[1];
    if (!e.target.name) {
      let data = { benefit: value.split("_")[0] };
      if (Object.keys(addBenefits).length > 0) {
        setAddBenefits((prevAddBen) => ({
          ...prevAddBen,
          [key]: { ...prevAddBen[key], ...data },
        }));
      } else {
        let newBenefit = { ...addBenefits, [key]: data };
        setAddBenefits(newBenefit);
      }
    } else {
      if (Object.keys(addBenefits).length > 0) {
        let data = { [e.target.name]: value };
        setAddBenefits((prevAddBen) => ({
          ...prevAddBen,
          [key]: { ...prevAddBen[key], ...data },
        }));
      } else {
        let newVal = {
          ...addBenefits,
          [key]: { ...addBenefits[key], [e.target.name]: value },
        };
        setAddBenefits(newVal);
      }
    }
    setValues({ ...values, updated: true });
  };

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

  const handleAddPolicyDetails = useCallback(
    (e) => {
      e.preventDefault();
      if (policyDetailsCount.length) {
        setPolicyDetailsCount([
          ...policyDetailsCount,
          policyDetailsCount[policyDetailsCount.length - 1] + 1,
        ]);
      } else {
        setPolicyDetailsCount([1]);
      }
    },
    [policyDetailsCount]
  );

  const handleAddPolicyDetailSet = useCallback(
    (e) => {
      e.preventDefault();
      if (policyDetailSetCount.length) {
        setPolicyDetailSetCount([
          ...policyDetailSetCount,
          policyDetailSetCount[policyDetailSetCount.length - 1] + 1,
        ]);
      } else {
        setPolicyDetailSetCount([1]);
      }
    },
    [policyDetailSetCount]
  );

  const handleAddPolicyFields = useCallback(
    (e) => {
      e.preventDefault();
      if (fieldsCount.length) {
        setPolicyFieldsCount([
          ...fieldsCount,
          fieldsCount[fieldsCount.length - 1] + 1,
        ]);
      } else {
        setPolicyFieldsCount([1]);
      }
    },
    [fieldsCount]
  );

  const handleAddPolicyFieldSet = useCallback(
    (e) => {
      e.preventDefault();
      if (fieldSetCount.length) {
        setFieldSetCount([
          ...fieldSetCount,
          fieldSetCount[fieldSetCount.length - 1] + 1,
        ]);
      } else {
        setFieldSetCount([1]);
      }
    },
    [fieldSetCount]
  );

  const handleAddAdditionalPremium = useCallback(
    (e) => {
      e.preventDefault();
      if (addPremiumCount.length) {
        setAddPremiumCount([
          ...addPremiumCount,
          addPremiumCount[addPremiumCount.length - 1] + 1,
        ]);
      } else {
        setAddPremiumCount([1]);
      }
    },
    [addPremiumCount]
  );
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
    },
    [addBenefits, addBenefitCount]
  );

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

  const handleRemovePolicyDetails = useCallback(
    (event) => {
      event.preventDefault();
      const newArr = policyDetailsCount.filter(
        (e) => e !== Number(event.target.id)
      );
      setPolicyDetailsCount(newArr);
      if (Object.keys(policyDetails).length > 0) {
        delete policyDetails[event.target.id];
      }
      setValues({ ...values, updated: true });
      setCalculated({ ...calculated, updated: true });
    },
    [policyDetailsCount, policyDetails, calculated, values]
  );

  const handleRemovePolicyDetailSet = useCallback(
    (event) => {
      event.preventDefault();
      const newArr = policyDetailSetCount.filter(
        (e) => e !== Number(event.target.id)
      );
      setPolicyDetailSetCount(newArr);
      if (Object.keys(policyDetailSet).length > 0) {
        delete policyDetailSet[event.target.id];
      }
      setValues({ ...values, updated: true });
      setCalculated({ ...calculated, updated: true });
    },
    [policyDetailSetCount, policyDetailSet, calculated, values]
  );

  const handleRemovePolicyFields = useCallback(
    (event) => {
      event.preventDefault();
      const newArr = fieldsCount.filter((e) => e !== Number(event.target.id));
      setPolicyFieldsCount(newArr);
      if (Object.keys(fields).length > 0) {
        delete fields[event.target.id];
      }
      setValues({ ...values, updated: true });

      setCalculated({ ...calculated, updated: true });
    },
    [fieldsCount, fields, calculated, values]
  );

  const handleRemovePolicyFieldSet = useCallback(
    (event) => {
      event.preventDefault();
      const newArr = fieldSetCount.filter((e) => e !== Number(event.target.id));
      setFieldSetCount(newArr);
      if (Object.keys(fieldSet).length > 0) {
        delete fieldSet[event.target.id];
      }
      setValues({ ...values, updated: true });

      setCalculated({ ...calculated, updated: true });
    },
    [fieldSetCount, fieldSet, calculated, values]
  );

  useEffect(() => {
    if (values.updated) {
      setValues({
        ...values,
        additionalBenefits: Object.values(addBenefits),
        additionalPremiums: Object.values(addPremiums),
        updated: false,
      });
      if (values.afterSubmit) {
        validate(values);
      }
    }
  }, [values, addBenefits, addPremiums, validate]);
  const deleteAdditional = () => {
    if (Object.keys(values.additionalBenefits).length) {
      setDeleteBenItem({ id: toDelete.additionalBenefits, deleted: false });
    }
    if (Object.keys(values.additionalPremiums).length) {
      setDeletePremItem({ id: toDelete.additionalPremiums, deleted: false });
    }
  };
  useEffect(() => {
    if (!deleteBenItem.deleted && deleteBenItem.id.length) {
      deleteBen();
      setDeleteBenItem({ ...deleteBenItem, deleted: true, id: [] });
    }
    if (!deletePremItem.deleted && deletePremItem.id.length) {
      deletePrem();
      setDeletePremItem({ ...deletePremItem, deleted: true, id: [] });
    }
  }, [deleteBen, deleteBenItem, deletePrem, deletePremItem]);
  function onSubmit(event) {
    event.preventDefault();
    validate(values);
    const polDetails = [];
    const fieldsArray = [];
    const fieldSetArray = [];

    const polDetailSet = [];

    Object.keys(fields).forEach((j) => {
      fieldsArray[j] = Object.assign(fields[j]);
    });

    const pickFields = [];
    const pickValues = [];
    Object.entries(fieldSet).forEach(([k, v]) => {
      if (k.startsWith("-")) {
        pickFields.push(v.field);
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

    Object.keys(policyDetails).forEach((k) => {
      polDetails[k] = Object.assign(policyDetails[k], { fields: fieldsArray });
    });

    const polId = Object.keys(policyDetailSet);
    Object.keys(policyDetailSet).forEach((k) => {
      polDetailSet[k] = Object.assign(
        { name: polId[0] },
        { fields: fieldSetArray }
      );
    });
    setValues({
      ...values,
      fields: Object.values(fields),
      fieldSet: Object.values(fieldSet),
      policyDetails: polDetails,
      policyDetailSet: Object.values(polDetailSet),
      afterSubmit: true,
    });
    if (Object.keys(values).length > 7 && !errors.errors.length) {
      updatePolicy();
    }
    deleteAdditional();
    setVisible(false);
  }
  useEffect(() => {
    if (values.done) {
      history.push({
        pathname: `/staff/dashboard/policies/general/motor/details/${motorPolicy.id}`,
        state: { motorPolicy },
      });
    }
  });
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
                {">"} Edit Policy
                <Header.Subheader>
                  Fill in this form to edit a policy
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>
        <Grid.Column>
          <DeleteModal handleRemovalItem={deletePolicy} />
        </Grid.Column>
      </Grid>

      <Grid container padded>
        {values.id && (
          <Grid.Column>
            <Form
              onSubmit={onSubmit}
              noValidate
              className={loading ? "loading" : ""}
            >
              <Form.Group>
                <Message visible={!!errors.errors.length || visible} warning>
                  <Message.Header>
                    Please correct the following issues:
                  </Message.Header>
                  {!!responseErrors.length && (
                    <Message>{responseErrors}</Message>
                  )}
                  {<Message.List items={errors.errors} />}
                </Message>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field
                  required
                  error={errors.errorPaths.includes("individualClient")}
                >
                  <label>Client</label>
                  {clients && (
                    <Clients
                      clients={clients}
                      selected={values.individualClient}
                      handleOnClientSearch={handleOnClientSearch}
                      handleOnClientChange={handleOnClientChange}
                    />
                  )}
                </Form.Field>
                <Form.Field
                  required
                  error={errors.errorPaths.includes("policyNo")}
                >
                  <label>Policy Number</label>
                  <Input
                    fluid
                    placeholder="Policy Number"
                    name="policyNo"
                    onChange={onChange}
                    value={values.policyNo}
                  />
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
                  {insuranceCos && (
                    <InsuranceCompanies
                      insuranceCompanies={insuranceCos}
                      selected={values.insuranceCompany}
                      handleOnInsuranceCompChange={handleOnInsuranceCompChange}
                    />
                  )}
                </Form.Field>
                <Form.Field
                  required
                  error={errors.errorPaths.includes("transactionType")}
                >
                  <label>Transaction Type</label>
                  {policyOpts && policyOpts.transaction_type_options && (
                    <TransactionTypes
                      transactionTypes={policyOpts.transaction_type_options}
                      selected={values.transactionType}
                      handleOnTransactionTypesChange={
                        handleOnTransactionTypesChange
                      }
                    />
                  )}
                </Form.Field>
                <Form.Field
                  required
                  error={errors.errorPaths.includes("insuranceClass")}
                >
                  <label>Insurance Class</label>
                  {policyOpts && policyOpts.insurance_class_options && (
                    <PremiumTypes
                      premiumTypes={policyOpts.insurance_class_options}
                      placeholder="Select Insurance Class"
                      selected={values.insuranceClass}
                      handleOnPremiumTypesChange={handleOnInsuranceClassChange}
                    />
                  )}
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field
                  required
                  error={errors.errorPaths.includes("transactionDate")}
                >
                  <label>Transaction Date</label>
                  <Input
                    fluid
                    placeholder="Transaction Date"
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
                    placeholder="Start Date"
                    name="startDate"
                    type="date"
                    onChange={onChange}
                    value={values.startDate}
                  />
                </Form.Field>
                <Form.Field
                  required
                  error={errors.errorPaths.includes("endDate")}
                >
                  <label>End Date</label>
                  <Input
                    fluid
                    placeholder="End Date"
                    name="endDate"
                    type="date"
                    onChange={onChange}
                    value={values.endDate}
                  />
                </Form.Field>
              </Form.Group>

              {values.transactionType && values.transactionType === "NEW" ? (
                <div>
                  <Divider horizontal>New Policy Details Setup</Divider>

                  <Form.Group widths="equal">
                    <Form.Field>
                      <Button
                        icon
                        floated="right"
                        onClick={handleAddPolicyDetails}
                      >
                        <Icon name="plus square outline" />
                      </Button>
                    </Form.Field>
                  </Form.Group>
                  {policyDetailsCount.map((key) => (
                    <Grid.Column width={8}>
                      <Form.Group widths="equal" key={key}>
                        <Form.Field>
                          <label> Policy Type</label>
                          <Input
                            fluid
                            placeholder="Policy Type"
                            id={key}
                            name="name"
                            onChange={handleOnPolicyDetailsChange}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Grid.Column width={10}>
                            <Button
                              id={key}
                              key={key}
                              icon
                              floated="right"
                              onClick={handleRemovePolicyDetails}
                              size="small"
                              disabled={
                                policyDetailsCount.length > 1 ? false : true
                              }
                            >
                              <Icon name="trash alternate" id={key} key={key} />
                            </Button>
                          </Grid.Column>
                        </Form.Field>
                      </Form.Group>

                      <Form.Group widths="equal">
                        <Form.Field>
                          <Button
                            icon
                            floated="right"
                            onClick={handleAddPolicyFields}
                          >
                            <Icon name="plus square outline" />
                          </Button>
                        </Form.Field>
                      </Form.Group>
                      <div>
                        {fieldsCount.map((fieldKey) => (
                          <Form.Group widths="equal" key={fieldKey}>
                            <Form.Field>
                              <label>Field</label>
                              <Input
                                fluid
                                placeholder="Field"
                                id={fieldKey}
                                name="field"
                                onChange={handleOnPolicyFieldsChange}
                              />
                            </Form.Field>
                            <Form.Field>
                              <label>
                                <b>Value</b>
                              </label>
                              <Grid>
                                <Grid.Column width={10}>
                                  <Input
                                    fluid
                                    placeholder="Value"
                                    name="value"
                                    id={fieldKey}
                                    onChange={handleOnPolicyFieldsChange}
                                  />
                                </Grid.Column>
                                <Grid.Column width={4}>
                                  <Button
                                    id={fieldKey}
                                    key={fieldKey}
                                    icon
                                    floated="right"
                                    onClick={handleRemovePolicyFields}
                                    size="small"
                                    disabled={
                                      fieldsCount.length > 1 ? false : true
                                    }
                                  >
                                    <Icon
                                      name="trash alternate"
                                      id={fieldKey}
                                      key={fieldKey}
                                    />
                                  </Button>
                                </Grid.Column>
                              </Grid>
                            </Form.Field>
                          </Form.Group>
                        ))}
                      </div>
                    </Grid.Column>
                  ))}
                </div>
              ) : (
                <div>
                  <Divider horizontal>Existing Policy Details Setup</Divider>

                  {policyDetailSetCount.map((key) => (
                    <Grid.Column width={8}>
                      <Form.Group widths="equal" key={key}>
                        <Form.Field>
                          <label> Policy Type</label>
                          {typeSet && (
                            <PolicyTypes
                              handleOnPolicyTypeChange={
                                handleOnPolicyDetailSetChange
                              }
                              policyTypes={typeSet}
                            />
                          )}
                        </Form.Field>
                      </Form.Group>

                      <Form.Group widths="equal">
                        <Form.Field>
                          <Button
                            icon
                            floated="right"
                            onClick={handleAddPolicyFieldSet}
                          >
                            <Icon name="plus square outline" />
                          </Button>
                        </Form.Field>
                      </Form.Group>
                      <div>
                        {fieldSetCount.map((fieldKey) => (
                          <Form.Group widths="equal" key={fieldKey}>
                            {detailSet && (
                              <Form.Field>
                                <label>Field</label>

                                <FieldsDropdown
                                  handleOnFieldsChange={
                                    handleOnPolicyFieldSetChange
                                  }
                                  fieldDetails={detailSet}
                                />
                              </Form.Field>
                            )}
                            <Form.Field>
                              <label>
                                <b>Value</b>
                              </label>
                              <Grid>
                                <Grid.Column width={10}>
                                  <Input
                                    fluid
                                    placeholder="Value"
                                    name="value"
                                    id={fieldKey}
                                    onChange={handleOnPolicyFieldSetChange}
                                  />
                                </Grid.Column>
                                <Grid.Column width={4}>
                                  <Button
                                    id={fieldKey}
                                    key={fieldKey}
                                    icon
                                    floated="right"
                                    onClick={handleRemovePolicyFieldSet}
                                    size="small"
                                    disabled={
                                      fieldSetCount.length > 1 ? false : true
                                    }
                                  >
                                    <Icon
                                      name="trash alternate"
                                      id={fieldKey}
                                      key={fieldKey}
                                    />
                                  </Button>
                                </Grid.Column>
                              </Grid>
                            </Form.Field>
                          </Form.Group>
                        ))}
                      </div>
                    </Grid.Column>
                  ))}
                </div>
              )}

              <Divider horizontal>Basic Premiums Details</Divider>
              <Form.Group widths="equal">
                <Form.Field
                  required
                  error={errors.errorPaths.includes("premiumType")}
                >
                  <label>Premium Type</label>
                  {policyOpts && policyOpts.premium_type_options && (
                    <PremiumTypes
                      premiumTypes={policyOpts.premium_type_options}
                      selected={values.premiumType}
                      handleOnPremiumTypesChange={handleOnPremiumTypesChange}
                    />
                  )}
                </Form.Field>
                <Form.Field
                  required
                  error={errors.errorPaths.includes("minimumPremiumAmount")}
                >
                  <label>Minimum Premium Amount</label>
                  <Input
                    fluid
                    placeholder="Minimum Premium Amount"
                    name="minimumPremiumAmount"
                    type="number"
                    onChange={onChange}
                    value={values.minimumPremiumAmount}
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
              <Divider horizontal>Additional Premiums</Divider>
              <Form.Group widths="equal">
                <Form.Field>
                  <Button
                    icon
                    floated="right"
                    onClick={handleAddAdditionalPremium}
                  >
                    <Icon name="plus square outline" />
                  </Button>
                </Form.Field>
              </Form.Group>
              {addPremiumCount.map((key) => (
                <Form.Group widths="equal" key={key}>
                  <Form.Field>
                    <label>Additional Premium Type</label>
                    {policyOpts && policyOpts.premium_type_options && (
                      <PremiumTypes
                        premiumTypes={policyOpts.premium_type_options}
                        id={key}
                        selected={addPremiums[key] && addPremiums[key].premium}
                        handleOnPremiumTypesChange={handleOnAddPremTypesChange}
                      />
                    )}
                  </Form.Field>
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
                  <Form.Field>
                    <Grid>
                      <label>
                        <b>Commission Rate</b>
                      </label>
                      <Grid.Column width={12}>
                        <Input
                          fluid
                          placeholder="Commission Rate"
                          name="commissionRate"
                          type="number"
                          step="any"
                          id={key}
                          onChange={handleOnAddPremTypesChange}
                          value={
                            addPremiums[key] && addPremiums[key].commissionRate
                              ? addPremiums[key].commissionRate
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
                          onClick={handleRemoveAdditionalPremium}
                          size="small"
                        >
                          <Icon name="trash alternate" id={key} key={key} />
                        </Button>
                      </Grid.Column>
                    </Grid>
                  </Form.Field>
                </Form.Group>
              ))}

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
                        handleOnPremiumTypesChange={
                          handleOnAddBenefitTypesChange
                        }
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
                          placeholder="Commission Rate"
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
              <Button type="submit">Edit Motor Policy</Button>
            </Form>
          </Grid.Column>
        )}
      </Grid>
    </Container>
  );
}
