// Import necessary libraries
import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as backend_idl, canisterId as backend_id } from '../../../../declarations/agrisurance_dao_backend';

// Initialize the agent and backend actor
const agent = new HttpAgent({ host: "https://ic0.app" }); // Adjust the host if necessary
const backend = Actor.createActor(backend_idl, { agent, canisterId: backend_id });

const DAOManagement = () => {
  // State hooks for form inputs, messages, and loading
  const [userId, setUserId] = useState('');
  const [participationLevel, setParticipationLevel] = useState('');
  const [behaviorMetric, setBehaviorMetric] = useState('');
  const [proposalDetails, setProposalDetails] = useState('');
  const [proposerId, setProposerId] = useState('');
  const [proposalId, setProposalId] = useState('');
  const [vote, setVote] = useState('Approve'); // Default vote type
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handler for adjusting stake based on DAO participation level
  const adjustStakeForParticipation = async () => {
    setLoading(true);
    setMessage('');
    try {
      await backend.adjust_stake_dao_participation(parseInt(userId, 10), parseInt(participationLevel, 10));
      setMessage('Stake adjusted based on DAO participation successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for rewarding user for positive behavior
  const rewardUserForBehavior = async () => {
    setLoading(true);
    setMessage('');
    try {
      await backend.reward_user_for_positive_behavior(parseInt(userId, 10), behaviorMetric);
      setMessage('User rewarded for positive behavior successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for submitting a governance proposal
  const submitGovernanceProposal = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await backend.submit_governance_proposal(parseInt(proposerId, 10), proposalDetails);
      if (result) {
        setMessage('Governance proposal submitted successfully!');
      } else {
        setMessage('Failed to submit governance proposal.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for voting on a governance proposal
  const voteOnProposal = async () => {
    setLoading(true);
    setMessage('');
    try {
      await backend.vote_on_proposal(parseInt(userId, 10), parseInt(proposalId, 10), { [vote]: null });
      setMessage('Vote recorded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for enacting a governance proposal
  const enactProposal = async () => {
    setLoading(true);
    setMessage('');
    try {
      await backend.enact_proposal(parseInt(proposalId, 10));
      setMessage('Proposal enacted successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>DAO Management</h2>
      {/* DAO Participation Adjustment Form */}
      <div>
        <label>User ID:</label>
        <input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
      </div>
      <div>
        <label>Participation Level:</label>
        <input type="number" value={participationLevel} onChange={(e) => setParticipationLevel(e.target.value)} placeholder="Participation Level" />
        <button onClick={adjustStakeForParticipation} disabled={loading}>Adjust Stake for Participation</button>
      </div>
      {/* User Reward Form */}
      <div>
        <label>Behavior Metric:</label>
        <select value={behaviorMetric} onChange={(e) => setBehaviorMetric(e.target.value)}>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="average">Average</option>
        </select>
        <button onClick={rewardUserForBehavior} disabled={loading}>Reward User for Behavior</button>
      </div>
      {/* Governance Proposal Form */}
      <div>
        <label>Proposal Details:</label>
        <textarea value={proposalDetails} onChange={(e) => setProposalDetails(e.target.value)} placeholder="Proposal Details" />
        <label>Proposer ID:</label>
        <input type="number" value={proposerId} onChange={(e) => setProposerId(e.target.value)} placeholder="Proposer ID" />
        <button onClick={submitGovernanceProposal} disabled={loading}>Submit Proposal</button>
      </div>
      {/* Voting Form */}
      <div>
        <label>Proposal ID:</label>
        <input type="number" value={proposalId} onChange={(e) => setProposalId(e.target.value)} placeholder="Proposal ID" />
        <label>Vote:</label>
        <select value={vote} onChange={(e) => setVote(e.target.value)}>
          <option value="Approve">Approve</option>
          <option value="Reject">Reject</option>
          <option value="Abstain">Abstain</option>
        </select>
        <button onClick={voteOnProposal} disabled={loading}>Vote on Proposal</button>
      </div>
      {/* Enact Proposal Button */}
      <button onClick={enactProposal} disabled={loading}>Enact Proposal</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DAOManagement;
