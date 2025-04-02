import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import ChannelPage from "./pages/ChannelPage";
import CreateChannel from "./pages/CreateChannel";
import Upload from "./components/Upload";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const Main = styled.div`
  flex: 7;
  background-color: white;
  transition: margin-left 0.3s ease;
  margin-left: ${(props) => (props.open ? "240px" : "80px")};

  @media (max-width: 768px) {
    margin-left: ${(props) => (props.open ? "200px" : "60px")};
  }

  @media (max-width: 480px) {
    margin-left: 0;
    width: 100%;
  }
`;

const Wrapper = styled.div`
  padding: 22px 96px;
  background-color: white;
  transition: padding 0.3s ease;
  padding-left: ${(props) => (props.open ? "20px" : "0px")};

  @media (max-width: 1024px) {
    padding: 20px 50px;
  }

  @media (max-width: 768px) {
    padding: 15px 30px;
  }

  @media (max-width: 480px) {
    padding: 10px 15px;
  }
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [open, setOpen] = useState(window.innerWidth > 768); // Open sidebar by default on larger screens
  const { currentUser } = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          {/* ✅ Pass open and setOpen here */}
          <Menu open={open} setOpen={setOpen} darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main open={open}>
            <Navbar open={open} setOpen={setOpen} />
            <Wrapper open={open}>
              <Routes>
                {/* Home & Authentication */}
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="trends" element={<Home type="trend" />} />
                  <Route path="subscriptions" element={<Home type="sub" />} />
                  <Route path="search" element={<Search />} />
                  <Route
                    path="signin"
                    element={currentUser ? <Home /> : <SignIn />}
                  />
                  {/* Video Page */}
                  <Route path="video/:videoId" element={<Video />} />

                  {/* Channel Page */}
                  <Route path="channel/:channelId" element={<ChannelPage />} />
                  {/* Upload Page */}
                  <Route
                    path="upload"
                    element={currentUser ? <Upload /> : <SignIn />}
                  />
                  {/* 404 - Not Found */}
                  <Route path="*" element={<h1>404 Not Found</h1>} />
                  <Route path="/create-channel" element={<CreateChannel />} />
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;

