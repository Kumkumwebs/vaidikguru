import { useState } from 'react';

const PopupSearch = ({ isOpen, onClose }) => {
	const [searchQuery, setSearchQuery] = useState('');

	const handleSubmit = e => {
		e.preventDefault();
		console.log('Search:', searchQuery);
	};

	return (
		<div className={`popup-search-box ${isOpen ? 'show' : ''}`}>
			<button className="searchClose" onClick={onClose}>
				<i className="fal fa-times"></i>
			</button>
			<form action="#" onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="What are you looking for?"
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
				/>
				<button type="submit">
					<i className="fal fa-search"></i>
				</button>
			</form>
		</div>
	);
};

export default PopupSearch;
