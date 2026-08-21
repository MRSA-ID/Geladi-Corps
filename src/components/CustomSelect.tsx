import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface OptionItem {
	value: string;
	label: string;
}

const DEFAULT_OPTIONS: OptionItem[] = [
	{
		value: "general",
		label: "General Corporate Inquiry",
	},
	{
		value: "partnership",
		label: "Strategic Brand Partnership & Incubation",
	},
	{
		value: "mice",
		label: "Corporate Travel & MICE Retreats",
	},
	{
		value: "scent",
		label: "OEM Perfumery & Ambient Scenting",
	},
	{
		value: "events",
		label: "Event Production & Custom Packaging",
	},
	{
		value: "hr",
		label: "Human Capital Consulting & Training",
	},
	{
		value: "media",
		label: "Media & Editorial Collaboration",
	},
];

interface CustomSelectProps {
	name?: string;
	required?: boolean;
	placeholder?: string;
	options?: OptionItem[];
}

export default function CustomSelect({
	name = "inquiry_type",
	required = true,
	placeholder = "Select an inquiry or service type",
	options = DEFAULT_OPTIONS,
}: CustomSelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedValue, setSelectedValue] = useState<string>("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find((opt) => opt.value === selectedValue);

	// Synchronize initial selection from URL search params or hash
	useEffect(() => {
		function syncFromUrl() {
			if (typeof window === "undefined") return;
			const params = new URLSearchParams(window.location.search);
			const typeParam = (
				params.get("type") || window.location.hash.replace("#", "")
			).toLowerCase();

			if (typeParam === "partnership" || typeParam === "partnerships") {
				setSelectedValue("partnership");
			} else if (
				typeParam === "inquiries" ||
				typeParam === "inquiry" ||
				typeParam === "business" ||
				typeParam === "mice"
			) {
				setSelectedValue("mice");
			} else if (
				typeParam === "scent" ||
				typeParam === "perfume" ||
				typeParam === "fragrance"
			) {
				setSelectedValue("scent");
			} else if (
				typeParam === "events" ||
				typeParam === "packaging" ||
				typeParam === "creative"
			) {
				setSelectedValue("events");
			} else if (
				typeParam === "hr" ||
				typeParam === "training" ||
				typeParam === "consulting"
			) {
				setSelectedValue("hr");
			} else if (typeParam === "media" || typeParam === "press") {
				setSelectedValue("media");
			} else if (typeParam === "general" || typeParam === "contact") {
				setSelectedValue("general");
			}
		}

		syncFromUrl();
		window.addEventListener("popstate", syncFromUrl);
		document.addEventListener("astro:page-load", syncFromUrl);

		return () => {
			window.removeEventListener("popstate", syncFromUrl);
			document.removeEventListener("astro:page-load", syncFromUrl);
		};
	}, []);

	// Click outside & Escape key listeners
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape" && isOpen) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	function handleSelect(option: OptionItem) {
		setSelectedValue(option.value);
		setIsOpen(false);
	}

	return (
		<div
			ref={dropdownRef}
			className="relative w-full font-testsohne select-none">
			{/* Hidden form input for standard form submission */}
			<input
				type="hidden"
				name={name}
				value={selectedValue}
				required={required}
			/>

			{/* Minimalist Line-Underlined Trigger Button */}
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				className={`w-full flex items-center justify-between bg-transparent border-0 border-b pb-3 pt-1 text-left text-base sm:text-lg transition-all duration-300 cursor-pointer group focus:outline-hidden ${
					isOpen
						? "border-primary_onyx text-primary_onyx"
						: selectedOption
							? "border-black/30 text-primary_onyx"
							: "border-black/20 text-neutral-400 hover:border-black/40"
				}`}>
				<span
					className={`truncate pr-4 ${
						selectedOption
							? "text-primary_onyx font-normal"
							: "text-neutral-300 font-light"
					}`}>
					{selectedOption ? selectedOption.label : placeholder}
				</span>

				<ChevronDown
					className={`size-4 text-neutral-500 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
						isOpen
							? "rotate-180 text-primary_onyx"
							: "group-hover:text-primary_onyx"
					}`}
				/>
			</button>

			{/* Glassmorphic Dropdown Popover */}
			<div
				role="listbox"
				data-lenis-prevent="true"
				className={`absolute left-0 right-0 top-full mt-2.5 z-50 overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl border border-black/10 shadow-2xl p-2 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
					isOpen
						? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
						: "opacity-0 scale-[0.97] -translate-y-2 pointer-events-none"
				}`}>
				<div
					data-lenis-prevent="true"
					className="max-h-[280px] overflow-y-auto space-y-1 overscroll-contain pr-1 custom-scrollbar">
					{options.map((option) => {
						const isSelected = option.value === selectedValue;
						return (
							<button
								key={option.value}
								type="button"
								role="option"
								aria-selected={isSelected}
								onClick={() => handleSelect(option)}
								className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer group/item ${
									isSelected
										? "bg-primary_onyx text-primary_bone_white shadow-xs"
										: "hover:bg-neutral-100/90 text-primary_onyx"
								}`}>
								<span
									className={`text-sm sm:text-base font-normal tracking-tight truncate ${
										isSelected
											? "text-primary_bone_white"
											: "text-primary_onyx group-hover/item:text-black"
									}`}>
									{option.label}
								</span>

								{/* Checkmark Indicator */}
								{isSelected && (
									<div className="size-5 rounded-full bg-secondary_olive/30 flex items-center justify-center shrink-0 border border-secondary_olive/50">
										<Check className="size-3 text-secondary_olive stroke-[3]" />
									</div>
								)}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
