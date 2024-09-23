import { useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Input,
  Modal,
  ModalActions,
  ModalContent
} from "semantic-ui-react";
import { FETCH_INSURANCE_COMP } from "../policies/queries";
import { UPDATE_INSURANCE_COMPANY } from "./queries";

export default function EditInsuranceCo({
  open,
  handleClose,
  handleOpen,
  company,
  pagination,
}) {
  const [newValues, setNewValues] = useState({});
  const [updateCompany, { loading }] = useMutation(
    UPDATE_INSURANCE_COMPANY
  );
  const handleSubmit = () => {
    try {
      updateCompany({
        variables: { input: newValues, id: company?.id },
        refetchQueries: () => [
          {
            query: FETCH_INSURANCE_COMP,
            variables: pagination,
          },
        ],
      });
      handleClose();
    } catch (err) {
      console.log("updating", err);
    }
  };
  const handleChange = ({ target }) => {
    if (!target?.name || !target?.value) return;
    const { name, value } = target;
    if (name in company) {
      setNewValues((prev) => ({ ...prev, [name]: value }));
    }
  };
  return (
    <Modal closeIcon open={open} onClose={handleClose} onOpen={handleOpen}>
      <Header content="Edit Company Details" textAlign="center" />
      <ModalContent>
        <Container>
          <Grid container padded>
            <Grid.Column>
              <Form>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Company Name</label>
                    <Input
                      fluid
                      name="name"
                      placeholder="Name"
                      defaultValue={company?.name || ""}
                      onChange={handleChange}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Contact Person</label>
                    <Input
                      fluid
                      name="contactPerson"
                      placeholder="Conatct Person"
                      defaultValue={company?.contactPerson || ""}
                      onChange={handleChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Email</label>
                    <Input
                      fluid
                      name="email"
                      placeholder="Email"
                      defaultValue={company?.email || ""}
                      onChange={handleChange}
                    />
                  </Form.Field>
                </Form.Group>

                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Physical Address</label>
                    <Input
                      fluid
                      name="physicalAddress"
                      placeholder="Physical Address"
                      defaultValue={company?.physicalAddress || ""}
                      onChange={handleChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Postal Address</label>
                    <Input
                      fluid
                      name="postalAddress"
                      placeholder="Postal Address"
                      defaultValue={company?.postalAddress || ""}
                      onChange={handleChange}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Telephone Number</label>
                    <Input
                      fluid
                      name="telephoneNumber"
                      placeholder="Telephone Number"
                      defaultValue={company?.telephoneNumber || ""}
                      onChange={handleChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Mobile Number</label>
                    <Input
                      fluid
                      name="mobileNumber"
                      placeholder="Mobile Number"
                      defaultValue={company?.mobileNumber || ""}
                      onChange={handleChange}
                    />
                  </Form.Field>
                </Form.Group>
              </Form>
            </Grid.Column>
          </Grid>
        </Container>
      </ModalContent>
      <ModalActions>
        <Button basic color="black" onClick={handleClose} disabled={loading}>
          cancel
        </Button>
        <Button color="blue" onClick={handleSubmit} disabled={loading}>
          submit
        </Button>
      </ModalActions>
    </Modal>
  );
}

// const schema = Yup.object().shape({
//   email: Yup.string().email("Email must be valid"),
//   phoneNumber: Yup.string()
//     .min(12, "Invalid telephone number")
//     .max(14, "Invalid telephone number"),
//   telephoneNumber: Yup.string()
//     .min(12, "Invalid telephone number")
//     .max(14, "Invalid telephone number"),
// });
