import { useQuery } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import { AGENCY_QUERY } from "../queries";
import {
  Button,
  Container,
  Divider,
  Grid,
  Image,
  Label,
  Segment,
} from "semantic-ui-react";
import moment from "moment";
import AgencyForm from "./agencyForm";

export default function AgencyDetails() {
  const [agencyData, setAgencyData] = useState({});
  const [edit, setEdit] = useState(false);
  const { data } = useQuery(AGENCY_QUERY);

  useEffect(() => {
    if (data?.profile) {
      setAgencyData(data.profile?.agency);
    }
  }, [data]);

  const handleEdit = () => {
    setEdit((prev) => !prev);
  };
  return (
    <>
      {!edit && (
        <Grid container>
          <Grid.Row columns={2}>
            <Grid.Column>
              <h3> {agencyData?.name}</h3>
            </Grid.Column>
            <Grid.Column floated="right" width={1}>
              <div className="centered-content">
                <Button onClick={handleEdit}>Edit</Button>
              </div>
            </Grid.Column>
          </Grid.Row>

          {agencyData && (
            <Grid container stackable>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Segment textAlign="left" size="small">
                    <Label as="a" tag>
                      Name:{" "}
                    </Label>{" "}
                    {agencyData?.name}
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment textAlign="left" size="small">
                    <Label as="a" tag>
                      Email:{" "}
                    </Label>{" "}
                    {agencyData?.agencyEmail}
                  </Segment>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Segment textAlign="left" size="small">
                    <Label as="a" tag>
                      Phone Number:{" "}
                    </Label>{" "}
                    {agencyData.phoneNumber}
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment textAlign="left" size="small">
                    <Label as="a" tag>
                      Office Location:{" "}
                    </Label>{" "}
                    {agencyData.officeLocation}
                  </Segment>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Segment textAlign="left" size="small">
                    <Label as="a" tag>
                      P.O Box:{" "}
                    </Label>{" "}
                    {agencyData?.boxNumber}
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment textAlign="left" size="small">
                    <Label as="a" tag>
                      Postal Code:{" "}
                    </Label>{" "}
                    {agencyData?.postalCode}
                  </Segment>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row columns={2}>
                <Grid.Column>
                  <Segment textAlign="left" size="small">
                    <Label as="a" tag>
                      Status:{" "}
                    </Label>{" "}
                    {agencyData?.isActive ? "Active" : "Not Active"}
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment textAlign="left" size="small">
                    <Label as="a" tag>
                      Created Date:{" "}
                    </Label>{" "}
                    {moment(agencyData.createdAt).format("ddd, MMM Do YYYY")}
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}
        </Grid>
      )}
      {edit && <AgencyForm details={agencyData} handleClose={handleEdit} />}
    </>
  );
}
