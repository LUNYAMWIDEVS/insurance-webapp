import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import React, { useContext, useEffect, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Label,
  Loader,
  Menu,
  Pagination,
  Tab,
  Table,
} from "semantic-ui-react";
import { AuthContext } from "../../../context/auth";
import { FETCH_MOTOR_POLICIES } from "../queries";
import DateFilter from "./listDateFilter";
import PolicyRow from "./PolicyRow";
import { MotorPolicyContext } from "../../../context/policy/motor";

export const getItemNumber = ({ hasPrev, limit, page, itemIndex }) => {
  const prev = hasPrev ? page - 1 : 0;
  const num = prev * limit + itemIndex;
  return num;
};

export default function MotorPolicies() {
  const authContext = useContext(AuthContext);
  const [motorPolicies, setMotorPolicies] = useState({});
  const [isSearch, setIsSearch] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    search: "",
  });

  const context = useContext(MotorPolicyContext);
  const { loading, data: motorPoliciesData } = useQuery(FETCH_MOTOR_POLICIES, {
    variables: { limit: pagination.limit, page: pagination.page },
  });
  const [fetchPolicies, { loading: searching }] = useLazyQuery(
    FETCH_MOTOR_POLICIES,
    {
      onCompleted(data) {
        setMotorPolicies(data.motorPolicies);
        if (isSearch === null) {
          // null is the middle state; false -> null -> true
          setIsSearch(true);
        } else if (isFiltering === null) {
          setIsFiltering(true);
        }
      },
    }
  );

  useEffect(() => {
    if (motorPoliciesData && isSearch === false && isFiltering === false) {
      setMotorPolicies(motorPoliciesData.motorPolicies);
    }
  }, [motorPoliciesData, context, isSearch, isFiltering]);

  const handleOnPageChange = (e, data) => {
    e.preventDefault();
    setPagination({ ...pagination, page: data.activePage });
  };
  const handleOnSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, search: e.target.value });
  };

  const resetPagination = () => {
    setPagination({
      limit: 10,
      page: 1,
      search: "",
    });
  };

  const panes = [
    {
      menuItem: (
        <Menu.Item key="motor" disabled={true}>
          Policy<Label>{motorPolicies && motorPolicies.count}</Label>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane>
            {
              <MotorList
                motorPolicies={motorPolicies}
                paginationData={{
                  page: motorPolicies?.page,
                  limit: pagination.limit,
                  hasPrev: motorPolicies.hasPrev,
                }}
              />
            }
            <br />
            {motorPolicies.pages ? (
              <Pagination
                defaultActivePage={motorPolicies.page}
                firstItem={null}
                lastItem={null}
                pointing
                secondary
                onPageChange={handleOnPageChange}
                totalPages={motorPolicies.pages}
              />
            ) : (
              ""
            )}
          </Tab.Pane>
        );
      },
    },
  ];

  return (
    <Container>
      <Grid
        container
        columns={2}
        padded
        style={{ justifyContent: "space-between" }}
      >
        <Grid.Column>
          <div className="content-wrapper">
            <Header as="h2">
              <Icon name="file" />
              <Header.Content>
                <a href="/staff/dashboard/overview">Policies</a> {">"} Policies
                <Header.Subheader>
                  Hey there {authContext.user.username}, find a list of motor
                  policies under General Insurance below
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>

        <Grid.Column
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button href="/staff/dashboard/add-new-motor-policy" color="blue">
            + Add New Policy
          </Button>
        </Grid.Column>
      </Grid>

      <Grid
        container
        columns={2}
        padded
        style={{ justifyContent: "space-between" }}
      >
        <Grid.Column style={{ justifyContent: "space-between" }}>
          <Form>
            <Form.Group>
              <Form.Input
                placeholder="Name, Policy number..."
                name="name"
                onChange={handleOnSearch}
                value={pagination.search}
              />
              {isSearch ? (
                <Form.Button
                  icon
                  size={"small"}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSearch(false);
                    setMotorPolicies({}); // clears previous results
                    resetPagination();
                  }}
                >
                  <Icon name="cancel" size="small" />
                  Clear Results
                </Form.Button>
              ) : (
                <Form.Button
                  icon
                  size={"small"}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSearch(null);
                    fetchPolicies({ variables: { ...pagination, page: 1 } });
                  }}
                >
                  <Icon
                    name="search"
                    size="small"
                    style={{ marginRight: "5px" }}
                  />
                  Find Policy
                </Form.Button>
              )}
            </Form.Group>
          </Form>
        </Grid.Column>
        <Grid.Column
          style={{
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "3px",
              justifyContent: "end",
              width: "100%",
            }}
          >
            <DateFilter
              onFilterChange={fetchPolicies}
              pagination={pagination}
              setIsFiltering={setIsFiltering}
              isFiltering={isFiltering}
            />
            <ReactHTMLTableToExcel
              table="multipleReports"
              filename="Motor Policies Report"
              sheet="Sheet 1"
              buttonText="Download Report"
              className="reportDownload"
            />
          </div>
        </Grid.Column>
      </Grid>
      {(loading || searching) && (
        <Grid container columns={1} padded>
          <Grid.Column>
            <Loader active inline="centered" size="massive" />
          </Grid.Column>
        </Grid>
      )}

      <Grid container padded>
        <Grid.Column>
          <Tab panes={panes} pagination={pagination} />
        </Grid.Column>
      </Grid>
    </Container>
  );
}

function MotorList({ motorPolicies, paginationData }) {
  return (
    <div style={{ overflowX: "scroll" }}>
      <Table
        celled
        striped
        structured
        id="multipleReports"
        style={{ overflowX: "scroll" }}
      >
        <Table.Header>
          <ListHeader />
        </Table.Header>
        <Table.Body>
          {motorPolicies.items &&
            motorPolicies.items.map((policy, idx) => {
              const index = getItemNumber({
                ...paginationData,
                itemIndex: idx + 1,
              });
              const alph = (id) => String.fromCharCode(97 + id);
              return (
                <React.Fragment key={policy.id}>
                  <PolicyRow
                    policy={policy}
                    transactionType={policy.transactionType}
                    individualClient={policy.individualClient}
                    corporateClient={policy.corporateClient}
                    index={index}
                  />
                  {policy.policyrenewalSet.length > 0 && (
                    <>
                      {policy.policyrenewalSet.map((set, idx) => (
                        <PolicyRow
                          key={set.id || idx}
                          policy={set}
                          transactionType="Renewal"
                          individualClient={policy.individualClient}
                          corporateClient={policy.corporateClient}
                          index={`${index}${alph(idx)}`}
                        />
                      ))}
                    </>
                  )}
                  {policy.policyadditionSet.length > 0 && (
                    <>
                      {policy.policyadditionSet.map((set, idx) => (
                        <PolicyRow
                          key={set.id || idx}
                          policy={set}
                          transactionType="Addition"
                          individualClient={policy.individualClient}
                          corporateClient={policy.corporateClient}
                          index={`${index}${alph(
                            (policy?.policyrenewalSet?.length || 0) + idx
                          )}`}
                        />
                      ))}
                    </>
                  )}
                  {policy.policydeletionSet.length > 0 && (
                    <>
                      {policy.policydeletionSet.map((set, idx) => (
                        <PolicyRow
                          key={set.id || idx}
                          policy={set}
                          transactionType="Credit Note"
                          individualClient={policy.individualClient}
                          corporateClient={policy.corporateClient}
                          index={`${index}${alph(
                            (policy?.policyrenewalSet?.length || 0) +
                              (policy?.policyadditionSet?.length || 0) +
                              idx
                          )}`}
                        />
                      ))}
                    </>
                  )}
                </React.Fragment>
              );
            })}
        </Table.Body>
      </Table>
    </div>
  );
}

function ListHeader() {
  return (
    <Table.Row>
      <Table.HeaderCell>#</Table.HeaderCell>
      <Table.HeaderCell>Client Name</Table.HeaderCell>
      <Table.HeaderCell>Client No.</Table.HeaderCell>
      <Table.HeaderCell>Policy No.</Table.HeaderCell>
      <Table.HeaderCell>Debit/Credit Note No.</Table.HeaderCell>
      <Table.HeaderCell>Insurance Company</Table.HeaderCell>
      <Table.HeaderCell>Insurance Class</Table.HeaderCell>
      <Table.HeaderCell>Policy Type</Table.HeaderCell>
      <Table.HeaderCell>Policy Details</Table.HeaderCell>
      <Table.HeaderCell>Transaction Type</Table.HeaderCell>
      <Table.HeaderCell>Start Date</Table.HeaderCell>
      <Table.HeaderCell>End Date</Table.HeaderCell>
      <Table.HeaderCell>Premium (Ksh)</Table.HeaderCell>
      <Table.HeaderCell>Value</Table.HeaderCell>
      <Table.HeaderCell>Transaction Date</Table.HeaderCell>
      <Table.HeaderCell>Net Premiums</Table.HeaderCell>
      <Table.HeaderCell>Premium Paid</Table.HeaderCell>
      <Table.HeaderCell>Premium Balance</Table.HeaderCell>
      <Table.HeaderCell>Gross Commission</Table.HeaderCell>
      <Table.HeaderCell>Withholding Tax</Table.HeaderCell>
      <Table.HeaderCell>Net Commission</Table.HeaderCell>
      <Table.HeaderCell>Go To</Table.HeaderCell>
    </Table.Row>
  );
}
