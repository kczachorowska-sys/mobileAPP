import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "../components/BottomNav";

export const metadata: Metadata = {
  title: "EquiFind - Find the right people for your horse",
  description:
    "Discover trusted farriers, vets, physios, instructors and more in your area. The UK's premium equestrian services directory.",
  applicationName: "EquiFind",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EquiFind",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FAF8F5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="app-container">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
