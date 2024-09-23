import React, { useState, useContext, useEffect } from "react";
import {
  Menu,
  Segment,
  Image,
  Dropdown,
  Sidebar,
  Button,
  Grid,
} from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import logo from "./brooks.png";
import { AuthContext } from "../../context/auth";
import BaseRouter from "../../routes";

export default function Layout(props) {
  const [activeItem, setActiveItem] = useState({});
  const [isHome, setIsHome] = useState(false);
  const context = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (window.location.pathname === "/") setIsHome(true);
  }, []);
  const onClickHandler = () => {
    window.location.href = "/";
  };
  const [visible, setVisible] = useState(false);
  const handleHideClick = () => setVisible(false);
  const handleShowClick = () => setVisible(true);
  const handleSidebarHide = () => setVisible(false);
  const handleItemClick = (e, { name }) => {
    setActiveItem({ activeItem: name });
    setVisible(false);
  };
  const trigger = (
    <span>
      {context.user ? (
        <div>
          <Image avatar src={context.user.imageUrl} /> {context.user.username}
        </div>
      ) : (
        ""
      )}
    </span>
  );

  const options = [
    { key: "user", text: "Account", icon: "user", value: "profile" },
    { key: "sign-out", text: "Sign Out", icon: "sign out", value: "logout" },
  ];

  const handleDropdown = (event, data) => {
    switch (data.value) {
      case "profile":
          history.push("/profile");
          break;
      case "logout":
        onClickHandler();
        context.logout();
        break;
      default:
        return data.value;
    }
  };
  return (
    <Segment>
      <Grid columns={1}>
        <Grid.Column>
          <Menu secondary>
            {context.user && !isHome && (
              <Menu.Item position="left">
                <Grid.Column>
                  <Button disabled={visible} onClick={handleShowClick}>
                    Menu
                  </Button>
                </Grid.Column>
              </Menu.Item>
            )}
            {context.user &&
              !isHome &&
              ((context.user.roles && context.user.roles.includes("admin")) ||
                (context.user.tokenAuth &&
                  context.user.tokenAuth.user.roles.includes("admin"))) && (
                <Menu.Item
                  name="dashboard"
                  active={activeItem === "dashboard"}
                  onClick={handleItemClick}
                  as={Link}
                  to="/admin/dashboard"
                />
              )}

            {context.user && !isHome && (
              <Menu.Item
                name="Overview"
                active={activeItem === "overview"}
                onClick={handleItemClick}
                as={Link}
                to="/staff/dashboard/overview"
              />
            )}
            {/* {context.user && !isHome && (
              <Menu.Item
                name="billing"
                active={activeItem === "billing"}
                onClick={handleItemClick}
              />
            )} */}
            {context.user && !isHome && (
              <Menu.Item
                name="receipts"
                active={activeItem === "receipts"}
                onClick={handleItemClick}
                as={Link}
                to="/staff/dashboard/receipt/view-receipts"
              />
            )}
            {/* {context.user && !isHome && (
              <Menu.Item
                name="reports"
                active={activeItem === "reports"}
                onClick={handleItemClick}
                position="left"
              />
            )} */}

            <Image src={logo} size="small" href="/" />

            {context.user && !isHome && (
              <Menu.Item position="right">
                <Dropdown
                  trigger={trigger}
                  pointing="top right"
                  icon={null}
                >
                  <Dropdown.Menu>
                    {options.map(option => (
                      <Dropdown.Item key={option.key}                   
                      {...option}
                      onClick={(e, data) => handleDropdown(e, data)} />
                    ))}
                  </Dropdown.Menu>

                </Dropdown>
              </Menu.Item>
            )}
          </Menu>
          <Sidebar.Pushable
            as={Segment}
            style={{ minHeight: "calc(100vh - 170px)" }}
          >
            <Sidebar
              as={Menu}
              style={{ background: "white" }}
              animation="overlay"
              icon="labeled"
              inverted
              className="ui primary"
              onHide={handleSidebarHide}
              vertical
              visible={visible}
              width="thin"
            >
              <Menu.Item
                style={{ color: "black", textAlign: "left" }}
                as={Link}
                to="/"
                onClick={handleHideClick}
              >
                {/* <Icon name='home' /> */}
                Home
              </Menu.Item>
              <Menu.Item style={{ color: "black", textAlign: "left" }}>
                <Menu.Header>
                  {/* <Icon name='users' /> */}
                  <Link to="/staff/dashboard/client-records">Clients</Link>
                </Menu.Header>
                <Menu.Menu>
                  <Menu.Item
                    style={{ color: "black", textAlign: "left" }}
                    name="list-clients"
                    as={Link}
                    to="/staff/dashboard/client-records"
                    active={activeItem === "list-clients"}
                    onClick={handleItemClick}
                  />
                  <Menu.Item
                    style={{ color: "black", textAlign: "left" }}
                    name="create-client"
                    as={Link}
                    to="/staff/dashboard/add-new-client"
                    active={activeItem === "create-client"}
                    onClick={handleItemClick}
                  />
                  <Menu.Item
                    style={{ color: "black", textAlign: "left" }}
                    name="create-contact-person"
                    as={Link}
                    to="/staff/dashboard/add-new-contact-person"
                    active={activeItem === "create-contact-person"}
                    onClick={handleItemClick}
                  />
                  <Menu.Item
                    style={{ color: "black", textAlign: "left" }}
                    name="list-contact-persons"
                    as={Link}
                    to="/staff/dashboard/contact-person-records"
                    active={activeItem === "list-contact-persons"}
                    onClick={handleItemClick}
                  />
                  <Menu.Item
                    style={{ color: "black", textAlign: "left" }}
                    name="receipts"
                    as={Link}
                    to="/staff/dashboard/receipt/view-receipts"
                    active={activeItem === "view-receipts"}
                    onClick={handleItemClick}
                  />
                </Menu.Menu>
              </Menu.Item>
              <Menu.Item style={{ color: "black", textAlign: "left" }}>
                <Menu.Header>
                  {/* <Icon name='suitcase' /> */}
                  <Link to="/staff/dashboard/policies">Policies</Link>
                </Menu.Header>
                <Menu.Menu>
                  <Menu.Item
                    style={{ color: "black", textAlign: "left" }}
                    name="motor-policy"
                    as={Link}
                    to="/staff/dashboard/policies/general/motor"
                    active={activeItem === "motor-policy"}
                    onClick={handleItemClick}
                  />
                  <Menu.Item
                    style={{ color: "black", textAlign: "left" }}
                    name="add-motor-policy"
                    as={Link}
                    to="/staff/dashboard/add-new-motor-policy"
                    active={activeItem === "add-motor-policy"}
                    onClick={handleItemClick}
                  />
                </Menu.Menu>
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher dimmed={visible}>
              <BaseRouter props={props} />
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}
