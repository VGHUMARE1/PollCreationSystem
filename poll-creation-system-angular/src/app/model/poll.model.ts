// src/app/models/poll.model.ts
export interface Option {
    id: number;
    optionText: string;
  }
  
  export interface Poll {
    _id: string;
    question: string;
    options: Option[];  // This is using the interface as a type
    allowMultiple: boolean;
    selectedOptions?: boolean[];
    selectedOption?: number | null;
    createdBy: string;
    expiryDate: string;
    totalVotes: number;
  }