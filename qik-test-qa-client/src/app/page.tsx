import type { Metadata } from "next";
import { HomePage } from "./home-page";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "QIK | AI Chat",
    description: "Your AI Assistant",
  };
}

export default async function LandingPage() {
  return <HomePage />;
}