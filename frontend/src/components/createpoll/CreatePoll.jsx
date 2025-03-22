import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreatePoll.css';

const CreatePoll = ({ onPollCreated }) => {
  const [title, setTitle] = useState('');
  const [pollQueries, setPollQueries] = useState([
    { description: '', image: null, imagePreview: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdPolls, setCreatedPolls] = useState([]); // Ensure it's initialized as an array
  const [votingInProgress, setVotingInProgress] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  // Get current user ID on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'defaultUserId';
    setCurrentUserId(userId);
    
    // Fetch existing polls
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get('/api/polls');
      // Check if response.data is an array, if not handle it appropriately
      if (Array.isArray(response.data)) {
        setCreatedPolls(response.data);
      } else if (response.data && Array.isArray(response.data.polls)) {
        // Some APIs might nest the array under a property name
        setCreatedPolls(response.data.polls);
      } else {
        // Fallback to empty array if unexpected format
        console.error('Unexpected data format from API:', response.data);
        setCreatedPolls([]);
      }
    } catch (err) {
      console.error('Error fetching polls:', err);
      setCreatedPolls([]); // Reset to empty array on error
    }
  };

  // Handle adding a new query option
  const handleAddQuery = () => {
    setPollQueries([...pollQueries, { description: '', image: null, imagePreview: '' }]);
  };

  // Handle removing a query option
  const handleRemoveQuery = (index) => {
    if (pollQueries.length > 1) {
      const newQueries = [...pollQueries];
      newQueries.splice(index, 1);
      setPollQueries(newQueries);
    }
  };

  // Handle query description change
  const handleQueryDescriptionChange = (index, value) => {
    const newQueries = [...pollQueries];
    newQueries[index].description = value;
    setPollQueries(newQueries);
  };

  // Handle query image change
  const handleQueryImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newQueries = [...pollQueries];
      newQueries[index].image = file;
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        newQueries[index].imagePreview = reader.result;
        setPollQueries([...newQueries]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Please enter a poll title');
      return;
    }
    
    // Validate queries
    const validQueries = pollQueries.filter(query => 
      query.description.trim() !== '' && query.image !== null
    );
    
    if (validQueries.length < 2) {
      setError('Please add at least two valid poll options with both description and image');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // First create the poll
      const pollResponse = await axios.post('/api/polls', {
        title,
        userId: currentUserId
      });
      
      const pollId = pollResponse.data._id;
      
      // Then create each query and associate with the poll
      const queryPromises = validQueries.map(query => {
        const formData = new FormData();
        formData.append('description', query.description);
        formData.append('image', query.image);
        formData.append('pollId', pollId);
        
        return axios.post('/api/queries', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      });
      
      await Promise.all(queryPromises);
      
      setSuccess(true);
      setTitle('');
      setPollQueries([{ description: '', image: null, imagePreview: '' }]);
      
      // Fetch updated polls
      fetchPolls();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
      // Notify parent component if callback exists
      if (onPollCreated) {
        onPollCreated(pollResponse.data);
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create poll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle voting for a query
  const handleVote = async (queryId) => {
    if (!currentUserId || votingInProgress) {
      return;
    }

    setVotingInProgress(true);
    try {
      await axios.post(`/api/queries/${queryId}/vote`, { userId: currentUserId });
      
      // Refresh polls to get updated vote counts
      fetchPolls();
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register vote. Please try again.');
    } finally {
      setVotingInProgress(false);
    }
  };

  // Check if user has already voted for a query
  const hasVoted = (query) => {
    return query.vote && Array.isArray(query.vote) && query.vote.includes(currentUserId);
  };

  return (
    <div className="create-poll-container">
      <h2>Create a New Poll</h2>
      
      {success && <div className="success-message">Poll created successfully!</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="poll-title">Poll Title</label>
          <input
            type="text"
            id="poll-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter poll title"
            disabled={loading}
          />
        </div>
        
        <div className="poll-queries-section">
          <h3>Poll Options</h3>
          
          {pollQueries.map((query, index) => (
            <div key={index} className="query-item">
              <div className="query-header">
                <h4>Option {index + 1}</h4>
                <button 
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveQuery(index)}
                  disabled={pollQueries.length <= 1 || loading}
                >
                  ✕
                </button>
              </div>
              
              <div className="query-content">
                <div className="form-group">
                  <label htmlFor={`query-desc-${index}`}>Description</label>
                  <input
                    type="text"
                    id={`query-desc-${index}`}
                    value={query.description}
                    onChange={(e) => handleQueryDescriptionChange(index, e.target.value)}
                    placeholder="Enter option description"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`query-image-${index}`}>Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      id={`query-image-${index}`}
                      accept="image/*"
                      onChange={(e) => handleQueryImageChange(index, e)}
                      className="image-input"
                      disabled={loading}
                    />
                    <label htmlFor={`query-image-${index}`} className="custom-file-upload">
                      {query.image ? 'Change Image' : 'Select Image'}
                    </label>
                    
                    {query.imagePreview && (
                      <div className="image-preview">
                        <img src={query.imagePreview} alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            className="add-query-btn"
            onClick={handleAddQuery}
            disabled={loading}
          >
            + Add Another Option
          </button>
        </div>
        
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Creating Poll...' : 'Create Complete Poll'}
        </button>
      </form>

      {/* Display existing polls with voting capability */}
      {Array.isArray(createdPolls) && createdPolls.length > 0 ? (
        <div className="existing-polls">
          <h2>Existing Polls</h2>
          
          {createdPolls.map(poll => (
            <div key={poll._id} className="poll-item">
              <h3>{poll.title}</h3>
              <div className="poll-options">
                {Array.isArray(poll.queries) && poll.queries.map(query => (
                  <div key={query._id} className="query-option">
                    <div className="query-option-content">
                      <div className="query-option-image">
                        <img src={query.image} alt={query.description} />
                      </div>
                      <div className="query-option-details">
                        <h4>{query.description}</h4>
                        <p className="vote-count">
                          {Array.isArray(query.vote) ? query.vote.length : 0} votes
                        </p>
                      </div>
                    </div>
                    <button 
                      className={`vote-btn ${hasVoted(query) ? 'voted' : ''}`}
                      onClick={() => handleVote(query._id)}
                      disabled={votingInProgress || hasVoted(query)}
                    >
                      {hasVoted(query) ? 'Voted' : 'Vote'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CreatePoll;
