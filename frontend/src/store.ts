import { create } from 'zustand';

type State = {
  message: string;
};

export default create<State>(() => ({
  message: 'Hello React!'
}));
