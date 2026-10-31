import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Kavya Labs — AI that takes the busywork off your team",
  description: "Kavya Labs builds AI assistants that take repetitive work off your team.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=IBM+Plex+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <noscript>
          <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
