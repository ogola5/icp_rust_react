// Import necessary libraries
import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as backend_idl, canisterId as backend_id } from '../../../../declarations/agrisurance_dao_backend';

// Initialize the agent and backend actor
const agent = new HttpAgent({ host: "https://ic0.app" }); // Adjust the host if necessary
const backend = Actor.createActor(backend_idl, { agent, canisterId: backend_id });

const Staking = () => {
  // State hooks for form inputs, messages, and loading
  const [userId, setUserId] = useState('');
  const [oldStake, setOldStake] = useState('');
  const [newStake, setNewStake] = useState('');
  const [reason, setReason] = useState('');
  const [adjustmentId, setAdjustmentId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Handler for creating a stake adjustment
  const handleCreateStakeAdjustment = async () => {
    setLoading(true);
    setMessage('');
    try {
      const stakeAdjustmentResult = await backend.create_stake_adjustment(
        parseInt(userId, 10),
        parseFloat(oldStake),
        parseFloat(newStake),
        reason
      );
      if (stakeAdjustmentResult) {
        setMessage('Stake adjustment created successfully!');
      } else {
        setMessage('Failed to create stake adjustment.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for reading a stake adjustment by ID
  const handleReadStakeAdjustment = async () => {
    setLoading(true);
    setMessage('');
    try {
      const adjustment = await backend.read_stake_adjustment(parseInt(adjustmentId, 10));
      setMessage(`Adjustment Found: ${JSON.stringify(adjustment)}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for updating a stake adjustment
  const handleUpdateStakeAdjustment = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await backend.update_stake_adjustment(
        parseInt(adjustmentId, 10),
        parseInt(userId, 10),
        parseFloat(oldStake),
        parseFloat(newStake),
        reason
      );
      if (result) {
        setMessage('Stake adjustment updated successfully!');
      } else {
        setMessage('Failed to update stake adjustment.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // UI for managing Stake Adjustments
  return (
    <div>
      <h2>Stake Adjustment Management</h2>
      <div>
        <label>User ID:</label>
        <input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
      </div>
      <div>
        <label>Old Stake:</label>
        <input type="number" value={oldStake} onChange={(e) => setOldStake(e.target.value)} placeholder="Old Stake" />
      </div>
      <div>
        <label>New Stake:</label>
        <input type="number" value={newStake} onChange={(e) => setNewStake(e.target.value)} placeholder="New Stake" />
      </div>
      <div>
        <label>Reason:</label>
        <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for adjustment" />
      </div>
      <button onClick={handleCreateStakeAdjustment} disabled={loading}>
        {loading ? 'Creating...' : 'Create Adjustment'}
      </button>
      <div>
        <label>Adjustment ID for Fetch/Update:</label>
        <input type="number" value={adjustmentId} onChange={(e) => setAdjustmentId(e.target.value)} placeholder="Adjustment ID" />
      </div>
      <button onClick={handleReadStakeAdjustment} disabled={loading}>Fetch Adjustment</button>
      <button onClick={handleUpdateStakeAdjustment} disabled={loading}>Update Adjustment</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Staking;
