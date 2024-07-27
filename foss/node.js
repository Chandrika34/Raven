const express = require('express');
const app = express();
app.use(express.json());

let channels = [
  { id: 1, name: 'Channel 1', type: 'private' },
  { id: 2, name: 'Channel 2', type: 'private' },
  // Add more channels
];

app.get('/api/channels', (req, res) => {
  res.json(channels);
});

app.put('/api/channels/:id', (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  channels = channels.map(channel =>
    channel.id == id ? { ...channel, type } : channel
  );
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
