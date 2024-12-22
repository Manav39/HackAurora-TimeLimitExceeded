import { React, useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ScrollText, Users, FileText, Shield, Wallet, History, Settings, Bell } from 'lucide-react';
import { TransactionContext } from "../context/context";
import Button from './ui/Button';
import Avatar from './ui/Avatar';

// Define the full set of routes
const routes = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Wills', icon: ScrollText, path: '/wills' },
  { label: 'Beneficiaries', icon: Users, path: '/beneficiaries' },
  { label: 'Documents', icon: FileText, path: '/documents' },
  { label: 'Assets', icon: Wallet, path: '/assets' },
  { label: 'Transactions', icon: History, path: '/transactions' },
  { label: 'My Stake', icon: Wallet, path: '/mystake' },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { getBeneficiaryWills } = useContext(TransactionContext);
  const [data, setData] = useState([]);
  
  // Handle conditional sidebar rendering for registrarDashboard
  const isRegistrarDashboard = location.pathname === '/verify';
  
  // Fetching data
  useEffect(() => {
    const fetchData = async () => {
      const account = localStorage.getItem("account");
      const res = await getBeneficiaryWills(account);
      if (res && Array.isArray(res)) {
        setData(res);
        // Check if any of the data contains will-Id 189
        const isRegistrarRequired = res.some(item => item['will-Id'] === 189);
        if (isRegistrarRequired) {
          navigate('/verify'); // Redirect to registrarDashboard if will-Id is 189
        }
      } else {
        console.error("Data fetch failed or response is not an array");
      }
    };
    fetchData();
  }, [getBeneficiaryWills, navigate]);

  // Define the routes to be shown based on current route
  const filteredRoutes = isRegistrarDashboard ? [{ label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }] : routes;

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">WillChain</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredRoutes.map((route) => {
            const Icon = route.icon;
            const isActive = location.pathname === route.path;

            return (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                  <span>{route.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <img src="/placeholder-user.jpg" alt="User" />
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">john@example.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
