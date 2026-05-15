import { Triangle } from "lucide-react";
import "./globals.css";

export const metadata = {
  title: "GlobalTNA | Service Request Board",
  description: "Post and browse home service requests across Scotland",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />

        <header className="site-header">
          <a href="/" className="logo">
            <Triangle size={20} fill="currentColor" />
            <span className="logo-name">GlobalTNA</span>
            <span className="logo-tag">Service Board</span>
          </a>
          <nav className="site-nav">
            <a href="/" className="nav-link">Jobs</a>
            <a href="/new-job" className="nav-cta">Post a job</a>
          </nav>
        </header>

        <main className="main">{children}</main>

        <footer className="site-footer">
          <span>© {new Date().getFullYear()} GlobalTNA</span>
          <span className="footer-sep">·</span>
          <span>Mini Service Request Board</span>
        </footer>
      </body>
    </html>
  );
}
