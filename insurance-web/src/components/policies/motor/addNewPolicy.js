import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { DateInput } from "semantic-ui-calendar-react";
import {
  Button,
  Container,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Item,
  Label,
  Menu,
  Message,
  Modal,
  Segment,
  Tab,
} from "semantic-ui-react";

import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import * as yup from "yup";
import { AuthContext } from "../../../context/auth";
import { MotorPolicyContext } from "../../../context/policy/motor";
import {
  FETCH_CLIENTS_QUERY,
  FETCH_CORPORATE_CLIENTS_QUERY,
} from "../../clients/queries";
import Clients from "../listClients";
import CorporateClients from "../listCorporateClients";
import InsuranceCompanies from "../listInsuranceComps";
import PolicyTypes from "../listPolicyTypes";
import PremiumTypes from "../premiumTypes";
import {
  CREATE_MOTOR_POLICY,
  FETCH_INSURANCE_COMP,
  GET_MOTOR_POLICY_OPTS,
  GET_POLICY_TYPES,
} from "../queries";
import StaticPolicyFields from "../staticPolicyFields";
import TransactionTypes from "../transactionTypes";
import { debounce } from "../../../utils/debounce";

export default function AddNewMotorPolicy(props) {
  const authContext = useContext(AuthContext);
  const [responseErrors, setResponseErrors] = useState([]);
  const context = useContext(MotorPolicyContext);

  let history = useHistory();
  const [errors, setErrors] = useState({
    errorPaths: [],
    errors: [],
  });

  const [clients, setClients] = useState();
  const [corporateClients, setCorporateClients] = useState();
  const [selectedClient, setSelectedClient] = useState();
  const [selectedCorporateClient, setSelectedCorporateClient] = useState();
  const [selectedInsCompany, setSelectedInsCompany] = useState();
  const [typeSet, setTypeSet] = useState();
  const [detailSet, setDetailSet] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [policyOpts, setPolicyOpts] = useState();
  const [insuranceCos, setInsuranceCos] = useState();
  const [addBenefits, setAddBenefits] = useState({});
  const [policyDetails, setPolicyDetails] = useState([]);
  const [policyDetailSet, setPolicyDetailSet] = useState([]);
  const [fields, setPolicyFields] = useState([]);
  const [fieldSet, setFieldSet] = useState([]);
  const [addBenefitCount, setAddBenefitCount] = useState([0]);
  const [policyDetailsCount, setPolicyDetailsCount] = useState([0]);
  const [policyDetailSetCount] = useState([0]);
  const [fieldsCount, setPolicyFieldsCount] = useState([0]);
  const [clientOption, setClientOption] = useState("");

  const [addPremiumCount] = useState([1, 2, 3]);
  const [addPremiums, setAddPremiums] = useState({
    1: {
      premium: "IPHCFLEVY",
      commissionRate: 0.25,
      amount: 0,
    },
    2: {
      premium: "TLEVY",
      commissionRate: 0.2,
      amount: 0,
    },
    3: {
      premium: "STAMPD",
      minimumAmount: 40,
    },
  });
  const [calculated, setCalculated] = useState({
    netPremium: 0,
    grossPremium: 0,
    totalLevies: 0,
    grossCommission: 0,
    netCommission: 0,
    withholdingTax: 0,
    updated: false,
  });
  const [search, setSearch] = useState({ search: "" });
  const [corporateSearch, setCorporateSearch] = useState({
    search: "",
  });
  const [searchPolicyType, setSearchPolicyType] = useState("");
  const [companySearch, setCompanySearch] = useState({ search: "" });
  const [premiumTypesSearch, setPremiumTypesSearch] = useState({ search: "" });
  const [usersFetched, setUsersFetched] = useState(false);
  const [values, setValues] = useState({
    additionalBenefits: {},
    policyDetails: [],
    policyDetailSet: [],
    fields: [],
    fieldSet: [],
    additionalPremiums: {},
    remarks: "",
    afterSubmit: false,
    commissionRate: 3.75,
    withholdingTax: 10,
    transactionDate: moment().format("YYYY-MM-DD"),
    premiumType: "BASIC",
  });

  let schema = yup.object().shape({
    policyNo: yup.string().required("policy no. is required"),
    individualClient: yup.string(),
    corporateClient: yup.string(),
    insuranceCompany: yup.string().required("insurance company is required"),
    insuranceClass: yup.string().required("insurance class is required"),
    transactionType: yup.string().required("transaction type is required"),
    transactionDate: yup.date().required(""),
    startDate: yup.date().required("start date is required"),
    endDate: yup.date().required("end date is required"),
    premiumType: yup.string().required("premium type is required"),
    minimumPremiumAmount: yup
      .number()
      .required("minimum premium amnount is required"),
    commissionRate: yup.number().required("commission rate is required"),
    policyCommissionRate: yup
      .number()
      .required("policy commission rate is required"),
    policyDetails: yup
      .array()
      .when("transactionType", {
        is: "NEW",
        then: yup.array().of(
          yup.object().shape({
            name: yup
              .string()
              .test(
                "empty-check",
                "policy type is required",
                (value) => value.length > 0
              )
              .required("policy type is required"),
            fields: yup
              .array()
              .of(
                yup.object().shape({
                  field: yup.string().required("name of field is required"),
                  value: yup.string().required("value of field is required"),
                })
              )
              .test(
                "check value",
                "Value of the policy is required",
                (fieldArray) =>
                  fieldArray.find(
                    (fieldPair) =>
                      fieldPair.field === "value" && !!fieldPair.value
                  )
              ),
          })
        ),
      })

      .when("transactionType", {
        is: (transactionType) => transactionType === "NEW",
        then: yup
          .array()
          .min(1, "you need at least one policy type")
          .required("Policy details required"),
      }),
  });

  const { data: policyOptsData } = useQuery(GET_MOTOR_POLICY_OPTS, {
    variables: { search: premiumTypesSearch.search },
  });
  useEffect(() => {
    if (policyOptsData) {
      setPolicyOpts(policyOptsData.motorPolicyOptions);
    }
  }, [policyOptsData, policyOpts]);

  const { data: insuranceCosData, loading:insuranceCompanyLoading } = useQuery(FETCH_INSURANCE_COMP, {
    variables: { search: companySearch.search },
  });
  useEffect(() => {
    if (insuranceCosData) {
      setInsuranceCos(insuranceCosData.insuranceCompanies.items);
    }
  }, [insuranceCosData, insuranceCos]);

  const { data: typeSetData } = useQuery(GET_POLICY_TYPES, {
    variables: { search: searchPolicyType },
  });
  useEffect(() => {
    if (typeSetData) {
      setTypeSet(typeSetData.policyTypes.items);
    }
  }, [typeSetData, typeSet]);

  useEffect(() => {
    let val = 0;
    if (values.transactionType === "NEW") {
      Object.entries(policyDetails).forEach(([key, pol]) => {
        Object.entries(pol).forEach(([k, v]) => {
          if (k === "fields") {
            v.forEach(function (i) {
              if (i.field === "value") {
                val = Number(i.value);
              }
            });
          }
        });
      });
    } else {
      Object.entries(fieldSet).forEach(([k, v]) => {
        if (!k.startsWith("-") && Number(v["field"]) === 0) {
          val = Number(v.value);
        }
      });
    }

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
      data["netPremium"] = netPremium;
      let totalLevies = 0;
      for (const [key, value] of Object.entries(addPremiums)) {
        let amount = 0;
        if (!value.commissionRate) {
          amount = value.minimumAmount;
        }
        if (
          !value.commissionRate &&
          value.premium === "STAMPD" &&
          values.transactionType === "NORM"
        ) {
          amount = parseInt(value.minimumAmount);
          grossPremium += amount;
        }
        if (value.commissionRate) {
          amount = parseFloat(
            (grossPremium * value.commissionRate) / 100
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
        totalLevies += +amount;
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
      data["netPremium"] = netPremium;
      let totalLevies = 0;
      for (const [key, value] of Object.entries(addPremiums)) {
        let amount = 0;
        if (!value.commissionRate) {
          amount = value.minimumAmount;
        }

        if (
          !value.commissionRate &&
          value.premium === "STAMPD" &&
          values.transactionType === "NORM"
        ) {
          amount = parseInt(value.minimumAmount);
          grossPremium += amount;
        }

        if (value.commissionRate) {
          amount = parseFloat(
            (grossPremium * value.commissionRate) / 100
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
        totalLevies += +amount;
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
    // eslint-disable-next-line
  }, [calculated, values, addPremiums, addBenefits]);

  const [fetchClients, { data: clientsData,loading:clientLoading }] = useLazyQuery(
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
  const [fetchCorporateClients, { data: corporateClientsData,loading:corporateClientLoading }] = useLazyQuery(
    FETCH_CORPORATE_CLIENTS_QUERY,
    {
      variables: { search: corporateSearch.search },
    }
  );
  useEffect(() => {
    if (!usersFetched) {
      fetchCorporateClients();
    }
    if (corporateClientsData) {
      setCorporateClients(corporateClientsData.corporateClients.items);
      setUsersFetched(true);
    }
  }, [
    corporateClientsData,
    corporateClients,
    fetchCorporateClients,
    usersFetched,
  ]);
  const validate = useCallback(
    (values) => {
      return new Promise((resolve, reject) => {
        schema
          .validate(values, { abortEarly: false })
          .then((valid) => {
            setErrors({ errorPaths: [], errors: [] });
            resolve(valid);
          }) //called if the entire form is valid
          .catch((err) => {
            setErrors({
              errors: err.errors,
              errorPaths: err.inner.map((i) => i.path),
            });
            reject(err);
          });
      });
    },
    [schema]
  );

  const [createPolicy, { loading }] = useCallback(
    useMutation(CREATE_MOTOR_POLICY, {
      update(_, result) {
        context.createPolicy(result.data);

        let pol = result.data.createMotorPolicy.motorPolicy;
        context.createPolicy(result.data.createMotorPolicy.motorPolicy);
        history.push({
          pathname: `/staff/dashboard/policies/general/motor/details/new/${pol.id}`,
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
      variables: values,
    })
  );

  const onChange = useCallback(
    (event, { name, value }) => {
      setValues({ ...values, [name]: value, updated: true });
      setCalculated({ ...calculated, updated: true });
    },
    [values, calculated]
  );

  const handleOnClientSearch = debounce((e) => {
    setSearch({ search: e.target.value });
  }, 1000);
  const handleOnClientChange = (e, { value }) => {
    e.preventDefault();
    const data = {
      individualClient: value,
      corporateClient: values.corporateClient,
    };
    if (value) {
      setClientOption("individual");
    } else {
      setClientOption("");
    }
    if (data.corporateClient) {
      data.corporateClient = "";
    }
    setValues({ ...values, ...data, updated: true });
    // validate()
  };

  const handleOnCorporateClientSearch = debounce((e) => {
    setCorporateSearch({ search: e.target.value });
  }, 1000);

  const handleOnInsuranceCompanySearch = debounce((e) => {
    e.persist();
    setCompanySearch({ search: e.target.value });
  }, 1000);

  const handleOnPremiumTypesSearch = (e) => {
    setPremiumTypesSearch({ search: e.target.value });
  };

  const handleOnCorporateClientChange = (e, { value }) => {
    e.preventDefault();
    const data = {
      individualClient: values.individualClient,
      corporateClient: value,
    };
    if (value) {
      setClientOption("corporate");
    } else {
      setClientOption("");
    }
    if (data.individualClient) {
      data.individualClient = "";
    }
    setValues({ ...values, ...data, updated: true });
    // validate()
  };

  const handleOnPolicyTypeSearch = (e) => {
    setSearchPolicyType(e.target.value);
  };
  useEffect(() => {
    if (values.individualClient) {
      let client = clients.find((x) => x.id === values.individualClient);
      setSelectedClient(client);
    }
  }, [clients, values.individualClient]);

  useEffect(() => {
    if (values.corporateClient) {
      let corporateClient = corporateClients.find(
        (x) => x.id === values.corporateClient
      );
      setSelectedCorporateClient(corporateClient);
    }
  }, [corporateClients, values.corporateClient]);

  useEffect(() => {
    if (values.insuranceCompany) {
      let comp = insuranceCos.find((x) => x.id === values.insuranceCompany);
      setSelectedInsCompany(comp);
    }
  }, [insuranceCos, values.insuranceCompany]);
  const handleOnInsuranceCompChange = (e, { value }) => {
    e.preventDefault();
    setValues({ ...values, insuranceCompany: value, updated: true });
  };
  const handleOnTransactionTypesChange = (e, { value }) => {
    e.preventDefault();
    setValues({ ...values, transactionType: value, updated: true });
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
    setValues({ ...values, updated: true });
    setCalculated({ ...calculated, updated: true });
  };

  const handleOnPolicyDetailsChange = (e, { value, name }) => {
    e.preventDefault();
    let key = e.target.name ? e.target.id : value.trim();
    if (!e.target.name) {
      let data = { name: value.trim() };
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
        let data = { [e.target.name]: value.trim() };
        setPolicyDetails((prevPolicyDetail) => ({
          ...prevPolicyDetail,
          [key]: { ...prevPolicyDetail[key], ...data },
        }));
      } else {
        let newVal = {
          ...policyDetails,
          [key]: { ...policyDetails[key], [e.target.name]: value.trim() },
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
        let data = { field: e.target.id, value: e.target.value };

        setFieldSet((prevPolicyField) => ({
          ...prevPolicyField,
          [key]: { ...prevPolicyField[key], ...data },
        }));
      } else {
        let newVal = {
          ...fieldSet,
          [key]: {
            ...fieldSet[key],
            field: e.target.id,
            [e.target.name]: value,
          },
        };
        setFieldSet(newVal);
      }
    }
    setValues({ ...values, updated: true });
    setCalculated({ ...calculated, updated: true });
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
  // const handleAddPolicyDetailSet = useCallback(
  //   (e) => {
  //     e.preventDefault();
  //     if (policyDetailSetCount.length) {
  //       setPolicyDetailSetCount([
  //         ...policyDetailSetCount,
  //         policyDetailSetCount[policyDetailSetCount.length - 1] + 1,
  //       ]);
  //     } else {
  //       setPolicyDetailSetCount([1]);
  //     }
  //   },
  //   [policyDetailSetCount]
  // );

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

  // const handleAddPolicyFieldSet = useCallback(
  //   (e) => {
  //     e.preventDefault();
  //     if (fieldSetCount.length) {
  //       setFieldSetCount([
  //         ...fieldSetCount,
  //         fieldSetCount[fieldSetCount.length - 1] + 1,
  //       ]);
  //     } else {
  //       setFieldSetCount([1]);
  //     }
  //   },
  //   [fieldSetCount]
  // );

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

  // const handleRemovePolicyDetailSet = useCallback(
  //   (event) => {
  //     event.preventDefault();
  //     const newArr = policyDetailSetCount.filter(
  //       (e) => e !== Number(event.target.id)
  //     );
  //     setPolicyDetailSetCount(newArr);
  //     if (Object.keys(policyDetailSet).length > 0) {
  //       delete policyDetailSet[event.target.id];
  //     }
  //     setValues({ ...values, updated: true });
  //     setCalculated({ ...calculated, updated: true });
  //   },
  //   [policyDetailSetCount, policyDetailSet, calculated, values]
  // );

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

  // const handleRemovePolicyFieldSet = useCallback(
  //   (event) => {
  //     event.preventDefault();
  //     const newArr = fieldSetCount.filter((e) => e !== Number(event.target.id));
  //     setFieldSetCount(newArr);
  //     if (Object.keys(fieldSet).length > 0) {
  //       delete fieldSet[event.target.id];
  //     }
  //     setValues({ ...values, updated: true });

  //     setCalculated({ ...calculated, updated: true });
  //   },
  //   [fieldSetCount, fieldSet, calculated, values]
  // );

  useEffect(() => {
    if (values.updated) {
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

      Object.keys(policyDetails).forEach((k) => {
        polDetails[k] = Object.assign(policyDetails[k], {
          fields: fieldsArray,
        });
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
        additionalBenefits: Object.values(addBenefits),
        fields: Object.values(fields),
        fieldSet: Object.values(fieldSet),
        policyDetails: polDetails,
        policyDetailSet: Object.values(polDetailSet),
        additionalPremiums: Object.values(addPremiums),
        updated: false,
      });

      if (values.afterSubmit) {
        validate(values);
      }
      setOpenModal(false);
    }
    // eslint-disable-next-line
  }, [
    values,
    addBenefits,
    policyDetails,
    policyDetailSet,
    addPremiums,
    validate,
  ]);

  const onPreview = async (event) => {
    event.preventDefault();
    try {
      await validate(values);
      setValues({ ...values, afterSubmit: true });
      // setOpenModal(true);
      if (Object.keys(values).length > 7 && !errors.errors.length) {
        setOpenModal(true);
      }
    } catch (err) {}
  };

  function setRenewalDate(inputDate) {
    /* formattedInputDate == inputDate converted from string to proper date format */
    const formattedInputDate = new Date(inputDate);
    formattedInputDate.setDate(formattedInputDate.getDate() + 1);
    /* convert to ISOString-format, split, and return only the first part */
    const result = formattedInputDate.toISOString().split("T");
    return result[0];
  }

  function motorPolicyDetails() {
    return (
      <Container>
        <Grid container columns={2} divided relaxed stackable>
          <Grid.Column>
            <Segment>
              <Header as="h3">Client details</Header>
            </Segment>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Divider horizontal>Basic Information</Divider>
                  {values.individualClient && (
                    <Item.Description>
                      <b>Name: </b>
                      <span className="price">
                        {selectedClient.firstName} {selectedClient.lastName}{" "}
                        {selectedClient.surname}
                      </span>
                      <br />
                      <b>Email: </b>
                      <span className="price">{selectedClient.email}</span>
                      <br />
                      <b>Phone Number: </b>
                      <span className="price">
                        {selectedClient.phoneNumber}
                      </span>
                      <br />
                      <b>ID Number: </b>
                      <span className="price">{selectedClient.idNumber}</span>
                      <br />
                      <b>kra Pin: </b>
                      <span className="price">{selectedClient.kraPin}</span>
                      <br />
                    </Item.Description>
                  )}
                  {values.corporateClient && (
                    <Item.Description>
                      <b>Name: </b>
                      <span className="price">
                        {selectedCorporateClient.name}
                      </span>
                      <br />
                      <b>Email: </b>
                      <span className="price">
                        {selectedCorporateClient.email}
                      </span>
                      <br />
                      <b>Phone Number: </b>
                      <span className="price">
                        {selectedCorporateClient.phoneNumber}
                      </span>
                      <br />
                      <b>kra Pin: </b>
                      <span className="price">
                        {selectedCorporateClient.kraPin}
                      </span>
                      <br />
                    </Item.Description>
                  )}
                </Item.Content>
              </Item>

              <Item>
                <Item.Content>
                  <Divider horizontal>Policy Information</Divider>
                  <Item.Description>
                    <b>Policy Number: </b>
                    <span className="price">{values.policyNo}</span>
                    <br />
                    <b>Insurance Class: </b>
                    <span className="price">
                      {
                        policyOpts.insurance_class_options[
                          values.insuranceClass
                        ]
                      }
                    </span>
                    <br />
                    <b>Insurance Company: </b>
                    <span className="price">{selectedInsCompany.name}</span>
                    <br />
                    <b>Transaction Type: </b>
                    <span className="price">
                      {
                        policyOpts.transaction_type_options[
                          values.transactionType
                        ]
                      }
                    </span>
                    <br />
                    <b>Start Date: </b>
                    <span className="price">{values.startDate}</span>
                    <br />
                    <b>End Date: </b>
                    <span className="price">{values.endDate}</span>
                    <br />
                    <b>Renewal Date: </b>
                    <span className="price">
                      {values.endDate
                        ? setRenewalDate(values.endDate, 1)
                        : "None"}
                    </span>
                    <br />
                    <b>Transaction Date: </b>
                    <span className="price">{values.transactionDate}</span>
                    <br />
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
          </Grid.Column>
          <Grid.Column>
            <Item.Group>
              <div>
                {values.policyDetails &&
                  values.policyDetails.map((fieldType, key) => (
                    <Item key={key}>
                      <Segment>
                        <Header as="h3">
                          {fieldType.length > 1
                            ? fieldType[key].name
                            : fieldType.name}{" "}
                          details
                        </Header>
                      </Segment>

                      <Item.Content>
                        <Item.Description>
                          {fieldType.fields.map((field, i) => (
                            <div key={i}>
                              <b>{fieldType.fields[i].field}: </b>
                              <span className="price">
                                {fieldType.fields[i].value}{" "}
                              </span>
                              <br />
                            </div>
                          ))}
                        </Item.Description>
                      </Item.Content>
                    </Item>
                  ))}
              </div>

              <div>
                {values.policyDetailSet &&
                  values.policyDetailSet.map((fieldType, key) => (
                    <Item key={key}>
                      <Segment>
                        <Header as="h3">
                          {fieldType.name.name} details {key}
                        </Header>
                      </Segment>
                      <Item.Content>
                        <Item.Description>
                          {fieldType.fields.map((field, i) => (
                            <div key={i}>
                              <b>{fieldType.fields[i].field.field}: </b>
                              <span className="price">
                                {fieldType.fields[i].value}{" "}
                              </span>
                              <br />
                            </div>
                          ))}
                        </Item.Description>
                      </Item.Content>
                    </Item>
                  ))}
              </div>
            </Item.Group>
          </Grid.Column>
        </Grid>
        {values.remarks && (
          <Grid container columns={1} divided relaxed stackable>
            <Grid.Column>
              <Segment>
                <Header as="h3">Remarks</Header>
              </Segment>
              <Item.Group>
                <Item>
                  <Item.Content>
                    <Item.Description>
                      <div
                        dangerouslySetInnerHTML={{ __html: values.remarks }}
                      />
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
          </Grid>
        )}
      </Container>
    );
  }
  function premiumDetails() {
    return (
      <Container>
        <Grid
          container
          columns={
            values.additionalPremiums && values.additionalBenefits.length
              ? 3
              : !!(
                  values.additionalPremiums.length ||
                  values.additionalBenefits.length
                )
              ? 2
              : 1
          }
          divided
          relaxed
          stackable
        >
          <Grid.Column>
            <Segment>
              <Header as="h3">Basic Premium</Header>
            </Segment>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Divider horizontal>Basic Premiums Info</Divider>
                  <Item.Description>
                    <b>Premium Type: </b>
                    <span className="price">Basic Premium </span>
                    <br />
                    <b>Premium Rate: </b>
                    <span className="price">{values.commissionRate}% </span>
                    <br />
                    <b>Minimum Premium Amount: </b>
                    <span className="price">
                      Ksh {values.minimumPremiumAmount}{" "}
                    </span>
                    <br />
                    <span>
                      <b>Amount: </b>
                      <span className="price">
                        Ksh{" "}
                        {calculated.netPremium
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      </span>
                      <br />
                    </span>
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
          </Grid.Column>

          {values.additionalBenefits && !!values.additionalBenefits.length && (
            <Grid.Column>
              <Segment>
                <Header as="h3">Additional Benefits</Header>
              </Segment>
              <Item.Group>
                {values.additionalBenefits.map((benefit, i) => (
                  <Item.Content key={i}>
                    <Item>
                      <Divider horizontal>.{i + 1}.</Divider>
                      <Item.Description>
                        <b>Benefit Type: </b>
                        <span className="price">
                          {
                            policyOpts.additional_benefit_options[
                              benefit.benefit
                            ]
                          }{" "}
                        </span>
                        <br />
                        <b>Commission Rate: </b>
                        <span className="price">
                          {benefit.commissionRate
                            ? benefit.commissionRate + "%"
                            : ""}{" "}
                        </span>
                        <br />
                        {benefit.minimumAmount && (
                          <span>
                            <b>Minimum Benefit Amount: </b>
                            <span className="price">
                              {" "}
                              Ksh{" "}
                              {benefit.minimumAmount
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                            </span>
                            <br />
                          </span>
                        )}
                        <span>
                          <b>Amount: </b>
                          <span className="price">
                            Ksh{" "}
                            {benefit.amount
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                          </span>
                          <br />
                        </span>
                      </Item.Description>
                    </Item>
                  </Item.Content>
                ))}
              </Item.Group>
            </Grid.Column>
          )}
          {!!values.additionalPremiums.length && (
            <Grid.Column>
              <Segment>
                <Header as="h3">Additional Levies</Header>
              </Segment>
              <Item.Group>
                {values.additionalPremiums.map((premium, i) => (
                  <Item.Content key={i}>
                    <Item>
                      <Divider horizontal>.{i + 1}.</Divider>
                      <Item.Description>
                        <b>Levy Type: </b>
                        <span className="price">
                          {
                            policyOpts.premium_type_options[
                              addPremiums[i + 1].premium
                            ]
                          }{" "}
                        </span>
                        <br />
                        {premium.commissionRate && (
                          <span>
                            <b>Levy Rate: </b>
                            <span className="price">
                              {premium.commissionRate + "%"}{" "}
                            </span>
                            <br />
                          </span>
                        )}
                        <span>
                          <b>Amount: </b>
                          <span className="price">
                            Ksh{" "}
                            {addPremiums[i + 1] && addPremiums[i + 1].amount
                              ? addPremiums[i + 1].amount
                              : addPremiums[i + 1].minimumAmount
                              ? addPremiums[i + 1].minimumAmount
                              : "0"}{" "}
                          </span>
                          <br />
                        </span>
                      </Item.Description>
                    </Item>
                  </Item.Content>
                ))}
              </Item.Group>
            </Grid.Column>
          )}
        </Grid>

        <div>
          <br />
          <br />
          <Segment>
            <Header as="h3" size="medium" textAlign="center">
              Policy Premium Totals
            </Header>
          </Segment>
          <Grid container columns={1} divided relaxed stackable>
            <Grid.Column>
              <Item.Group>
                <Item>
                  <Item.Content>
                    <Item.Description>
                      <b>Net Premium:</b>
                      <span className="price">
                        Ksh{" "}
                        {calculated.netPremium
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      </span>
                      <br />
                      <b>Total Levies:</b>
                      <span className="price">
                        Ksh{" "}
                        {calculated.totalLevies
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      </span>
                      <br />
                      <b>Gross Premium:</b>
                      <span className="price">
                        Ksh{" "}
                        {calculated.grossPremium
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      </span>
                      <br />
                      <br />
                      <b>Gross Commission: </b>
                      <span className="price">
                        Ksh{" "}
                        {calculated.grossCommission
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      </span>
                      <br />
                      <b>Withholding Tax: </b>
                      <span className="price">
                        Ksh{" "}
                        {calculated.withholdingTax
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      </span>
                      <br />
                      <b>Net Commission: </b>
                      <span className="price">
                        Ksh{" "}
                        {calculated.netCommission
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                      </span>
                      <br />
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
          </Grid>
        </div>
      </Container>
    );
  }
  const panes = [
    {
      menuItem: <Menu.Item key="policy">Motor Policy Details</Menu.Item>,
      render: () => {
        return <Tab.Pane>{motorPolicyDetails()}</Tab.Pane>;
      },
    },
    {
      menuItem: <Menu.Item key="premiums">Premiums Details</Menu.Item>,
      render: () => {
        return <Tab.Pane>{premiumDetails()}</Tab.Pane>;
      },
    },
  ];

  return (
    <Container>
      <Grid container padded>
        <Grid.Column>
          <div className="content-wrapper">
            <Header as="h2">
              <Icon name="settings" />
              <Header.Content>
                <a href="/staff/dashboard/policies/general/motor">Motor</a>{" "}
                {">"} Create New Policy
                <Header.Subheader>
                  Hello {authContext.user.username}, Fill in this form to create
                  a policy
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
                visible={!!(!!errors.errors.length | !!responseErrors.length)}
                warning
              >
                <Message.Header>
                  Please correct the following issues:
                </Message.Header>
                {!!responseErrors.length && <Message>{responseErrors}</Message>}
                {<Message.List items={errors.errors} />}
              </Message>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                error={errors.errorPaths.includes("individualClient")}
              >
                <label>Individual Client</label>
                {clients && (
                  <Clients
                    clients={clients}
                    handleOnClientSearch={(e) => {
                      e.persist();
                      handleOnClientSearch(e);
                    }}
                    handleOnClientChange={handleOnClientChange}
                    disable={clientOption === "corporate"}
                    loading={clientLoading}
                  />
                )}
              </Form.Field>
              <Form.Field error={errors.errorPaths.includes("corporateClient")}>
                <label>Corporate</label>
                {corporateClients && (
                  <CorporateClients
                    corporateClients={corporateClients}
                    handleOnCorporateClientSearch={(e) => {
                      e.persist();
                      handleOnCorporateClientSearch(e);
                    }}
                    handleOnCorporateClientChange={
                      handleOnCorporateClientChange
                    }
                    disable={clientOption === "individual"}
                    loading={corporateClientLoading}
                  />
                )}
              </Form.Field>
              <Form.Field error={errors.errorPaths.includes("policyNo")}>
                <label>Policy Number</label>
                <Input
                  fluid
                  placeholder="Policy Number"
                  name="policyNo"
                  onChange={onChange}
                  values={values.policyNo}
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
                    handleOnInsuranceCompanySearch={(e) => {
                      e.persist(e);
                      handleOnInsuranceCompanySearch(e);
                    }}
                    handleOnInsuranceCompChange={handleOnInsuranceCompChange}
                    loading={insuranceCompanyLoading}
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
                    handleOnPremiumTypesChange={handleOnInsuranceClassChange}
                    handleOnPremiumTypesSearch={handleOnPremiumTypesSearch}
                  />
                )}
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                required
                error={errors.errorPaths.includes("startDate")}
              >
                <label>Start Date</label>
                <DateInput
                  autoComplete="off"
                  name="startDate"
                  placeholder="Start Date"
                  popupPosition="bottom left"
                  value={values.startDate ? values.startDate : ""}
                  iconPosition="left"
                  dateFormat="YYYY-MM-DD"
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("endDate")}
              >
                <label>End Date</label>
                <DateInput
                  name="endDate"
                  autoComplete="off"
                  placeholder="End Date"
                  popupPosition="bottom left"
                  value={values.endDate ? values.endDate : ""}
                  dateFormat="YYYY-MM-DD"
                  iconPosition="left"
                  onChange={onChange}
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
                {policyDetailsCount.map((key, index) => (
                  <Grid.Column width={8} key={key}>
                    <Form.Group widths="equal">
                      <Form.Field
                        required
                        error={
                          errors.errorPaths.includes("policyDetails") ||
                          errors.errorPaths.includes(
                            `policyDetails[${index}].name`
                          )
                        }
                      >
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

                <Grid.Column width={8}>
                  {policyDetailSetCount.map((key) => (
                    <React.Fragment key={key}>
                      <Form.Group widths="equal">
                        <Form.Field>
                          <label> Policy Type</label>
                          {typeSet && (
                            <PolicyTypes
                              handleOnPolicyTypeChange={
                                handleOnPolicyDetailSetChange
                              }
                              policyTypes={typeSet}
                              handleOnPolicyTypeSearch={
                                handleOnPolicyTypeSearch
                              }
                            />
                          )}
                        </Form.Field>
                      </Form.Group>
                      &nbsp;
                      <div>
                        {detailSet && fieldSet && (
                          <StaticPolicyFields
                            detailSet={detailSet}
                            handleOnPolicyFieldSetChange={
                              handleOnPolicyFieldSetChange
                            }
                          />
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </Grid.Column>
              </div>
            )}

            <Divider horizontal>Premiums Details</Divider>
            <Form.Group widths="equal">
              <Form.Field
                required
                error={errors.errorPaths.includes("premiumType")}
              >
                <label>Premium Type</label>
                <Input
                  fluid
                  placeholder="Basic Premium"
                  name="premiumType"
                  value="Basic Premium"
                />
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
                  values={values.minimumPremiumAmount}
                />
              </Form.Field>
              <Form.Field
                required
                error={errors.errorPaths.includes("commissionRate")}
              >
                <label>Premium Rate (%)</label>
                <Input
                  fluid
                  placeholder="Premium Rate"
                  name="commissionRate"
                  type="number"
                  step="any"
                  onChange={onChange}
                  value={values.commissionRate}
                />
              </Form.Field>
            </Form.Group>
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
                    values={values.minimumPremiumAmount}
                  />
                </Form.Field>
                <Form.Field>
                  <Grid>
                    <label>
                      <b>Premium Rate</b>
                    </label>
                    <Grid.Column width={12}>
                      <Input
                        fluid
                        placeholder="Premium Rate"
                        name="commissionRate"
                        type="number"
                        step="any"
                        id={key}
                        onChange={handleOnAddBenefitTypesChange}
                        values={values.commissionRate}
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
                        disabled={addBenefitCount.length > 1 ? false : true}
                      >
                        <Icon name="trash alternate" id={key} key={key} />
                      </Button>
                    </Grid.Column>
                  </Grid>
                </Form.Field>
              </Form.Group>
            ))}

            <Divider horizontal>Additional Levies</Divider>
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
                          addPremiums[key].premium
                        ]
                      }
                    />
                  )}
                </Form.Field>
                {addPremiums[key].commissionRate ? (
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
                          : addPremiums[key].minimumAmount
                          ? addPremiums[key].minimumAmount
                          : "0"}
                      </Label>
                    </Grid.Row>
                  </Grid>
                </Form.Field>
              </Form.Group>
            ))}
            <Divider horizontal>Totals</Divider>
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
                  placeholder="Commission Rate"
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
            <Button type="submit">Preview Policy</Button>
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
                createPolicy();
                setOpenModal(false);
                setResponseErrors([]);
              }}
            >
              Save Policy
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </Container>
  );
}
