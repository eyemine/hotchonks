import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GameEmbed } from "@/components/GameEmbed";

const Playground = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <GameEmbed />
      </main>
      <Footer />
    </div>
  );
};

export default Playground;
