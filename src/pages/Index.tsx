
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { NFTGallery } from "@/components/NFTGallery";
import { GameEmbed } from "@/components/GameEmbed";
import { KlimaSection } from "@/components/KlimaSection";
import { Footer } from "@/components/Footer";
import { GoneGreenUpdater } from "@/components/GoneGreenUpdater";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div className="container mx-auto px-4 py-8">
          <GoneGreenUpdater />
        </div>
        <KlimaSection />
        <NFTGallery />
        <GameEmbed />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
