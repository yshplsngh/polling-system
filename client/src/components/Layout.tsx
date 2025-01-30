import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;