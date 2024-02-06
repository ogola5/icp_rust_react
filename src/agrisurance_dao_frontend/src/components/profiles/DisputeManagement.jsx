// Import necessary libraries
import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as backend_idl, canisterId as backend_id } from '../../../../declarations/agrisurance_dao_backend';

// Initialize the agent and backend actor
const agent = new HttpAgent({ host: "https://ic0.app" }); // Adjust the host if necessary
const backend = Actor.createActor(backend_idl, { agent, canisterId: backend_id });

const DisputeManagement = () => {
  // State hooks for form inputs, messages, and loading
  const [farmerId, setFarmerId] = useState('');
  const [consumerId, setConsumerId] = useState('');
  const [reason, setReason] = useState('');
  const [disputeId, setDisputeId] = useState('');
  const [status, setStatus] = useState('Raised');
  const [resolution, setResolution] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handler for creating a dispute
  const handleCreateDispute = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await backend.create_dispute({
        farmer_id: parseInt(farmerId, 10),
        consumer_id: parseInt(consumerId, 10),
        reason: reason,
      });
      if (result) {
        setMessage('Dispute created successfully!');
        setDisputeId(result.id.toString()); // Assuming the result includes the dispute ID
      } else {
        setMessage('Failed to create dispute.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for retrieving a dispute
  const handleGetDispute = async () => {
    setLoading(true);
    setMessage('');
    try {
      const dispute = await backend.get_dispute(parseInt(disputeId, 10));
      setMessage(`Dispute Found: ${JSON.stringify(dispute)}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for updating a dispute
  const handleUpdateDispute = async () => {
    setLoading(true);
    setMessage('');
    try {
      await backend.update_dispute(parseInt(disputeId, 10), status, resolution ? resolution : null);
      setMessage('Dispute updated successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for deleting a dispute
  const handleDeleteDispute = async () => {
    setLoading(true);
    setMessage('');
    try {
      await backend.delete_dispute(parseInt(disputeId, 10));
      setMessage('Dispute deleted successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Dispute Management</h2>
      {/* Form for creating a dispute */}
      <div>
        <label>Farmer ID:</label>
        <input type="number" value={farmerId} onChange={(e) => setFarmerId(e.target.value)} placeholder="Farmer ID" />
      </div>
      <div>
        <label>Consumer ID:</label>
        <input type="number" value={consumerId} onChange={(e) => setConsumerId(e.target.value)} placeholder="Consumer ID" />
      </div>
      <div>
        <label>Reason:</label>
        <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for dispute" />
        <button onClick={handleCreateDispute} disabled={loading}>Create Dispute</button>
      </div>
      {/* Actions for an existing dispute */}
      <div>
        <label>Dispute ID:</label>
        <input type="number" value={disputeId} onChange={(e) => setDisputeId(e.target.value)} placeholder="Dispute ID" />
        <button onClick={handleGetDispute} disabled={loading}>Get Dispute</button>
      </div>
      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Raised">Raised</option>
          <option value="UnderReview">Under Review</option>
          <option value="Resolved">Resolved</option>
        </select>
        <label>Resolution (Optional):</label>
        <input type="text" value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="Resolution" />
        <button onClick={handleUpdateDispute} disabled={loading}>Update Dispute</button>
        <button onClick={handleDeleteDispute} disabled={loading}>Delete Dispute</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DisputeManagement;
