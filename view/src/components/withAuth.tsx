import { getAuth, User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "./Loading";

export interface AuthProps {
  user: User;
}

const auth = getAuth();
export default function withAuth(WrappedComponent: any) {
  return function WithAuth({ ...props }) {
    const [user, loading, error] = useAuthState(auth);
    if (loading) {
      return <Loading />;
    }
    return <WrappedComponent user={user} {...props} />;
  };
}
