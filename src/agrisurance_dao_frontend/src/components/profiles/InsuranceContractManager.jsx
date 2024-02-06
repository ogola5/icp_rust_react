// Import necessary libraries
import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as backend_idl, canisterId as backend_id } from '../../../../declarations/agrisurance_dao_backend';

// Initialize the agent and backend actor
const agent = new HttpAgent({ host: "https://ic0.app" }); // Adjust the host if necessary
const backend = Actor.createActor(backend_idl, { agent, canisterId: backend_id });

const InsuranceContractManager = () => {
  // State hooks for form inputs, messages, and loading
  const [farmerId, setFarmerId] = useState('');
  const [consumerId, setConsumerId] = useState('');
  const [terms, setTerms] = useState('');
  const [conditions, setConditions] = useState('');
  const [payoutCriteria, setPayoutCriteria] = useState('');
  const [contractId, setContractId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Handlers for CRUD operations
  const handleCreateInsuranceContract = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const insuranceContractResult = await backend.create_insurance_contract(
        parseInt(farmerId, 10),
        parseInt(consumerId, 10),
        terms,
        conditions,
        payoutCriteria
      );
      if (insuranceContractResult) {
        setMessage('Insurance contract created successfully!');
      } else {
        setMessage('Failed to create insurance contract.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReadInsuranceContract = async () => {
    setLoading(true);
    setMessage('');
    try {
      const contract = await backend.read_insurance_contract(parseInt(contractId, 10));
      setMessage(`Contract Found: ${JSON.stringify(contract)}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInsuranceContract = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await backend.update_insurance_contract(
        parseInt(contractId, 10),
        parseInt(farmerId, 10),
        parseInt(consumerId, 10),
        terms,
        conditions,
        payoutCriteria
      );
      if (result) {
        setMessage('Insurance contract updated successfully!');
      } else {
        setMessage('Failed to update insurance contract.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInsuranceContract = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await backend.delete_insurance_contract(parseInt(contractId, 10));
      if (result) {
        setMessage('Insurance contract deleted successfully!');
      } else {
        setMessage('Failed to delete insurance contract.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // UI for managing Insurance Contracts
  return (
    <div>
      <h2>Insurance Contract Management</h2>
      <form onSubmit={handleCreateInsuranceContract}>
        <div>
          <label>Farmer ID:</label>
          <input type="number" value={farmerId} onChange={(e) => setFarmerId(e.target.value)} placeholder="Farmer ID" />
        </div>
        <div>
          <label>Consumer ID:</label>
          <input type="number" value={consumerId} onChange={(e) => setConsumerId(e.target.value)} placeholder="Consumer ID" />
        </div>
        <div>
          <label>Terms:</label>
          <textarea value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="Terms of the contract" />
        </div>
        <div>
          <label>Conditions:</label>
          <textarea value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="Conditions of the contract" />
        </div>
        <div>
          <label>Payout Criteria:</label>
          <textarea value={payoutCriteria} onChange={(e) => setPayoutCriteria(e.target.value)} placeholder="Payout Criteria" />
        </div>
        <button type="button" onClick={handleCreateInsuranceContract} disabled={loading}>
          {loading ? 'Creating...' : 'Create Contract'}
        </button>
        <button type="button" onClick={handleUpdateInsuranceContract} disabled={loading}>
          Update Contract
        </button>
        <button type="button" onClick={handleDeleteInsuranceContract} disabled={loading}>
          Delete Contract
        </button>
        <div>
          <label>Contract ID for Fetch/Update/Delete:</label>
          <input
            type="number"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            placeholder="Contract ID"
          />
          <button type="button" onClick={handleReadInsuranceContract} disabled={loading}>
            Fetch Contract
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default InsuranceContractManager;
