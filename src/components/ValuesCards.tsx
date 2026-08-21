import React, { useRef } from "react";
import { Coolshape, type shapeTypes } from "coolshapes-react";
import gsap from "gsap";

interface ValueItem {
	title: string;
	type: shapeTypes;
	index: number;
	description: string;
}

const values: ValueItem[] = [
	{
		title: "Growth orientation",
		type: "triangle",
		index: 0,
		description:
			"We invest in learning, improve what we already do, and look for opportunities in markets where our businesses can create lasting value.",
	},
	{
		title: "Authentic quality",
		type: "flower",
		index: 0,
		description:
			"We care about the details people experience directly — from the quality of a product to the way a service is delivered.",
	},
	{
		title: "Leadership empowerment",
		type: "wheel",
		index: 1,
		description:
			"We trust Managing Partners and teams to lead with ownership while staying aligned with the direction of the group",
	},
	{
		title: "Ecosystem energy",
		type: "wheel",
		index: 3,
		description:
			"We share knowledge, capabilities, relationships, and opportunities when working together creates a better outcome",
	},
	{
		title: "Adaptability",
		type: "ellipse",
		index: 8,
		description:
			"Markets change. Customer expectations change. Businesses have to respond and adapt when the situation calls for it.",
	},
	{
		title: "Integrity & trust",
		type: "rectangle",
		index: 1,
		description:
			"Good business starts with doing the right thing, especially when the decision is not obvious.",
	},
];

function ValueCardItem({ item }: { item: ValueItem }) {
	const cardRef = useRef<HTMLDivElement>(null);
	const shapeRef = useRef<HTMLDivElement>(null);

	const handlePointerEnter = () => {
		if (!shapeRef.current) return;

		switch (item.type) {
			case "triangle":
				gsap.to(shapeRef.current, {
					y: -8,
					rotate: 8,
					scale: 1.12,
					duration: 0.4,
					ease: "back.out(2)",
					overwrite: "auto",
				});
				break;
			case "flower":
				gsap.to(shapeRef.current, {
					rotate: 60,
					scale: 1.14,
					duration: 0.5,
					ease: "power3.out",
					overwrite: "auto",
				});
				break;
			case "wheel":
				gsap.to(shapeRef.current, {
					rotate: 120,
					scale: 1.12,
					duration: 0.6,
					ease: "power3.out",
					overwrite: "auto",
				});
				break;
			case "ellipse":
				gsap.to(shapeRef.current, {
					scaleX: 1.14,
					scaleY: 0.96,
					y: -6,
					duration: 0.45,
					ease: "elastic.out(1, 0.4)",
					overwrite: "auto",
				});
				break;
			case "rectangle":
				gsap.to(shapeRef.current, {
					y: -8,
					rotate: -4,
					scale: 1.1,
					duration: 0.4,
					ease: "back.out(1.8)",
					overwrite: "auto",
				});
				break;
			default:
				gsap.to(shapeRef.current, {
					scale: 1.12,
					y: -6,
					duration: 0.4,
					ease: "back.out(2)",
					overwrite: "auto",
				});
		}
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!cardRef.current || !shapeRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const relativeX = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
		const relativeY = ((e.clientY - rect.top) / rect.height - 0.5) * 16;

		gsap.to(shapeRef.current, {
			x: relativeX,
			y: relativeY + (item.type === "triangle" || item.type === "rectangle" ? -8 : 0),
			duration: 0.3,
			ease: "power2.out",
			overwrite: "auto",
		});
	};

	const handlePointerLeave = () => {
		if (!shapeRef.current) return;
		gsap.to(shapeRef.current, {
			x: 0,
			y: 0,
			rotate: 0,
			scale: 1,
			scaleX: 1,
			scaleY: 1,
			duration: 0.5,
			ease: "elastic.out(1, 0.5)",
			overwrite: "auto",
		});
	};

	return (
		<div
			ref={cardRef}
			onPointerEnter={handlePointerEnter}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			className="grid grid-rows-[0.25fr_1fr_0.5fr] place-content-around bg-secondary_olive rounded-2xl p-2.5 min-h-[300px] h-full transition-colors duration-300 hover:bg-[#596653] shadow-sm group gap-4 cursor-pointer select-none"
		>
			<h3 className="text-white text-base sm:text-[17px] font-medium leading-snug">
				{item.title}
			</h3>
			<div className="my-auto py-6 flex items-center justify-center pointer-events-none">
				<div
					ref={shapeRef}
					className="will-change-transform flex items-center justify-center"
				>
					<Coolshape
						type={item.type}
						index={item.index}
						size={142.86}
						noise={true}
					/>
				</div>
			</div>
			<div className="h-full">
				<p className="text-primary_bone_white text-xs sm:text-[13px] leading-relaxed font-light text-justify">
					{item.description}
				</p>
			</div>
		</div>
	);
}

export default function ValuesCards() {
	return (
		<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
			{values.map((item, idx) => (
				<ValueCardItem key={idx} item={item} />
			))}
		</div>
	);
}
