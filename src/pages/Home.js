import { useState } from "react";
import styled from "styled-components";
// Components
import TestForm from "../components/TestForm";
// Firebase
import firebase from "../firebase";

const Home = ({
  setAlert,
  alertColor,
  alertMessage,
  alertOpacity,
  alertOn,
  loggedUser,
}) => {
  return (
    <StyledHome>
      <Card>
        <h1>Day Logger</h1>
        <TestForm
          setAlert={setAlert}
          alertColor={alertColor}
          alertMessage={alertMessage}
          alertOpacity={alertOpacity}
          alertOn={alertOn}
          loggedUser={loggedUser}
          // EPIC
        />
      </Card>
    </StyledHome>
  );
};

// Styles
const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80vh;
  h1 {
    margin: 2rem;
  }
`;
const Card = styled.div`
  background-color: #686868;
  padding: 1rem;
  width: 40%;
  border-radius: 20px;
  text-align: center;
  h1 {
    margin: 0;
    padding-top: 1rem;
  }
`;
export default Home;
