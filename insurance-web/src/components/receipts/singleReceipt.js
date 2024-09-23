import React, { useState, useContext, useEffect } from 'react';
import { GET_RECEIPT } from './queries'
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { Segment, Image, Grid, Label, Container, Header, Icon } from 'semantic-ui-react';
import { ReceiptContext } from '../../context/receipt';
import { AuthContext } from '../../context/auth';
import { Link } from 'react-router-dom';

export default function ReceiptProfile({ props }) {
  const [receipt, setReceipt] = useState('records');
  const [fetched, setFetched] = useState(false);

  const context = useContext(ReceiptContext);
  const authContext = useContext(AuthContext);
  const receiptId = props.computedMatch.params.receiptId


  const { data: receiptData } = useQuery(GET_RECEIPT, { variables: { id: receiptId } })
  useEffect(() => {
    if (receiptData) {
      setReceipt(receiptData.motorReceipt)
      if (!fetched) {
        context.getReceipt(receiptData.motorReceipt)
        setFetched(true)
      }
    }
  }, [context, fetched, receiptData])
  return (

    <div>
      {receipt &&
        <Container>
          <Grid container columns={1} padded>
            <Grid.Column>
              <div className="content-wrapper">
                <Header as='h2'>
                  <Icon name='file' />
                  <Header.Content>
                    <a href="/staff/dashboard/overview">Overview</a> {'>'} <a href="/staff/dashboard/receipt/view-receipts">Receipts</a> {'>'} Details
                                    <Header.Subheader>
                      Hey there {authContext.user.username},
                                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </div>
            </Grid.Column>

          </Grid>
          <Grid>
            {receipt.id && <Grid celled container stackable>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Image className="ui centered image" src={authContext.user.image || "https://res.cloudinary.com/dsw3onksq/image/upload/v1607329111/fileuser-avatar-2png-wikimedia-commons-user-avatar-png-450_450_kuzijz.png"} circular size="tiny" />

                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Segment>
                    <Label as='a' tag>Receipt Number: </Label> {receipt.receiptNumber}
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Label as='a' tag>Posting Date: </Label>{moment(receipt.createdAt).format('ddd, MMM Do YYYY')}, at {moment(receipt.createdAt).format('HH:mm:ss')}
                  </Segment>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Segment>
                    <Label as='a' tag>Transaction Date: </Label>  {moment(receipt.transactionDate).format('ddd, MMM Do YYYY')}
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Label as='a' tag>Amount in Words: </Label> {receipt.amountWords}
                  </Segment>
                </Grid.Column>
                {receipt.policy.individualClient ? <Grid.Column>
                  <Segment>
                    <Label as='a' tag>Client: </Label> {receipt.policy.individualClient.firstName} - {receipt.policy.individualClient.lastName}
                  </Segment>
                </Grid.Column>
                :<Grid.Column>
                  <Segment>
                    <Label as='a' tag>Corporate Client: </Label> {receipt.policy.corporateClient.name}
                  </Segment>
                </Grid.Column>}
                <Grid.Column>
                  <Segment>
                    <Label as='a' tag>Amount in Figures: </Label> {receipt.amountFigures}
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  {receipt.issuedBy && <Segment>
                    <Label as='a' tag>Issued By: </Label>
                    <Link to={`/staff/dashboard/users/profile/${receipt.issuedBy.id}`}>{receipt.issuedBy.firstName} {receipt.issuedBy.lastName}</Link>
                  </Segment>}
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Label as='a' tag>Payment Mode: </Label> {receipt.paymentMode}
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Label as='a' tag>Motor Policy: </Label>
                    <Link to={`/staff/dashboard/policies/general/motor/details/${receipt.policy.id}`}>
                      {receipt.policy.policyNo}
                    </Link>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>

              </Grid.Row>
            </Grid>}
          </Grid>

        </Container >
      }
    </div>)
}
