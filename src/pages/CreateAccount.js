import { useState, useEffect } from "react";
// Styles
import { LoginForm, StyledLogin, LoginContainer } from "../LoginStyles";
// Link
import { Link, useHistory } from "react-router-dom";
// uuid
import { v4 as uuidv4 } from "uuid";
// firebase
import firebase from "../firebase";

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
      return true;
    }
  }
};

const CreateAccount = () => {
  const history = useHistory();
  const clearInputs = () => {
    setUInput("");
    setPInput("");
    setCPInput("");
  };
  const users = useUsers();

  // State
  const [uInput, setUInput] = useState("");
  const [pInput, setPInput] = useState("");
  const [cpInput, setCPInput] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // CHECKS
    if (searchArray(uInput, "username", users)) {
      clearInputs();
      return console.log("error!!! user already be there lol");
    }
    if (pInput !== cpInput) {
      return console.error("Error!!!!!! enter the same password idiot");
    }
    if (pInput === null || pInput === undefined || pInput === "") {
      return console.error("pls enter pwd");
    }
    if (uInput === null || uInput === undefined || uInput === "") {
      return console.error("pls enter username");
    }
    // ADD TO FIREBASE
    let userId = uuidv4();
    firebase.firestore().collection("users").doc(userId).set({
      username: uInput,
      password: pInput,
      id: userId,
      rememberMe: false,
    });

    clearInputs();
    history.push("/login");
  };
  return (
    <StyledLogin>
      <LoginContainer>
        <div></div>
        <LoginForm onSubmit={onSubmit}>
          <h1>Create Account</h1>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={uInput}
              onChange={(e) => setUInput(e.currentTarget.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={pInput}
              onChange={(e) => setPInput(e.currentTarget.value)}
            />
          </div>
          <div>
            <label htmlFor="passwordAgain">Confirm password</label>
            <input
              type="password"
              name="passwordAgain"
              value={cpInput}
              onChange={(e) => setCPInput(e.currentTarget.value)}
            />
          </div>
          <button>Submit</button>
        </LoginForm>
        <Link to="/login">
          <h3>Login</h3>
        </Link>
      </LoginContainer>
    </StyledLogin>
  );
};

export default CreateAccount;
