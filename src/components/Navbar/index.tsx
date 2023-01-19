import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="border-b shadow">
      <div className="container mx-auto py-4 px-8">
        <div className="flex items-center justify-between">
          <h1 className="uppercase text-xl">Chess</h1>
          <div className="flex items-center gap-4">
            <p className="text-lg uppercase">2700 Chess</p>
            <p className="text-lg uppercase">
              <Link href="/chess.com">chess.com</Link>
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
