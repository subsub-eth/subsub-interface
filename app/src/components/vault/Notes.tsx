import React, {FormEvent, useEffect, useState} from "react";

import * as S from "./VaultStyle";

const VaultNote = () => {
  return (
    <S.Note>
      <S.NoteTitle>Lorem Ipsum</S.NoteTitle>
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
      <ul>
        <li>liquyam erat, sed diam voluptua</li>
        <li>liquyam erat, sed diam voluptua</li>
        <li>liquyam erat, sed diam voluptua</li>
      </ul>
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
    </S.Note>
  );
}

export const VaultNotes = () => {
  return (
    <S.NotesContainer>
      <VaultNote />
      <VaultNote />
      <VaultNote />
      <VaultNote />
    </S.NotesContainer>
  );
};
