export interface Record {
  id: number;
  name: string;
  content: string;
  amount: number | null;
  type: 'MONEY' | 'ITEM';
  is_complete: boolean;
}

export type FilterStatus = "ALL" | "ACTIVE" | "COMPLETED";