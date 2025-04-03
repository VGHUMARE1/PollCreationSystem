export interface Option {
  id: number;
  optionText: string;
}

export interface Poll {
  _id: string;  
  question: string;
  createdBy: string;
  expiryDate: string;
  totalVotes: number;
  allowMultiple: boolean;
  options: Option[];
  userVoted: boolean;
  selectedOptions?: (Option | boolean)[]; 
  selectedOption?: number | null;
}