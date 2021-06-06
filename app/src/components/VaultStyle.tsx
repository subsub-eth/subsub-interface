import styled from "styled-components";

import {FileCopy, Link as LinkIcon, Warning, Report, ExpandLess, TrendingFlat}
  from '@material-ui/icons';

import {fontHeadlineH1, resetButton, textEllipsis, fontLabel, fontValue}
  from "./Theme";


export const VaultContainer = styled.div`
margin-top: ${props => props.theme.gutter * 4}px;
padding: ${props => props.theme.gutter * 2}px;
border-radius: ${props => props.theme.gutter}px;
background: ${props => props.theme.cardBackground};
box-shadow: 0 0 10px 0 #484545;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  margin-top: ${props => props.theme.gutter * 6}px;
  padding: ${props => props.theme.gutter * 3}px;
}
`;

export const Meta = styled.div`
display: grid;
grid-template-areas: 'status . actions' 'token title title' 'token owner owner';
grid-template-columns: 64px minmax(0, auto) 80px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  grid-template-areas: 'token title status actions' 'token owner . .';
  grid-template-columns: 84px auto 70px 100px;
}
`;

export const TokenLink = styled.a`
grid-area: token;
align-items: center;
display: grid;
cursor: pointer;
`;

export const TokenImage = styled.img`
width: 40px;
height: 40px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  width: 60px;
  height: 60px;
}
`;

export const VaultTitle = styled.h1`
grid-area: title;
${props => fontHeadlineH1(props.theme.minTablet, props.theme.minDesktop)}
${textEllipsis}
`;

export const OwnerContainer = styled.div`
grid-area: owner;
font-size: 12px;
display: flex;
align-items: center;

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  font-size: 14px;
}
`;

export const OwnerAddress = styled.div`
line-height: 1;
${textEllipsis}
`;

export const OwnerButton = styled.button`
${resetButton}
height: 20px;
width: 20px;
display: grid;
place-items: center;
svg {
  font-size: 16px;
}
&:hover {
  border-radius: 4px;
  background-color: ${props => props.theme.secondary};
  color: ${props => props.theme.background};
}
`;

export const OwnerCopyButton = styled(OwnerButton)`
margin-left: ${props => props.theme.gutter}px;
margin-right: ${props => props.theme.gutter / 2}px;
`;



export const StatusContainer = styled.div`
grid-area: status;
margin-bottom: ${props => props.theme.gutter}px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  justify-self: end;
  margin-bottom: 0;
}
`;

export const vaultStatusIcon = (minTablet: number) => `
font-size: 28px !important;
@media screen and (min-width: ${minTablet}px) {
  font-size: 32px !important;
}
`;
export const VaultWarning = styled(Warning)`
color: ${props => props.theme.cardYellow};
${props => vaultStatusIcon(props.theme.minTablet)}
`;

export const VaultDanger = styled(Report)`
color: ${props => props.theme.cardRed};
${props => vaultStatusIcon(props.theme.minTablet)}
`;


export const VaultMetaActionButton = styled.button`
${resetButton}
height: 28px;
width: 28px;
display: grid;
place-items: center;

&:hover {
  border-radius: 4px;
  background-color: ${props => props.theme.secondary};
  color: ${props => props.theme.background}
}
`;

export const VaultCopyButton = styled(VaultMetaActionButton)`
margin-right: ${props => props.theme.gutter / 2}px;

svg {
  font-size: 18px;
}
`;

export const MetaActionsContainer = styled.div`
grid-area: actions;
justify-self: end;
display: flex;
`;


export const InfoContainter = styled.div`
${props => props.theme.contentSpacing}
display: grid;
grid-template-columns: 1fr;

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  grid-template-columns: 60% 40%;
  grid-column-gap: ${props => props.theme.gutter * 2}px;
}
`;

export const InfoField = styled.div`
display: flex;
flex-direction: column;
margin-top: ${props => props.theme.gutter * 1.5}px;
width: 100%;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  align-items: flex-end;
  flex-direction: row;
  margin-top: ${props => props.theme.gutter * 2}px;
}
`;

export const InfoFieldLabel = styled.div`
margin-bottom: ${props => props.theme.gutter}px;
${props => fontLabel(props.theme.minDesktop)}

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  width: ${props => props.theme.vaultInfoLabelWidth}px;
  margin-bottom: 0;
}
`;

export const InfoFieldLabelModifier = styled.span`
font-size: 12px;
@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  font-size: 14px;
}
`;

export const FieldProperties = styled.div`
display: grid;
grid-template-columns: 3fr 3fr 2fr;
width: 100%;
${props => fontValue(props.theme.minDesktop)}

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  grid-template-columns: repeat(3, 1fr);
  width: calc(100% - ${props => props.theme.vaultInfoLabelWidth}px);
}
`;

export const PropertyValue = styled.span`
svg {
  margin-left: 8px;
  vertical-align: -2px;
  font-size: 16px;
  color: ${props => props.theme.cardYellow};

  @media screen and (min-width: ${props => props.theme.minTablet}px) {
    font-size: 18px;
  }
}
`;

export const TransitionArrow = styled(TrendingFlat)`
margin-right: ${props => props.theme.gutter}px;
color: ${props => props.theme.secondary};
font-size: 18px;
line-height: 22px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  margin-right: ${props => props.theme.gutter * 2}px;
  font-size: 22px;
}
`;

export const FieldProperty = styled.div`
&:not(:last-child) {
  display: flex;
  justify-content: space-between;
}
`;

export const UserProperty = styled(FieldProperty)`
color: ${props => props.theme.cardBlue}
`;
export const CurrentProperty = styled(FieldProperty)`
color: ${props => props.theme.cardGreen}
`;
export const UpcomingProperty = styled(FieldProperty)`
color: ${props => props.theme.cardRed}
`;


export const VaultStateContainer = styled.div`
@media screen and (max-width: ${props => props.theme.maxMobile}px) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: ${props => props.theme.gutter * 2}px;
  margin-top: ${props => props.theme.gutter * 2}px;
}
`;

export const StateInfoFieldValue = styled.div`
width: calc(100% - ${props => props.theme.vaultInfoLabelWidth}px);
${props => fontValue(props.theme.minDesktop)}
`;


export const UserDetailsContainer = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
grid-column-gap: ${props => props.theme.gutter * 2}px;
@include content-spacing;

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  grid-template-columns: 2fr 2fr 1fr;
  grid-column-gap: ${props => props.theme.gutter * 4}px;
}
`;

export const UserDetailsFieldContainer = styled.div`
display: flex;
flex-direction: column;
margin-top: ${props => props.theme.gutter * 1.5}px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  flex-direction: row;
  align-items: flex-end;
  margin-top: ${props => props.theme.gutter * 2}px;
}

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  &:nth-child(odd) {
    grid-column: 1 / 2;
  }

  &:nth-child(even) {
    grid-column: 2 / 3;
  } 
}
`;

export const UserDetailsLabel = styled.div`
margin-bottom: ${props => props.theme.gutter}px;
width: ${props => props.theme.vaultInfoLabelWidth}px;
${props => fontLabel(props.theme.minDesktop)}

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  margin-bottom: 0;
}
`;
export const UserDetailsValue = styled.div`
width: calc(100% - ${props => props.theme.vaultInfoLabelWidth}px);
${props => fontValue(props.theme.minDesktop)}
`;


export const VaultActionsContainer = styled.div`
margin-top: ${props => props.theme.gutter * 3}px;
display: grid;
align-items: end;
grid-template-columns: 1fr;
grid-row-gap: ${props => props.theme.gutter * 2}px;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  grid-template-columns: 1fr 1fr;
  grid-column-gap: ${props => props.theme.gutter * 2}px;
}

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  margin-top: ${props => props.theme.gutter * 4}px;
  grid-template-columns: 2fr 2fr 1fr;
  grid-column-gap: ${props => props.theme.gutter * 4}px;
}
`;

export const AmountInput = styled.input`
height: 43px;
background-color: transparent;
color: ${props => props.theme.secondary};
font-size: 18px;
padding: 0 ${props => props.theme.gutter}px;
border: none;
border-bottom: 1px solid ${props => props.theme.secondary};

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  font-size: 20px;
}

&::placeholder{
  opacity: 0;
}

&:focus {
  outline: none;

  &::placeholder {
    opacity: 1;
  }
}

// Remove number input arrows
&::-webkit-outer-spin-button,
&::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
&[type=number] {
  -moz-appearance: textfield;
}
`;

export const topLabel = `
top: -20px;
left: 8px;
font-size: 16px;
`;

export const InputLabel = styled.label`
color: #999999; 
font-size: 18px;
font-weight: normal;
position: absolute;
pointer-events: none;
left: 14px;
top: ${props => props.theme.gutter * 2}px;
transition: 0.3s ease all; 
`;

export const ActionButtonContainer = styled.div`
display: flex;
justify-content: space-between;
width: 100%;
`;

export const ActionButton = styled.button`
${props => props.theme.buttonMixin}
margin-top: ${props => props.theme.gutter * 1.2}px;
`;

export const GroupedButton = styled(ActionButton)`
width: 48%;
`;

export const ActionForm = styled.form`
display: flex;
flex-direction: column;
background: #ffffff0f;
margin-top: ${props => props.theme.gutter * 2}px;
padding: ${props => props.theme.gutter}px;
border-radius: ${props => props.theme.gutter}px;
position: relative;
min-height: 120px;
justify-content: space-around;

${AmountInput}:focus ~ ${InputLabel} {
  ${topLabel}
}
${AmountInput}:valid ~ ${InputLabel} {
  ${topLabel}
}
`;

export const RewardsLabel = styled(InputLabel)`
${topLabel}
`;

export const RewardsAmount = styled.span`
height: 43px;
font-size: 22px;
line-height: 32px;
display: grid;
place-items: center;

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  font-size: 24px;
}
`;


export const NotesContainer = styled.div`
margin: ${props => props.theme.gutter * 3}px 0 0;
display: flex;
flex-wrap: wrap;
justify-content: space-between;
opacity: 0.9;
font-size: 12px;
line-height: 1.5;
`;

export const Note = styled.div`
margin-top: ${props => props.theme.gutter * 2}px;
flex-basis: 100%;

@media screen and (min-width: ${props => props.theme.minTablet}px) {
  flex-basis: 45%;
}

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  margin-top: ${props => props.theme.gutter * 2}px;
  flex-basis: 30%;

  &:nth-of-type(1):last-of-type {
    width: 60%;
  }

  &:nth-of-type(1):nth-last-of-type(2),
  &:nth-of-type(2):last-of-type {
    width: 45%;
  }
}
ul {
  list-style: inside;
}

ul, p {
  margin-top: 8px;
}
`;

export const NoteTitle = styled.div`
font-weight: 600;
`;
