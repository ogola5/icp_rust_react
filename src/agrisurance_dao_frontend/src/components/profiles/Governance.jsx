// Import necessary libraries
import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as backend_idl, canisterId as backend_id } from '../../../../declarations/agrisurance_dao_backend';

// Initialize the agent and backend actor
const agent = new HttpAgent({ host: "https://ic0.app" }); // Adjust the host if necessary
const backend = Actor.createActor(backend_idl, { agent, canisterId: backend_id });

const Governance = () => {
  // State hooks for form inputs, messages, and loading
  const [proposalDetails, setProposalDetails] = useState('');
  const [proposerId, setProposerId] = useState('');
  const [proposalId, setProposalId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Handler for creating a governance proposal
  const handleCreateGovernanceProposal = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const governanceProposalResult = await backend.create_governance_proposal(
        proposalDetails,
        parseInt(proposerId, 10),
        [] // Assuming voting records are not provided at creation
      );
      if (governanceProposalResult) {
        setMessage('Governance proposal created successfully!');
      } else {
        setMessage('Failed to create governance proposal.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for reading a governance proposal by ID
  const handleReadGovernanceProposal = async () => {
    setLoading(true);
    setMessage('');
    try {
      const proposal = await backend.read_governance_proposal(parseInt(proposalId, 10));
      setMessage(`Proposal Found: ${JSON.stringify(proposal)}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for updating a governance proposal
  const handleUpdateGovernanceProposal = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await backend.update_governance_proposal(
        parseInt(proposalId, 10),
        proposalDetails,
        parseInt(proposerId, 10),
        [] // Assuming updating voting records is handled separately
      );
      if (result) {
        setMessage('Governance proposal updated successfully!');
      } else {
        setMessage('Failed to update governance proposal.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for deleting a governance proposal
  const handleDeleteGovernanceProposal = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await backend.delete_governance_proposal(parseInt(proposalId, 10));
      if (result) {
        setMessage('Governance proposal deleted successfully!');
      } else {
        setMessage('Failed to delete governance proposal.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // UI for managing Governance Proposals
  return (
    <div>
      <h2>Governance Proposal Management</h2>
      <div>
        <label>Proposal Details:</label>
        <textarea value={proposalDetails} onChange={(e) => setProposalDetails(e.target.value)} placeholder="Proposal Details" />
      </div>
      <div>
        <label>Proposer ID:</label>
        <input type="number" value={proposerId} onChange={(e) => setProposerId(e.target.value)} placeholder="Proposer ID" />
      </div>
      <button onClick={handleCreateGovernanceProposal} disabled={loading}>
        {loading ? 'Creating...' : 'Create Proposal'}
      </button>
      <div>
        <label>Proposal ID for Fetch/Update/Delete:</label>
        <input type="number" value={proposalId} onChange={(e) => setProposalId(e.target.value)} placeholder="Proposal ID" />
      </div>
      <button onClick={handleReadGovernanceProposal} disabled={loading}>Fetch Proposal</button>
      <button onClick={handleUpdateGovernanceProposal} disabled={loading}>Update Proposal</button>
      <button onClick={handleDeleteGovernanceProposal} disabled={loading}>Delete Proposal</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Governance;
