import React from "react";

const benefits = [
  {
    title: "Freedom from Tantrik Obstacles & Business Stability",
    description:
      "The Dus Mahavidyas remove unseen Tantrik barriers, negative energies, and planetary disturbances affecting business. Offering this chadhava during Diwali ensures protection from sudden losses and brings long-term stability.",
  },
  {
    title: "Stronger Decision-Making & Risk Confidence",
    description:
      "Blessings of Maa Baglamukhi, Chhinnamasta, and Dhoomavati awaken inner strength, clarity, and confidence — empowering business owners to take correct and timely decisions.",
  },
  {
    title: "Lakshmi Kripa & Accelerated Sales Growth",
    description:
      "When Dus Mahavidya Chadhava is offered during Diwali, Goddess Lakshmi’s blessings multiply. It removes stagnation, attracts customers, and opens continuous income channels throughout the year.",
  },
];

const BenefitOfOfferingsWidget = () => {
  return (
   <div className="container">
     <div className="benefit-widget-modern">
      <div className="benefit-header">
        {/* <span className="benefit-subtitle">Sacred Benefits</span> */}
        <h2 className="benefit-main-title">Benefits of Offerings</h2>
      </div>

      <div className="benefit-cards">
        {benefits.map((item, index) => (
          <div className="benefit-card" key={index}>
            <div className="benefit-icon">➜</div>
            <div className="benefit-content">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
   </div>
  );
};

export default BenefitOfOfferingsWidget;
