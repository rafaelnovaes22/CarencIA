import { Header } from "@/components/Header";
import { CampoBuscaGlobal } from "@/components/CampoBuscaGlobal";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { LeadForm } from "@/components/LeadForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <CampoBuscaGlobal />
      <main className="flex-1">
        <Hero />
        <Features />
        <LeadForm />
      </main>
      <Footer />
    </div>
  );
}
