import React, { useState, useRef } from "react";
import { ArrowUpRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import CustomSelect from "./CustomSelect";

interface FormValues {
	name: string;
	email: string;
	company: string;
	phone: string;
	inquiry_type: string;
	message: string;
}

interface FormErrors {
	name?: string;
	email?: string;
	company?: string;
	phone?: string;
	inquiry_type?: string;
	message?: string;
}

export default function ContactForm() {
	const [values, setValues] = useState<FormValues>({
		name: "",
		email: "",
		company: "",
		phone: "",
		inquiry_type: "",
		message: "",
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const formRef = useRef<HTMLFormElement>(null);

	// Contextual field validation function
	function validateField(field: keyof FormValues, value: string): string | undefined {
		const trimmed = value.trim();

		switch (field) {
			case "name":
				if (!trimmed) {
					return "Please enter your name.";
				}
				if (trimmed.length < 2) {
					return "Name must be at least 2 characters.";
				}
				if (!/^[a-zA-Z\s.,'-]+$/.test(trimmed)) {
					return "Please enter a valid name without numbers or special symbols.";
				}
				return undefined;

			case "email":
				if (!trimmed) {
					return "Please enter your email address.";
				}
				// RFC-standard email format check
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
					return "Please enter a valid email address (e.g. name@company.com).";
				}
				return undefined;

			case "company":
				if (trimmed && trimmed.length < 2) {
					return "Company name must be at least 2 characters if provided.";
				}
				return undefined;

			case "phone":
				if (trimmed) {
					// Clean phone string to count digits
					const digitsOnly = trimmed.replace(/\D/g, "");
					if (digitsOnly.length < 8) {
						return "Please enter a valid phone number (min 8 digits).";
					}
					if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(trimmed)) {
						return "Please enter a valid phone number format.";
					}
				}
				return undefined;

			case "inquiry_type":
				if (!trimmed) {
					return "Please select an inquiry or service type.";
				}
				return undefined;

			case "message":
				if (!trimmed) {
					return "Please enter your message.";
				}
				if (trimmed.length < 10) {
					return `Message must be at least 10 characters (${trimmed.length}/10).`;
				}
				return undefined;

			default:
				return undefined;
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		const field = name as keyof FormValues;

		setValues((prev) => ({ ...prev, [field]: value }));

		// If field is already touched or has an active error, validate live on change to reward fixing
		if (touched[field] || errors[field]) {
			const error = validateField(field, value);
			setErrors((prev) => ({ ...prev, [field]: error }));
		}
	}

	function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		const field = name as keyof FormValues;

		setTouched((prev) => ({ ...prev, [field]: true }));
		const error = validateField(field, value);
		setErrors((prev) => ({ ...prev, [field]: error }));
	}

	function handleCustomSelectChange(value: string) {
		setValues((prev) => ({ ...prev, inquiry_type: value }));
		setTouched((prev) => ({ ...prev, inquiry_type: true }));
		const error = validateField("inquiry_type", value);
		setErrors((prev) => ({ ...prev, inquiry_type: error }));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		// Read inquiry_type from hidden input inside CustomSelect if present
		const formData = new FormData(e.currentTarget);
		const inquiryValue = (formData.get("inquiry_type") as string) || values.inquiry_type;

		// Validate all fields
		const newErrors: FormErrors = {
			name: validateField("name", values.name),
			email: validateField("email", values.email),
			company: validateField("company", values.company),
			phone: validateField("phone", values.phone),
			inquiry_type: validateField("inquiry_type", inquiryValue),
			message: validateField("message", values.message),
		};

		// Mark all fields as touched
		setTouched({
			name: true,
			email: true,
			company: true,
			phone: true,
			inquiry_type: true,
			message: true,
		});

		setErrors(newErrors);

		// Check if any error exists
		const hasErrors = Object.values(newErrors).some((err) => Boolean(err));
		if (hasErrors) {
			// Find first invalid input and focus/scroll to it smoothly
			const firstErrorKey = Object.keys(newErrors).find((key) => Boolean(newErrors[key as keyof FormErrors]));
			if (firstErrorKey) {
				const errorElement = formRef.current?.querySelector(`[name="${firstErrorKey}"]`) as HTMLElement | null;
				errorElement?.focus();
			}
			return;
		}

		// Proceed with submission simulation
		setIsSubmitting(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1200));
			setIsSubmitted(true);
		} catch {
			// Handle error if needed
		} finally {
			setIsSubmitting(false);
		}
	}

	function handleReset() {
		setValues({
			name: "",
			email: "",
			company: "",
			phone: "",
			inquiry_type: "",
			message: "",
		});
		setErrors({});
		setTouched({});
		setIsSubmitted(false);
	}

	if (isSubmitted) {
		return (
			<div className="p-8 sm:p-12 rounded-2xl bg-primary_bone_white border border-black/10 flex flex-col items-center justify-center text-center gap-6 shadow-xs animate-in fade-in zoom-in-95 duration-500">
				<div className="size-16 rounded-full bg-secondary_olive/20 text-secondary_olive flex items-center justify-center shadow-xs">
					<CheckCircle2 className="size-9 stroke-[2.2]" />
				</div>
				<div className="flex flex-col gap-2 max-w-md">
					<h3 className="text-2xl sm:text-3xl font-semibold text-primary_onyx tracking-tight">
						Message Received
					</h3>
					<p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
						Thank you for reaching out to Galedi Corps. Our partnership and strategic consulting team will review your inquiry and get back to you shortly.
					</p>
				</div>
				<button
					type="button"
					onClick={handleReset}
					className="mt-2 px-8 py-3 rounded-full bg-primary_onyx text-primary_bone_white text-sm font-medium hover:bg-neutral-800 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
				>
					Send Another Message
				</button>
			</div>
		);
	}

	return (
		<form
			ref={formRef}
			noValidate
			onSubmit={handleSubmit}
			className="flex flex-col gap-10 sm:gap-12 font-testsohne"
		>
			{/* Row 1: Name & Email */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
				{/* Name Field */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="name-input" className="text-sm sm:text-base text-neutral-600 font-light">
						Enter your name <span className="text-secondary_terracotta">*</span>
					</label>
					<input
						id="name-input"
						name="name"
						type="text"
						value={values.name}
						onChange={handleChange}
						onBlur={handleBlur}
						placeholder="e.g. Amanda Putri"
						aria-invalid={Boolean(errors.name)}
						aria-describedby={errors.name ? "name-error" : undefined}
						className={`w-full bg-transparent border-0 border-b pb-3 pt-1 text-base sm:text-lg placeholder:text-neutral-300 focus:outline-hidden transition-all duration-200 ${
							errors.name
								? "border-secondary_terracotta text-primary_onyx focus:border-secondary_terracotta"
								: "border-black/20 text-primary_onyx focus:border-primary_onyx"
						}`}
					/>
					{errors.name && (
						<div id="name-error" className="flex items-center gap-1.5 text-xs text-secondary_terracotta pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
							<AlertCircle className="size-3.5 shrink-0" />
							<span>{errors.name}</span>
						</div>
					)}
				</div>

				{/* Email Field */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="email-input" className="text-sm sm:text-base text-neutral-600 font-light">
						Email address <span className="text-secondary_terracotta">*</span>
					</label>
					<input
						id="email-input"
						name="email"
						type="email"
						value={values.email}
						onChange={handleChange}
						onBlur={handleBlur}
						placeholder="amanda@example.com"
						aria-invalid={Boolean(errors.email)}
						aria-describedby={errors.email ? "email-error" : undefined}
						className={`w-full bg-transparent border-0 border-b pb-3 pt-1 text-base sm:text-lg placeholder:text-neutral-300 focus:outline-hidden transition-all duration-200 ${
							errors.email
								? "border-secondary_terracotta text-primary_onyx focus:border-secondary_terracotta"
								: "border-black/20 text-primary_onyx focus:border-primary_onyx"
						}`}
					/>
					{errors.email && (
						<div id="email-error" className="flex items-center gap-1.5 text-xs text-secondary_terracotta pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
							<AlertCircle className="size-3.5 shrink-0" />
							<span>{errors.email}</span>
						</div>
					)}
				</div>
			</div>

			{/* Row 2: Company & Phone */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
				{/* Company Field (Optional) */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="company-input" className="text-sm sm:text-base text-neutral-600 font-light">
						Company name <span className="text-xs text-neutral-400 font-normal">(Optional)</span>
					</label>
					<input
						id="company-input"
						name="company"
						type="text"
						value={values.company}
						onChange={handleChange}
						onBlur={handleBlur}
						placeholder="Company or Brand Name"
						aria-invalid={Boolean(errors.company)}
						aria-describedby={errors.company ? "company-error" : undefined}
						className={`w-full bg-transparent border-0 border-b pb-3 pt-1 text-base sm:text-lg placeholder:text-neutral-300 focus:outline-hidden transition-all duration-200 ${
							errors.company
								? "border-secondary_terracotta text-primary_onyx focus:border-secondary_terracotta"
								: "border-black/20 text-primary_onyx focus:border-primary_onyx"
						}`}
					/>
					{errors.company && (
						<div id="company-error" className="flex items-center gap-1.5 text-xs text-secondary_terracotta pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
							<AlertCircle className="size-3.5 shrink-0" />
							<span>{errors.company}</span>
						</div>
					)}
				</div>

				{/* Phone Field (Optional) */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="phone-input" className="text-sm sm:text-base text-neutral-600 font-light">
						Phone number <span className="text-xs text-neutral-400 font-normal">(Optional)</span>
					</label>
					<input
						id="phone-input"
						name="phone"
						type="tel"
						value={values.phone}
						onChange={handleChange}
						onBlur={handleBlur}
						placeholder="+62 812-xxxx-xxxx"
						aria-invalid={Boolean(errors.phone)}
						aria-describedby={errors.phone ? "phone-error" : undefined}
						className={`w-full bg-transparent border-0 border-b pb-3 pt-1 text-base sm:text-lg placeholder:text-neutral-300 focus:outline-hidden transition-all duration-200 ${
							errors.phone
								? "border-secondary_terracotta text-primary_onyx focus:border-secondary_terracotta"
								: "border-black/20 text-primary_onyx focus:border-primary_onyx"
						}`}
					/>
					{errors.phone && (
						<div id="phone-error" className="flex items-center gap-1.5 text-xs text-secondary_terracotta pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
							<AlertCircle className="size-3.5 shrink-0" />
							<span>{errors.phone}</span>
						</div>
					)}
				</div>
			</div>

			{/* Row 3: Inquiry Type (Custom Select) */}
			<div className="flex flex-col gap-1.5 relative z-30">
				<label className="text-sm sm:text-base text-neutral-600 font-light">
					Inquiry Type <span className="text-secondary_terracotta">*</span>
				</label>
				<CustomSelect />
				{errors.inquiry_type && (
					<div className="flex items-center gap-1.5 text-xs text-secondary_terracotta pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
						<AlertCircle className="size-3.5 shrink-0" />
						<span>{errors.inquiry_type}</span>
					</div>
				)}
			</div>

			{/* Row 4: Your Message */}
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between">
					<label htmlFor="message-input" className="text-sm sm:text-base text-neutral-600 font-light">
						Your message <span className="text-secondary_terracotta">*</span>
					</label>
					<span
						className={`text-xs transition-colors duration-200 ${
							values.message.trim().length >= 10
								? "text-neutral-400"
								: values.message.length > 0
									? "text-secondary_terracotta"
									: "text-neutral-400"
						}`}
					>
						{values.message.trim().length}/10 min
					</span>
				</div>
				<textarea
					id="message-input"
					name="message"
					rows={4}
					value={values.message}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Type your message, inquiry, or partnership details here..."
					aria-invalid={Boolean(errors.message)}
					aria-describedby={errors.message ? "message-error" : undefined}
					className={`w-full bg-transparent border-0 border-b pb-3 pt-1 text-base sm:text-lg placeholder:text-neutral-300 focus:outline-hidden transition-all duration-200 resize-none ${
						errors.message
							? "border-secondary_terracotta text-primary_onyx focus:border-secondary_terracotta"
							: "border-black/20 text-primary_onyx focus:border-primary_onyx"
					}`}
				/>
				{errors.message && (
					<div id="message-error" className="flex items-center gap-1.5 text-xs text-secondary_terracotta pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
						<AlertCircle className="size-3.5 shrink-0" />
						<span>{errors.message}</span>
					</div>
				)}
			</div>

			{/* Submit Button */}
			<div className="pt-4">
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full sm:w-max px-10 py-4 rounded-full bg-primary_onyx hover:bg-neutral-800 text-primary_bone_white font-medium text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 cursor-pointer group disabled:opacity-75 disabled:cursor-not-allowed"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="size-5 animate-spin" />
							<span>Sending Message...</span>
						</>
					) : (
						<>
							<span>Send Message</span>
							<ArrowUpRight className="size-5 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</>
					)}
				</button>
			</div>
		</form>
	);
}
