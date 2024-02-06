// Import necessary libraries
import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as backend_idl, canisterId as backend_id } from '../../../../declarations/agrisurance_dao_backend';

// Initialize the agent and backend actor
const agent = new HttpAgent({ host: "https://ic0.app" }); // Adjust the host if necessary
const backend = Actor.createActor(backend_idl, { agent, canisterId: backend_id });

const Profile = () => {
  // State hooks for form inputs and messages
  const [name, setName] = useState('');
  const [role, setRole] = useState('Farmer');
  const [stakeInDao, setStakeInDao] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(name,role,stakeInDao)
    setLoading(true);
    setMessage('');
    try {
      // Validate input
      if (!name || stakeInDao <= 0) {
        setMessage('Please provide a valid name and stake.');
        setLoading(false);
        return;
      }
      
      // Assuming the backend method is adjusted to accept the role as a string for simplicity
      //const userProfileResult = await backend.create_user_profile(name, role, parseFloat(stakeInDao));
      const userProfileResult = await backend.create_user_profile(name, { [role]: null }, parseFloat(stakeInDao));
      // Handle response based on your backend's implementation
      if (userProfileResult) {
        setMessage('User profile created successfully!');
      } else {
        setMessage('Failed to create user profile.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Farmer">Farmer</option>
            <option value="Consumer">Consumer</option>
          </select>
        </div>
        <div>
          <label>Stake in DAO:</label>
          <input
            type="number"
            value={stakeInDao}
            onChange={(e) => setStakeInDao(e.target.value)}
            placeholder="Stake in DAO"
          />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Profile'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Profile;
