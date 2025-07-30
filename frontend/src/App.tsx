import useStore from './store';

function App() {
  const message = useStore((state) => state.message);
  return <h1>{message}</h1>;
}

export default App;
