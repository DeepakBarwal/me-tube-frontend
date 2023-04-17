import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";

import store from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store/store";

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;
const Wrapper = styled.div`
  padding: 22px 96px;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <Container>
            <BrowserRouter>
              <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
              <Main>
                <Navbar />
                <Wrapper>
                  <Routes>
                    <Route path="/">
                      <Route index element={<Home type="random" />} />
                      <Route path="/trending" element={<Home type="trend" />} />
                      <Route
                        path="/subscriptions"
                        element={<Home type="subscriptions" />}
                      />
                      <Route path="signin" element={<SignIn />} />
                      <Route path="video">
                        <Route path=":id" element={<Video />} />
                      </Route>
                    </Route>
                  </Routes>
                </Wrapper>
              </Main>
            </BrowserRouter>
          </Container>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
