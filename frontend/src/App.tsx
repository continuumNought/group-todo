import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import useStore from './store';

function App() {
  const token = useStore((state) => state.token);
  const listId = useStore((state) => state.listId);
  const setToken = useStore((state) => state.setToken);
  const setListId = useStore((state) => state.setListId);
  const [items, setItems] = useState<
    { id: number; text: string; is_completed: boolean }[]
  >([]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    const urlToken = window.location.pathname.slice(1);
    if (urlToken) {
      setToken(urlToken);
    }
  }, [setToken]);

  const fetchItems = () => {
    if (token) {
      fetch(`/api/lists/${token}/items/`)
        .then((res) => res.json())
        .then((data) => setItems(data));
    }
  };

  useEffect(() => {
    if (!token) return;
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(
      `${protocol}://${window.location.host}/ws/todos/${token}/`
    );
    socket.onmessage = () => fetchItems();
    return () => socket.close();
  }, [token]);

  useEffect(() => {
    if (token) {
      fetch(`/api/lists/${token}/`)
        .then((res) => res.json())
        .then((data) => setListId(data.id));
      fetchItems();
    }
  }, [token, setListId]);

  const handleClick = async () => {
    const response = await fetch('/api/lists/', { method: 'POST' });
    const data = await response.json();
    setToken(data.token);
    setListId(data.id);
    window.history.pushState(null, '', `/${data.token}`);
  };

  const handleAdd = async () => {
    if (!newItemText.trim() || !listId) return;
    await fetch('/api/items/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ list: listId, text: newItemText }),
    });
    setNewItemText('');
    fetchItems();
  };

  const handleToggle = async (id: number, isCompleted: boolean) => {
    await fetch(`/api/items/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_completed: !isCompleted }),
    });
    fetchItems();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/items/${id}/`, { method: 'DELETE' });
    fetchItems();
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
              <Checkbox
                checked={item.is_completed}
                onChange={() => handleToggle(item.id, item.is_completed)}
              />
              <ListItemText primary={item.text} />
              <IconButton
                onClick={() => handleDelete(item.id)}
                sx={{ color: 'red', marginLeft: 'auto' }}
              >
                -
              </IconButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <IconButton onClick={handleAdd}>+</IconButton>
            <TextField
              variant="standard"
              placeholder="Add an item"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdd();
                }
              }}
            />
          </ListItem>
        </List>
      )}
    </Box>
  );
}

export default App;
