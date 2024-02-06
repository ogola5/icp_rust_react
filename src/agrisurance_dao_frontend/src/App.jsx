import React from 'react';
import Profile from './components/profiles/Profile.jsx'; // Adjust the path according to your file structure
import Transaction from './components/profiles/Transaction.jsx';
import InsuranceClaims from './components/profiles/InsuranceClaims.jsx';
import DisputeManagement from './components/profiles/DisputeManagement.jsx';
import InsuranceContractManager from './components/profiles/InsuranceContractManager.jsx';
import Staking from './components/profiles/Staking.jsx';
import DAOManagement from './components/profiles/DAOManagement.jsx';
import Governance from './components/profiles/Governance.jsx';

const App = () => {
  return (
    <div>
      <h1>Welcome to the User Profile Application</h1>
      <Profile />
      <Transaction/>
      <Governance/>
      <InsuranceClaims/>
      <DisputeManagement/>
      <InsuranceContractManager/>
      <Staking/>
      <DAOManagement/>
    </div>
  );
};

export default App;
//src/agrisurance_dao_frontend/src/components/UserProfileComponent/Profile.js