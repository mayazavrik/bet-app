"use client";

import { useEffect } from "react";

export const PreloadHandler = () => {
	useEffect(() => {
		document.documentElement.classList.add("loading");

		const handleLoad = () => {
			document.documentElement.classList.remove("loading");
		};

		if (document.readyState === "complete") {
			handleLoad();
		} else {
			window.addEventListener("load", handleLoad);

			const timeout = setTimeout(handleLoad, 2000);

			return () => {
				window.removeEventListener("load", handleLoad);
				clearTimeout(timeout);
			};
		}
	}, []);

	return null;
};
