import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import firebase from "../firebase";
import styled from "styled-components";
// Icons for mood
import iconHappy from "../img/happy.svg";
import iconNeutral from "../img/neutral.svg";
import iconSuperHappy from "../img/superhappy.svg";
import iconSuperSad from "../img/supersad.svg";

const useDetails = (loggedUser) => {
  const [details, setDetails] = useState({});
  const history = useHistory();

  const getCurrentPath = () => {
    let fullPath = history.location.pathname;
    let parts = fullPath.split("/");
    return parts[parts.length - 1];
  };

  const getTotalSleep = (a, b) => {
    //   a = time woke up
    //  b = time went to bed night  before
    // Work out if "b" is am or pm
    let d1, d2;
    // Split time into array of hours and minutes in time
    let x = b.split(":");
    // Turn first item in array (hours) into a number
    let y = parseInt(x[0], 10);
    // If hours is above 12 (After midday) then set day as date before time woke up
    // Otherwise, if time as am (under 12/midday) set day as current day (If fell asleep same day as woke up)
    if (y > 12) {
      d1 = new Date(`January 1 2000 ${b}`);
    } else {
      d1 = new Date(`January 2 2000 ${b}`);
    }
    d2 = new Date(`January 2 2000 ${a}`);

    const duration = d2 - d1;
    let minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}h${minutes}`;
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      // Please work netlify
      // eslint-disable-next-line react-hooks/exhaustive-deps
      .doc(loggedUser.id)
      .collection("entries")
      // eslint-disable-next-line react-hooks/exhaustive-deps
      .doc(getCurrentPath())
      .get()
      .then((doc) => {
        if (doc.exists) {
          // console.log("Doc data: ", doc.data());
          const newDetails = {
            ...doc.data(),
            date: doc.data().date.toDate(),
            totalSleep: getTotalSleep(
              doc.data().sleep.wakeUp,
              doc.data().sleep.wentToBed
            ),
          };
          setDetails(newDetails);
        } else {
          console.error("Document unavailable");
        }
      })
      .catch((err) => {
        console.error("Error getting document: ", err);
      });
  }, []);
  return details;
};
const sSpaceBetween = {
  display: "flex",
  justifyContent: "space-between",
};

const EntryDetails = ({ loggedUser }) => {
  const ent = useDetails(loggedUser);

  const getMoodIcon = (m) => {
    if (m <= 2) {
      return iconSuperSad;
    } else if (m <= 5) {
      return iconNeutral;
    } else if (m <= 8) {
      return iconHappy;
    } else {
      return iconSuperHappy;
    }
  };

  return (
    <StyledDetails>
      <h1>Entry Details</h1>
      {ent.date && (
        <Grid>
          {/* Date/day */}
          <GridItem style={{ gridArea: 1 / 1 / 2 / 2 }}>
            <h2>Date</h2>
            <p>{ent.date.toString()}</p>
          </GridItem>
          {/* Sleep */}
          <GridItem style={{ gridArea: 1 / 2 / 2 / 3 }}>
            <h2>Sleep</h2>
            <div style={sSpaceBetween}>
              <p>Time woke up:</p>
              <p>{ent.sleep.wakeUp}</p>
            </div>
            <div style={sSpaceBetween}>
              <p>Time fell asleep:</p>
              <p>{ent.sleep.wentToBed}</p>
            </div>
            <div style={sSpaceBetween}>
              <p>Total sleep:</p>
              <p>{ent.totalSleep}</p>
            </div>
          </GridItem>
          {/* Mood */}
          <GridItem style={{ gridArea: 1 / 3 / 2 / 4 }}>
            <h2>Mood</h2>
            <MoodGradient>
              <MoodLine mood={ent.mood}>
                <MoodLineCount>
                  <h3>{ent.mood}</h3>
                </MoodLineCount>
              </MoodLine>
            </MoodGradient>
            <IconDiv>
              <MoodIcon src={getMoodIcon(ent.mood)} alt="Icon" />
            </IconDiv>
          </GridItem>
          {/* Weather */}
          <GridItem style={{ gridArea: 2 / 1 / 3 / 2 }}>
            <div style={sSpaceBetween}>
              <h2>Weather</h2>
              <WeatherIcon
                src={ent.weather.icon}
                alt={ent.weather.description}
              />
            </div>
            <div style={sSpaceBetween}>
              <p>Avg temperature:</p>
              <p>{ent.weather.temp}</p>
            </div>
            <div style={sSpaceBetween}>
              <p>Forecast:</p>
              <p>{ent.weather.description}</p>
            </div>
            <div style={sSpaceBetween}>
              <p>Precipitation:</p>
              <p>{ent.weather.precip}mm</p>
            </div>
            <div style={sSpaceBetween}>
              <p>Humidity:</p>
              <p>{ent.weather.humidity}%</p>
            </div>
            <div style={sSpaceBetween}>
              <p>Moon phase:</p>
              <p>{ent.weather.moonPhase}</p>
            </div>
          </GridItem>
          {/* Food */}
          <GridItem style={{ gridArea: 2 / 2 / 3 / 3 }}>
            <h2>Food</h2>
            <div style={sSpaceBetween}>
              <p>Breakfast:</p>
              <p>{ent.food.breakfast}</p>
            </div>
            <div style={sSpaceBetween}>
              <p>Lunch:</p>
              <p>{ent.food.lunch}</p>
            </div>
            <div style={sSpaceBetween}>
              <p>Dinner:</p>
              <p>{ent.food.dinner}</p>
            </div>
          </GridItem>
          {/* Habits */}
          <GridItem style={{ gridArea: 2 / 3 / 3 / 4 }}>
            <h2>Habits</h2>
            <div style={sSpaceBetween}>
              <p>Exercised?</p>
              <p>{ent.exercise ? "Yes" : "No"}</p>
            </div>
            <div style={sSpaceBetween}>
              <p>Played games?</p>
              <p>{ent.games ? "Yes" : "No"}</p>
            </div>
            <div style={sSpaceBetween}>
              <p>Worked?</p>
              <p>{ent.work ? "Yes" : "No"}</p>
            </div>
          </GridItem>
          {/* <GridItem style={{ gridArea: 3 / 1 / 4 / 2 }}></GridItem>
          <GridItem style={{ gridArea: 3 / 2 / 4 / 3 }}></GridItem>
          <GridItem style={{ gridArea: 3 / 3 / 4 / 4 }}></GridItem> */}
        </Grid>
      )}
      <div>
        Icons made by{" "}
        <a
          href="https://www.flaticon.com/authors/pixel-perfect"
          title="Pixel perfect"
        >
          Pixel perfect
        </a>{" "}
        from{" "}
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>
      </div>
    </StyledDetails>
  );
};
export default EntryDetails;

const WeatherIcon = styled.img`
  transform: translateY(-25%);
`;

const IconDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;
const MoodIcon = styled.img`
  width: 40%;
  height: 40%;
  margin: auto;
`;
const MoodGradient = styled.div`
  background: rgb(200, 13, 13);
  background: linear-gradient(
    90deg,
    rgba(200, 13, 13, 1) 0%,
    rgba(249, 242, 21, 1) 50%,
    rgba(0, 255, 12, 1) 100%
  );

  width: 100%;
  height: 10%;
  position: relative;
`;
const MoodLine = styled.div`
  width: 1%;
  height: 100%;
  background: #c2c2c2;
  position: absolute;
  border: 1px solid black;
  left: ${(props) => props.mood * 10}%;
`;
const MoodLineCount = styled.div`
  transform: translate(-100%, 170%);
`;
const StyledDetails = styled.div`
  text-align: center;
  background: #1a1919;
  h1 {
    padding-top: 2rem;
  }
`;
const Grid = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  min-height: 90vh;
  text-align: initial;
`;
const GridItem = styled.div`
  background-color: #2a2a2a;
  width: 100%;
  height: 100%;
  padding: 2rem;
  position: relative;
  h2 {
    font-size: 1.8rem;
    text-decoration: underline;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 1.4rem;
  }
`;
