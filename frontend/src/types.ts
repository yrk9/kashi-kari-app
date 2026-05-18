export interface Record {
  id: number;
  name: string;
  content: string;
  amount: number | null;
  type: "MONEY" | "ITEM";
  is_complete: boolean;
}

export interface GroupCreate {
  description: string;
  total_amount: number;
}

export interface GroupResponse {
  id: string;
  description: string;
  total_amount: number;
}

export type FilterStatus = "ALL" | "ACTIVE" | "COMPLETED";
