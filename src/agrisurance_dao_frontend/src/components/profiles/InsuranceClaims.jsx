// Import necessary libraries
import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as backend_idl, canisterId as backend_id } from '../../../../declarations/agrisurance_dao_backend';

// Initialize the agent and backend actor
const agent = new HttpAgent({ host: "https://ic0.app" }); // Adjust the host if necessary
const backend = Actor.createActor(backend_idl, { agent, canisterId: backend_id });

const InsuranceClaims = () => {
  // State hooks for form inputs, messages, and loading
  const [farmerId, setFarmerId] = useState('');
  const [contractId, setContractId] = useState('');
  const [claimDetails, setClaimDetails] = useState('');
  const [affectedCrops, setAffectedCrops] = useState('');
  const [evidence, setEvidence] = useState('');
  const [claimId, setClaimId] = useState('');
  const [approve, setApprove] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handler for submitting an insurance claim
  const handleSubmitInsuranceClaim = async () => {
    setLoading(true);
    setMessage('');
    try {
      const cropsArray = affectedCrops.split(',').map(crop => crop.trim());
      const claimResult = await backend.submit_insurance_claim(
        parseInt(farmerId, 10),
        parseInt(contractId, 10),
        claimDetails,
        cropsArray,
        evidence
      );
      if (claimResult) {
        setMessage('Insurance claim submitted successfully!');
      } else {
        setMessage('Failed to submit insurance claim.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for verifying an insurance claim
  const handleVerifyInsuranceClaim = async () => {
    setLoading(true);
    setMessage('');
    try {
      await backend.verify_insurance_claim(parseInt(claimId, 10));
      setMessage('Insurance claim verified successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for approving or rejecting an insurance claim
  const handleApproveRejectInsuranceClaim = async () => {
    setLoading(true);
    setMessage('');
    try {
      await backend.approve_or_reject_claim(parseInt(claimId, 10), approve, "Reason for decision");
      setMessage(`Insurance claim ${approve ? "approved" : "rejected"} successfully!`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // UI for managing Insurance Claims
  return (
    <div>
      <h2>Insurance Claim Management</h2>
      <div>
        <label>Farmer ID:</label>
        <input type="number" value={farmerId} onChange={(e) => setFarmerId(e.target.value)} placeholder="Farmer ID" />
      </div>
      <div>
        <label>Contract ID:</label>
        <input type="number" value={contractId} onChange={(e) => setContractId(e.target.value)} placeholder="Contract ID" />
      </div>
      <div>
        <label>Claim Details:</label>
        <textarea value={claimDetails} onChange={(e) => setClaimDetails(e.target.value)} placeholder="Claim Details" />
      </div>
      <div>
        <label>Affected Crops:</label>
        <input type="text" value={affectedCrops} onChange={(e) => setAffectedCrops(e.target.value)} placeholder="Affected Crops, comma-separated" />
      </div>
      <div>
        <label>Evidence:</label>
        <input type="text" value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="Evidence URL or data" />
      </div>
      <button onClick={handleSubmitInsuranceClaim} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Claim'}
      </button>
      <div>
        <label>Claim ID for Verification/Approval/Rejection:</label>
        <input type="number" value={claimId} onChange={(e) => setClaimId(e.target.value)} placeholder="Claim ID" />
        <button onClick={handleVerifyInsuranceClaim} disabled={loading}>Verify Claim</button>
        <div>
          <label>Approve Claim:</label>
          <select value={approve} onChange={(e) => setApprove(e.target.value === 'true')}>
            <option value="true">Approve</option>
            <option value="false">Reject</option>
          </select>
          <button onClick={handleApproveRejectInsuranceClaim} disabled={loading}>{approve ? 'Approve' : 'Reject'} Claim</button>
        </div>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default InsuranceClaims;
