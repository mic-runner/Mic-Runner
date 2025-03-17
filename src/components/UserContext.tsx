import React, { createContext, useState } from "react";
import { LinePositionValues } from "../utils/sharedConsts";

interface UserContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  roomNumber: string;
  setRoomNumber: React.Dispatch<React.SetStateAction<string>>;
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
  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        roomNumber,
        setRoomNumber,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
