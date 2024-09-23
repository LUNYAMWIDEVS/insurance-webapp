import React from "react";
import {
  Container,
  Grid,
  Header,
  List
} from "semantic-ui-react";

export default function PrivacyPolicy() {
  const listStyles = {
    margin: 0,
    paddingLeft: "8px 0px",
  };

  const listItemStyle = {
    padding: "8px 16px",
    textDecoration: "none",
    width: "100%",
    textAlign: "left",
    lineHeight: 1.5,
  };
  const rowStyles = {
    padding: "8px 0px",
  };
  return (
    <Container
      style={{
        marginTop: "20px",
        padding: "24px",
        lineHeight: "250%",
      }}
    >
      <Grid centered>
        <Grid.Column width={12} tablet={10}>
          {/* <Segment raised>    </Segment> */}
          <Grid stackable>
            {/* <Grid.Row style={rowStyles} centered>
              <Grid.Column textAlign="center">
                <Image src={BrooksLogo} alt="Brooks logo" size="medium" />
              </Grid.Column>
            </Grid.Row> */}
            <Grid.Row style={rowStyles} centered>
              <Grid.Column>
                <Header as="h1" textAlign="center">
                  Brooks Privacy Policy
                </Header>
              </Grid.Column>
            </Grid.Row>
            {/* Introduction Section */}
            <Grid.Row style={rowStyles}>
              <Grid.Column>
                <Header as="h2">1. Introduction</Header>
                <p>
                  We are committed to safeguarding and preserving the privacy of
                  our users.
                  <br />
                  <br />
                  This privacy policy outlines how we collect, use, and protect
                  personal information that you provide to us, or that we
                  collect from you while you use our application. We respect
                  your right to privacy and are committed to maintaining it. We
                  only collect, store and process your personal information
                  according to the relevant laws and regulations. By accessing,
                  browsing or otherwise using the application you confirm that
                  you have read and understood this Privacy Policy. Ensure you
                  have read it carefully.
                </p>
              </Grid.Column>
            </Grid.Row>
            {/* Definitions Section */}
            <Grid.Row style={rowStyles}>
              <Grid.Column>
                <Header as="h2">2. Definitions</Header>
                <List style={listStyles} bulleted>
                  <List.Item style={listItemStyle}>
                    <strong>"Brooks," "We," "our," "ours," and "us,"</strong>{" "}
                    means Brooks Insurance Agencies Ltd and includes its
                    successors in title and assigns, its affiliates and/or its
                    strategic business units as may be specified from time to
                    time.
                  </List.Item>
                  <List.Item style={listItemStyle}>
                    <strong>"Personal data" or "personal information"</strong>{" "}
                    means: Information about you or information that identifies
                    you as a unique individual, such as your name and surname
                    combined with your physical address, contact details,
                    identity card or passport number.
                  </List.Item>
                  <List.Item style={listItemStyle}>
                    <strong>“Processing”</strong> means handling, collecting,
                    using, altering, merging, linking, organizing,
                    disseminating, storing, protecting, retrieving, disclosing,
                    erasing, archiving, destroying, or disposing of your
                    personal information.
                  </List.Item>
                  <List.Item style={listItemStyle}>
                    <strong>“Sensitive personal information”</strong> includes
                    data revealing your race, health status, ethnic social
                    origin, conscience, belief, genetic data, biometric data,
                    property details, marital status, family details including
                    details of your children, parents, spouse or spouses, sex or
                    sexual orientation.
                  </List.Item>
                  <List.Item style={listItemStyle}>
                    <strong>“You”</strong> means: Customer, which includes
                    personal representatives and assigns doing business with us
                    and includes (where appropriate) any person you authorize to
                    give us instructions, the person who uses any of our
                    products and services or accesses our websites. “Customer”
                    shall include both the masculine and the feminine gender as
                    well as a legal person.
                    <br />
                    Any visitor that is a person (including partners or any
                    third parties) who gains access to any of our premises. Any
                    supplier/ service provider who has been contracted by us
                    and/or signed a service level agreement with us.
                  </List.Item>
                  <List.Item style={listItemStyle}>
                    The word <strong>“includes”</strong> means that what follows
                    is not necessarily exhaustive and therefore the examples
                    given are not the only things or situations included in the
                    meaning or explanation of that text.
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Grid.Column>
                <Header as="h2">3. Information We Collect</Header>
                <p>We may collect the following personal information:</p>
                <List style={listStyles} bulleted>
                  <List.Item style={listItemStyle}>
                    <strong>Individual details:</strong> Name, address, email
                    and telephone details, gender, marital status, family
                    details, date and place of birth, relationship to the
                    policyholder insured, beneficiary, or claimant.
                  </List.Item>
                  <List.Item style={listItemStyle}>
                    <strong>Identification details:</strong> Identification
                    numbers issued by government bodies or agencies (e.g., ID
                    number).
                  </List.Item>
                  <List.Item style={listItemStyle}>
                    <strong>Financial information:</strong> Mobile money number,
                    mobile money statements, bank account number and account
                    details, and other financial information.
                  </List.Item>
                  <List.Item style={listItemStyle}>
                    <strong>Online data:</strong> When you use our products and
                    services through our website, mobile applications such as
                    cookies, login data, IP address (your computer’s internet
                    address), browser type and version, ISP or operating system,
                    domain name, access time, page views, location data, how you
                    frequently use our online insurance, banking and other
                    services, our mobile applications or visit our website; or
                  </List.Item>
                  <List.Item style={listItemStyle}>
                    <strong>Profile data:</strong> Such as your username and
                    password, your interests, preferences, feedback, and survey
                    responses.
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Grid.Column>
                <Header as="h2">
                  4. Where We Collect Personal Information
                </Header>
                <p>We collect Personal Data from various sources, including:</p>
                <List style={listStyles} ordered>
                  <List.Item style={listItemStyle}>
                    Directly from individuals and their family members, online
                    or by telephone, or in written correspondence;
                  </List.Item>
                  <List.Item style={listItemStyle}>
                    From individuals’ employers;
                  </List.Item>
                  <List.Item style={listItemStyle}>Claim forms.</List.Item>
                </List>
                <p>
                  Once you register on our platform, you will no longer be
                  anonymous to us and will provide us with personal information.
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">
                5. Purpose For Data Processing And The Legal Basis
              </Header>
              <p>
                The primary purpose for collecting and processing your personal
                data is to perform statutory and contractual activities related
                to management of the insurance product you have with us. We will
                also process your data in connection with other tasks as
                required by law and statutory regulations. In addition to these,
                personal data may be used in service and product development.
              </p>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">
                6. Storage And Protection Of Personal Data
              </Header>
              <p>
                We maintain appropriate technical and organizational safeguards
                against unauthorized processing of personal data and against
                accidental loss, destruction or damage.
              </p>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">7. Use Of Personal Data</Header>
              <p>
                We use your personal information to manage your policy, process
                payments, and manage claims. We may also use your information to
                provide you with marketing materials or to improve our services.
              </p>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">8. How We Share Your Information</Header>
              <p>
                We may share your personal information with third-party service
                providers, such as payment processors or claims management
                companies, who help us manage your policy and process your
                payments. We may also share your information with as required by
                law and statutory regulations.
              </p>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">9. Consent</Header>
              <p>
                In order to facilitate the provision of our services, we rely on
                the data subject’s consent to process personal sensitive
                information, such as age and marital status . This consent
                allows us to share the information with Insurers and other
                Intermediaries that may need to process the information in order
                to undertake their role in the insurance industry.
              </p>
              <p>
                The affected individual’s consent to the processing of personal
                information is a necessary condition for us to be able to
                provide the services requested. When you are providing us with
                information about a person other than yourself, you agree to
                notify them of our use of their Personal Data and to obtain such
                consent for us.
              </p>
              <p>
                Individuals may withdraw their consent to such processing at any
                time. However, doing so may prevent us from continuing to
                provide the services. In addition, if an individual withdraws
                consent to an Insurer’s processing of their Personal Data, it
                may not be possible for the insurance cover to continue.
              </p>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">10. Cookies</Header>
              <p>
                We may use cookies and similar technologies on our websites ,
                systems, apps and in our emails. Cookies are text files that
                gather small amounts of information, which your computer or
                mobile device stores when you visit a website or use an app.
                When you return to the website or app, or visit websites and
                apps that use the same cookies, they recognize these cookies and
                your device.
              </p>
              <p>
                Cookies make it easier for us to give you a better experience
                online. You can stop your browser from accepting cookies, but if
                you do, some parts of our website or online services may not
                work. We recommend that you allow cookies
              </p>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">11. Marketing</Header>
              <p>
                If you give us permission, we may use your personal or other
                information to tell you about products, services, and special
                offers from us or other companies that may be of interest to
                you. We will do this by post, email, or text message (SMS),
                WhatsApp, and social media platforms. If later you decide that
                you would not want us to do this, please contact us at{" "}
                <a
                  href="mailto:dpo@brooks.co.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="teal"
                  style={{ fontWeight: "bold", textDecoration: "none" }}
                >
                  dpo@brooks.co.ke
                </a>{" "}
                and we will update your preferences.
              </p>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">12. Transfer Across Borders</Header>
              <p>
                Your data is primarily stored in our data server located in
                Kenya. Some data is stored on cloud, and accessed in other
                countries. We are committed to ensure an appropriate level of
                protection by the recipient of the data when we transmit your
                data outside Kenya.
              </p>
              <p>
                If we transfer Personal Data to other countries outside Kenya,
                there are legal grounds justifying such transfer, such as
                individuals’ consent, or other legal grounds permitted by law.
              </p>
              <p>
                By dealing with us and submitting your personal information, you
                agree to the transfer, storage, and/or processing of your
                personal information outside of Kenya.
              </p>
            </Grid.Row>

            <Grid.Row style={rowStyles}>
              <Header as="h2">13. Your Rights As A Data Subject</Header>
              <List style={listStyles} bulleted>
                <List.Item style={listItemStyle}>
                  Access a copy of your Personal Data processed.
                </List.Item>
                <List.Item style={listItemStyle}>
                  Correct, delete, or verify your Personal Data that we process
                  that you have submitted to us.
                </List.Item>
                <List.Item style={listItemStyle}>
                  Request erasure of your Personal Data where there is no good
                  reason for us to continue to process it. Please note, that we
                  reserve the right to decline this request for specific legal
                  or regulatory obligations.
                </List.Item>
                <List.Item style={listItemStyle}>
                  Object to the processing of all or part of your personal data.
                </List.Item>
                <List.Item style={listItemStyle}>
                  Request the transfer of your Personal Data to you or a third
                  party. We will provide to you, or a third party you have
                  chosen, your Personal Data in a commonly used,
                  machine-readable format. Please note that this right only
                  applies to information which you initially provided consent
                  for us to use or where we used the information to perform a
                  contract with you.
                </List.Item>
                <List.Item style={listItemStyle}>
                  Withdraw your consent to the processing of your Personal Data.
                  We may, in certain circumstances continue to process your if
                  there is a legitimate reason to do so.
                </List.Item>
              </List>
              <p>
                So as to exercise your rights as provided above, we may request
                specific information from you to help us confirm your identity.
                This is a security measure to ensure that Personal Data is not
                disclosed to any person who has no right to receive it. We may
                also contact you to ask you for further information in relation
                to your request.
              </p>
              <List style={listStyles} as="blockquote" bulleted>
                <List.Item style={listItemStyle}>
                  <Header as="h4">
                    Requests, questions, or concerns should be:
                  </Header>
                  <List.List>
                    <List.Item style={listItemStyle}>
                      Made at our head office:
                      <List.List>
                        <List.Item style={listItemStyle}>
                          Brooks Insurance Agencies Limited, 1113 Kayahwe Rd,
                          Off Galana Rd, Kilimani, P.O Box 15850-00100 Nairobi
                          Kenya
                        </List.Item>
                        <List.Item style={listItemStyle}>
                          Tel:{" "}
                          <a
                            color="secondary"
                            href="tel:0111023600"
                            sx={{ textDecoration: "none" }}
                          >
                            0111023600
                          </a>
                        </List.Item>
                      </List.List>
                    </List.Item>
                    <List.Item style={listItemStyle}>
                      Sent via email to:{" "}
                      <a href="mailto:dpo@brooks.co.ke">dpo@brooks.co.ke</a>
                    </List.Item>
                  </List.List>
                </List.Item>
              </List>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">14. Data Security</Header>
              <p>
                Personal information is safeguarded against unauthorized access
                , use, disclosure, alteration, damage or loss.
                <br />
                We take reasonable steps to ensure the integrity, accuracy and
                confidentiality of personal information held by it. We have
                implemented adequate security measures such as access control,
                encryption, physical security, and other best practices, to
                protect personal data.We will, on an ongoing basis, continue to
                review our security controls and related processes to ensure
                that your personal information is secure.
              </p>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">
                15. Retention And Storing Your Personal Data
              </Header>
              <p>
                We will retain your personal information for as long as you have
                your account with us, or as long as it is required for us to be
                able to provide the relevant services to you. We may retain your
                personal data and information as may be required by law and
                maintain specific records management and retention policies and
                procedures.If the data is not required anymore for statutory or
                contractual obligations, it will be deleted.
              </p>
            </Grid.Row>
            <Grid.Row style={rowStyles}></Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">16. Updates To This Privacy Policy</Header>
              <p>
                We reserve the right to modify or update this privacy policy
                from time to time to reflect changes in our data processing
                practices or legal requirements. We shall notify you of any
                material changes to this policy.
              </p>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">17. Limitation Of Liability</Header>
              <p>
                We recognize our responsibility in relation to the collection,
                holding, processing or use of personal information. The
                provision of your personal information is voluntary. You may
                choose not to provide us with the requested data, but failure to
                do so may inhibit our ability to provide services to you.
                <br />
                We are not responsible for, give no warranties, nor make any
                representations in respect to the privacy policies or practices
                of linked or any third party websites.
              </p>
            </Grid.Row>
            <Grid.Row style={rowStyles}>
              <Header as="h2">18. Contact Us</Header>
              <p>
                If you have any questions about our privacy practices, or want
                to exercise any of your rights, contact our Data Protection
                Officer:
              </p>
              <List style={listStyles} sx={{ fontWeight: "bold" }}>
                <List.Item sx={{ p: 0 }}>Data Protection Officer,</List.Item>
                <List.Item sx={{ p: 0 }}>Brooks Insurance Agency,</List.Item>
                <List.Item sx={{ p: 0 }}>
                  1113 Kayahwe Rd, Off Galana Rd, Kilimani,
                </List.Item>
                <List.Item sx={{ p: 0 }}>
                  P.O Box 15850-00100 Nairobi. Kenya
                </List.Item>
                <List.Item sx={{ p: 0 }}>
                  Tel:&nbsp;
                  <a
                    color="secondary"
                    href="tel:0111023600"
                    sx={{ textDecoration: "none" }}
                  >
                    0111023600
                  </a>
                </List.Item>
                <List.Item sx={{ p: 0 }}>
                  Email:&nbsp;
                  <a
                    href="mailto:dpo@brooks.co.ke"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="secondary"
                    sx={{ textDecoration: "none" }}
                  >
                    dpo@brooks.co.ke
                  </a>
                </List.Item>
              </List>
            </Grid.Row>

            {/* Additional Sections */}
          </Grid>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
