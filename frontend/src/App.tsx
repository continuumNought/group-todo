import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import useStore from './store';

function App() {
  const token = useStore((state) => state.token);
  const setToken = useStore((state) => state.setToken);
  const [items, setItems] = useState<
    { id: number; text: string; is_completed: boolean }[]
  >([]);

  useEffect(() => {
    const urlToken = window.location.pathname.slice(1);
    if (urlToken) {
      setToken(urlToken);
    }
  }, [setToken]);

  useEffect(() => {
    if (token) {
      fetch(`/api/lists/${token}/items/`)
        .then((res) => res.json())
        .then((data) => setItems(data));
    }
  }, [token]);

  const handleClick = async () => {
    const response = await fetch('/api/lists/', { method: 'POST' });
    const data = await response.json();
    setToken(data.token);
    window.history.pushState(null, '', `/${data.token}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      {!token && (
        <Button variant="contained" onClick={handleClick}>
          Get Busy!
        </Button>
      )}
      {token && (
        <List>
          {items.map((item) => (
            <ListItem key={item.id} disablePadding>
              <Checkbox checked={item.is_completed} />
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default App;
