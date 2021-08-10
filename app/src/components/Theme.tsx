import * as React from "react";
import styled, 
  { 
    keyframes,
    createGlobalStyle,
    ThemeProvider
  } from "styled-components";
import "@fontsource/noto-sans/index.css";

export interface CreatezTheme {

  readonly background: string;
  readonly primary: string;
  readonly secondary: string;

  readonly cardBackground: string;
  readonly cardRed: string;
  readonly cardYellow: string;
  readonly cardGreen: string;
  readonly cardBlue: string;

  readonly minTablet: number;
  readonly maxMobile: number;
  readonly minDesktop: number;
  readonly maxTablet: number;

  readonly maxHeader: number;
  readonly maxCard: number;
  readonly vaultInfoLabelWidth: number;

  readonly gutter: number;
  readonly fontCopy: string;
  readonly buttonMixin: string;
  readonly resetButton: string;
  readonly contentSpacing: string;
}

export class DefaultTheme implements CreatezTheme {

  background: string = "#2c2c2c";
  primary: string = "#fa5b04";
  secondary: string = "#f9f9f9";

  cardBackground: string = "#3c3c3c";
  cardRed: string = "#ea5956";
  cardYellow: string = "#f2c91e";
  cardGreen: string = "#7ac4a2";
  cardBlue: string = "#7eb0e4";

  minTablet: number = 680;
  maxMobile: number = this.minTablet - 1;
  minDesktop: number = 1040;
  maxTablet: number = this.minDesktop - 1;

  maxHeader: number = 1560;
  maxCard: number = 1440;
  vaultInfoLabelWidth: number = 130;

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

  &[disabled] {
    box-shadow: none;
    border: 1px solid ${this.secondary};
    background-color: transparent;
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media screen and (min-width: ${this.minTablet}px) {
    padding: 8px 10px;
  }
  `;
  resetButton: string = resetButton;
  contentSpacing: string = contentSpacing(this.gutter, this.minTablet);
}

export const resetButton = `
border: none;
margin: 0;
padding: 0;
width: auto;
overflow: visible;
background: transparent;
color: inherit;
&:hover {
  cursor: pointer;
}
`;

export const contentSpacing = (gutter: number, minTablet: number) => `
margin-top: ${gutter * 2}px;

@media screen and (min-width: ${minTablet}px) {
  margin-top: ${gutter * 3}px;
}
`;

export const fontHeadlineH1 = (minTablet: number, minDesktop: number) => `
font-size: 24px;
font-weight: 600;
line-height: 1.5;

@media screen and (min-width: ${minTablet}px) {
  font-size: 28px;
}

@media screen and (min-width: ${minDesktop}px) {
  font-size: 32px;
}
`;

export const fontLabel = (minDesktop: number) => `
font-size: 14px;

@media screen and (min-width: ${minDesktop}px) {
  font-size: 16px;
}
`;

export const fontValue = (minDesktop: number) => `
font-size: 20px;

@media screen and (min-width: ${minDesktop}px) {
  font-size: 22px;
}
`;

export const textEllipsis = `
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
`;

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
