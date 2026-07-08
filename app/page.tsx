import Hero from "@/components/Hero";
import WhatYouGet from "@/components/WhatYouGet";
import Screenshots from "@/components/Screenshots";
import ProblemAgitate from "@/components/ProblemAgitate";
import PriceBlock from "@/components/PriceBlock";
import Faq from "@/components/Faq";
import BuySection from "@/components/BuySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhatYouGet />
      <Screenshots />
      <ProblemAgitate />
      <PriceBlock />
      <Faq />
      <BuySection />
      <Footer />
    </main>
  );
}
