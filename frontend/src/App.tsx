import { useCallback } from 'react';
import useStore from './store';

function App() {
  const message = useStore((state) => state.message);
  const token = useStore((state) => state.token);
  const setToken = useStore((state) => state.setToken);

  const createList = useCallback(async () => {
    const response = await fetch('/api/lists/', { method: 'POST' });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setToken(data.token);
    window.history.pushState({}, '', `/${data.token}`);
  }, [setToken]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      {!token && (
        <button onClick={createList}>Get Busy!</button>
      )}
      {token && (
        <ul>
          <li>Under Construction</li>
        </ul>
      )}
    </div>
  );
}

export default App;
