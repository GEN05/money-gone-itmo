export interface Transaction {
  id: string;
  date: number;
  category: string;
  value: number;
}

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isActivated: boolean;
  id: string;
  transactions: Transaction[];
  transactionsFromBank: Transaction[];
}
