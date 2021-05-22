import * as React from "react";
import styled, 
  { 
    keyframes,
    createGlobalStyle,
    ThemeProvider
  } from "styled-components";
import "@fontsource/noto-sans";

export interface CreatezTheme {

  readonly background: string;
  readonly primary: string;
  readonly secondary: string;

  readonly minTablet: number;
  readonly maxMobile: number;
  readonly minDesktop: number;
  readonly maxTablet: number;

  readonly gutter: number;
  readonly fontCopy: string;
  readonly buttonMixin: string;
  readonly resetButton: string;
}

export class DefaultTheme implements CreatezTheme {

  background: string = "#2c2c2c";
  primary: string = "#fa5b04";
  secondary: string = "#f9f9f9";

  minTablet: number = 680;
  maxMobile: number = this.minTablet - 1;
  minDesktop: number = 1040;
  maxTablet: number = this.minDesktop - 1;

  gutter: number = 12;
  fontCopy: string = `
  font-size: 14px;
  line-height: 1.5;

  @media screen and (min-width: ${this.minTablet}px) {
    font-size: 16px;
  }

  @media screen and (min-width: ${this.minDesktop}px) {
    font-size: 18px;
  }
  `;
  buttonMixin: string = `
  ${this.fontCopy}
  padding: 6px 8px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 0 15px ${this.primary};
  background-color: ${this.primary};
  color: ${this.secondary};
  font-size: 14px;

  &:hover {
    cursor: pointer;
  }

  @media screen and (min-width: ${this.minTablet}px) {
    padding: 8px 10px;
  }
  `;
  resetButton: string = `
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  `;

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
