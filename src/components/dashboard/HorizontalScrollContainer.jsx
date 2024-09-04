import React from 'react';
import './HorizontalScrollContainer.css'; // Import the CSS file

const HorizontalScrollContainer = ({ children }) => {
  return (
    <div className="horizontal-scroll-container">
      {children}
    </div>
  );
};

export default HorizontalScrollContainer;