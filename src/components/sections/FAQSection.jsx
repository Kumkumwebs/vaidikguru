import React, { useState } from "react";


const FaqSection = ({ faq }) => {
  if (!faq) return null;
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="faq-section space-top ">
      <div className="container">
        
        {/* ===== TITLE ===== */}
      
       <h2 className="puja-package-title">Frequently asked Questions</h2>

    

        {/* ===== FAQ LIST ===== */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="faq-list">
              {faq.map((item, index) => (
                <div
                  key={index}
                  className={`faq-card ${activeIndex === index ? "active" : ""}`}
                >
                  <button
                    className="faq-header"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="faq-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="faq-question">{item.question}</span>
                    <span className="faq-toggle">
                      {activeIndex === index ? "−" : "+"}
                    </span>
                  </button>

                  {activeIndex === index && (
                    <div className="faq-body">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FaqSection;
