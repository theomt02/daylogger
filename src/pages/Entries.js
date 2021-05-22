import styled from "styled-components";
import { useState, useEffect } from "react";
import firebase from "../firebase";
// Components
import Alert from "../components/Alert";
import { useHistory } from "react-router-dom";

const SORT_OPTIONS = {
  EXERCISE_ASC: { column: "exercise", direction: "asc" },
  EXERCISE_DESC: { column: "exercise", direction: "desc" },
  MOOD_ASC: { column: "mood", direction: "asc" },
  MOOD_DESC: { column: "mood", direction: "desc" },
  DATE_ASC: { column: "date", direction: "asc" },
  DATE_DESC: { column: "date", direction: "desc" },
};
// Text stuff
let capitalizeText = { textTransform: "capitalize" };
const tick = "\u2713";
const cross = "\u2717";

const useTimes = (sortBy = "DATE_ASC", loggedUser) => {
  const [times, setTimes] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(loggedUser.id)
      .collection("entries")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .onSnapshot((snapshot) => {
        const newTimes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTimes(newTimes);
      });

    return () => unsubscribe();
  }, [sortBy]);
  return times;
};

const Entries = ({
  setAlert,
  alertColor,
  alertMessage,
  alertOpacity,
  alertOn,
  loggedUser,
}) => {
  const [sortBy, setSortBy] = useState("DATE_ASC");
  const times = useTimes(sortBy, loggedUser);

  const timeToDate = (stamp) => {
    let date = new Date(stamp.seconds * 1000);
    let newDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    return newDate;
  };

  // Delete row
  const deleteRow = (e) => {
    let id = e.target.id;
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(loggedUser.id)
      .collection("entries")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted");
        setAlert("darkred", "Entry deleted");
      })
      .catch((err) => {
        console.error("Error deleting document: ", err);
      });
    return () => unsubscribe();
  };

  // Change link when clicking row
  const history = useHistory();
  const rowClickHandle = (row) => {
    history.push(`/entry/${row}`);
  };
  return (
    <EntriesPage>
      <h1>Entries</h1>

      <StyledTimesList>
        <div>
          <SortBy>Sort By:</SortBy>{" "}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.currentTarget.value)}
          >
            <option value="DATE_ASC">Date (Ascending)</option>
            <option value="DATE_DESC">Date (Descending)</option>
            <option disabled>---</option>
            <option value="MOOD_ASC">Mood (a-z)</option>
            <option value="MOOD_DESC">Mood (z-a)</option>
            <option disabled>---</option>
            <option value="EXERCISE_ASC">Exercise (false first)</option>
            <option value="EXERCISE_DESC">Exercise (true first)</option>
          </select>
        </div>
        <List>
          <tbody>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Mood (1-10)</th>
              <th>Exercise (Bool)</th>
              <th>Games (Bool)</th>
              <th>Work (Bool)</th>
              <th>Weather</th>
              <th>Temperature</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
              <th>Time went to bed</th>
              <th>Time woke up</th>
            </tr>
            {times.map((entry) => (
              <TableRow key={entry.id}>
                <TD>
                  {timeToDate(
                    new firebase.firestore.Timestamp(entry.date).seconds
                  )}
                </TD>
                <TD>{entry.day}</TD>
                <TD>{entry.mood}</TD>
                <TD>{entry.exercise ? tick : cross}</TD>
                <TD>{entry.games ? tick : cross}</TD>
                <TD>{entry.work ? tick : cross}</TD>
                <TD style={capitalizeText}>{entry.weather.description}</TD>
                <TD>{`${entry.weather.temp}${String.fromCharCode(176)}`}</TD>
                <TD>{entry.food.breakfast}</TD>
                <TD>{entry.food.lunch}</TD>
                <TD>{entry.food.dinner}</TD>
                <TD>{entry.sleep.wentToBed}</TD>
                <TD>{entry.sleep.wakeUp}</TD>
                <TD
                  onClick={() => rowClickHandle(entry.id)}
                  style={{ fontWeight: 600, cursor: "pointer" }}
                >
                  Details
                </TD>
                <EntryDelete id={entry.id} onClick={(e) => deleteRow(e)}>
                  {String.fromCharCode(55357, 56785)}
                </EntryDelete>
              </TableRow>
            ))}
          </tbody>
        </List>
      </StyledTimesList>
      {alertOn ? (
        <Alert
          alertMessage={alertMessage}
          alertColor={alertColor}
          alertOpacity={alertOpacity}
        ></Alert>
      ) : null}
    </EntriesPage>
  );
};
export default Entries;
// Styles
const EntriesPage = styled.div`
  text-align: center;
  padding: 2rem;
`;
const SortBy = styled.label`
  font-size: 1.2rem;
`;
const StyledTimesList = styled.div`
  margin-top: 2rem;
  background-color: #4d4d4d;
  padding: 1rem;
  border-radius: 10px;
  text-align: initial;
`;
const Code = styled.code`
  font-family: "Courier New", monospace;
  color: darkblue;
  font-weight: bolder;
`;
const List = styled.table`
  width: 100%;
  border: 1px solid #272727;
  border-collapse: collapse;
  th,
  td {
    padding: 0.3rem;
    border: 2px solid #414141;
    border-collapse: collapse;
  }
  th {
    text-align: left;
    background-color: #616161;
  }
`;
const TD = styled.td``;
const EntryDelete = styled.td`
  font-size: 2rem;
  color: coral;
  cursor: pointer;
  &:hover {
    color: red;
  }
`;
const TableRow = styled.tr``;
