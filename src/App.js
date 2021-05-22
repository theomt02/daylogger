import { useState, useEffect } from "react";
import firebase from "./firebase";
// Style
import GlobalStyle from "./globalStyles";
// Components/Pages
import Home from "./pages/Home";
import Entries from "./pages/Entries";
import EntryDetails from "./pages/EntryDetails";

import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";

import Nav from "./components/Nav";
// Router
import { Switch, Route } from "react-router-dom";

function App() {
  // Authentication
  const [loggedUser, setLoggedUser] = useState({});
  const [latestUser, setLatestUser] = useState({});
  // Alert
  const [alertColor, setAlertColor] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOn, setAlertOn] = useState(false);
  const [alertOpacity, setAlertOpacity] = useState(1);

  const setAlert = (c, message) => {
    setAlertOpacity(1);
    setAlertColor(c);
    setAlertMessage(message);
    setAlertOn(true);

    setTimeout(() => {
      setAlertOpacity(0);
      setTimeout(() => {
        setAlertColor("");
        setAlertMessage("");
        setAlertOn(false);
      }, 1000);
    }, 2500);
  };
  useEffect(() => {
    firebase
      .firestore()
      .collection("meta")
      .doc("latestUser")
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().user.rememberMe === true) {
            setLoggedUser(doc.data().user);
          }
          // console.log(doc.data());
        }
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="App">
      <GlobalStyle />
      <Nav loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
      <Switch>
        {loggedUser.id && (
          <Route path="/" exact>
            <Home
              setAlert={setAlert}
              alertColor={alertColor}
              setAlertColor={setAlertColor}
              alertMessage={alertMessage}
              setAlertMessage={setAlertMessage}
              alertOpacity={alertOpacity}
              setAlertOpacity={setAlertOpacity}
              alertOn={alertOn}
              setAlertOn={setAlertOn}
              loggedUser={loggedUser}
            />
          </Route>
        )}
        {loggedUser.id && (
          <Route path="/entries" exact>
            <Entries
              setAlert={setAlert}
              alertColor={alertColor}
              setAlertColor={setAlertColor}
              alertMessage={alertMessage}
              setAlertMessage={setAlertMessage}
              alertOpacity={alertOpacity}
              setAlertOpacity={setAlertOpacity}
              alertOn={alertOn}
              setAlertOn={setAlertOn}
              loggedUser={loggedUser}
            />
          </Route>
        )}
        {loggedUser.id && (
          <Route path="/entry/:id">
            <EntryDetails loggedUser={loggedUser} />
          </Route>
        )}
        <Route path="/login">
          <Login loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
        </Route>
        <Route path="/createaccount">
          <CreateAccount />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
