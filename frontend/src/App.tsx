import { useEffect } from 'react';
import useStore from './store';

function App() {
  const token = useStore((state) => state.token);
  const setToken = useStore((state) => state.setToken);

  useEffect(() => {
    const urlToken = window.location.pathname.slice(1);
    if (urlToken) {
      setToken(urlToken);
    }
  }, [setToken]);

  const handleClick = async () => {
    const response = await fetch('/api/lists/', { method: 'POST' });
    const data = await response.json();
    setToken(data.token);
    window.history.pushState(null, '', `/${data.token}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      {!token && (
        <button onClick={handleClick}>Get Busy!</button>
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
