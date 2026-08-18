import React from "react";
import { Coolshape, type shapeTypes } from "coolshapes-react";

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

export default function ValuesCards() {
	return (
		<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
			{values.map((item, idx) => (
				<div
					key={idx}
					className="grid grid-rows-[0.25fr_1fr_0.5fr] place-content-around bg-secondary_olive rounded-2xl p-2.5 min-h-[300px] h-full transition-all duration-300 hover:bg-[#596653] shadow-sm group gap-4">
					<h3 className="text-white text-base sm:text-[17px] font-medium leading-snug">
						{item.title}
					</h3>
					<div className="my-auto py-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
						<Coolshape
							type={item.type}
							index={item.index}
							size={142.86}
							noise={true}
						/>
					</div>
					<div className="h-full">
						<p className="text-primary_bone_white text-xs sm:text-[13px] leading-relaxed font-light text-justify ">
							{item.description}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
