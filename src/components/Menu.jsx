import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ open }) => (open ? "240px" : "80px")};
  background-color: white;
  color: black;
  border-right: 1px solid #ddd;
  transition: width 0.3s ease;
  z-index: 200;

  @media (max-width: 768px) {
    width: ${({ open }) => (open ? "240px" : "0px")};
    box-shadow: ${({ open }) => (open ? "2px 0 5px rgba(0, 0, 0, 0.1)" : "none")};
  }
`;

const Sidebar = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 10px;
  height: calc(100vh - 56px);
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ open }) => (open ? "20px" : "0")};
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background-color: #f0f0f0;
  }

  svg {
    min-width: 24px;
    min-height: 24px;
  }

  span {
    display: ${({ open }) => (open ? "inline" : "none")};
    opacity: ${({ open }) => (open ? 1 : 0)};
    transition: opacity 0.3s;
  }
`;

const Hr = styled.hr`
  margin: 15px 0;
  border: 0.5px solid #ddd;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #777;
  margin: 20px 0 10px;
  display: ${({ open }) => (open ? "block" : "none")};
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  height: 56px;
  border-bottom: 1px solid #ddd;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

const LogoText = styled.span`
  font-size: 18px;
  font-weight: bold;
  display: ${({ open }) => (open ? "inline" : "none")};
`;

const Overlay = styled.div`
  display: ${({ open }) => (open ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 199;
  @media (min-width: 769px) {
    display: none;
  }
`;

const Menu = ({ open, setOpen, darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  return (
    <>
      <Overlay open={open} onClick={() => setOpen(false)} />

      <Container open={open}>
        {/* Top Bar */}
        <TopBar>
          <MenuIcon
            onClick={() => setOpen(!open)}
            style={{ cursor: "pointer" }}
          />
          <LogoContainer onClick={() => navigate("/")}>
            <Logo src="/logo.png" alt="YouTube Logo" />
            <LogoText open={open}>YouTube</LogoText>
          </LogoContainer>
        </TopBar>

        {/* Sidebar Contents */}
        <Sidebar>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Item open={open}>
              <HomeIcon />
              <span>Home</span>
            </Item>
          </Link>

          <Link to="/trends" style={{ textDecoration: "none", color: "inherit" }}>
            <Item open={open}>
              <ExploreOutlinedIcon />
              <span>Explore</span>
            </Item>
          </Link>

          <Link to="/subscriptions" style={{ textDecoration: "none", color: "inherit" }}>
            <Item open={open}>
              <SubscriptionsOutlinedIcon />
              <span>Subscriptions</span>
            </Item>
          </Link>

          <Hr />
          <Title open={open}>BEST OF YOUTUBE</Title>

          <Item open={open}>
            <LibraryMusicOutlinedIcon />
            <span>Music</span>
          </Item>

          <Item open={open}>
            <SportsBasketballOutlinedIcon />
            <span>Sports</span>
          </Item>

          <Item open={open}>
            <SportsEsportsOutlinedIcon />
            <span>Gaming</span>
          </Item>

          <Item open={open}>
            <MovieOutlinedIcon />
            <span>Movies</span>
          </Item>

          <Item open={open}>
            <ArticleOutlinedIcon />
            <span>News</span>
          </Item>

          <Item open={open}>
            <LiveTvOutlinedIcon />
            <span>Live</span>
          </Item>

          <Hr />
          <Item open={open}>
            <SettingsOutlinedIcon />
            <span>Settings</span>
          </Item>

          <Item open={open}>
            <FlagOutlinedIcon />
            <span>Report</span>
          </Item>

          {/* Dark Mode Toggle */}
          <Item open={open} onClick={() => setDarkMode(!darkMode)}>
            <SettingsBrightnessOutlinedIcon />
            <span>{darkMode ? "Light" : "Dark"} Mode</span>
          </Item>
        </Sidebar>
      </Container>
    </>
  );
};

export default Menu;


