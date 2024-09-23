import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/common/layout';
import { AuthProvider } from './context/auth';
import { ClientProvider } from './context/clients';
import { ContactPersonProvider } from './context/contactPerson';
import { MessageProvider } from './context/messages';
import { MotorPolicyProvider } from './context/policy/motor';
import { ReceiptProvider } from './context/receipt';
import { WhatsAppMessageProvider } from './context/whatsappMessages';
import { SalesAgentProvider } from './context/salesAgent';
import { FirePolicyProvider } from './context/policy/fire';
import { BurglaryPolicyProvider } from './context/policy/burglary';
import { DomesticPackagePolicyProvider } from './context/policy/domesticPackage';
import { ComputerElectronicProvider } from './context/policy/computerElectronic';
import { ConsequentialLossProvider } from './context/policy/consequentialLoss';
import { ElectronicEquipmentProvider } from './context/policy/electronicEquipment';
import { MachineryBreakdownProvider } from './context/policy/machineryBreakdown';
import { GoodsTransitProvider } from './context/policy/goodsTransit';
import { IndustrialAllRisksProvider } from './context/policy/industrialAllRisks';
import { MoneyProvider } from './context/policy/money';
import { PlateGlassProvider } from './context/policy/plateGlass';
import { PoliticalViolenceProvider } from './context/policy/politicalViolence';
import { ContractorsRiskProvider } from './context/policy/contractorsRisk';
import AmendedPolicyProvider from './components/policies/motor/policyAmendment/context/AmendedPolicyContext';
class App extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <AuthProvider>
          <ClientProvider>
            <ContactPersonProvider>
              <MotorPolicyProvider>
                <MessageProvider>
                  <ReceiptProvider>
                    <WhatsAppMessageProvider>
                      <SalesAgentProvider>
                        <FirePolicyProvider>
                          <BurglaryPolicyProvider>
                            <DomesticPackagePolicyProvider>
                              <ComputerElectronicProvider>
                                <ConsequentialLossProvider>
                                  <ElectronicEquipmentProvider>
                                    <GoodsTransitProvider>
                                      <IndustrialAllRisksProvider>
                                        <MachineryBreakdownProvider>
                                          <MoneyProvider>
                                            <PlateGlassProvider>
                                              <PoliticalViolenceProvider>
                                                <ContractorsRiskProvider>
                                                  <AmendedPolicyProvider>
                                                    <Router>
                                                      <Layout {...this.props} />
                                                    </Router>
                                                  </AmendedPolicyProvider>
                                                </ContractorsRiskProvider>
                                              </PoliticalViolenceProvider>
                                            </PlateGlassProvider>
                                          </MoneyProvider>
                                        </MachineryBreakdownProvider>
                                      </IndustrialAllRisksProvider>
                                    </GoodsTransitProvider>
                                  </ElectronicEquipmentProvider>
                                </ConsequentialLossProvider>
                              </ComputerElectronicProvider>
                            </DomesticPackagePolicyProvider>
                          </BurglaryPolicyProvider>
                        </FirePolicyProvider>
                      </SalesAgentProvider>
                    </WhatsAppMessageProvider>
                  </ReceiptProvider>
                </MessageProvider>
              </MotorPolicyProvider>
            </ContactPersonProvider>
          </ClientProvider>
        </AuthProvider>
      </div>
    );
  }
}

export default App;
