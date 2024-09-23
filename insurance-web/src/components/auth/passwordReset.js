import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Grid, Container, Header, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/react-hooks';
import { PASS_RESET_REQUEST } from './queries'

import '../root.scss';

function PasswordReset(props) {
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState({});



  const [values, setValues] = useState({
    email: "",
  });


  const handleDismiss = () => {
    setVisible(false)
  }

  const [resetPassword, { loading }] = useMutation(PASS_RESET_REQUEST, {
    update(_, result) {
      setMessage(result.data.passwordReset)
    },
    onError(err) {
      try {
        if (err.graphQLErrors) {
          setErrors({ message: err.graphQLErrors[0].message });
        }

        if (err.networkError !== null && err.networkError !== 'undefined') {

          setErrors({ message: err.networkError.result.errors[0] });

        } else if (err.graphQLErrors !== null && err.networkError !== 'undefined') {
          setErrors({ message: err.graphQLErrors.result.errors[0] });

        }
      } catch (e) { }

    },
    variables: values
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  const onSubmit = (event) => {
    event.preventDefault();
    setErrors({})
    resetPassword();
    setVisible(true);
  }

  return (
    <div className='.app-container'>
      <Container>
        <Grid padded>
          <Grid.Row>
            <Grid.Column>
              <Header as='h1'>Reset Password</Header>
              {message.message ?
                <Message
                  onDismiss={handleDismiss}
                  header='System Response'
                  content={message.message}
                />
                :
                ''
              }
              <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>

                <Form.Field>
                  <input
                    placeholder='Enter your email'
                    name='email'
                    type="email"
                    value={values.email}
                    onChange={onChange}

                  />
                </Form.Field>

                <div className='center'>
                  Already have an account?
                                    <Link to="/"> Login</Link>
                </div>
                <Button type='submit' secondary>Get password reset link</Button>
              </Form>

              {visible && Object.keys(errors).length ?
                <Message
                  onDismiss={handleDismiss}
                  header='Failed!'
                  warning
                  content={errors ? errors.message : ''}
                />
                :
                ''

              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

export default PasswordReset;
