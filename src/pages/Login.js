import styled from "styled-components";
import { useState, useEffect } from "react";
import firebase from "../firebase";
import { LoginForm, StyledLogin, LoginContainer } from "../LoginStyles";
import { Link, useHistory } from "react-router-dom";
const useUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .onSnapshot((snapshot) => {
        const newUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(newUsers);
      });

    return () => unsubscribe();
  }, []);
  return users;
};

const searchArray = (nameKey, term, myArray) => {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i][term] === nameKey) {
      return myArray[i];
    }
  }
};

const Login = ({ loggedUser, setLoggedUser }) => {
  let changedRM = false;
  const [userInput, setUserInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [inputRememberMe, setInputRememberMe] = useState(false);
  const history = useHistory();
  const users = useUsers();

  const onSubmit = (e) => {
    e.preventDefault();

    if (searchArray(userInput, "username", users) != undefined) {
      let user = searchArray(userInput, "username", users);
      if (user.password == passInput) {
        console.log("Correct password");
        logRememberMe(user.id);
      } else {
        console.log("Incorrect password");
      }
    }
  };
  const setLatestUser = (user) => {
    firebase.firestore().collection("meta").doc("latestUser").set({ user });
  };

  const logRememberMe = (id) => {
    firebase
      .firestore()
      .collection("users")
      .doc(id)
      .update({
        rememberMe: changedRM,
      })
      .then(() => {
        finalLogin(id);
      })
      .catch((err) => console.error(err));
  };

  const finalLogin = (id) => {
    firebase
      .firestore()
      .collection("users")
      .doc(id)
      .get()
      .then((doc) => {
        setLatestUser(doc.data());
        setLoggedUser(doc.data());
        history.push("/");
      });
  };

  const rememberMeHandle = (info) => {
    if (info) {
      changedRM = true;
    } else {
      changedRM = false;
    }
  };

  return (
    <StyledLogin>
      <LoginContainer>
        <div></div>
        <LoginForm onSubmit={onSubmit}>
          <h1>Login</h1>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={userInput}
              onChange={(e) => setUserInput(e.currentTarget.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={passInput}
              onChange={(e) => setPassInput(e.currentTarget.value)}
            />
          </div>
          <div>
            <label htmlFor="rememberMe">Remember me?</label>
            <input
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              onChange={(e) => rememberMeHandle(e.currentTarget.checked)}
            />
          </div>
          <button>Submit</button>
        </LoginForm>
        <Link to="/createaccount">
          <h3>No account? Create one</h3>
        </Link>
      </LoginContainer>
    </StyledLogin>
  );
};

export default Login;
