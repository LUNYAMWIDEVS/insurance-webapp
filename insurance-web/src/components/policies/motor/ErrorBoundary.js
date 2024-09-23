import React from "react";
import { Button, Container, Grid, Header, Icon } from "semantic-ui-react";

const ErrorView = ({ error, errorInfo }) => {
  return (
    <Container>
      <Grid container columns={1} padded>
        <Grid.Column>
          <div className="content-wrapper">
            <Header as="h2">
              <Icon name="exclamation triangle" />
              <Header.Content>
                Something went wrong
                <Header.Subheader>{error && error.toString()}</Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        </Grid.Column>
        <Grid.Column>
          {/* <h4
            style={{ cursor: "pointer", color: "#0077FF",  }}
          ></h4> */}
          <div style={{ marginLeft: 60 }}>
            <Button
              primary
              onClick={() => {
                window.location.href = "/staff/dashboard/overview";
              }}
            >
              Return to Home Page
            </Button>
            <Button secondary onClick={() => {
                window.location.reload()
              }}>Reload This Page</Button>
          </div>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: "", errorInfo: "", hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorView error={this.state.error} errorInfo={this.state.errorInfo} />
      );
    }

    return this.props.children;
  }
}
