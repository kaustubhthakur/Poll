import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateQuery.css';

const CreateQuery = ({ pollId, onQueryAdded, currentUserId }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [queries, setQueries] = useState([]);
  const [votingInProgress, setVotingInProgress] = useState(false);

  // Fetch existing queries for this poll
  useEffect(() => {
    if (pollId) {
      fetchQueries();
    }
  }, [pollId]);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(`/api/polls/${pollId}/queries`);
      setQueries(response.data);
    } catch (err) {
      console.error('Error fetching queries:', err);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form after successful submission
  const resetForm = () => {
    setDescription('');
    setImage(null);
    setImagePreview('');
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!description.trim()) {
      setError('Please enter a query description');
      return;
    }
    
    if (!image) {
      setError('Please upload an image');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create FormData to send file and text data
      const formData = new FormData();
      formData.append('description', description);
      formData.append('image', image);
      formData.append('pollId', pollId); // Associate with a poll
      
      // Send request to backend
      const response = await axios.post('/api/queries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess(true);
      resetForm();
      
      // Add the new query to the list
      setQueries([...queries, response.data]);
      
      // Notify parent component of the new query
      if (onQueryAdded && response.data) {
        onQueryAdded(response.data);
      }
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle voting
  const handleVote = async (queryId) => {
    if (!currentUserId || votingInProgress) {
      return;
    }

    setVotingInProgress(true);
    try {
      const response = await axios.post(`/api/queries/${queryId}/vote`, { userId: currentUserId });
      
      // Update the queries state with the updated vote data
      setQueries(queries.map(query => 
        query._id === queryId ? response.data : query
      ));
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register vote. Please try again.');
    } finally {
      setVotingInProgress(false);
    }
  };

  // Check if user has already voted for a query
  const hasVoted = (query) => {
    return query.vote && query.vote.includes(currentUserId);
  };

  return (
    <div className="create-query-container">
      <h3>Add Poll Option</h3>
      
      {success && <div className="success-message">Poll option added successfully!</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="query-description">Option Description</label>
          <input
            type="text"
            id="query-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter option description"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="query-image">Option Image</label>
          <div className="image-upload-container">
            <input
              type="file"
              id="query-image"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
              disabled={loading}
            />
            <label htmlFor="query-image" className="custom-file-upload">
              {image ? 'Change Image' : 'Select Image'}
            </label>
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Option'}
        </button>
      </form>

      {/* Display existing queries with voting options */}
      {queries.length > 0 && (
        <div className="queries-list">
          <h4>Current Poll Options</h4>
          <div className="query-items">
            {queries.map(query => (
              <div key={query._id} className="query-item">
                <div className="query-content">
                  <div className="query-image">
                    <img src={query.image} alt={query.description} />
                  </div>
                  <div className="query-details">
                    <h5>{query.description}</h5>
                    <p>{query.vote ? query.vote.length : 0} votes</p>
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
      )}
    </div>
  );
};

export default CreateQuery;