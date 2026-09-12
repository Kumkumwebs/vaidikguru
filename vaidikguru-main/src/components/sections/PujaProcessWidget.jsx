import React from "react";

const steps = [
  {
    step: "01",
    title: "Select Your Puja",
    desc: "Choose a sacred puja or chadhava aligned with your intention and divine needs.",
    icon: "🪔",
  },
  {
    step: "02",
    title: "Add Divine Offerings",
    desc: "Enhance blessings with Gau Seva, Deep Daan, Vastra Seva, Anna Seva & more.",
    icon: "🌸",
  },
  {
    step: "03",
    title: "Provide Sankalp",
    desc: "Enter your Name & Gotra to personalize the puja Sankalp.",
    icon: "📿",
  },
  {
    step: "04",
    title: "Live Puja Updates",
    desc: "Pandits perform puja collectively. Get real-time WhatsApp updates.",
    icon: "📲",
  },
  {
    step: "05",
    title: "Receive Blessings",
    desc: "Get puja video in 3–4 days & Ganga Jal delivered in 8–10 days.",
    icon: "🙏",
  },
];

const PujaProcessFlow = () => {
  return (
    <section className="puja-flow-section">
      <div className="container">
        <div className="puja-flow-header">
          <span className="puja-flow-subtitle">Divine Journey</span>
          <h2 className="puja-flow-title">How Your Puja Happens at DivinIQ</h2>
          <p className="puja-flow-desc">
            A seamless spiritual process guided by Vedic rituals and devotion.
          </p>
        </div>

        <div className="puja-flow-wrapper">
          {steps.map((item, index) => (
            <div className="puja-flow-card" key={index}>
              <div className="puja-flow-glow" />
              <div className="puja-flow-icon">{item.icon}</div>

              <div className="puja-flow-step">{item.step}</div>

              <h4 className="puja-flow-card-title">{item.title}</h4>
              <p className="puja-flow-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PujaProcessFlow;
