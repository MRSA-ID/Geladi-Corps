import gsap from "gsap";
import { startLenis, stopLenis } from "./lenis";

const SESSION_STORAGE_KEY = "geladi_visited";
const PRELOADER_SKIPPED_CLASS = "preloader-skipped";

/**
 * Initialize and run the initial session preloader
 */
export function initPreloader(): void {
	const preloader = document.getElementById("geladi-preloader");
	if (!preloader) return;

	// Check if already visited in this browser session
	const hasVisited = Boolean(sessionStorage.getItem(SESSION_STORAGE_KEY));
	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	if (hasVisited || prefersReducedMotion) {
		document.documentElement.classList.add(PRELOADER_SKIPPED_CLASS);
		preloader.style.display = "none";
		preloader.remove();
		startLenis();
		return;
	}

	// Show preloader and lock scroll during genuine first visit
	preloader.style.display = "flex";
	stopLenis();
	document.body.style.overflow = "hidden";

	const logoMark = preloader.querySelector(".preloader-logo");
	const brandTitle = preloader.querySelector(".preloader-title");
	const brandSubtitle = preloader.querySelector(".preloader-subtitle");
	const progressBar = preloader.querySelector(".preloader-progress-bar");
	const progressTrack = preloader.querySelector(".preloader-progress-track");
	const curtain = preloader.querySelector(".preloader-curtain");

	const tl = gsap.timeline({
		onComplete: () => {
			document.documentElement.classList.add(PRELOADER_SKIPPED_CLASS);
			sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
			document.body.style.overflow = "";
			preloader.style.display = "none";
			preloader.remove();
			startLenis();
		},
	});

	// Emergency fallback in case GSAP fails or stalls
	const emergencyTimeout = setTimeout(() => {
		document.documentElement.classList.add(PRELOADER_SKIPPED_CLASS);
		sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
		document.body.style.overflow = "";
		if (preloader.parentNode) {
			preloader.style.display = "none";
			preloader.remove();
		}
		startLenis();
	}, 2000);

	// GSAP Animation Sequence
	tl.set(preloader, { opacity: 1 })
		.fromTo(
			logoMark,
			{ scale: 0.85, opacity: 0, y: 15 },
			{ scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
		)
		.fromTo(
			[brandTitle, brandSubtitle],
			{ opacity: 0, y: 10 },
			{ opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
			"-=0.25"
		)
		.fromTo(
			progressTrack,
			{ opacity: 0, scaleX: 0.5 },
			{ opacity: 1, scaleX: 1, duration: 0.3, ease: "power2.out" },
			"-=0.2"
		)
		.fromTo(
			progressBar,
			{ scaleX: 0 },
			{ scaleX: 1, duration: 0.55, ease: "power2.inOut" },
			"-=0.1"
		)
		.to(
			[logoMark, brandTitle, brandSubtitle, progressTrack],
			{ opacity: 0, y: -15, duration: 0.3, ease: "power2.in" },
			"+=0.1"
		)
		.to(
			curtain || preloader,
			{
				yPercent: -100,
				duration: 0.65,
				ease: "power4.inOut",
				onComplete: () => {
					clearTimeout(emergencyTimeout);
				},
			},
			"-=0.05"
		);
}
