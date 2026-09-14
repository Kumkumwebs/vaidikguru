import React from "react";

const benefits = [
  {
    icon: "🕉️",
    title: "Protection from Hidden Obstacles",
    subtitle: "Tantrik & Planetary Relief",
    description:
      "The Dus Mahavidyas are supreme forces of divine Shakti. Their combined blessings remove unseen Tantrik disturbances, negative energies, and adverse planetary effects that silently block progress. This sacred offering creates a powerful spiritual shield around your life and business.",
  },
  {
    icon: "🔱",
    title: "Clarity, Courage & Right Decisions",
    subtitle: "Strengthening Inner Power",
    description:
      "Blessings of Maa Baglamukhi, Chhinnamasta, and Dhoomavati awaken mental strength, courage, and focus. Devotees experience enhanced clarity, fearless decision-making, and confidence — especially during crucial life or business transitions.",
  },
  {
    icon: "🌸",
    title: "Lakshmi Kripa & Prosperity Flow",
    subtitle: "Growth, Abundance & Stability",
    description:
      "When offered during auspicious periods like Diwali, this Chadhava opens the channels of Goddess Lakshmi’s grace. It removes stagnation, attracts opportunities, increases sales and income flow, and ensures long-term financial stability for the family.",
  },
];

const BenefitsPujaWidget = () => {
  return (
    <section className="benefits-puja-section">
      <div className="container">
        {/* Header */}
        <div className="benefits-header text-center">
          <span className="benefits-subtitle">Sacred Outcomes</span>
          <h2 className="benefits-title">Benefits of This Puja & Offering</h2>
          <p className="benefits-desc">
            Each offering is performed with a sacred Sankalp, invoking divine
            energies that bring balance, protection, and prosperity into your life.
          </p>
        </div>

        {/* Cards */}
        <div className="row benefits-grid">
          {benefits.map((item, index) => (
            <div className="col-lg-4 col-md-6 mb-30" key={index}>
              <div className="benefit-puja-card">
                <div className="benefit-icon-wrapper">
                  <span className="benefit-icon">{item.icon}</span>
                </div>

                <div className="benefit-card-content">
                  <h4 className="benefit-card-title">{item.title}</h4>
                  <span className="benefit-card-subtitle">
                    {item.subtitle}
                  </span>
                  <p className="benefit-card-desc">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsPujaWidget;
