import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
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
import { useQuery } from "@apollo/react-hooks";
import { GET_RECEIPTS } from "./queries";
import { ReceiptContext } from "../../context/receipt";
import "../root.scss";
import { AuthContext } from "../../context/auth";

export default function ReceiptRecords(props) {
  const authContext = useContext(AuthContext);
  const context = useContext(ReceiptContext);
  const [fetched, setFetched] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    search: "",
  });

  const [receipts, setReceipts] = useState([]);

  const { data: receiptData, loading } = useQuery(GET_RECEIPTS, {
    variables: pagination,
  });
  useEffect(() => {
    if (receiptData) {
      setReceipts(receiptData.motorReceipts);
      setFetched(true);
    }
    if (!setFetched) {
      if (receiptData) {
        context.getReceipts(receiptData.motorReceipts);
      }
    }

    if (!fetched) {
      if (receiptData) {
        context.getReceipts(receiptData.motorReceipts);
      }
    }
  }, [context, fetched, receiptData]);

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
        <Menu.Item key="receipts">
          Receipts<Label>{receipts.count}</Label>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane>
            {loading ? <Loader active size="medium" /> : <ReceiptList receipts={receipts} />}
            <br />
            {receipts.pages && (
              <Pagination
                defaultActivePage={receipts.page}
                firstItem={null}
                lastItem={null}
                pointing
                secondary
                onPageChange={handleOnPageChange}
                totalPages={receipts.pages}
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
              <Icon name="settings" />
              <Header.Content>
                <a href="/staff/dashboard/overview">Overview</a> {">"}{" "}
                <a href="/staff/dashboard/receipt/view-receipts">Receipts</a>{" "}
                {">"}
                <Header.Subheader>
                  Hey there {authContext.user.username}, here is your
                  receipt-records dashboard
                </Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>

        <Grid.Column width={3} className="clear-left">
          <Button href="/staff/dashboard/receipt/add-new-receipt" color="blue">
            + Generate A Receipt
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
                Find Receipts
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

function ReceiptList({ receipts }) {
  return (
    <Grid container columns={7}>
      <Grid.Row>
        <Grid.Column>
          <Header as="h4">ReceiptNumber</Header>
        </Grid.Column>
        <Grid.Column>
          <Header as="h4">Posting Date</Header>
        </Grid.Column>
        <Grid.Column>
          <Header as="h4">Transaction Date</Header>
        </Grid.Column>
        <Grid.Column>
          <Header as="h4">Amount Words</Header>
        </Grid.Column>
        <Grid.Column>
          <Header as="h4">Amount Figures</Header>
        </Grid.Column>
        <Grid.Column>
          <Header as="h4">Issued By</Header>
        </Grid.Column>
        <Grid.Column></Grid.Column>
      </Grid.Row>

      {receipts?.items
        ? receipts.items.map((receipt, key) => (
            <Grid.Row key={receipt.id}>
              <Grid.Column>
                <span>{key + 1}. </span>
                <span style={{ textTransform: "titlecase" }}>
                  {receipt.receiptNumber}
                </span>
              </Grid.Column>
              <Grid.Column>
                <span style={{ fontSize: ".9em" }}>
                  {moment(receipt.createdAt).format("ddd, MMM Do YYYY")}
                </span>
              </Grid.Column>
              <Grid.Column>{receipt.transactionDate}</Grid.Column>
              <Grid.Column>{receipt.amountWords}</Grid.Column>
              <Grid.Column>{receipt.amountFigures}</Grid.Column>
              {receipt.issuedBy && (
                <Grid.Column>
                  {receipt.issuedBy.firstName} {receipt.issuedBy.lastName}
                </Grid.Column>
              )}
              <Grid.Column width={1} floated="right">
                <Link to={`/staff/dashboard/receipt/profile/${receipt.id}`}>
                  <Button icon>
                    <Icon name="external alternate" />
                  </Button>
                </Link>
              </Grid.Column>
            </Grid.Row>
          ))
        : "No Receipts Available"}
    </Grid>
  );
}
