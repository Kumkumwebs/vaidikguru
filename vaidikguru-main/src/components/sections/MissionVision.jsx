import React from 'react';
import { motion } from 'framer-motion';

const MissionVision = () => {
    const data = [
        {
            title: "Our Sacred Mission",
            desc: "To empower every modern seeker with the precision of Vedic sciences. We translate ancient planetary frequencies into actionable life strategies for career, health, and harmony.",
            icon: "assets/img/brand/vision_18224729.png",
            accent: "#6366f1", // Indigo
            glow: "rgba(99, 102, 241, 0.5)",
            bgSoft: "#f5f7ff"
        },
        {
            title: "Our Cosmic Vision",
            desc: "To become the global gold standard for digital spiritual transformation—where tradition meets technology to create a world aligned with universal order and inner peace.",
            icon: "assets/img/brand/achievement_7281990.png",
            accent: "#a855f7", // Purple
            glow: "rgba(168, 85, 247, 0.5)",
            bgSoft: "#faf5ff"
        }
    ];

    return (
        <section className="space bg-white overflow-hidden">
            <div className="container">
                <div className="row g-4 mission-vision-grid">
                    {data.map((item, index) => (
                        <div className="col-lg-6" key={index}>
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: index * 0.2 }}
                                className="diviniq-box"
                                style={{ 
                                    '--accent-color': item.accent, 
                                    '--glow-color': item.glow,
                                    '--bg-soft': item.bgSoft
                                }}
                            >
                                <div className="diviniq-icon-wrap shadow-sm">
                                    <img src={item.icon} width="40" alt={item.title} />
                                </div>
                                <h3 className="heading">{item.title}</h3>
                                <p className="leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MissionVision;