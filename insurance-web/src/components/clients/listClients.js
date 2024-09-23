import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import React, { useContext, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { Link } from "react-router-dom";
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
import { AuthContext } from "../../context/auth";
import "../root.scss";
import { FETCH_CLIENTS_QUERY, FETCH_CORPORATE_CLIENTS_QUERY } from "./queries";

export default function ClientRecords() {
  const authContext = useContext(AuthContext);
  const [pagination, setPagination] = useState({
    limit: 200,
    page: 1,
    search: "",
  });


  const { data: corporateData, loading: loadingCorporates } = useQuery(
    FETCH_CORPORATE_CLIENTS_QUERY,
    {
      variables: pagination,
    }
  );
  const { loading, data } = useQuery(FETCH_CLIENTS_QUERY, {
    variables: pagination,
  });
  // useEffect(() => {
  //   if (corporateData) {
  //     setCorporateClients(corporateData.corporateClients);
  //     setFetched(true);
  //   }
  //   if (!corporateFetched) {
  //     if (corporateData) {
  //       context.getCorporateClients(corporateData.corporateClients);
  //     }
  //   }
  //   if (data) {
  //     setClients(data.individualClients);
  //     setCorporateFetched(true);
  //   }
  //   if (!fetched) {
  //     if (data) {
  //       context.getClients(data.individualClients);
  //     }
  //   }
  // }, [data, context, fetched, corporateData, corporateFetched]);

  const handleOnPageChange = (e, data) => {
    e.preventDefault();
    setPagination({ ...pagination, page: data.activePage });
  };
  const handleOnSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, search: e.target.value });
  };

  const panes = [
    {
      menuItem: (
        <Menu.Item key="clients" disabled={loading || loadingCorporates}>
          Individual Clients<Label>{data?.individualClients?.count}</Label>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane>
            {loading ? (
              <Loader size="medium" active />
            ) : (
              <ClientList clientsData={data} />
            )}
            <br />
            {data?.individualClients?.pages && (
              <Pagination
                defaultActivePage={data?.individualClients?.page}
                firstItem={null}
                lastItem={null}
                pointing
                secondary
                onPageChange={handleOnPageChange}
                totalPages={data?.individualClients?.pages}
              />
            )}
            <ReactHTMLTableToExcel
              table="individualClientReports"
              filename="individualClientReports"
              sheet="Sheet 1"
              buttonText="Download individualClientReports"
            />
          </Tab.Pane>
        );
      },
    },
    {
      menuItem: (
        <Menu.Item
          key="corporateClients"
          disabled={loading || loadingCorporates}
        >
          Corporate Clients<Label>{corporateData?.corporateClients?.count}</Label>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane>
            {loadingCorporates ? (
              <Loader size="medium" active />
            ) : (
              <CorporateClientList corporateData={corporateData} />
            )}
            <br />
            {corporateData?.corporateClients?.pages && (
              <Pagination
                defaultActivePage={corporateData?.corporateClients?.page}
                firstItem={null}
                lastItem={null}
                pointing
                secondary
                onPageChange={handleOnPageChange}
                totalPages={corporateData?.corporateClients?.pages}
              />
            )}
            <ReactHTMLTableToExcel
              table="corporateClientReports"
              filename="corporateClientReports"
              sheet="Sheet 1"
              buttonText="Download corporateClientReports"
            />
          </Tab.Pane>
        );
      },
    },
  ];

  return (
    <Container>
      <Grid container columns={2} padded>
        <Grid.Column>
          <div className="content-wrapper">
            <Header as="h2">
              <Icon name="settings" />
              <Header.Content>
                <a href="/staff/dashboard/overview">Overview</a> {">"}{" "}
                <a href="/staff/dashboard/crm">CRM</a> {">"} Client Records
                <Header.Subheader>
                  Hey there {authContext.user.username}, here is your
                  client-records dashboard
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>

        <Grid.Column width={3} className="clear-left">
          <Button href="/staff/dashboard/add-new-client" color="blue">
            + Register New Client
          </Button>
        </Grid.Column>
      </Grid>

      <Grid container columns={1} padded>
        <Grid.Column>
          <Form>
            <Form.Group>
              <Form.Input
                placeholder="Name, Email, Id Number ..."
                name="name"
                onChange={handleOnSearch}
              />
              <Form.Button
                icon
                size={"medium"}
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Icon name="search" />
                Find Client
              </Form.Button>
            </Form.Group>
          </Form>
        </Grid.Column>
      </Grid>

      <Grid container columns={1} padded>
        <Grid.Column>
          <Tab panes={panes} />
        </Grid.Column>
      </Grid>
    </Container>
  );
}

function CorporateClientList({ corporateData }) {
  const corporateClients = corporateData?.corporateClients || [];
  return (
    <Table id="corporateClientReports">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>Phone Number</Table.HeaderCell>
          <Table.HeaderCell>Town</Table.HeaderCell>
          <Table.HeaderCell>Postal Address</Table.HeaderCell>
          <Table.HeaderCell>Join Date</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {corporateClients.items ? (
          corporateClients.items.map((client, key) => (
            <Table.Row key={key}>
              <Table.Cell>
                <span>{key + 1}. </span>
                <span style={{ textTransform: "titlecase" }}>
                  {client.name}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span style={{ fontSize: ".9em" }}>{client.email}</span>
              </Table.Cell>
              <Table.Cell>{client.phoneNumber}</Table.Cell>
              <Table.Cell>{client.town}</Table.Cell>
              <Table.Cell>{client.postalAddress}</Table.Cell>
              <Table.Cell>
                {moment(client.createdAt).format("DD/MM/YYYY")}
              </Table.Cell>
              <Table.Cell>
                <Link
                  to={`/staff/dashboard/corporate-client/profile/${client.id}`}
                >
                  <Button icon>
                    <Icon name="external alternate" />
                  </Button>
                </Link>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell>No Clients Available</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}
function ClientList({ clientsData }) {
  const clients = clientsData?.individualClients || [];
  return (
    <Table id="individualClientReports">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Client No.</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Occupation</Table.HeaderCell>
          <Table.HeaderCell>Phone Number</Table.HeaderCell>
          <Table.HeaderCell>Join Date</Table.HeaderCell>
          <Table.HeaderCell>Residence</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {clients.items ? (
          clients.items.map((client, key) => (
            <Table.Row key={key}>
              <Table.Cell>
                <span>{key + 1}. </span>
                <span style={{ fontSize: ".9em" }}>{client.clientNumber}</span>
              </Table.Cell>
              <Table.Cell>
                <span style={{ textTransform: "titlecase" }}>
                  {client.firstName} {client.lastName} {client.surname}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span style={{ fontSize: ".9em" }}>{client.occupation}</span>
              </Table.Cell>
              <Table.Cell>{client.phoneNumber}</Table.Cell>
              <Table.Cell>
                {moment(client.createdAt).format("DD/MM/YYYY")}
              </Table.Cell>
              <Table.Cell>
                {client.location ? client.location : client.town}{" "}
              </Table.Cell>
              <Table.Cell>
                <Link to={`/staff/dashboard/clients/profile/${client.id}`}>
                  <Button icon>
                    <Icon name="external alternate" />
                  </Button>
                </Link>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell>No Clients Available</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}
