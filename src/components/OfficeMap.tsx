import React from "react";
import { Map, MapMarker, MarkerContent } from "@components/ui/map";
import { ArrowUpRight, MapPin } from "lucide-react";

const OFFICE_COORDINATES: [number, number] = [106.8318, -6.1884];
const GOOGLE_MAPS_URL =
	"https://www.google.com/maps/search/?api=1&query=Jl.+KH.+Wahid+Hasyim+No.+77,+Menteng,+Jakarta+Pusat+10350,+Indonesia";

export default function OfficeMap() {
	return (
		<div className="relative w-full overflow-hidden rounded-2xl border border-black/10 bg-primary_bone_white shadow-xs transition-all duration-500 hover:shadow-xl group">
			{/* Map Canvas Container (240px tall for a compact editorial preview) */}
			<div className="relative w-full h-[220px] sm:h-[260px] overflow-hidden">
				<div className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105">
					<Map
						center={OFFICE_COORDINATES}
						zoom={15.5}
						interactive={false}
						scrollZoom={false}
						dragPan={false}
						dragRotate={false}
						doubleClickZoom={false}
						touchZoomRotate={false}
						className="w-full h-full select-none">
						<MapMarker
							longitude={OFFICE_COORDINATES[0]}
							latitude={OFFICE_COORDINATES[1]}>
							<MarkerContent>
								<div className="relative flex items-center justify-center -translate-y-1/2">
									{/* Radar Halo Pulse */}
									<span className="absolute size-9 rounded-full bg-secondary_olive/30 animate-ping pointer-events-none" />
									<span className="absolute size-6 rounded-full bg-secondary_olive/20 pointer-events-none" />

									{/* Branded Marker Core */}
									<div className="relative size-8 rounded-full bg-primary_onyx text-primary_bone_white border-2 border-white shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-secondary_olive">
										<MapPin className="size-4 stroke-[2.5]" />
									</div>
								</div>
							</MarkerContent>
						</MapMarker>
					</Map>
				</div>

				{/* Location Label Badge top-left */}
				<div className="absolute top-3 left-3 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
					<div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/5 shadow-xs text-xs font-medium text-neutral-800 tracking-tight">
						<span className="size-1.5 rounded-full bg-secondary_olive"></span>
						<span>Galedi Corps</span>
					</div>
				</div>

				{/* Backdrop Blur & Dimming Overlay with Centered Action Button */}
				<a
					href={GOOGLE_MAPS_URL}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Open Galedi Corps location in Google Maps"
					className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/0 backdrop-blur-none group-hover:bg-black/35 group-hover:backdrop-blur-xs transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer">
					{/* Centered Action Button on Hover */}
					<div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary_onyx/95 text-primary_bone_white text-xs sm:text-sm font-medium shadow-2xl backdrop-blur-md border border-white/20 opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:shadow-2xl hover:bg-secondary_olive active:scale-95">
						<MapPin className="size-3.5 stroke-[2]" />
						<span>Open in Google Maps</span>
						<ArrowUpRight className="size-4 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</div>
				</a>
			</div>
		</div>
	);
}
