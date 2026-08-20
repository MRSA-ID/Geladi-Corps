import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { startLenis, stopLenis, scrollToTarget } from "./lenis";

gsap.registerPlugin(ScrollTrigger);

let isTransitioning = false;
let isInitialized = false;
let watchdogTimeout: number | null = null;

// SVG Path Geometry for Organic Morphing Wave Transition (viewBox="0 0 100 100")
const PATHS = {
	// Leave sequence (rising liquid wave from bottom)
	leaveStart: "M 0 100 V 100 Q 50 100 100 100 V 100 z",
	leaveCurve: "M 0 100 V 50 Q 50 0 100 50 V 100 z",
	leaveFull: "M 0 100 V 0 Q 50 0 100 0 V 100 z",

	// Enter sequence (lifting liquid wave towards top)
	enterFull: "M 0 0 V 100 Q 50 100 100 100 V 0 z",
	enterCurve: "M 0 0 V 50 Q 50 0 100 50 V 0 z",
	enterEnd: "M 0 0 V 0 Q 50 0 100 0 V 0 z",
};

/**
 * Close any currently open navigation menus (mobile drawer or mega-menus)
 */
function closeActiveMenus(): void {
	// Close mobile menu
	const mobileMenu = document.getElementById("mobile-fullscreen-menu");
	if (mobileMenu && !mobileMenu.classList.contains("opacity-0")) {
		const closeBtn = document.getElementById("mobile-menu-close-btn");
		closeBtn?.click();
	}

	// Close desktop mega menus
	const ecoPanel = document.getElementById("mega-menu-ecosystem");
	const brandsPanel = document.getElementById("mega-menu-brands");
	const ecoChevron = document.getElementById("chevron-ecosystem");
	const brandsChevron = document.getElementById("chevron-brands");

	ecoPanel?.classList.add("opacity-0", "scale-[0.96]", "-translate-y-2", "pointer-events-none");
	ecoPanel?.classList.remove("opacity-100", "scale-100", "translate-y-0", "pointer-events-auto");
	brandsPanel?.classList.add("opacity-0", "scale-[0.96]", "-translate-y-2", "pointer-events-none");
	brandsPanel?.classList.remove("opacity-100", "scale-100", "translate-y-0", "pointer-events-auto");
	ecoChevron?.classList.remove("rotate-180");
	brandsChevron?.classList.remove("rotate-180");
}

/**
 * Force reset and hide the SVG transition canvas
 */
function forceResetTransition(): void {
	const svg = document.getElementById("page-transition-svg");
	const path = document.getElementById("page-transition-path");
	const watermark = document.getElementById("page-transition-watermark");

	if (svg && path) {
		gsap.killTweensOf([path, watermark]);
		svg.style.display = "none";
		gsap.set(path, { attr: { d: PATHS.leaveStart } });
	}
	if (watermark) {
		gsap.set(watermark, { opacity: 0 });
	}

	isTransitioning = false;
	if (watchdogTimeout) {
		clearTimeout(watchdogTimeout);
		watchdogTimeout = null;
	}
}

/**
 * Play page leave animation (liquid SVG wave rises from bottom to cover the screen)
 */
export function playPageLeave(): Promise<void> {
	return new Promise((resolve) => {
		const svg = document.getElementById("page-transition-svg");
		const path = document.getElementById("page-transition-path");
		const watermark = document.getElementById("page-transition-watermark");

		if (!svg || !path) {
			resolve();
			return;
		}

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			resolve();
			return;
		}

		isTransitioning = true;
		svg.style.display = "block";

		// Safety watchdog: auto-reset if navigation stalls
		if (watchdogTimeout) clearTimeout(watchdogTimeout);
		watchdogTimeout = window.setTimeout(() => {
			forceResetTransition();
			startLenis();
		}, 2500);

		const tl = gsap.timeline({
			onComplete: () => {
				resolve();
			},
		});

		tl.set(path, { attr: { d: PATHS.leaveStart } })
			.to(path, {
				attr: { d: PATHS.leaveCurve },
				duration: 0.25,
				ease: "power2.in",
			})
			.to(path, {
				attr: { d: PATHS.leaveFull },
				duration: 0.22,
				ease: "power2.out",
			})
			.to(
				watermark,
				{
					opacity: 1,
					duration: 0.15,
					ease: "power1.out",
				},
				"-=0.15"
			);
	});
}

/**
 * Play page enter animation (liquid SVG wave pulls up and exits off the top)
 */
export function playPageEnter(): Promise<void> {
	return new Promise((resolve) => {
		const svg = document.getElementById("page-transition-svg");
		const path = document.getElementById("page-transition-path");
		const watermark = document.getElementById("page-transition-watermark");

		if (!svg || !path) {
			resolve();
			return;
		}

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			forceResetTransition();
			resolve();
			return;
		}

		svg.style.display = "block";

		const tl = gsap.timeline({
			onComplete: () => {
				forceResetTransition();
				resolve();
			},
		});

		tl.set(path, { attr: { d: PATHS.enterFull } })
			.to(watermark, {
				opacity: 0,
				duration: 0.15,
				ease: "power1.in",
			})
			.to(
				path,
				{
					attr: { d: PATHS.enterCurve },
					duration: 0.28,
					ease: "power2.in",
				},
				"-=0.05"
			)
			.to(path, {
				attr: { d: PATHS.enterEnd },
				duration: 0.24,
				ease: "power3.out",
			});
	});
}

/**
 * Initialize Astro View Transitions lifecycle listeners
 */
export function initPageTransitions(): void {
	if (isInitialized) return;
	isInitialized = true;

	// Ensure SVG starts completely hidden on initial load
	forceResetTransition();

	// 1. Navigation Start: Prepare and play leave animation
	document.addEventListener("astro:before-preparation", (event: any) => {
		const originalLoader = event.loader;
		event.loader = async () => {
			closeActiveMenus();
			stopLenis();
			await playPageLeave();
			await originalLoader();
		};
	});

	// 2. Before Swap: Strip preloader from incoming DOM and ensure SVG overlay remains fully covered
	document.addEventListener("astro:before-swap", (event: any) => {
		if (sessionStorage.getItem("geladi_visited")) {
			event.newDocument?.documentElement?.classList?.add("preloader-skipped");
			const incomingPreloader = event.newDocument?.getElementById("geladi-preloader");
			if (incomingPreloader) {
				incomingPreloader.remove();
			}
		}

		const svg = document.getElementById("page-transition-svg");
		const path = document.getElementById("page-transition-path");
		if (isTransitioning && svg && path && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			svg.style.display = "block";
			gsap.set(path, { attr: { d: PATHS.leaveFull } });
		}
	});

	// 3. Page Load: Play enter animation ONLY if an actual transition was in progress
	document.addEventListener("astro:page-load", async () => {
		if (isTransitioning) {
			await playPageEnter();
		} else {
			// Initial page load or refresh: ensure transition is hidden
			forceResetTransition();
		}

		startLenis();
		ScrollTrigger.refresh();

		// Handle hash scroll after page transition
		if (window.location.hash) {
			setTimeout(() => {
				scrollToTarget(window.location.hash, { offset: -80, duration: 1.2 });
			}, 150);
		}
	});
}
