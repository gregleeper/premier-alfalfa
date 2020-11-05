import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Auth } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import Layout from "../components/layout";

const SignIn = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  console.log(Auth.currentAuthenticatedUser());
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUser(user);
      })
      .catch((err) => setUser(null));
  }, []);

  return (
    <Layout>
      <div className="w-1/4 mx-auto py-4">
        {user && <p className="py-12">Welcome, {user.username}</p>}
        <AmplifySignOut />
      </div>
    </Layout>
  );
};

export default withAuthenticator(SignIn);
