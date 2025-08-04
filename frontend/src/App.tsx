import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import useStore from './store';

function App() {
  const token = useStore((state) => state.token);
  const listId = useStore((state) => state.listId);
  const setToken = useStore((state) => state.setToken);
  const setListId = useStore((state) => state.setListId);
  const [items, setItems] = useState<
    {
      id: number;
      text: string;
      description: string | null;
      is_completed: boolean;
    }[]
  >([]);
  const [newItemText, setNewItemText] = useState('');
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [editing, setEditing] = useState<Record<number, boolean>>({});
  const [descriptions, setDescriptions] = useState<Record<number, string>>({});

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

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startEdit = (id: number, current: string | null) => {
    setEditing((prev) => ({ ...prev, [id]: true }));
    setDescriptions((prev) => ({ ...prev, [id]: current || '' }));
  };

  const saveDescription = async (id: number) => {
    await fetch(`/api/items/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: descriptions[id] }),
    });
    setEditing((prev) => ({ ...prev, [id]: false }));
    fetchItems();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ mb: 4, fontWeight: 'bold', color: 'common.white' }}
        >
          ToDone!
        </Typography>
        {!token && (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClick}
            >
              Get Busy!
            </Button>
            <Typography
              variant="body1"
              sx={{ mt: 4, color: 'common.white' }}
            >
              Click "Get Busy!" to create a new shared list. Add tasks with the
              + button, expand items to add details, and check them off when
              you're done.
            </Typography>
          </>
        )}
        {token && (
          <Paper
            elevation={3}
            sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'rgba(255,255,255,0.9)' }}
          >
            <List sx={{ width: '100%' }}>
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  disablePadding
                  sx={{ flexDirection: 'column', alignItems: 'stretch' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Checkbox
                      checked={item.is_completed}
                      onChange={() => handleToggle(item.id, item.is_completed)}
                    />
                    <ListItemText primary={item.text} />
                    <IconButton
                      onClick={() => toggleExpand(item.id)}
                      sx={{ marginLeft: 'auto' }}
                    >
                      {expanded[item.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                  <Collapse in={!!expanded[item.id]} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 2 }}>
                      {editing[item.id] ? (
                        <TextField
                          fullWidth
                          multiline
                          variant="standard"
                          value={descriptions[item.id] || ''}
                          onChange={(e) =>
                            setDescriptions({
                              ...descriptions,
                              [item.id]: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Typography>{item.description}</Typography>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {editing[item.id] ? (
                          <IconButton onClick={() => saveDescription(item.id)}>
                            <SaveIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => startEdit(item.id, item.description)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={() => handleDelete(item.id)}
                          sx={{ color: 'red' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Collapse>
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
                  fullWidth
                  sx={{ ml: 1 }}
                />
              </ListItem>
            </List>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default App;
