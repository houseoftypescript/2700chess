import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import RankingTable from '@/components/RankingTable';
import players from '@/data/players.json';
import Container from '@mui/material/Container';

const PlayerTemplate: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow">
        <Container>
          <div className="py-8">
            <RankingTable players={players} />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default PlayerTemplate;
