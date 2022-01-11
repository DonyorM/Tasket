import { User } from "firebase/auth";
import { collection, getFirestore, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import { LinkButton } from "../components/Button";
import Loading from "../components/Loading";
import withAuth from "../components/withAuth";

const db = getFirestore();
interface userProps {
  user: User;
}
function Home({ user }: userProps) {
  const [groupDocs, tasksLoading, tasksError] = useCollection(
    query(
      collection(db, "groups"),
      where("memberEmails", "array-contains", user.email)
    )
  );

  if (tasksLoading || !groupDocs) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-gray-300 text-center text-3xl">Groups</h2>
      <ul className="flex flex-col divide-y divide-gray-200/10 text-gray-300 ring-1 ring-gray-200/10 rounded-md m-2 w-11/12">
        {groupDocs.docs.map((doc, index) => (
          <li
            key={index}
            className={`block p-2 hover:bg-gray-400/25 active:bg-gray-200/25 ${
              index === 0 ? "rounded-t-md" : ""
            } ${index === groupDocs.docs.length - 1 ? "rounded-b-md" : ""}`}
          >
            <Link to={`/group/${doc.id}`} className="block">
              {doc.data().name}
            </Link>
          </li>
        ))}
      </ul>
      <LinkButton to="/create-group">Create Group</LinkButton>
    </div>
  );
}

export default withAuth(Home);
