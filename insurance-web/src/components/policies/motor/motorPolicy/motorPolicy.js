import { useQuery } from "@apollo/react-hooks";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Dropdown,
  Grid,
  Header,
  Icon,
  Menu,
  Tab,
} from "semantic-ui-react";
import { AuthContext } from "../../../../context/auth";
import { GET_MOTOR_POLICY_OPTS } from "../../queries";
import MotorPolicyDetails from "../motorPolicyComponents/MotorPolicyDetails";
import PremiumDetails from "../motorPolicyComponents/PremiumDetails";

const amendTypes = [
  "PolicyAdditionObjectType",
  "PolicyDeletionObjectType",
  "PolicyRenewalObjectType",
];
export default function MotorPolicy({ motorPolicy }) {
  const authContext = useContext(AuthContext);
  const [policyOpts, setPolicyOpts] = useState();
  const [addBenefits, setAddBenefits] = useState([]);

  useEffect(() => {
    if (motorPolicy) {
      motorPolicy.additionalBenefits
        ? setAddBenefits(motorPolicy.additionalBenefits)
        : setAddBenefits(motorPolicy.premiums?.AdditionalBenefits);
    }
  }, [motorPolicy]);

  const { data: policyOptsData } = useQuery(GET_MOTOR_POLICY_OPTS);

  useEffect(() => {
    if (policyOptsData) {
      setPolicyOpts(policyOptsData.motorPolicyOptions);
    }
  }, [policyOptsData, policyOpts]);
  const panes = [
    {
      menuItem: <Menu.Item key="policy">Basic Policy Details</Menu.Item>,
      render: () => {
        return (
          <Tab.Pane>
            {
              <MotorPolicyDetails
                values={{ ...motorPolicy, ...motorPolicy.policy }}
                clientsData={{
                  individualClient:
                    motorPolicy?.individualClient ||
                    motorPolicy?.policy?.individualClient ||
                    {},
                }}
                policyDetails={
                  motorPolicy?.policyDetailSet?.length
                    ? motorPolicy.policyDetailSet
                    : motorPolicy?.policyDetails?.length
                    ? motorPolicy?.policyDetails
                    : []
                }
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
                values={{ ...motorPolicy, ...motorPolicy.policy }}
                premiumsData={{
                  additionalBenefits: addBenefits,
                  premiums: motorPolicy.premiums || {},
                  additionalPremiums: motorPolicy.additionalPremiums || {},
                }}
              />
            }
          </Tab.Pane>
        );
      },
    },
  ];

  return (
    <Container>
      <Grid container columns={4} padded>
        <Grid.Column width={4}>
          <div className="content-wrapper">
            <Header as="h3">
              <Icon name="file" />
              <Header.Content>
                <a href="/staff/dashboard/policies/general/motor">Policies</a>{" "}
                {">"} Policy Details
                <Header.Subheader>
                  Hey there {authContext.user.username}, find a view of policy
                  details below
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>
        <Grid.Column width={3} className="clear-left">
          {motorPolicy && (
            <Link
              to={`/staff/dashboard/policies/general/motor/reports/${motorPolicy.id}`}
            >
              {" "}
              <Button icon>
                <Icon name="chart line" /> View Report
              </Button>
            </Link>
          )}
        </Grid.Column>
        {/* <Grid.Column width={2}>
          <DeleteModal handleRemovalItem={" "} />
        </Grid.Column> */}
        <Grid.Column width={2}>
          <Dropdown text="Endorsement">
            <Dropdown.Menu>
              {/* assumes all policies are of MotorPolicyType */}
              {/* 1 === endorse a new policy, 2 === endorse a renewal, addition, or deletion */}
              <Dropdown.Item
                icon="add"
                text="Addition"
                as={Link}
                to={`/staff/dashboard/policies/general/motor/addition/${
                  amendTypes.includes(motorPolicy.__typename) ? 2 : 1
                }/${motorPolicy.id}`}
              />
              <Dropdown.Item
                icon="remove circle"
                text="Deletion"
                as={Link}
                to={`/staff/dashboard/policies/general/motor/deletion/${
                  amendTypes.includes(motorPolicy.__typename) ? 2 : 1
                }/${motorPolicy.id}`}
              />
              <Dropdown.Item
                icon="sync"
                text="Renew"
                as={Link}
                to={`/staff/dashboard/policies/general/motor/renew/${
                  amendTypes.includes(motorPolicy.__typename) ? 2 : 1
                }/${motorPolicy.id}`}
              />
            </Dropdown.Menu>
          </Dropdown>
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
