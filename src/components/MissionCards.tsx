import React, { useState } from "react";
import { Coolshape, type shapeTypes } from "coolshapes-react";
import {
	ChartNoAxesCombined,
	Share2,
	UsersRound,
	HandCoins,
	type LucideIcon,
} from "lucide-react";

interface MissionItem {
	title: string;
	number_index: number;
	icon: LucideIcon;
	type: shapeTypes;
	index: number;
	color: string;
	description: string;
}

const values: MissionItem[] = [
	{
		title: "Portfolio Scaling",
		number_index: 1,
		icon: ChartNoAxesCombined,
		type: "star",
		index: 5,
		color: "bg-[#ADF59F]",
		description:
			"Guiding and scaling our business units across fragrance, travel, events, HR consulting, and digital media to reach their full potential.",
	},
	{
		title: "Ecosystem Synergy",
		number_index: 2,
		icon: Share2,
		type: "star",
		index: 5,
		color: "bg-[#DFF3FE]",
		description:
			"Driving cross-brand collaboration to unlock new competitive advantages and improve operational efficiency.",
	},
	{
		title: "Leadership Empowerment",
		number_index: 3,
		icon: UsersRound,
		type: "star",
		index: 5,
		color: "bg-[#D6CEFE]",
		description:
			"Supporting our Managing Partners and key talent with adaptive, reliable enterprise governance.",
	},
	{
		title: "Value Creation",
		number_index: 4,
		icon: HandCoins,
		type: "star",
		index: 5,
		color: "bg-[#FFDEAF]",
		description:
			"Delivering trusted products and services that enrich customer lives and accelerate partner growth.",
	},
];

export default function MissionCards() {
	// null by default: all cards remain in uniform collapsed state until hovered
	const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

	// Zero-re-render high performance cursor tracking via CSS variables
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
		e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
	};

	return (
		<div
			onMouseLeave={() => setHoveredIdx(null)}
			className="flex flex-col md:flex-row gap-3.5 w-full min-h-[460px] sm:min-h-[500px] select-none font-testsohne">
			{values.map((item, idx) => {
				const isHovered = hoveredIdx === idx;
				const Icon = item.icon;

				return (
					<div
						key={idx}
						onMouseMove={handleMouseMove}
						onMouseEnter={() => setHoveredIdx(idx)}
						onClick={() => setHoveredIdx(idx)}
						onFocus={() => setHoveredIdx(idx)}
						tabIndex={0}
						role="button"
						aria-expanded={isHovered}
						className={`group relative overflow-hidden rounded-2xl p-6 sm:p-7 transition-[flex-grow,background-color,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer focus:outline-hidden ${
							isHovered
								? "flex-[2.5] bg-[#272825] shadow-xl border border-white/20"
								: "flex-1 bg-digital-neutrals-800/95 hover:bg-digital-neutrals-800 border border-white/5"
						}`}>
						{/* Spotlight Layer 1: Ambient Surface Radial Glow */}
						<div
							className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							style={{
								background: `radial-gradient(480px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(138, 154, 135, 0.12), transparent 70%)`,
							}}
						/>

						{/* Spotlight Layer 2: Subtle Border Sheen Highlight */}
						<div
							className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							style={{
								background: `radial-gradient(900px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.25), transparent 60%)`,
								maskImage: `linear-gradient(#4d5b4b 0 0) content-box, linear-gradient(#4d5b4b 0 0)`,
								maskComposite: "exclude",
								WebkitMaskComposite: "xor",
								padding: "1px",
							}}
						/>

						{/* Card Content in 3 Grid Rows */}
						<div className="relative z-10 grid grid-rows-[auto_1fr_auto] gap-4 h-full">
							{/* Row 1: Top (Lucide Icon Badge when expanded, Large Number when collapsed) */}
							<div className="w-full flex items-center justify-between min-h-[52px]">
								{isHovered ? (
									<div
										className={`rounded-full ${item.color} text-primary_onyx flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-105 animate-in fade-in zoom-in-90 p-2 mt-5`}>
										<Icon className="size-11" />
									</div>
								) : (
									<div className="text-primary_bone_white/40 text-5xl sm:text-6xl md:text-7xl font-normal transition-opacity duration-300 pt-16">
										<span>{"0" + item.number_index + "."}</span>
									</div>
								)}
							</div>

							{/* Row 2: Middle (Title when expanded, subtle flex space when collapsed) */}
							<div className="flex items-center justify-start my-auto min-h-[80px]">
								{isHovered ? (
									<h2 className="font-normal  text-3xl sm:text-4xl md:text-7xl leading-tight text-primary_bone_white animate-in fade-in slide-in-from-bottom-2 duration-300">
										{item.title}
									</h2>
								) : (
									<div className="h-0" />
								)}
							</div>

							{/* Row 3: Bottom (Description when expanded, Coolshape + Title when collapsed) */}
							<div className="flex flex-col justify-end mt-auto">
								{isHovered ? (
									<p className="text-sm sm:text-2xl font-light leading-relaxed text-primary_bone_white/80 max-w-[600px] animate-in fade-in slide-in-from-bottom-3 duration-400">
										{item.description}
									</p>
								) : (
									<div className="flex flex-col gap-3 max-w-[270px]">
										<div className="bg-primary_bone_white rounded-md w-max p-1 flex items-center justify-center shadow-xs">
											<Coolshape
												type={item.type}
												index={item.index}
												size={22}
												noise={true}
											/>
										</div>
										<h2 className="font-normal text-5xl leading-snug tracking-tight text-primary_bone_white">
											{item.title}
										</h2>
									</div>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
