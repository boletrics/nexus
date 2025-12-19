import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const sourceSerif4 = Source_Serif_4({
	variable: "--font-source-serif-4",
	subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Venue Map Editor | Ticketing Platform",
	description:
		"Professional venue map editor for creating and managing seating layouts",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${sourceSerif4.variable} ${jetBrainsMono.variable} font-sans antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
