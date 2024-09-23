import { useMutation, useQuery } from "@apollo/react-hooks";
import moment from "moment";
import numWords from "num-to-words";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { DateInput } from "semantic-ui-calendar-react";
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Tab
} from "semantic-ui-react";
import * as yup from "yup";
import { AuthContext } from "../../context/auth";
import { ReceiptContext } from "../../context/receipt";
import PremiumTypes from "../policies/premiumTypes";
import {
  FETCH_MINIMAL_MOTOR_POLICIES,
  GET_MOTOR_POLICY_OPTS,
} from "../policies/queries";
import FilterPolicies from "./filterPolicies";
import PaymentOptions from "./listReceiptOptions";
import { ADD_NEW_RECEIPT, GET_RECEIPT_OPTS } from "./queries";

function AddNewReceipt({ props }) {
  const authContext = useContext(AuthContext);
  let history = useHistory();

  const [errors, setErrors] = useState({
    errorPaths: [],
    errors: [],
  });
  const [visible, setVisible] = useState(false);

  const context = useContext(ReceiptContext);
  const [successMsg, setSuccessMsg] = useState();
  const [responseErrors, setResponseErrors] = useState([]);
  const [receiptOpts, setReceiptOpts] = useState();

  const [policyNumber, setMotorPolicy] = useState();
  const [selectedInsuranceClass, setSelectedInsuranceClass] = useState();
  // Add limit set to 200 to display available policies fix the previous issue list a maximum on 10 entries only
  const [search, setSearch] = useState({ search: "", limit: 200 });
  const [policyOpts, setPolicyOpts] = useState();
  const [values, setValues] = useState({
    updated: true,
    afterSubmit: false,
    policyNumber: "",
  });

  let schema = yup.object().shape({
    transactionDate: yup.date().required("Please provide the transaction date"),
    amountFigures: yup
      .string()
      .required("Please provide the amount in figures"),
    paymentMode: yup.string().required("Please indicate the payment mode used"),
    policyNumber: yup.string().required("Please provide the motor policy "),
  });

  const { data: receiptOptsData } = useQuery(GET_RECEIPT_OPTS);
  useEffect(() => {
    if (receiptOptsData) {
      setReceiptOpts(receiptOptsData.receiptOptions);
    }
  }, [receiptOptsData, receiptOpts]);

  const { data: motorPolicyData } = useQuery(FETCH_MINIMAL_MOTOR_POLICIES, {
    variables: search,
  });
  useEffect(() => {
    if (motorPolicyData) {
      setMotorPolicy(motorPolicyData.motorPolicies.items);
    }
  }, [motorPolicyData]);

  const { data: policyOptsData } = useQuery(GET_MOTOR_POLICY_OPTS);

  useEffect(() => {
    setPolicyOpts(policyOptsData);
  }, [policyOptsData]);

  const handleOnInsuranceClassChange = (e, { value, premiumTypes }) => {
    e.preventDefault();
    let selected = premiumTypes.find((item) => item.value === value);
    setSelectedInsuranceClass(selected.text);
  };

  const [addReceipt, { loading }] = useCallback(
    useMutation(ADD_NEW_RECEIPT, {
      update(_, result) {
        context.createReceipt(result.data.createMotorReceipt.receipt);
        setVisible(false);
        let receiptData = result.data.createMotorReceipt.receipt;
        history.push({
          pathname: `/staff/dashboard/receipt/profile/${receiptData.id}`,
          state: { receipt: receiptData, receiptId: receiptData.id },
        });

        setSuccessMsg("Successfully Created A New Receipt");
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
          setVisible(true);
        }
      },
      variables: values,
    })
  );

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

  useEffect(() => {
    if (values.updated) {
      const data = { ...values, updated: false };
      if (values.amountFigures) {
        data.amountWords = numWords(+values.amountFigures);
      }
      setValues(data);
      if (values.afterSubmit) {
        validate(values);
      }
    }
  }, [values, validate]);

  const onChange = useCallback(
    (event, { name, value }) => {
      setValues({ ...values, [name]: value, updated: true });
    },
    [values]
  );

  const handleOnMotorPolicySearch = (e) => {
    setSearch({ search: e.target.value, limit: 200 });
  };

  const handleOnMotorPolicyChange = (e, { value }) => {
    e.preventDefault();
    setValues({ ...values, policyNumber: value, updated: true });
  };

  const handleOnReceiptOptionsChange = (e, { value }) => {
    e.preventDefault();
    setValues({ ...values, paymentMode: value, updated: true });
  };

  const handleDismiss = () => {
    setVisible(false);
    setSuccessMsg("");
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSuccessMsg("");
    validate(values);
    setValues({ ...values, afterSubmit: true });
    if (!errors.errors.length) {
      addReceipt();
    }
    setVisible(false);
  };
  const panes = [
    {
      menuItem: "Create Receipt",
      render: () => (
        <Grid.Column>
          {successMsg ? (
            <Message
              positive
              onDismiss={handleDismiss}
              header="status"
              content={successMsg}
            />
          ) : (
            ""
          )}

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
                {!!responseErrors.length && <Message>{responseErrors}</Message>}
                {<Message.List items={errors.errors} />}
              </Message>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                required
                error={errors.errorPaths.includes("paymentMode")}
              >
                <label>Payment Mode</label>
                {receiptOpts && receiptOpts.receipt_options && (
                  <PaymentOptions
                    receiptOptionsList={receiptOpts.receipt_options}
                    handleOnReceiptOptionsChange={handleOnReceiptOptionsChange}
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

                <DateInput
                  name="transactionDate"
                  autoComplete="off"
                  placeholder="Transaction Date"
                  popupPosition="bottom left"
                  value={values.transactionDate ? values.transactionDate : ""}
                  iconPosition="left"
                  dateFormat="YYYY-MM-DD"
                  maxDate={moment()}
                  onChange={onChange}
                />
              </Form.Field>

              {policyOpts && (
                <Form.Field required>
                  <label>Insurance Class</label>
                  {policyOpts.motorPolicyOptions && (
                    <>
                      <PremiumTypes
                        premiumTypes={
                          policyOpts.motorPolicyOptions.insurance_class_options
                        }
                        placeholder="Filter policies by Insurance Class"
                        handleOnPremiumTypesChange={
                          handleOnInsuranceClassChange
                        }
                      />
                      <small>
                        Select an insurance class to display available policies
                      </small>
                    </>
                  )}
                </Form.Field>
              )}
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                required
                error={errors.errorPaths.includes("amountFigures")}
              >
                <label>Amount (Figures)</label>
                <Form.Input
                  fluid
                  placeholder="Amount in Figures"
                  name="amountFigures"
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Amount (Words)</label>
                <Form.Input
                  fluid
                  placeholder="Amount In Words"
                  name="amountWords"
                  value={values.amountWords ? values.amountWords : ""}
                />
              </Form.Field>
            </Form.Group>
            {selectedInsuranceClass && (
              <Form.Group widths="equal">
                <Form.Field
                  required
                  error={errors.errorPaths.includes("policyNumber")}
                >
                  <label>Policies</label>
                  {policyNumber && (
                    <FilterPolicies
                      motorPoliciesOptions={policyNumber}
                      handleOnMotorPolicySearch={handleOnMotorPolicySearch}
                      handleOnMotorPolicyChange={handleOnMotorPolicyChange}
                      selected={selectedInsuranceClass}
                    />
                  )}
                </Form.Field>
              </Form.Group>
            )}

            <Button type="submit">Generate Receipt</Button>
          </Form>
        </Grid.Column>
      ),
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
                <a href="/staff/dashboard/overview">Overview</a> {">"}{" "}
                <a href="/staff/dashboard/receipt/view-receipts">Receipts</a>{" "}
                {">"} Receipt
                <Header.Subheader>
                  Hello there {authContext.user.username}, Fill in this form to
                  generate a receipt
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>
      </Grid>
      <Tab
        className="clear-top"
        menu={{ secondary: true, pointing: true }}
        panes={panes}
      />
    </Container>
  );
}

export default AddNewReceipt;
