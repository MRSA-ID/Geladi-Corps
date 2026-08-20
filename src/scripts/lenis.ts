import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

declare global {
	interface Window {
		lenis?: Lenis;
	}
}

/**
 * Initialize or retrieve the global Lenis smooth scroll instance
 */
export function initLenis(): Lenis {
	if (lenisInstance) {
		return lenisInstance;
	}

	lenisInstance = new Lenis({
		duration: 1.2,
		easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple fluid exponential decay
		smoothWheel: true,
		touchMultiplier: 1.5,
		autoRaf: false,
	});

	window.lenis = lenisInstance;

	// Synchronize Lenis scroll with GSAP ScrollTrigger
	lenisInstance.on("scroll", () => {
		ScrollTrigger.update();
	});

	// Drive Lenis through GSAP ticker for 100% synchronized animation loops
	if (!tickerCallback) {
		tickerCallback = (time: number) => {
			lenisInstance?.raf(time * 1000);
		};
		gsap.ticker.add(tickerCallback);
	}

	// Disable lag smoothing in GSAP to prevent any latency in scroll calculations
	gsap.ticker.lagSmoothing(0);

	return lenisInstance;
}

/**
 * Get the active Lenis instance
 */
export function getLenis(): Lenis | null {
	return lenisInstance;
}

/**
 * Stop smooth scrolling (e.g. during page transitions or modal open)
 */
export function stopLenis(): void {
	if (lenisInstance) {
		lenisInstance.stop();
	}
}

/**
 * Resume smooth scrolling
 */
export function startLenis(): void {
	if (lenisInstance) {
		lenisInstance.start();
	}
}

/**
 * Destroy Lenis instance and remove GSAP ticker listener
 */
export function destroyLenis(): void {
	if (tickerCallback) {
		gsap.ticker.remove(tickerCallback);
		tickerCallback = null;
	}
	if (lenisInstance) {
		lenisInstance.destroy();
		lenisInstance = null;
		window.lenis = undefined;
	}
}

/**
 * Smoothly scroll to a target element or selector
 */
export function scrollToTarget(
	target: string | HTMLElement,
	options: { offset?: number; duration?: number; immediate?: boolean } = {}
): boolean {
	const lenis = getLenis() || initLenis();
	if (!lenis) return false;

	const { offset = -80, duration = 1.2, immediate = false } = options;

	try {
		const element = typeof target === "string" ? document.querySelector(target) : target;
		if (element) {
			lenis.scrollTo(element as HTMLElement, {
				offset,
				duration,
				immediate,
				easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			});
			return true;
		}
	} catch {
		// Invalid selector fallback
	}
	return false;
}
