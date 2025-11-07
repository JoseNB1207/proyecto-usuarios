import UserCRUD from './UserCRUD';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Verificar si hay usuario en localStorage al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Manejar login exitoso
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  // Manejar logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <UserCRUD user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;