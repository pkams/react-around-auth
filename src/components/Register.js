import React from 'react';
import Header from './Header';
import Main from './Main';
import { NavLink } from 'react-router-dom';
import logo from '../images/logo.svg';
import Footer from './Footer';
import InfoTooltip from './InfoTooltip';

export default function Register() {
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
          <p className="header__navilink">Faça o login</p>
        </Header>

        <Main>
          <div className="">
            <h2 className="register__title">Inscrever-se</h2>
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
              <button className="register__save-button">Inscrever-se</button>
              <NavLink
                exact
                className="register__save-button-text"
                to="/signup"
              >
                Já é um membro? Faça o login aqui!
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
