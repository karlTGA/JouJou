export default interface Entry {
  readonly entry_id: number;
  title: string;
  date: string;
  location: string;
  isPublic: boolean;
  content: string;
}
