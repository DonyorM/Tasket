import { getAuth, User } from "firebase/auth";
import { collection, getFirestore, query, where } from "firebase/firestore";
import React, { Fragment } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import {Button, LinkButton} from "../components/Button";
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
      where("members", "array-contains", user.email)
    )
  );

  if (tasksLoading || !groupDocs) {
    return <Loading />;
  }

  const groupData = groupDocs.docs.map((doc) => doc.data());

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-gray-300 text-center text-3xl">Groups</h2>
      <ul className="flex flex-col divide-y divide-gray-200/10 text-gray-300 ring-1 ring-gray-200/10 rounded-md m-2 w-11/12">
        {groupData.map((data, index) => (
          <li className="block p-2 hover:bg-blue-500">
            <Link
              key={index}
              to={`/group/${data.name}`}
              className="block"
            >
              {data.name}
            </Link>
          </li>
        ))}
      </ul>
      <LinkButton to="/create-group">Create Group</LinkButton>
    </div>
  );
}

export default withAuth(Home);
