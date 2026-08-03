import '../../pages/home.css';

const COLUMNS = [
	{
		title: 'Popular Aarti & Chalisa',
		links: ['Hanuman Chalisa', 'Shiv Chalisa', 'Vishnu Sahasranamam', 'Durga Chalisa', 'Gayatri Mantra', 'Sunderkand'],
	},
	{
		title: 'Popular Pooja Places',
		links: ['Kashi Vishwanath', 'Mahakal Ujjain', 'Ayodhya Ram Mandir', 'Tirupati Balaji', 'Vaishno Devi', 'Somnath Temple', 'Shirdi Sai Baba', 'Khatu Shyam'],
	},
	{
		title: 'Chadhava Places',
		links: ['Kashi Vishwanath', 'Mahakal Ujjain', 'Ayodhya Ram Mandir', 'Tirupati Balaji', 'Vaishno Devi', 'Jagannath Puri', 'Shirdi Sai Baba', 'Badrinath Dham'],
	},
];

const QuickLinksSection = () => {
	return (
		<section className="dq-quicklinks">
			<div className="dq-container">
				<div className="dq-quicklinks-grid">
					{COLUMNS.map((col) => (
						<div className="dq-quicklinks-col" key={col.title}>
							<h5>{col.title}</h5>
							<ul>
								{col.links.map((link) => (
									<li key={link}>{link}</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default QuickLinksSection;
