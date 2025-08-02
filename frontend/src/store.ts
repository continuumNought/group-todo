import { create } from 'zustand';

type State = {
  message: string;
  token: string | null;
  listId: number | null;
  setToken: (token: string) => void;
  setListId: (id: number) => void;
};

export default create<State>((set) => ({
  message: 'Hello React!',
  token: null,
  listId: null,
  setToken: (token) => set({ token }),
  setListId: (id) => set({ listId: id }),
}));
