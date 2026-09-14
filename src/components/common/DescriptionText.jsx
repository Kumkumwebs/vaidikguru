import { useState } from "react";

const DescriptionBlock = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="chadhava-desc">
      <p
        className={`box-text mb-10 ${expanded ? "expanded" : "clamped"}`}
      >
        {text}
      </p>

      {text?.length > 200 && (
        <button
          className="read-toggle-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default DescriptionBlock;
