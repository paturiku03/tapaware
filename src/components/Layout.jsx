import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 lg:ml-64">
                <main className="p-8 pt-24 lg:pt-8">
                    {children}
                </main>
            </div>

        </div>
    );
};

export default Layout;