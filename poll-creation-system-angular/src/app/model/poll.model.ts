export interface Option {
  id: number;
  optionText: string;
}

export interface Poll {
  _id: number;
  question: string;
  createdBy: string;
  expiryDate: string;
  totalVotes: number;
  allowMultiple: boolean;
  options: Option[];
  userVoted: boolean;
  selectedOptions: (boolean | Option)[]; // Can be either boolean or Option
  selectedOption: number | null;
}