import logo from "../images/logo.svg";

function Header() {
  return (
    <header className="header">
      <img
        className="header__logo"
        src={logo}
        alt="Logo do site Around the U.S."
      />
    </header>
  );
}

export default Header;
