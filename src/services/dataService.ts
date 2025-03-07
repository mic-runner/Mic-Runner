export interface Participant {
  id: number;
  name: string;
  comment: string;
  speaking?: boolean;
}

export interface RoomInfo {
  roomNumber: string;
  joinUrl: string;
}

class DataService {
  private participants: Participant[] = [
    {
      id: 1,
      name: "Username123",
      comment: "I have a comment related to frasgerd"
    },
    {
      id: 2,
      name: "Username456",
      comment: ""
    },
    {
      id: 3,
      name: "Username789",
      comment: "I have a question about orders of ignorance"
    },
    {
      id: 4,
      name: "Username123",
      comment: "I have a comment related to frasgerd I have a question about orders of ignorance 2 I have a question about orders of ignorance 2 I have a question about orders of ignorance 2I have a question about orders of ignorance 2 I have a question about orders of ignorance 2I have a question about orders of ignorance 2"
    },
    {
      id: 5,
      name: "Username456",
      comment: ""
    },
    {
      id: 6,
      name: "Username789",
      comment: "I have a question about orders of ignorance"
    }
  ];

  private roomInfo: RoomInfo = {
    roomNumber: "123",
    joinUrl: "mic-runner.github.io/room123"
  };

  getParticipants(): Participant[] {
    return this.participants;
  }

  getRoomInfo(): RoomInfo {
    return this.roomInfo;
  }
}

export default new DataService();
