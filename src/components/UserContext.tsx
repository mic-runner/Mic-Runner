import React, { createContext, useState } from "react";
import { ParticipantConnection } from "../model/participantConnection";

interface UserContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  roomNumber: string;
  setRoomNumber: React.Dispatch<React.SetStateAction<string>>;
  placeInLine: string;
  setPlaceInLine: React.Dispatch<React.SetStateAction<string>>;
  participantConnection: ParticipantConnection | null;
  setParticipantConnection: React.Dispatch<
    React.SetStateAction<ParticipantConnection | null>
  >;
}

// creating context here
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [username, setUsername] = useState<string>("");
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [placeInLine, setPlaceInLine] = useState<string>("10"); // thi is hardcoded to 10 for now
  const [participantConnection, setParticipantConnection] =
    useState<ParticipantConnection | null>(null);

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        roomNumber,
        setRoomNumber,
        placeInLine,
        setPlaceInLine,
        participantConnection,
        setParticipantConnection,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
