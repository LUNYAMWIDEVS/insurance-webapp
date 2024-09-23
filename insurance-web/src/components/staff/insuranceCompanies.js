import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Button,
  Container,
  Header,
  Icon,
  Form,
  Label,
  Menu,
  Tab,
  Pagination,
  Loader,
} from "semantic-ui-react";
import "../root.scss";
import { FETCH_INSURANCE_COMP } from "../policies/queries";
import { useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../../context/auth";
import EditInsuranceCo from "./EditInsuranceCompany";

export default function InsuranceCompanyListings(props) {
  const [insuranceCos, setInsuranceCos] = useState();
  const userContext = useContext(AuthContext);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    search: "",
  });

  const { data, loading } = useQuery(FETCH_INSURANCE_COMP, {
    variables: pagination,
  });

  useEffect(() => {
    if (data) {
      setInsuranceCos(data.insuranceCompanies);
    }
  }, [data, insuranceCos]);

  const handleOnSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, search: e.target.value });
  };

  const handleOnPageChange = (e, data) => {
    e.preventDefault();
    setPagination({ ...pagination, page: data.activePage });
  };

  const panes = [
    {
      menuItem: (
        <Menu.Item key="clients">
          Insurance Companies
          <Label>
            {insuranceCos && insuranceCos.count && insuranceCos.count}
          </Label>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane>
            {loading ? (
              <Loader size="medium" active />
            ) : (
              <CompanyList
                insuranceCos={insuranceCos}
                pagination={pagination}
              />
            )}
            <br />
            {insuranceCos && (
              <Pagination
                defaultActivePage={1}
                firstItem={null}
                lastItem={null}
                pointing
                secondary
                onPageChange={handleOnPageChange}
                totalPages={insuranceCos?.pages || 1}
              />
            )}
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
              <Icon name="building" />
              <Header.Content>
                Insurance Company Listings
                <Header.Subheader>
                  {userContext.user.username}, find a list of companies below
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>

        <Grid.Column width={3} className="clear-left">
          <Button basic href="/staff/dashboard/add-insurance-company">
            + add new
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
              <Form.Button icon size={"medium"}>
                <Icon name="search" />
                Find Company
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

function CompanyList({ insuranceCos, pagination }) {
  return (
    <Grid container columns={6}>
      <Grid.Row>
        <Grid.Column>
          <Header as="h4">Name</Header>
        </Grid.Column>
        <Grid.Column>
          <Header as="h4">Email</Header>
        </Grid.Column>
        <Grid.Column>
          <Header as="h4">Contact Person</Header>
        </Grid.Column>
        <Grid.Column>
          <Header as="h4">Phone Number</Header>
        </Grid.Column>
        <Grid.Column>
          <Header as="h4">Physical Address</Header>
        </Grid.Column>
        <Grid.Column>
          <Header as="h4">Edit</Header>
        </Grid.Column>
      </Grid.Row>

      {insuranceCos &&
        insuranceCos.items.map((company, key) => (
          <CompanyDetails company={company} key={key} pagination={pagination} />
        ))}
    </Grid>
  );
}

function CompanyDetails({ company, pagination }) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  return (
    <Grid.Row>
      <Grid.Column>
        <span style={{ textTransform: "titlecase", fontSize: "12px" }}>
          {company.name}
        </span>
      </Grid.Column>
      <Grid.Column style={{ textTransform: "titlecase", fontSize: "12px" }}>
        {company.email}
      </Grid.Column>
      <Grid.Column style={{ textTransform: "titlecase", fontSize: "12px" }}>
        {company.contactPerson}
      </Grid.Column>
      <Grid.Column style={{ textTransform: "titlecase", fontSize: "12px" }}>
        {company.telephoneNumber[0] || company.mobileNumber[0]}
      </Grid.Column>
      <Grid.Column>
        <span style={{ textTransform: "titlecase", fontSize: "12px" }}>
          {company.physicalAddress}
        </span>
      </Grid.Column>
      <Grid.Column>
        <Button basic icon onClick={handleOpen}>
          <Icon name="pencil alternate" />
        </Button>
      </Grid.Column>
      {open && (
        <EditInsuranceCo
          open={open}
          handleClose={handleClose}
          handleOpen={handleOpen}
          company={company}
          pagination={pagination}
        />
      )}
    </Grid.Row>
  );
}
