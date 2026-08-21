import React, { useState, useRef } from "react";
import { ArrowUpRight, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
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

const INITIAL_VALUES: FormValues = {
	name: "",
	email: "",
	company: "",
	phone: "",
	inquiry_type: "",
	message: "",
};

export default function ContactForm() {
	const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

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

		// Prepare payload for PHP backend
		const payload = {
			name: values.name.trim(),
			email: values.email.trim(),
			company: values.company.trim(),
			phone: values.phone.trim(),
			inquiry_type: inquiryValue,
			message: values.message.trim(),
		};

		setIsSubmitting(true);

		const isLocalhost =
			typeof window !== "undefined" &&
			(window.location.hostname === "localhost" ||
				window.location.hostname === "127.0.0.1" ||
				window.location.hostname.endsWith(".local"));

		try {
			const response = await fetch("/api/send-mail.php", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const result = await response.json().catch(() => null);

			if (response.ok && result?.success) {
				// Reset form to empty defaults
				setValues(INITIAL_VALUES);
				setErrors({});
				setTouched({});

				// Trigger Emil Kowalski Sonner Success Toast
				toast.success("Message Received Successfully", {
					description:
						"Thank you for reaching out to Galedi Corps. Our partnership team will review your inquiry and get back to you shortly.",
					duration: 5000,
				});
			} else if (isLocalhost) {
				// In local development simulate successful submission & reset form
				console.info(
					"%c📨 [Galedi Corps - Local Dev Mode]: Form payload received successfully!",
					"color: #5c634d; font-weight: bold; font-size: 13px;",
					payload
				);
				await new Promise((resolve) => setTimeout(resolve, 600));

				// Reset form inputs to default empty state
				setValues(INITIAL_VALUES);
				setErrors({});
				setTouched({});

				// Trigger Emil Kowalski Sonner Success Toast
				toast.success("Message Received Successfully", {
					description:
						"Thank you for reaching out to Galedi Corps. Our partnership team will review your inquiry and get back to you shortly.",
					duration: 5000,
				});
			} else {
				const errorMsg =
					result?.error ||
					"Unable to send message at this moment. Please email info@galedicorps.com directly.";

				toast.error("Unable to Send Message", {
					description: errorMsg,
					duration: 5000,
				});
			}
		} catch (err) {
			if (isLocalhost) {
				console.info(
					"%c📨 [Galedi Corps - Local Dev Mode]: Form simulated successfully! (When uploaded to Hostinger, send-mail.php will execute and send email to info@galedicorps.com)",
					"color: #5c634d; font-weight: bold; font-size: 13px;",
					payload
				);
				await new Promise((resolve) => setTimeout(resolve, 600));

				setValues(INITIAL_VALUES);
				setErrors({});
				setTouched({});

				toast.success("Message Received Successfully", {
					description:
						"Thank you for reaching out to Galedi Corps. Our partnership team will review your inquiry and get back to you shortly.",
					duration: 5000,
				});
			} else {
				console.warn("Mailer endpoint network error:", err);
				toast.error("Network Error", {
					description:
						"Unable to connect to the mail server. Please ensure the site is uploaded to Hostinger, or contact info@galedicorps.com directly.",
					duration: 5000,
				});
			}
		} finally {
			setIsSubmitting(false);
		}
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
				<CustomSelect
					value={values.inquiry_type}
					onChange={handleCustomSelectChange}
				/>
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
			<div className="pt-2">
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
