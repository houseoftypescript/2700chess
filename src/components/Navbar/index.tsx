import Container from '@mui/material/Container';

export const Navbar: React.FC = () => {
  return (
    <nav className="border-b">
      <Container>
        <div className="py-4">
          <h1 className="uppercase text-xl">2700 Chess</h1>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
