export interface Message {
  linePos?: number;
  comment?: string;
  connectionInfo?: string; // I think this could handle when someone is kicked from the queue and other informational messages.
  
}
