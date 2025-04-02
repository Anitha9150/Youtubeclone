import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

const NavbarContainer = styled.div`
  position: sticky;
  top: 0;
  height: 60px;
  background-color: white;
  color: black;
  border-bottom: 1px solid #ddd;
  z-index: 100;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
`;

const Search = styled.form`
  display: flex;
  align-items: center;
  border: 2px solid #ccc;
  border-radius: 20px;
  padding: 5px 10px;
  flex-grow: 1;
  max-width: 500px;
  margin-left: auto;

  @media (max-width: 768px) {
    max-width: 250px;
  }
`;

const Input = styled.input`
  border: none;
  background: transparent;
  color: black;
  outline: none;
  width: 100%;
`;

const UserSection = styled.div`
  position: relative;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: black;
  cursor: pointer;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 180px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px;
  background: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;

  &:hover {
    background: #f1f1f1;
  }
`;

const Filters = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 10px 20px;
  background-color: white;
  color: black;
  border-bottom: 1px solid #ddd;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 10px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 10px;
    padding: 10px;
  }
`;

const FilterButton = styled.div`
  background: ${({ $active }) => ($active ? "#333" : "#f1f1f1")};
  color: ${({ $active }) => ($active ? "white" : "black")};
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  transition: background 0.2s;

  &:hover {
    background: ${({ $active }) => ($active ? "#222" : "#ccc")};
  }
`;

const MobileMenu = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const filter = searchParams.get("filter") || "all";

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleFilterClick = (selectedFilter) => {
    setSearchParams({ filter: selectedFilter.toLowerCase() });
  };

  const filters = ["All", "Music", "Gaming", "Sports", "News", "Movie", "Food", "Trending"];


  return (
    <NavbarContainer>
      {/* 🌟 Navbar Top Section */}
      <Wrapper>
        {/* Mobile Menu Icon */}
        <MobileMenu onClick={() => setMenuOpen(!menuOpen)}>
          <MenuIcon />
        </MobileMenu>

        {/* Search Bar */}
        <Search onSubmit={handleSearch}>
          <Input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
          <SearchOutlinedIcon style={{ cursor: "pointer" }} />
        </Search>

        {currentUser ? (
          <UserSection>
            {/* Clickable User Section */}
            <User onClick={() => setDropdownOpen(!dropdownOpen)}>
              {currentUser.img ? <Avatar src={currentUser.img} /> : <AccountCircleOutlinedIcon />}
              {currentUser.name || "User"}
            </User>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <Dropdown>
                <DropdownItem onClick={() => window.open("https://www.youtube.com/channel/UCJwjuQZXFhf3SOz7rsPtyFw", "_blank")}>
                  View Channel
                </DropdownItem>

                <DropdownItem onClick={() => navigate("/create-channel")}>Create Channel</DropdownItem>
                <DropdownItem onClick={handleLogout}>Log Out</DropdownItem>
              </Dropdown>
            )}
          </UserSection>
        ) : (
          <Link to="/signin" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "5px 15px",
                backgroundColor: "transparent",
                border: "1px solid black",
                color: "black",
                borderRadius: "3px",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <AccountCircleOutlinedIcon />
              SIGN IN
            </button>
          </Link>
        )}
      </Wrapper>


      {/* 🌟 Filters (Always visible on desktop) */}
      <Filters>
        {filters.map((item, index) => (
          <FilterButton
            key={index}
            $active={filter.toLowerCase() === item.toLowerCase()}
            onClick={() => handleFilterClick(item)}
          >
            {item}
          </FilterButton>
        ))}
      </Filters>

      {/* 🌟 Filters (Only visible on mobile view when menuOpen is true) */}
      {menuOpen && (
        <Filters>
          {filters.map((item, index) => (
            <FilterButton
              key={index}
              $active={filter.toLowerCase() === item.toLowerCase()}
              onClick={() => handleFilterClick(item)}
            >
              {item}
            </FilterButton>
          ))}
        </Filters>
      )}

    </NavbarContainer>
  );
};

export default Navbar;





