import React, { useState, useEffect } from "react";
import UserDetailsModal from "../common/ChadhavaUserDetailsModel";
import apiService from "../../services/apiServices";
import { useStorage } from '../../context/StorageContext';

const ShopChadhava = ({ chadhava }) => {
	const { setActiveChadhavaId } = useStorage();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [cart, setCart] = useState({ addons: [], prasad: [] });
	const [localActiveChadhavaId, setLocalActiveChadhavaId] = useState(null);

	// --- 1. Load Cart & Sync activeChadhavaId ---

	const fetchCart = async () => {
		try {
			const res = await apiService.postBearer('https://admin.diviniq.in/puja/getChadhavaCart', {});
			if (res && res.status && res.data.length > 0) {
				const serverCart = res.data[0];
				// Get ID from the populated object or string
				const serverChadhavaId =
					serverCart.chadhava_id?._id || serverCart.chadhava_id;

				// Only show cart items if they belong to THIS chadhava
				if (serverChadhavaId === chadhava._id) {
					setCart({
						addons: serverCart.addons_selected || [],
						prasad: serverCart.prasad_selected || [],
					});
					setLocalActiveChadhavaId(serverChadhavaId);
				} else {
					// Keep local state empty if it's a different chadhava
					setCart({ addons: [], prasad: [] });
					setLocalActiveChadhavaId(serverChadhavaId);
				}
			}
		} catch (e) {
			console.error('Failed to load cart', e);
		}
	};
	useEffect(() => {
		if (chadhava?._id) fetchCart();
	}, [chadhava?._id]);

	// --- 2. Sync with Server (The Overwrite Logic) ---
	const syncWithServer = async (updatedAddons, updatedPrasad) => {
		try {
			const payload = {
				chadhava_id: chadhava._id,
				addons_selected: updatedAddons.map(i => ({
					addon_id: i.addon_id || i._id,
					qty: i.qty || i.quantity,
				})),
				prasad_selected: updatedPrasad.map(i => ({
					prasad_id: i.prasad_id || i._id,
					qty: i.qty || i.quantity,
				})),
			};

			const res = await apiService.postBearer(
				'https://admin.diviniq.in/puja/ChadhavaaddToCart',
				payload
			);
			if (res && res.status) {
				const newData = res.data[0];
				setCart({
					addons: newData.addons_selected || [],
					prasad: newData.prasad_selected || [],
				});
				setLocalActiveChadhavaId(chadhava._id);
				setActiveChadhavaId(chadhava._id); // Sync to context/sessionStorage
			}
		} catch (e) {
			console.error('Sync error:', e);
		}
	};

	// --- 3. Quantity Handler with "Different Chadhava" Guard ---
	const handleUpdateQty = (item, delta, type) => {
		// 1. Determine if we are truly switching to a brand new Chadhava
		// We check if there's an existing ID and if it's different from the current page
		const isSwitchingChadhava =
			localActiveChadhavaId !== null && localActiveChadhavaId !== chadhava._id;

		let currentAddons = isSwitchingChadhava ? [] : [...cart.addons];
		let currentPrasad = isSwitchingChadhava ? [] : [...cart.prasad];

		const targetList = type === 'addon' ? currentAddons : currentPrasad;
		const itemIdField = type === 'addon' ? 'addon_id' : 'prasad_id';

		const existingIndex = targetList.findIndex(
			i => (i[itemIdField] || i._id) === item._id
		);

		if (existingIndex > -1) {
			const currentQty =
				targetList[existingIndex].qty || targetList[existingIndex].quantity;
			const newQty = currentQty + delta;

			if (newQty <= 0) {
				targetList.splice(existingIndex, 1);
			} else {
				targetList[existingIndex] = {
					...targetList[existingIndex],
					qty: newQty,
					quantity: newQty,
				};
			}
		} else {
			if (delta > 0) {
				targetList.push({
					...item,
					qty: 1,
					quantity: 1,
					[itemIdField]: item._id,
				});
			}
		}

		const finalAddons = type === 'addon' ? targetList : currentAddons;
		const finalPrasad = type === 'prasad' ? targetList : currentPrasad;

		// 2. CRITICAL FIX: Update state AND activeChadhavaId immediately
		setCart({ addons: finalAddons, prasad: finalPrasad });
		setActiveChadhavaId(chadhava._id); // This prevents the "switch" logic from triggering on the 2nd click

		// 3. Sync to server
		syncWithServer(finalAddons, finalPrasad);
	};

	// --- Calculations ---
	const totalItems = [...cart.addons, ...cart.prasad].reduce(
		(acc, curr) => acc + (curr.qty || curr.quantity || 0),
		0
	);

	// Total logic that works even if price is string or number
	const totalAmount =
		cart.addons.reduce(
			(acc, curr) =>
				acc + Number(curr.pamount || 0) * (curr.qty || curr.quantity || 0),
			0
		) +
		cart.prasad.reduce(
			(acc, curr) =>
				acc + Number(curr.amount || 0) * (curr.qty || curr.quantity || 0),
			0
		);

	// --- Helper to Render Cards ---
	const renderProductCard = (item, type) => {
		const list = type === 'addon' ? cart.addons : cart.prasad;
		const idField = type === 'addon' ? 'addon_id' : 'prasad_id';
		const cartItem = list.find(i => (i[idField] || i._id) === item._id);
		const quantity = cartItem ? cartItem.qty || cartItem.quantity : 0;

		return (
			<div className="col-md-6" key={item._id}>
				<div className="modern-product-card d-flex shadow-sm p-3 bg-white rounded-3 mb-3">
					<div className="modern-product-image position-relative">
						<img
							src={item.pimage || item.image}
							alt={item.pname || item.name}
							className="rounded-2"
							style={{ width: '80px', height: '80px', objectFit: 'cover' }}
						/>
						<div className="quantity-control-wrapper">
							{quantity === 0 ? (
								<button
									className="add-btn-main"
									onClick={() => handleUpdateQty(item, 1, type)}
								>
									+ Add
								</button>
							) : (
								<div className="quantity-stepper">
									<button onClick={() => handleUpdateQty(item, -1, type)}>
										−
									</button>
									<span>{quantity}</span>
									<button onClick={() => handleUpdateQty(item, 1, type)}>
										+
									</button>
								</div>
							)}
						</div>
					</div>
					<div className="ms-3 flex-grow-1">
						<h3 className="h6 mb-1 fw-bold">{item.pname || item.name}</h3>
						<p className="small text-muted mb-2 text-truncate-2">
							{item.pdesc || item.description}
						</p>
						<span className="fw-bold text-success">
							₹{item.pamount || item.amount}
						</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<section
			className="space-extra-bottom"
			style={{ paddingBottom: totalItems > 0 ? '100px' : '40px' }}
		>
			<div className="container">
				{/* ADDONS */}
				{chadhava.addons?.length > 0 && (
					<div className="mb-4">
						<h3 className="box-title mb-4">Enhance Your Seva (Add-ons)</h3>
						<div className="row">
							{chadhava.addons.map(i => renderProductCard(i, 'addon'))}
						</div>
					</div>
				)}

				{/* PRASAD */}
				{chadhava.prasad?.length > 0 && (
					<div className="mb-4">
						<h3 className="box-title mb-4">Sacred Prasad</h3>
						<div className="row">
							{chadhava.prasad.map(i => renderProductCard(i, 'prasad'))}
						</div>
					</div>
				)}
			</div>

			{/* Floating Bottom Bar */}
			{totalItems > 0 && (
				<div className="sri-bottom-bar-fixed-wrapper">
					<div className="sri-bottom-bar shadow-lg">
						<div className="sri-cart-details">
							<span className="sri-offering-count">
								{totalItems} Item{totalItems > 1 ? 's' : ''} Selected
							</span>
							<span className="sri-separator">•</span>
							<span className="sri-total-amount">₹{totalAmount}</span>
						</div>
						<button
							className="sri-next-btn"
							onClick={() => setIsModalOpen(true)}
						>
							Next <span className="arrow">→</span>
						</button>
					</div>
				</div>
			)}

			<UserDetailsModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				cart={{ ...cart, chadhava_id: chadhava._id }}
				page={'chadhava'}
			/>
		</section>
	);
};

export default ShopChadhava;