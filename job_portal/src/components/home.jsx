import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./navbar/navbar";
import Fonts from "./Homepage/Homepage";

const Home = () => {
  const [auth, setauth] = useState(false);
  const [user_name, setname] = useState("");
  const [message, setmessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8081", { withCredentials: true })
      .then((res) => {
        console.log("Response from backend:", res.data); // Debug the response
        if (res.data.status === "success") {
          setauth(true);
          setname(res.data.name);
        } else {
          setauth(false);
          setmessage(res.data.message || "Authentication failed.");
        }
      });
  }, []);

  const handlelogout = () => {
    axios
      .get("http://localhost:8081/logout", { withCredentials: true })
      .then((res) => {
        if (res.data.status === "success") {
          location.reload(); // Reload page after logout
        } else {
          alert("Logout failed. Try again.");
        }
      })
      .catch((err) => console.error("Error during logout:", err));
  };
  return (
    <>
      <div>
        {/* {auth ? (
          <div>
            <h1>welcome {user_name}</h1>
            <button onClick={handlelogout}>Logout</button>
          </div>
        ) : (
          <div>
            <h3>{message}</h3>
            <h3>Login now</h3>
          </div>
        )} */}

        <Fonts />
      </div>
    </>
  );
};
export default Home;
