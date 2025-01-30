import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold">Polling System</Link>
                    <div className="space-x-4">
                        <Link to="/create-poll" className="hover:text-blue-500">Create Poll</Link>
                        <Link to="/" className="hover:text-blue-500">Leaderboard</Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;