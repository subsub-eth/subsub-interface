import * as React from "react";
import styled, 
  { 
    keyframes,
    createGlobalStyle,
    ThemeProvider
  } from "styled-components";

export interface CreatezTheme {

  readonly background: string;
  readonly primary: string;
  readonly secondary: string;

}

export class DefaultTheme implements CreatezTheme {

  background: string = "#2c2c2c";
  primary: string = "#fa5b04";
  secondary: string = "#f9f9f9";

}

const defaultTheme = new DefaultTheme();

export { defaultTheme };

export const GlobalStyle = createGlobalStyle`
body {
  font-family: 'Noto Sans', sans-serif;
  background-color: ${defaultTheme.background};
  color: ${defaultTheme.secondary};
}
`;

const blink = keyframes`
  0% {
      opacity: 1;
  }
  50% {
      opacity: 0.2;
  }
  100% {
      opacity: 1;
  }
`;

function randInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function generateStars(stars: number): string {
  const rand = () => randInt(3000);

  const value = Array.from(Array(stars).keys())
    .map(_ => `${rand()}px ${rand()}px rgba(184,174,131,${randInt(10) * 10}%)`)
    .join(",");
  return value;
}

const StarsBase = styled.div`
  background: transparent;
  border-radius: 100%;
  position: absolute;
  left: 0;
  top: 0;
`;

const StarsSmall = styled(StarsBase)`
  width: 2px;
  height: 2px;
  box-shadow: ${generateStars(500)};
  animation: ${blink} 2s infinite;
`;

const StarsMedium = styled(StarsBase)`
  width: 3px;
  height: 3px;
  box-shadow: ${generateStars(400)};
  animation: ${blink} 4s infinite;
`;

const StarsLarge = styled(StarsBase)`
  width: 4px;
  height: 4px;
  box-shadow: ${generateStars(300)};
  animation: ${blink} 3s infinite;
`;

export function Stars() {
  return (
    <React.Fragment>
      <StarsSmall />
      <StarsMedium />
      <StarsLarge />
    </React.Fragment>
  );
}
