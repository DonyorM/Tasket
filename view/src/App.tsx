import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Loading from "./components/Loading";
import { UserContext } from "./utilities/contexts";
import { DarkBorderButton, LinkButton } from "./components/Button";

const auth = getAuth();

function App() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    navigate("/login");
    return <p></p>;
  }

  return (
    <div className="bg-gray-800 text-gray-300 min-h-screen">
      <header className="mb-2">
        <nav className="py-4 px-6 text-sm font-medium bg-sky-800 rounded-b-md flex place-content-between">
          <div className="inline-block">
            <ul className="flex space-x-3">
              <li>
                <LinkButton to="/" variant="dark">
                  Home
                </LinkButton>
              </li>
            </ul>
          </div>
          <h1 className="text-4xl inline-block">Tasket</h1>
          <div className="inline-block">
            <ul>
              <li>
                <DarkBorderButton
                  onClick={() => {
                    signOut(auth);
                  }}
                >
                  Sign Out
                </DarkBorderButton>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <UserContext.Provider value={user}>
        <Outlet />
      </UserContext.Provider>
    </div>
  );
}

export default App;
