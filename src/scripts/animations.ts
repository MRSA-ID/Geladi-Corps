import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Clean up all active GSAP ScrollTriggers or page-specific triggers
 */
export function cleanupPageAnimations(): void {
	ScrollTrigger.getAll().forEach((trigger) => {
		// Only kill page triggers, keep persistent triggers if any
		trigger.kill();
	});
}

/**
 * Refresh ScrollTrigger calculations after DOM swap
 */
export function refreshScrollTrigger(): void {
	ScrollTrigger.refresh();
}
