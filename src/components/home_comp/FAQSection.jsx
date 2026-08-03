import { useState } from 'react';
import '../../pages/home.css';
import '../../pages/Pujadetails.css'; // for pd-faq-* styles used below

const DEFAULT_FAQS = [
	{ q: 'How can I book a puja on VaidikGuru?', a: 'Choose a puja from our Puja section, select your preferred temple and date, then complete the booking with payment.' },
	{ q: 'How do online consultations work?', a: 'You can chat, call, or video call a verified astrologer directly from the Consult Astrologer section.' },
	{ q: 'Can I watch the puja live?', a: 'Yes, for eligible pujas you will receive a live video link so you can watch the ritual in real-time.' },
	{ q: 'Can I book puja for someone else?', a: 'Absolutely, just add their name and gotra details during checkout so the sankalp is taken on their behalf.' },
	{ q: 'How is chadhava delivered?', a: 'Chadhava items are offered at the temple and prasad is couriered to your address across India.' },
	{ q: 'What is the refund policy?', a: 'Refunds are processed as per our Refund Policy page depending on the service and cancellation timing.' },
];

const pad = (n, len = 2) => String(n).padStart(len, '0');

// Same accordion item UI used on the Puja Details page FAQ section
const FaqItem = ({ num, q, a }) => {
	const [open, setOpen] = useState(false);
	return (
		<div className="pd-faq-item" onClick={() => setOpen((o) => !o)}>
			<div className="pd-faq-q">
				<span className="pd-faq-num">{pad(num)}</span>
				<span className="pd-faq-text">{q}</span>
				<div className="pd-faq-toggle">
					<i className={`fas fa-${open ? 'minus' : 'plus'}`} />
				</div>
			</div>
			{open && <div className="pd-faq-ans">{a}</div>}
		</div>
	);
};

const FAQSection = ({ faqs = DEFAULT_FAQS, title = 'Frequently Asked Questions' }) => {
	return (
		<div className="pd-faq-wrap">
			<div className="pd-sec-eyebrow">
				<span className="pd-eyebrow-line" />
				<i className="fas fa-om" /> {title} <i className="fas fa-om" />
				<span className="pd-eyebrow-line" />
			</div>
			<div className="pd-faq-grid">
				{faqs.map((item, index) => (
					<FaqItem key={item.q} num={index + 1} q={item.q} a={item.a} />
				))}
			</div>
		</div>
	);
};

export default FAQSection;