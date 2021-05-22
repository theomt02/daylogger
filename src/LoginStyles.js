import styled from "styled-components";
export const LoginForm = styled.form`
  min-height: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  input {
    margin: 5px;
  }
  div {
    width: 70%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  button {
    margin: 1rem;
    padding: 1rem;
    border: none;
    background: #1e1e1e;
    color: white;
    border-radius: 10px;
    cursor: pointer;
  }
`;
export const StyledLogin = styled.div`
  width: 100vw;
  height: 100vh;
`;
export const LoginContainer = styled.div`
  text-align: center;
  width: 30vw;
  height: 70vh;
  margin: auto;
  margin-top: 2rem;
  border-radius: 16px;
  background: #caf7ca;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  color: #2b2b2b;
  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  h3 {
    text-decoration: underline;
    cursor: pointer;
  }
`;
