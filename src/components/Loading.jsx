import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  width: 100%;
`;

const Loader = styled.div`
  border: 6px solid ${({ theme }) => theme.text};
  border-top: 6px solid red;
  border-radius: 50%;
  width: ${(props) => (props.type === "sm" ? "35px" : "50px")};
  height: ${(props) => (props.type === "sm" ? "35px" : "50px")};
  animation: spin 1.5s linear infinite;
  will-change: transform;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-width: 5px;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    border-width: 4px;
  }
`;

function Loading({ type }) {
  return (
    <Container type={type}>
      <Loader type={type} />
    </Container>
  );
}

export default Loading;
