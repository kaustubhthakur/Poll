import React, { useState } from 'react';
import axios from 'axios';
import './PollModal.css';

const PollModal = ({ isOpen, onClose, currentPoll = null, onPollCreated }) => {
  const [title, setTitle] = useState(currentPoll?.title || '');
  const [queries, setQueries] = useState(currentPoll?.queries || ['']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Don't render if modal is not open
  if (!isOpen) return null;

  const handleAddQuery = () => {
    setQueries([...queries, '']);
  };

  const handleQueryChange = (index, value) => {
    const newQueries = [...queries];
    newQueries[index] = value;
    setQueries(newQueries);
  };

  const handleRemoveQuery = (index) => {
    if (queries.length > 1) {
      const newQueries = [...queries];
      newQueries.splice(index, 1);
      setQueries(newQueries);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Filter out empty queries
    const filteredQueries = queries.filter(query => query.trim() !== '');

    if (!title.trim()) {
      setError('Title is required');
      setIsLoading(false);
      return;
    }

    if (filteredQueries.length === 0) {
      setError('At least one query is required');
      setIsLoading(false);
      return;
    }

    const pollData = {
      title: title.trim(),
      queries: filteredQueries,
      // userId should be retrieved from your authentication context/service
      // This is just a placeholder - replace with actual auth method
      userId: localStorage.getItem('userId') || 'user123'
    };

    try {
      let response;
      
      if (currentPoll?._id) {
        // Update existing poll
        response = await axios.put(`/api/polls/${currentPoll._id}`, pollData);
      } else {
        // Create new poll
        response = await axios.post('/api/polls', pollData);
      }

      setIsLoading(false);
      
      if (onPollCreated) {
        onPollCreated(response.data);
      }
      
      onClose();
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Failed to save poll. Please try again.');
    }
  };

  return (
    <div className="poll-modal-overlay">
      <div className="poll-modal">
        <div className="poll-modal-header">
          <h2>{currentPoll ? 'Edit Poll' : 'Create New Poll'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="poll-title">Poll Title</label>
            <input
              id="poll-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter poll title"
              required
            />
          </div>

          <div className="form-group">
            <label>Poll Questions</label>
            {queries.map((query, index) => (
              <div key={index} className="query-input-group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(index, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                />
                <button 
                  type="button" 
                  className="remove-query-btn"
                  onClick={() => handleRemoveQuery(index)}
                  disabled={queries.length <= 1}
                >
                  -
                </button>
              </div>
            ))}
            <button 
              type="button" 
              className="add-query-btn"
              onClick={handleAddQuery}
            >
              + Add Question
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Saving...' : currentPoll ? 'Update Poll' : 'Create Poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PollModal;