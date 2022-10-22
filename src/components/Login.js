import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../images/logo.svg';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import InfoTooltip from './InfoTooltip';

export default function Login() {
  function onSubmit(e) {
    e.preventDefault();
    setIsPopupOpen(true);
  }

  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [isSucceed, setIsSucceed] = React.useState(true);

  function closePopup() {
    setIsPopupOpen(false);
  }

  return (
    <>
      <div className="main-page">
        <Header>
          <p className="header__navilink">Entrar</p>
        </Header>

        <Main>
          <div className="">
            <h2 className="register__title">Entrar</h2>
            <form className="register__form" onSubmit={onSubmit}>
              <input
                type="email"
                id="email"
                name="email"
                className="register__form-input"
                placeholder="Email"
                required=""
              />
              <span className="register__form-error name-error" />
              <input
                type="password"
                id="password"
                name="password"
                className="register__form-input"
                placeholder="Password"
                required=""
              />
              <span className="register__form-error job-error" />
              <button className="register__save-button">Entrar</button>
              <NavLink
                exact
                className="register__save-button-text"
                to="/signin"
              >
                Ainda não é membro? Inscreva-se aqui!
              </NavLink>
            </form>
          </div>
        </Main>

        <InfoTooltip
          isOpen={isPopupOpen}
          isSucceed={isSucceed}
          onClose={closePopup}
        />
      </div>
    </>
  );
}
