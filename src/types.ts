export type Block =
  | { type: 'text'; content?: string }
  | { type: 'image'; src?: string; alt?: string }
  | { type: 'video'; src?: string };

export interface Blog {
  id?: string;
  title: string;
  content?: string;
  createdAt?: Date | null;
  slug: string;
  image?: string | null;
  alt?: string | null;
  excerpt?: string;
  blocks: Block[];
}

