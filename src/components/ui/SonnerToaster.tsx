import React from "react";
import { Toaster as Sonner } from "sonner";

export default function SonnerToaster() {
	return (
		<Sonner
			position="bottom-right"
			richColors
			closeButton
			theme="light"
			toastOptions={{
				classNames: {
					toast:
						"!bg-primary_bone_white !text-primary_onyx !border !border-black/10 !shadow-2xl !rounded-2xl !font-testsohne !py-3.5 !px-4",
					title: "!font-medium !text-sm !text-primary_onyx",
					description: "!text-xs !text-neutral-600 !font-light !leading-relaxed !mt-0.5",
					actionButton: "!bg-primary_onyx !text-white !rounded-full !px-3 !py-1.5 !text-xs",
					cancelButton: "!bg-neutral-200 !text-neutral-700 !rounded-full !px-3 !py-1.5 !text-xs",
					closeButton: "!bg-white !border !border-black/10 !text-neutral-600 hover:!text-black",
				},
			}}
		/>
	);
}
