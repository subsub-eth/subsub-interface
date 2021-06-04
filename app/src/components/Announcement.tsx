import React, {} from "react";
import styled from "styled-components";
import {Info, Warning} from '@material-ui/icons';

interface HasIcon {
  readonly icon: React.ReactNode
}

interface AnnouncementData {
  readonly text: string,
  readonly linkTarget?: string,
  readonly linkText?: string
}
const Panel = styled.div`
display: flex;
align-items: center;
margin: 36px auto 0;
padding: 28px;
border: 1px solid;
border-radius: 12px;
width: 80%;

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  padding: 24px;
  width: 50%;
}
`;

const InfoPanel = styled(Panel)`
background-color: ${props => props.theme.cardBackground};
border-color: ${props => props.theme.secondary};
`;

const WarningPanel = styled(Panel)`
background-color: #8e010126;
border-color: ${props => props.theme.cardRed};
box-shadow: 0 0 15px 0 ${props => props.theme.cardRed};
`;

const Text = styled.div`
font-size: 14px;
line-height: 1.5;

@media screen and (min-width: ${props => props.theme.minDesktop}px) {
  font-size: 16px;
}
`;

const Link = styled.a`
color: ${props => props.theme.secondary};
font-weight: 600;
display: block;
margin-top: 12px;
`;

const iconMixin = (minDesktop: number) => `
margin-right: 18px;
font-size: 40px !important;

@media screen and (min-width: ${minDesktop}px) {
  margin-right: 24px;
}
`;

const InfoIcon = styled(Info)`
${props => iconMixin(props.theme.minDesktop)}
color: ${props => props.theme.secondary}
`;

const WarningIcon = styled(Warning)`
${props => iconMixin(props.theme.minDesktop)}
color: ${props => props.theme.cardRed}
`;

const Announcement = ({icon, text, linkText, linkTarget}:
  {} & HasIcon & AnnouncementData) => {
  return (
    <>
      {icon}
      <Text>
        <p>{text}</p>
        <Link href={linkTarget} title={linkText}>{linkText}</Link>
      </Text>
    </>
  );
}

const InfoAnnouncement = ({text, linkText, linkTarget}: {} & AnnouncementData) => {
  return (
    <InfoPanel>
      <Announcement
        text={text}
        linkText={linkText}
        linkTarget={linkTarget}
        icon={<InfoIcon />}
      />
    </InfoPanel>
  );
}

const WarningAnnouncement = ({text, linkText, linkTarget}: {} & AnnouncementData) => {
  return (
    <WarningPanel>
      <Announcement
        text={text}
        linkText={linkText}
        linkTarget={linkTarget}
        icon={<WarningIcon />}
      />
    </WarningPanel>
  );
}

export const Announcements = () => {
  return (
    <div>
      <InfoAnnouncement
        text="Lorem Ipsum"
        linkTarget="#"
        linkText="Lorem Ipsum" />

      <WarningAnnouncement
        text="Lorem Ipsum"
        linkTarget="#"
        linkText="Lorem Ipsum" />
    </div >
  );
}
