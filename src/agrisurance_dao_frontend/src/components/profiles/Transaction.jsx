// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as backend_idl, canisterId as backend_id } from '../../../../declarations/agrisurance_dao_backend';

// Initialize the agent and backend actor
const agent = new HttpAgent({ host: "https://ic0.app" }); // Adjust the host if necessary
const backend = Actor.createActor(backend_idl, { agent, canisterId: backend_id });

const Transaction = () => {
  // State hooks for form inputs, messages, and loading
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [involvedParties, setInvolvedParties] = useState('');
  const [recordId, setRecordId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionRecords, setTransactionRecords] = useState([]);

  // Function to handle creating a transaction record
  const handleCreateTransactionRecord = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const partiesArray = involvedParties.split(',').map(id => parseInt(id.trim(), 10));
    try {
      const transactionRecordResult = await backend.create_transaction_record(parseFloat(amount), parseInt(date, 10), partiesArray);
      if (transactionRecordResult) {
        setMessage('Transaction record created successfully!');
        fetchTransactionRecords(); // Refresh the list of transaction records
      } else {
        setMessage('Failed to create transaction record.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle reading a transaction record by ID
  const fetchTransactionRecordById = async () => {
    setLoading(true);
    setMessage('');
    try {
      const record = await backend.read_transaction_record(parseInt(recordId, 10));
      setTransactionRecords([record]); // Set the fetched record to state
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all transaction records (assuming there's a way to fetch all)
  const fetchTransactionRecords = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Assuming there's a function to fetch all transaction records
      // const records = await backend.read_all_transaction_records();
      // setTransactionRecords(records);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle updating a transaction record
  const handleUpdateTransactionRecord = async () => {
    setLoading(true);
    setMessage('');
    const partiesArray = involvedParties.split(',').map(id => parseInt(id.trim(), 10));
    try {
      const result = await backend.update_transaction_record(parseInt(recordId, 10), parseFloat(amount), parseInt(date, 10), partiesArray);
      if (result) {
        setMessage('Transaction record updated successfully!');
        fetchTransactionRecords(); // Refresh the list
      } else {
        setMessage('Failed to update transaction record.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deleting a transaction record
  const handleDeleteTransactionRecord = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await backend.delete_transaction_record(parseInt(recordId, 10));
      if (result) {
        setMessage('Transaction record deleted successfully!');
        fetchTransactionRecords(); // Refresh the list
      } else {
        setMessage('Failed to delete transaction record.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Optionally, fetch all transaction records on component mount
  useEffect(() => {
    // fetchTransactionRecords();
  }, []);

  return (
    <div>
      <h2>Transaction Record Management</h2>
      <form onSubmit={handleCreateTransactionRecord}>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
        </div>
        <div>
          <label>Date (Unix Timestamp):</label>
          <input
            type="number"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Date"
          />
        </div>
        <div>
          <label>Involved Parties (IDs, comma-separated):</label>
          <input
            type="text"
            value={involvedParties}
            onChange={(e) => setInvolvedParties(e.target.value)}
            placeholder="1,2,3"
          />
        </div>
        <button type="button" onClick={handleCreateTransactionRecord} disabled={loading}>
          {loading ? 'Creating...' : 'Create Transaction'}
        </button>
        <button type="button" onClick={handleUpdateTransactionRecord} disabled={loading}>
          Update Transaction
        </button>
        <button type="button" onClick={handleDeleteTransactionRecord} disabled={loading}>
          Delete Transaction
        </button>
        <div>
          <label>Record ID for Fetch/Update/Delete:</label>
          <input
            type="text"
            value={recordId}
            onChange={(e) => setRecordId(e.target.value)}
            placeholder="Record ID"
          />
          <button type="button" onClick={fetchTransactionRecordById} disabled={loading}>
            Fetch Transaction
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
      <h3>Transaction Records:</h3>
      <ul>
        {transactionRecords.map((record, index) => (
          <li key={index}>
            ID: {record.id}, Amount: {record.amount}, Date: {record.date}, Parties: {record.involved_parties.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );

};

export default Transaction;

