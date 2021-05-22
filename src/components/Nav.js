import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";

const Nav = ({ loggedUser, setLoggedUser }) => {
  const history = useHistory();
  const logOut = () => {
    setLoggedUser({});
    history.push("/login");
  };
  return (
    <StyledNav>
      <Link to="/">
        <h1>Day Logger</h1>
      </Link>
      <NavLinks>
        {loggedUser.id && (
          <li>
            <Link to="/">Add Entry</Link>
          </li>
        )}
        {loggedUser.id && (
          <li>
            <Link to="/entries">Entries</Link>
          </li>
        )}
        <li>
          {loggedUser.id ? (
            <h3 style={{ cursor: "pointer" }} onClick={logOut}>
              Log out
            </h3>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </NavLinks>
    </StyledNav>
  );
};
export default Nav;

const StyledNav = styled.nav`
  height: 10vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #141414;
  color: white;
  a {
    text-decoration: none;
    color: #ffffff;
  }
  a h1 {
    font-size: 2rem;
  }
`;
const NavLinks = styled.ul`
  display: flex;
  width: 20%;
  justify-content: space-around;
  list-style: none;
  a {
    font-size: 1.2rem;
    font-weight: 600;
  }
`;
