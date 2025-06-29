export interface MemoInterface {
  _id: string;
  user_id: string;
  folder_id: string | null;
  title: string;
  text: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FolderInterface {
  _id: string;
  user_id: string;
  folder_name: string;
}
