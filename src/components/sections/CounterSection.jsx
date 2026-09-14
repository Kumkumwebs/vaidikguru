import React from 'react';
import { motion } from 'framer-motion';

const CounterSection = () => {
    const counters = [
        { number: 12, suffix: '+', title: 'Years Lineage' },
        { number: 98, suffix: '%', title: 'Connection' },
        { number: 15, suffix: 'k', title: 'Sankalpas' },
        { number: 22, suffix: 'k', title: 'Seekers' },
    ];

    return (
        <div className="counter-area space overflow-hidden" style={{ background: '#ffffff' }}>
            <div className="container">
                {/* REPHRASED TOP BAR */}
                <div className="row justify-content-center">
                    <div className="col-lg-7 text-center">
                        <div className="counter-title-area">
                            <motion.span 
                                initial={{ opacity: 0 }} 
                                whileInView={{ opacity: 1 }} 
                                className="sub-title style1 text-theme"
                            >
                                Our Spiritual Impact
                            </motion.span>
                            <h2 className="sec-title mb-3">Legacy of <span className="text-gradient">Divine Energy</span></h2>
                            <p className="sec-text mx-auto" style={{ maxWidth: '600px', fontSize: '15px', color: '#64748b' }}>
                                Behind every number lies a soul’s journey. We measure our success through the precision 
                                of rituals and the profound peace experienced by our global community.
                            </p>
                        </div>
                    </div>
                </div>

                {/* THE EYE-CATCHING ORBS */}
                <div className="row g-3 g-md-4 justify-content-center">
                    {counters.map((counter, index) => (
                        <div key={index} className="col-6 col-md-3">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ 
                                    duration: 0.8, 
                                    delay: index * 0.1,
                                    ease: [0, 0.71, 0.2, 1.01]
                                }}
                                className="energy-orb"
                            >
                                <div className="text-center px-2">
                                    <h3 className="orb-number mb-0">
                                        {counter.number}{counter.suffix}
                                    </h3>
                                    <h6 className="orb-title mb-0">
                                        {counter.title}
                                    </h6>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CounterSection;