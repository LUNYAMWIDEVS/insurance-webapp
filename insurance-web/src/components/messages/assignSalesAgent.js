/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  Grid,
  Container,
  Divider,
  Header,
  Icon,
  Menu,
  Tab,
  Button,
  Form,
} from "semantic-ui-react";
import "react-chat-elements/dist/main.css";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { ASSIGN_SALES_AGENT, FETCH_USERS_QUERY } from "./queries";
import { AuthContext } from "../../context/auth";
import { salesAgentContext } from "../../context/salesAgent";
import Agents from "./listAgents";

export default function AssignSalesAgent({ props }) {
  let history = useHistory();
  const authContext = useContext(AuthContext);
  const [agents, setAgents] = useState([]);
  const context = useContext(salesAgentContext);
  const whatsappPhoneNumber = props.computedMatch.params.whatsappPhoneNumber;
  let recipientsColumns = 1;
  const [fetched, setFetched] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    whatsappPhoneNumber: whatsappPhoneNumber,
  });
  const [values, setValues] = useState({
    whatsappPhoneNumber: whatsappPhoneNumber,
    salesAgentAssignedId: "",
  });

  const { data } = useQuery(FETCH_USERS_QUERY, { variables: pagination });
  useEffect(() => {
    if (data) {
      setAgents(data.users);
    }
  }, [data, context, agents]);

  const [assignSalesAgent, { loading }] = useCallback(
    useMutation(ASSIGN_SALES_AGENT, {
      update(_, result) {
        context.assignSalesAgent(result.data.assignSalesAgent.agent);
        history.push({
          pathname: `/staff/dashboard/crm/whatsapp-messages`,
        });
      },
      onError(err) {
        try {
          console.log(
            err.graphQLErrors && err.graphQLErrors[0]
              ? err.graphQLErrors[0].message
              : err.networkError && err.networkError.result
              ? err.networkError.result.errors
              : err
          );
        } catch (e) {
          console.log(e);
        }
      },
      variables: values,
    })
  );

  const handleOnAgentChange = (e, { value }) => {
    e.preventDefault();
    setValues({ ...values, salesAgentAssignedId: value, updated: true });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    assignSalesAgent();
  };
  function assignment() {
    return (
      <Container>
        <Divider></Divider>
        <Form>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Agents</label>
              {agents && agents.items && (
                <Agents
                  agents={agents.items}
                  multiple={true}
                  handleOnAgentChange={handleOnAgentChange}
                />
              )}
            </Form.Field>
          </Form.Group>
          <Button
            type="submit"
            positive
            onClick={() => {
              assignSalesAgent();
            }}
          >
            Assign Sales Agent
          </Button>
        </Form>
      </Container>
    );
  }

  const panes = [
    {
      menuItem: <Menu.Item key="Message">Assign A Sales Agent</Menu.Item>,
      render: () => {
        return <Tab.Pane>{assignment()}</Tab.Pane>;
      },
    },
  ];

  return (
    <Container>
      <Grid container columns={1} padded>
        <Grid.Column>
          <div className="content-wrapper">
            <Header as="h2">
              <Icon name="file" />
              <Header.Content>
                <a href="/staff/dashboard/overview">Overview</a> {">"}{" "}
                <a href="/staff/dashboard/crm">CRM</a> {">"}{" "}
                <a href="/staff/dashboard/crm/agents">Messages</a> {">"} Message
                Details
                <Header.Subheader>
                  Hey there {authContext.user.username}, find a list of motor
                  policies under General Insurance below
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>
      </Grid>

      <Grid container padded>
        <Grid.Column>
          <Tab panes={panes} />
        </Grid.Column>
      </Grid>
    </Container>
  );
}
