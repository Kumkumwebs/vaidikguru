import React, { useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
	const followerRef = useRef(null);
	const coords = useRef({
		mouseX: 0,
		mouseY: 0,
		posX: 0,
		posY: 0,
	});

	useEffect(() => {
		const handleMouseMove = e => {
			coords.current.mouseX = e.clientX;
			coords.current.mouseY = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);

		const updatePosition = () => {
			if (!followerRef.current) return;

			const { mouseX, mouseY, posX, posY } = coords.current;

			// Interpolation logic from original main.js:
			// posX += (mouseX - posX) / 9;
			coords.current.posX += (mouseX - posX) / 9;
			coords.current.posY += (mouseY - posY) / 9;

			// Update styles
			// Original code used left/top with -12px offset
			// We use transform for better performance
			followerRef.current.style.transform = `translate3d(${
				coords.current.posX - 12
			}px, ${coords.current.posY - 12}px, 0)`;

			requestAnimationFrame(updatePosition);
		};

		const animationFrameId = requestAnimationFrame(updatePosition);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return <div ref={followerRef} id="cursor-follower"></div>;
};

export default CursorFollower;
