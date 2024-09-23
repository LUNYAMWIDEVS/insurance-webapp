import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AdminDashBoard from './components/admin/adminDashboard';
import RegisterAdmin from './components/admin/registerAdmin';
import Login from './components/auth/login';
import PasswordReset from './components/auth/passwordReset';
import UserProfile from './components/auth/profile';
import Register from './components/auth/register';
import ResetPassword from './components/auth/resetPassword';
import AddNewClient from './components/clients/addNewClient';
import ClientProfile from './components/clients/clientProfile';
import CorporateClientProfile from "./components/clients/corporateClientProfile";
import ClientRecords from './components/clients/listClients';
import ListMessages from "./components/clients/listMessages";
import Message from "./components/clients/messageDetails";
import SendClientMessage from './components/clients/sendMessages';
import NotFound from './components/common/404page';
import AddNewContactPerson from './components/contactPersons/addNewContactPerson';
import ContactPersonProfile from './components/contactPersons/contactPersonProfile';
import ContactPersonRecords from './components/contactPersons/listContactPersons';
import AssignSalesAgent from "./components/messages/assignSalesAgent";
import ListWhatsappMessages from "./components/messages/listMessages";
import WhatsAppMessage from "./components/messages/messageDetails";
import SendMultipleWhatsappMessages from "./components/messages/sendMessages";
import AddNewFirePolicy from "./components/policies/fire/addNewFirePolicy";
import AddNewPolicy from './components/policies/motor/addNewPolicy';
import MotorPolicies from './components/policies/motor/listMotorPolicies';
import MotorPolicyReport from "./components/policies/motor/motorPolicyReport";
import AddNewReceipt from "./components/receipts/addNewReceipt";
import ReceiptRecords from "./components/receipts/listReceipts";
import ReceiptProfile from "./components/receipts/singleReceipt";
import AddInsuranceCompany from './components/staff/addInsuranceCompany';
import CRMOverview from "./components/staff/crmOverview";
import GeneralPolicies from './components/staff/generalPolicies';
import InsuranceCompanyListings from './components/staff/insuranceCompanies';
import PolicyOverview from './components/staff/policyOverview';
import StaffDashBoard from './components/staff/staffDashboard';
import ProtectedRoute from './protectedRoutes';

import NewPolicy from "./components/policies/motor/motorPolicy/NewPolicy";
import PolicyAddition from "./components/policies/motor/motorPolicy/PolicyAddition";
import PolicyDeletion from "./components/policies/motor/motorPolicy/PolicyDeletion";
import PolicyRenewal from "./components/policies/motor/motorPolicy/PolicyRenewal";
import EndorseAddition from './components/policies/motor/policyAmendment/endorsements/EndorseAddition';
import EndorseDeletion from './components/policies/motor/policyAmendment/endorsements/EndorseDeletion';
import EndorseNewPolicy from './components/policies/motor/policyAmendment/endorsements/EndorseNewPolicy';
import EndorseRenewal from "./components/policies/motor/policyAmendment/endorsements/EndorseRenewal";
import PrivacyPolicy from './components/common/privacy-policy';
import Account from './components/auth/account';


const BaseRouter = () => (
    <div>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/privacy-policy" component={PrivacyPolicy} />
            <Route exact path="/admin/register" component={RegisterAdmin} />
            <ProtectedRoute exact path="/admin/dashboard" component={AdminDashBoard} />
            <ProtectedRoute exact path="/staff/dashboard/overview" component={StaffDashBoard} />
            <ProtectedRoute exact path="/staff/dashboard/client-records" component={ClientRecords} />
            <ProtectedRoute exact path="/staff/dashboard/contact-person-records" component={ContactPersonRecords} />
            <ProtectedRoute exact path="/staff/dashboard/add-new-client" component={AddNewClient} />
            <ProtectedRoute exact path="/staff/dashboard/add-new-contact-person" component={AddNewContactPerson} />
            <ProtectedRoute exact path="/staff/dashboard/policies" component={PolicyOverview} />
            <ProtectedRoute exact path="/staff/dashboard/crm" component={CRMOverview} />
            <ProtectedRoute exact path="/staff/dashboard/add-new-motor-policy" component={AddNewPolicy} />
            <ProtectedRoute exact path="/staff/dashboard/policies/general/motor" component={MotorPolicies} />
            {/* view policy details */}
            <ProtectedRoute exact path="/staff/dashboard/policies/general/motor/details/new/:policyId" component={NewPolicy} />
            <ProtectedRoute exact path="/staff/dashboard/policies/general/motor/details/addition/:policyId" component={PolicyAddition} />
            <ProtectedRoute exact path="/staff/dashboard/policies/general/motor/details/renewal/:policyId" component={PolicyRenewal} />
            <ProtectedRoute exact path="/staff/dashboard/policies/general/motor/details/credit-note/:policyId" component={PolicyDeletion} />
            {/* amend policies */}
            <ProtectedRoute exact path="/staff/dashboard/policies/general/motor/:amendment/1/:policyId" component={EndorseNewPolicy} />           
            <ProtectedRoute exact path="/staff/dashboard/policies/general/motor/renew/2/:policyId" component={EndorseRenewal} />          
            <ProtectedRoute exact path="/staff/dashboard/policies/general/motor/addition/2/:policyId" component={EndorseAddition} />          
            <ProtectedRoute exact path="/staff/dashboard/policies/general/motor/deletion/2/:policyId" component={EndorseDeletion} /> 

            <ProtectedRoute exact path="/staff/dashboard/add-new-fire-policy" component={AddNewFirePolicy} />
            <ProtectedRoute exact path="/profile" component={Account}/>
            <ProtectedRoute exact path="/staff/dashboard/users/profile/:userId" component={UserProfile} />
            <ProtectedRoute exact path="/staff/dashboard/clients/profile/:clientId" component={ClientProfile} />
            <ProtectedRoute exact path="/staff/dashboard/contact-person/profile/:contactPersonId" component={ContactPersonProfile} />
            <ProtectedRoute exact path="/staff/dashboard/corporate-client/profile/:clientId" component={CorporateClientProfile} />
            <ProtectedRoute exact path="/staff/dashboard/policies/general" component={GeneralPolicies} />
            <ProtectedRoute exact path="/staff/dashboard/insurance-companies" component={InsuranceCompanyListings} />
            <ProtectedRoute exact path="/staff/dashboard/crm/send-messages" component={SendClientMessage} />
            <ProtectedRoute exact path="/staff/dashboard/crm/messages" component={ListMessages} />
            <ProtectedRoute exact path="/staff/dashboard/crm/whatsapp-messages" component={ListWhatsappMessages} />
            <ProtectedRoute exact path="/staff/dashboard/crm/send-whatsapp-messages" component={SendMultipleWhatsappMessages} />
            <ProtectedRoute exact path="/staff/dashboard/crm/whatsAppmessage/:whatsappPhoneNumber" component={WhatsAppMessage} />
            <ProtectedRoute exact path="/staff/dashboard/crm/assignSalesAgent/:whatsappPhoneNumber" component={AssignSalesAgent} />
            <ProtectedRoute exact path="/staff/dashboard/crm/message/:messageId" component={Message} />
            <ProtectedRoute exact path="/staff/dashboard/add-insurance-company" component={AddInsuranceCompany} />
            <ProtectedRoute exact path="/staff/dashboard/receipt/add-new-receipt" component={AddNewReceipt} />
            <ProtectedRoute exact path="/staff/dashboard/receipt/view-receipts" component={ReceiptRecords} />
            <ProtectedRoute exact path="/staff/dashboard/receipt/profile/:receiptId" component={ReceiptProfile} />
            <ProtectedRoute exact path="/staff/dashboard/policies/general/motor/reports/:policyId" component={MotorPolicyReport} />
            <Route exact path="/password-reset-request" component={PasswordReset} />
            <Route exact path="/reset-password/:token" component={ResetPassword} />
            <Route path="*" component={NotFound} />
        </Switch>
    </div>
);

export default BaseRouter;
