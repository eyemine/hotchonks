
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TokenBoundSection } from "@/components/TokenBoundSection";
import { NFTGallery } from "@/components/NFTGallery";
import { KlimaSection } from "@/components/KlimaSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TokenBoundSection />
        <KlimaSection />
        <NFTGallery />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
