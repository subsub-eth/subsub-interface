import React from "react";

import {Warning}
  from '@mui/icons-material';
import * as S from "./VaultStyle";

import {
  HasVaultValues
} from "../../helper/propTypes";

interface VaultPropertyValue {
  value: string;
  flagged: boolean;
}
interface VaultProperty {
  label: string;
  modifier?: string;
  values: {
    user?: VaultPropertyValue,
    current: VaultPropertyValue,
    upcoming?: VaultPropertyValue
  };
}

/**
  * renders a set of transitioning vault properties
*/
const VaultProperties = () => {
  const isTransitioning = (value: VaultProperty) =>
    !!value.values.user || !!value.values.upcoming;

  const renderVaultPropertyValue = (v: VaultPropertyValue,
    transitioning: boolean) =>
    <>
      <S.PropertyValue>
        {v.value}
        {v.flagged ? <Warning /> : ""}
      </S.PropertyValue>
      {transitioning ? <S.TransitionArrow /> : ""}
    </>;

  // TODO hardcoded
  const fields = [
    {
      label: "Lorem", modifier: "ipsum",
      values: {current: {value: "123", flagged: true}}
    },
    {
      label: "Lorem", modifier: "ipsum",
      values: {
        user: {value: "111%", flagged: true},
        current: {value: "123", flagged: true},
        upcoming: {value: "222%", flagged: true}
      }
    }
  ]
    .map((f: VaultProperty, i: number) => {
      const values = isTransitioning(f) ?
        <>
          {f.values.user ?
            <S.UserProperty>
              {renderVaultPropertyValue(f.values.user, !!f.values.current)}
            </S.UserProperty> : ""}
          {f.values.current ?
            <S.CurrentProperty>
              {renderVaultPropertyValue(f.values.current, !!f.values.upcoming)}
            </S.CurrentProperty> : ""}
          {f.values.upcoming ?
            <S.UpcomingProperty>
              {renderVaultPropertyValue(f.values.upcoming, false)}
            </S.UpcomingProperty> : ""}
        </> :
        <S.FieldProperty>
          {renderVaultPropertyValue(f.values.current, false)}
        </S.FieldProperty>

      return (
        <S.InfoField key={i}>
          <S.InfoFieldLabel>
            {f.label}
            {f.modifier ?
              <S.InfoFieldLabelModifier> / {f.modifier}</S.InfoFieldLabelModifier> :
              ""}
          </S.InfoFieldLabel>
          <S.FieldProperties>
            {values}
          </S.FieldProperties>
        </S.InfoField>
      );
    });

  return (
    <div>
      {fields}
    </div>
  );
};


const VaultStateField = ({name, value}: {name: string, value: string}) => {
  return (
    <S.InfoField>
      <S.InfoFieldLabel>
        {name}
      </S.InfoFieldLabel>
      <S.StateInfoFieldValue>
        {value}
      </S.StateInfoFieldValue>
    </S.InfoField>
  );
}

const VaultState = ({vault}: {} & HasVaultValues) => {
  return (
    <S.VaultStateContainer>
      <VaultStateField name="Active Subs" value={vault.activeSubs.toString()} />
    </S.VaultStateContainer>
  );
};

export const VaultInfo = ({vault}: {} & HasVaultValues) => {
  return (
    <S.InfoContainter>
      <VaultProperties />
      <VaultState vault={vault} />
    </S.InfoContainter>
  );
}
