import { doc, getDoc, getFirestore, setDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import withAuth, { AuthProps } from "../components/withAuth";
import { Group } from "../utilities/types";

const db = getFirestore();

function Unsubscribe({ user }: AuthProps) {
  const [searchParams] = useSearchParams();
  const group = searchParams.get("group");
  const [displayString, setDisplayString] = useState("Loading...");
  useEffect(() => {
    const effectCall = async () => {
      if (!group) {
        setDisplayString(
          "No group id set, try clicking the link in your email again"
        );
        return;
      }
      const groupRef = doc(db, "groups", group);
      const groupDoc = await getDoc(groupRef);
      if (groupDoc.exists()) {
        const data = groupDoc.data() as Group;
        for (const member of data.members) {
          if (member.id === user.email) {
            member.unsubscribed = true;
            setDisplayString("Successfully unsubscribed");
            break;
          }
        }
        setDoc(groupRef, data);
      } else {
        setDisplayString("No group to unsubscribe from!");
      }
    };
    effectCall();
  }, []);
  return (
    <>
      <p className="text-center text-2xl m-3">{displayString}</p>
      <p className="text-center">
        To return home click here:{" "}
        <Link to="/" className="underline">
          Homepage
        </Link>
      </p>
    </>
  );
}

export default withAuth(Unsubscribe);
