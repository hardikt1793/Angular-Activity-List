
  export interface ActivityType {
    [Key: string]: {
      title: string;
      icon: string;
    }
  }
  
  
export interface Activity {
    id: number;
    note: string;
    type: string; 
    timestamp: Date;
    user: string;
}