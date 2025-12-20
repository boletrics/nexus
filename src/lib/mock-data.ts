import type { VenueMap } from "./types";

// Generate mock venue data
export const createMockVenue = (): VenueMap => {
	const venueWidth = 1200;
	const venueHeight = 800;
	const venueCenterX = venueWidth / 2; // 600

	// Stage - centered horizontally
	const stageWidth = 400;
	const stageHeight = 80;
	const stageX = (venueWidth - stageWidth) / 2; // 400
	const stageY = 50;

	// Helper function to center a seat row
	const centerSeatRow = (seats: number, spacing: number, y: number) => {
		const totalWidth = (seats - 1) * spacing + 24; // 24 is seat width
		const x = venueCenterX - totalWidth / 2;
		return { x, y };
	};

	// Box dimensions
	const boxWidth = 100;
	const boxHeight = 120;
	const boxDistanceFromCenter = 500; // Distance from venue center to box center (increased for better spacing)
	const box1CenterX = venueCenterX - boxDistanceFromCenter;
	const box2CenterX = venueCenterX + boxDistanceFromCenter;
	const boxY = 180;

	// Standing area - centered
	const standingWidth = 600;
	const standingHeight = 100;
	const standingX = (venueWidth - standingWidth) / 2; // 300
	const standingY = 580;

	// Tables - symmetric
	const tableSize = 60; // Approximate table size
	const tableDistanceFromCenter = 400; // Distance from venue center
	const table1X = venueCenterX - tableDistanceFromCenter - tableSize / 2;
	const table2X = venueCenterX + tableDistanceFromCenter - tableSize / 2;
	const tableY = 580;

	return {
		id: "venue-1",
		name: "Grand Arena",
		dimensions: { width: venueWidth, height: venueHeight },
		stage: {
			position: { x: stageX, y: stageY },
			dimensions: { width: stageWidth, height: stageHeight },
			label: "Main Stage",
		},
		elements: [
			// Front rows (VIP) - centered
			{
				id: "row-a",
				type: "seat-row",
				position: centerSeatRow(20, 32, 180),
				seats: 20,
				rowLabel: "A",
				curved: true,
				curveAngle: 10,
				spacing: 32,
				tier: "vip",
			},
			{
				id: "row-b",
				type: "seat-row",
				position: centerSeatRow(22, 32, 220),
				seats: 22,
				rowLabel: "B",
				curved: true,
				curveAngle: 8,
				spacing: 32,
				tier: "vip",
			},
			// Middle rows (Premium) - centered
			{
				id: "row-c",
				type: "seat-row",
				position: centerSeatRow(24, 32, 280),
				seats: 24,
				rowLabel: "C",
				curved: false,
				curveAngle: 0,
				spacing: 32,
				tier: "premium",
			},
			{
				id: "row-d",
				type: "seat-row",
				position: centerSeatRow(24, 32, 320),
				seats: 24,
				rowLabel: "D",
				curved: false,
				curveAngle: 0,
				spacing: 32,
				tier: "premium",
			},
			{
				id: "row-e",
				type: "seat-row",
				position: centerSeatRow(24, 32, 360),
				seats: 24,
				rowLabel: "E",
				curved: false,
				curveAngle: 0,
				spacing: 32,
				tier: "premium",
			},
			// Back rows (Standard) - centered
			{
				id: "row-f",
				type: "seat-row",
				position: centerSeatRow(26, 32, 420),
				seats: 26,
				rowLabel: "F",
				curved: false,
				curveAngle: 0,
				spacing: 32,
				tier: "standard",
			},
			{
				id: "row-g",
				type: "seat-row",
				position: centerSeatRow(26, 32, 460),
				seats: 26,
				rowLabel: "G",
				curved: false,
				curveAngle: 0,
				spacing: 32,
				tier: "standard",
			},
			{
				id: "row-h",
				type: "seat-row",
				position: centerSeatRow(26, 32, 500),
				seats: 26,
				rowLabel: "H",
				curved: false,
				curveAngle: 0,
				spacing: 32,
				tier: "standard",
			},
			// VIP Boxes - symmetric
			{
				id: "box-1",
				type: "box",
				position: { x: box1CenterX - boxWidth / 2, y: boxY },
				dimensions: { width: boxWidth, height: boxHeight },
				capacity: 8,
				label: "Box 1",
				amenities: ["Private Bar", "Catering", "VIP Entrance"],
				tier: "vip",
			},
			{
				id: "box-2",
				type: "box",
				position: { x: box2CenterX - boxWidth / 2, y: boxY },
				dimensions: { width: boxWidth, height: boxHeight },
				capacity: 8,
				label: "Box 2",
				amenities: ["Private Bar", "Catering", "VIP Entrance"],
				tier: "vip",
			},
			// Standing Area - centered
			{
				id: "standing-1",
				type: "standing",
				position: { x: standingX, y: standingY },
				dimensions: { width: standingWidth, height: standingHeight },
				capacity: 200,
				label: "General Standing",
				tier: "economy",
			},
			// Tables - symmetric
			{
				id: "table-1",
				type: "table",
				position: { x: table1X, y: tableY },
				seats: 6,
				shape: "round",
				label: "T1",
				tier: "premium",
			},
			{
				id: "table-2",
				type: "table",
				position: { x: table2X, y: tableY },
				seats: 6,
				shape: "round",
				label: "T2",
				tier: "premium",
			},
		],
	};
};

export const generateId = () =>
	`el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
