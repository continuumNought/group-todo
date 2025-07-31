import { create } from 'zustand';

type State = {
  message: string;
  token: string | null;
  setToken: (token: string) => void;
};

export default create<State>((set) => ({
  message: 'Hello React!',
  token: null,
  setToken: (token: string) => set({ token })
}));
