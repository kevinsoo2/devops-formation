import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevOps Formation - Ansible, Kubernetes, Docker, Red Hat",
  description: "Apprenez les bases du DevOps : Ansible, Kubernetes, Docker et Red Hat Enterprise Linux. Du débutant au niveau avancé.",
  openGraph: {
    title: "DevOps Formation - Maîtrisez le DevOps",
    description: "Cours structurés gratuits pour apprendre Ansible, Kubernetes, Docker et Red Hat.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevOps Formation",
    description: "Apprenez le DevOps gratuitement avec des cours structurés.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
