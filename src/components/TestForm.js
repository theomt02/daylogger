/* eslint-disable */
import styled from "styled-components";
// React
import { useState, useEffect } from "react";
// firebase
import firebase from "../firebase";
import axios from "axios";
// Components
import Alert from "./Alert";

// Food default
const foodDefault = { breakfast: "", lunch: "", dinner: "" };

const TestForm = ({
  setAlert,
  alertColor,
  alertMessage,
  alertOpacity,
  alertOn,
  loggedUser,
}) => {
  // STATE
  const [mood, setMood] = useState("5");
  const [exercise, setExercise] = useState(false);
  const [games, setGames] = useState(false);
  const [work, setWork] = useState(false);
  const [date, setDate] = useState("");
  const [food, setFood] = useState(foodDefault);
  const [sleep, setSleep] = useState({ wakeUp: "", wentToBed: "" });
  const [day, setDay] = useState("");

  // Weather
  const [weatherData, setWeather] = useState({});

  // Weather API
  const WEATHER_KEY = "3d1fd2f7daa542dcb0a33148211805";
  useEffect(() => {
    if (!date) return;
    axios
      .get(
        `http://api.weatherapi.com/v1/history.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=Masterton&dt=${date}`
      )
      .then((data) => {
        data = data.data;
        setWeather(data);
      })
      .catch((err) => console.error(err));
  }, [date]);

  // HANDLERS
  const exerciseHandle = (info) => {
    if (info) {
      setExercise(true);
    } else {
      setExercise(false);
    }
  };

  const gamesHandle = (info) => {
    if (info) {
      setGames(true);
    } else {
      setGames(false);
    }
  };
  const workHandle = (info) => {
    if (info) {
      setWork(true);
    } else {
      setWork(false);
    }
  };
  const dateDayHandle = (e) => {
    setDate(e);
    getDay(e);
  };
  const getDay = (date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const d = new Date(date).getDay();
    const fullD = days[d];
    setDay(fullD);
  };

  // SUBMIT TO DATABASE
  const onSubmit = (e) => {
    e.preventDefault();

    firebase
      .firestore()
      .collection("users")
      .doc(loggedUser.id)
      .collection("entries")
      .add({
        mood,
        exercise,
        date: new Date(date),
        day: day,
        games,
        weather: {
          description: weatherData.forecast.forecastday[0].day.condition.text,
          temp: weatherData.forecast.forecastday[0].day.avgtemp_c,
          icon: weatherData.forecast.forecastday[0].day.condition.icon,
          humidity: weatherData.forecast.forecastday[0].day.avghumidity,
          moonPhase: weatherData.forecast.forecastday[0].astro.moon_phase,
          precip: weatherData.forecast.forecastday[0].day.totalprecip_mm,
        },
        food: {
          breakfast: food.breakfast ? food.breakfast : "Nothing",
          lunch: food.lunch ? food.lunch : "Nothing",
          dinner: food.dinner ? food.dinner : "Nothing",
        },
        sleep: {
          wakeUp: sleep.wakeUp,
          wentToBed: sleep.wentToBed,
        },
        work,
      })
      .then(() => {
        setMood("");
        setExercise(false);
        setGames(false);
        setWork(false);
        setFood(foodDefault);
        setSleep({ wakeUp: "", wentToBed: "" });
        setAlert("green", "Entry added");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  return (
    <StyledTestForm>
      <Form onSubmit={onSubmit}>
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => dateDayHandle(e.currentTarget.value)}
            required
          />
        </div>
        <div>
          <label>Mood</label>
          <input
            type="range"
            min="0"
            max="10"
            value={mood}
            onChange={(e) => setMood(e.currentTarget.value)}
            required
          />
        </div>
        <div>
          <label>Exercise</label>
          <input
            type="checkbox"
            name="exercise"
            onChange={(e) => exerciseHandle(e.currentTarget.checked)}
          />
        </div>
        <div>
          <label>Did you play games?</label>
          <input
            type="checkbox"
            name="games"
            onChange={(e) => gamesHandle(e.currentTarget.checked)}
          />
        </div>
        <div>
          <label>Did you do any work?</label>
          <input
            type="checkbox"
            name="work"
            onChange={(e) => workHandle(e.currentTarget.checked)}
          />
        </div>
        <div>
          <label>Breakfast</label>
          <input
            type="text"
            value={food.breakfast}
            onChange={(e) =>
              setFood({ ...food, breakfast: e.currentTarget.value })
            }
          />
        </div>
        <div>
          <label>Lunch</label>
          <input
            type="text"
            value={food.lunch}
            onChange={(e) => setFood({ ...food, lunch: e.currentTarget.value })}
          />
        </div>
        <div>
          <label>Dinner</label>
          <input
            type="text"
            value={food.dinner}
            onChange={(e) =>
              setFood({ ...food, dinner: e.currentTarget.value })
            }
          />
        </div>
        <div>
          <label>Time went to bed (Night before)</label>
          <input
            type="time"
            value={sleep.wentToBed}
            onChange={(e) =>
              setSleep({ ...sleep, wentToBed: e.currentTarget.value })
            }
          />
        </div>
        <div>
          <label>Time woke up</label>
          <input
            type="time"
            value={sleep.wakeUp}
            onChange={(e) =>
              setSleep({ ...sleep, wakeUp: e.currentTarget.value })
            }
          />
        </div>
        <SubmitButton>Add Entry</SubmitButton>
      </Form>
      {alertOn ? (
        <Alert
          alertMessage={alertMessage}
          alertColor={alertColor}
          alertOpacity={alertOpacity}
        ></Alert>
      ) : null}
    </StyledTestForm>
  );
};

const StyledTestForm = styled.div`
  width: 80%;
  margin: 2rem auto;
  background: #505050;
  padding: 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px #575757;
  display: flex;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  div {
    margin: 5px 0rem;
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  width: 80%;
`;
const SubmitButton = styled.button`
  padding: 0.7rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
`;
export default TestForm;
