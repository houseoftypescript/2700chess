import Container from '@mui/material/Container';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t">
      <Container>
        <div className="py-4">
          <p className="text-sm">&copy; {year} - 2700 Chess</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
