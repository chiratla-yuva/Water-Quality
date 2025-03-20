import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/auth/logout", { method: "POST", credentials: "include" });
            const data = await response.json();
            if (data.success) {
                localStorage.clear();
                navigate("/");
            } else {
                console.error("Logout failed: ", data.message);
            }
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    const navItems = [
        { name: "Profile", path: "/operator/profile" },
        { name: "Reset Password", path: "/operator/reset" },
        { name: "Realtime Data", path: "/operator/realtime" },
        { name: "Historical Data", path: "/operator/historical" },
        { name: "Threshold", path: "/operator/threshold" },
    ];

    return (
        <nav className="bg-blue-600 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/operator/profile" className="text-white text-xl font-bold">
                    Dashboard
                </Link>

                {/* Mobile Menu Button */}
                <button onClick={toggleMenu} className="md:hidden text-white">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Navbar Links */}
                <div className={`md:flex md:items-center ${isOpen ? "block" : "hidden"} w-full md:w-auto`}>
                    <ul className="md:flex space-y-4 md:space-y-0 md:space-x-6 text-white text-lg">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`block px-3 py-2 rounded-md transition duration-300 ${location.pathname === item.path ? "bg-blue-800" : "hover:bg-blue-700"}`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={handleLogout}
                                className="block px-3 py-2 rounded-md transition duration-300 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Log out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
