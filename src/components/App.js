import React from 'react';
import PopupWithForm from './PopupWithForm.js';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import api from '../utils/api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import '../index.css';
import { Route, Switch, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login.js';
import Register from './Register.js';
import * as auth from '../auth.js';

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  const [userData, setUserData] = React.useState({ email: '' });

  const [loggedIn, setLoggedIn] = React.useState(false);

  const history = useHistory();

  React.useEffect(() => {
    tokenCheck();
    api
      .getProfileInformation()
      .then((result) => {
        setCurrentUser(result);
      })
      .catch((err) => {
        console.log(err);
      });

    api
      .getCards()
      .then((result) => {
        setCards(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    tokenCheck();
  }, [loggedIn]);

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setAddPlacePopupOpen(false);
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard(false);
  }

  function handleUpdateUser(obj) {
    api.updateProfileInformation(obj.name, obj.about);
    currentUser.name = obj.name;
    currentUser.about = obj.about;
    setCurrentUser(currentUser);
    closeAllPopups();
  }

  function handleUpdateAvatar(obj) {
    api.updateProfilePhoto(obj.avatar);
    currentUser.avatar = obj.avatar;
    setCurrentUser(currentUser);
    closeAllPopups();
  }

  function handleCardLike(card) {
    // Verifique mais uma vez se esse cart??o j?? foi curtido
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Envie uma solicita????o para a API e obtenha os dados do cart??o atualizados
    if (isLiked) {
      api.unfavoriteCard(card._id).then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      });
    } else {
      api.favoriteCard(card._id).then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      });
    }
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(setCards(cards.filter((item) => item._id != card._id)));
  }

  function handleAddPlaceSubmit(card) {
    api.createCards(card.title, card.link).then((newCard) => {
      setCards([newCard, ...cards]);
    });
    closeAllPopups();
  }

  function onSignOut(e) {
    localStorage.removeItem('token');
    setLoggedIn(false);
  }

  function onLogin(info, setIsSucceed, setIsPopupOpen) {
    const { password, email } = info;
    auth.authorize(password, email).then((res) => {
      if (res) {
        setLoggedIn(true);
        history.push('/');
      } else {
        setIsSucceed(false);
        setIsPopupOpen(true);
      }
    });
  }

  function onRegister(info, setIsSucceed, setIsPopupOpen) {
    const { password, email } = info;
    auth.register(password, email).then((res) => {
      console.log(res);
      if (!res.error) {
        setIsSucceed(true);
      } else {
        setIsSucceed(false);
      }
      setIsPopupOpen(true);
    });
  }

  function tokenCheck() {
    // se o usu??rio tiver um token em localStorage,
    // essa fun????o ir?? verificar se o usu??rio tem um token v??lido
    const jwt = localStorage.getItem('token');
    if (jwt) {
      // vamos verificar o token
      auth.checkToken(jwt).then((res) => {
        if (res) {
          const data = {
            email: res.data.email,
          };
          // vamos logar o usu??rio
          setUserData(data);
          setLoggedIn(true);
          history.push('/');
        }
      });
    }
  }

  return (
    <>
      <Switch>
        <Route path="/signin">
          <Login setLoggedIn={setLoggedIn} onLogin={onLogin}></Login>
        </Route>
        <Route path="/signup">
          <Register onRegister={onRegister}></Register>
        </Route>
        <ProtectedRoute path="/" loggedIn={loggedIn}>
          <CurrentUserContext.Provider value={currentUser}>
            <div className="main-page">
              <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
              />

              <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
              />

              <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddPlaceSubmit={handleAddPlaceSubmit}
              />

              <PopupWithForm name="confirm-delete" title="Tem certeza?">
                <button className="popup__save-button popup__confirm-delete">
                  Sim
                </button>
              </PopupWithForm>

              <ImagePopup card={selectedCard} onClose={closeAllPopups} />
              <Header>
                <div className="header__info">
                  <p className="header__note">{userData.email}</p>
                  <a className="header__logout" onClick={onSignOut}>
                    Sair
                  </a>
                </div>
              </Header>
              <Main
                onEditAvatarClick={handleEditAvatarClick}
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
              <Footer />
            </div>
            <template id="card-template" />
          </CurrentUserContext.Provider>
        </ProtectedRoute>
      </Switch>
    </>
  );
}

export default App;
