import React, { useState } from 'react';

function ReviewUpdatePopup({ review, onClose, onUpdate }) {
  const [description, setDescription] = useState(review.description);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/update-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewID: review.reviewID, utilityID: review.utilityID, newDescription: description }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Review updated successfully");
        onUpdate(review.reviewID, description);
        onClose();
      } else {
        alert("Failed to update review: " + data.message);
      }
    } catch (error) {
      alert("Internal server error");
    }
  };

  return (
    <div>
      <div>
        <h3>Update Review</h3>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={handleUpdate}>Update</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default ReviewUpdatePopup;
