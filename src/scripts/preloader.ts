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

	const counterContainer = document.getElementById("preloader-counter-container");
	const counterVal = document.getElementById("preloader-counter-val");
	const wordmarkContainer = document.getElementById("preloader-wordmark-container");
	const wordmarkSvg = document.getElementById("preloader-wordmark-svg");
	const chars = gsap.utils.toArray<SVGPathElement>(".preloader-char");
	const curtainPath = document.getElementById("preloader-curtain-path");

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
	}, 3500);

	// 1. Initial State Setup
	tl.set(preloader, { opacity: 1 })
		.set(curtainPath, {
			attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" },
		})
		.set(counterContainer, {
			opacity: 0,
			y: 35,
		})
		.set(wordmarkContainer, {
			opacity: 0,
		})
		.set(wordmarkSvg, {
			opacity: 1,
			y: 0,
		})
		.set(chars, {
			opacity: 0,
			y: 55,
			scale: 0.88,
			transformOrigin: "50% 100%",
		});

	// 2. Pure Minimalist Progress Counter In (from bottom offset)
	tl.to(counterContainer, {
		opacity: 1,
		y: 0,
		duration: 0.35,
		ease: "power3.out",
	});

	// 3. Progress Ticker (0% to 100% - No progress bar)
	const progressObj = { val: 0 };
	tl.to(
		progressObj,
		{
			val: 100,
			duration: 0.75,
			ease: "power2.inOut",
			onUpdate: () => {
				if (counterVal) counterVal.textContent = Math.round(progressObj.val).toString();
			},
		},
		"-=0.15"
	);

	// 4. Progress Counter Exit (to bottom offset)
	tl.to(counterContainer, {
		opacity: 0,
		y: 40,
		duration: 0.25,
		ease: "power2.in",
	});

	// 5. Step-by-Step Alphabet Reveal from Bottom Offset (G ➔ E ➔ L ➔ A ➔ D ➔ I ➔ C ➔ O ➔ R ➔ P ➔ S)
	tl.set(wordmarkContainer, { opacity: 1 })
		.to(
			chars,
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.42,
				stagger: 0.045,
				ease: "power3.out",
			},
			"-=0.05"
		);

	// 6. Step-by-Step Wordmark Exit (Glides up and dissolves)
	tl.to(
		chars,
		{
			opacity: 0,
			y: -25,
			scale: 0.95,
			duration: 0.25,
			stagger: 0.015,
			ease: "power2.in",
		},
		"+=0.25"
	);

	// 7. Liquid SVG Morphing Wave Curtain Exit
	tl.to(
		curtainPath,
		{
			attr: { d: "M 0 0 V 50 Q 50 0 100 50 V 0 z" },
			duration: 0.32,
			ease: "power2.in",
		},
		"-=0.1"
	).to(curtainPath, {
		attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
		duration: 0.28,
		ease: "power3.out",
		onComplete: () => {
			clearTimeout(emergencyTimeout);
		},
	});
}
