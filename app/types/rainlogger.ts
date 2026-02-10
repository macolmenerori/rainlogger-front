export type RainLog = {
  _id: string;
  date: string;
  records?: Record<string, any>[];
  measurement: number;
  realReading: boolean;
  location: string;
  timestamp: string;
  loggedBy: string;
};
