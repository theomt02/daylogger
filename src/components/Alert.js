import styled from "styled-components";
const Alert = ({ alertMessage, alertColor, alertOpacity }) => {
  return (
    <StyledAlert alertColor={alertColor} alertOpacity={alertOpacity}>
      <p>{alertMessage}</p>
    </StyledAlert>
  );
};
export default Alert;

const StyledAlert = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 10vw;
  height: 6vh;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => props.alertOpacity};
  transition: opacity 1s ease;

  background-color: ${(props) => props.alertColor};
`;
