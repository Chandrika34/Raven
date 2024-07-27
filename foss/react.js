import React, { useState, useEffect } from 'react';

const ChannelComponent = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    // Fetch channels from the server
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    // Replace with your API call
    const response = await fetch('/api/channels');
    const data = await response.json();
    setChannels(data);
  };

  const changeChannelType = async (channelId, newType) => {
    // Replace with your API call to update the channel type
    await fetch(`/api/channels/${channelId}`, {
      method: 'PUT',
      body: JSON.stringify({ type: newType }),
      headers: { 'Content-Type': 'application/json' }
    });

    // Update the state to reflect the change
    setChannels(prevChannels =>
      prevChannels.map(channel =>
        channel.id === channelId ? { ...channel, type: newType } : channel
      )
    );
  };

  return (
    <div>
      <Modal channels={channels} onChangeChannelType={changeChannelType} />
      <Sidebar channels={channels} />
    </div>
  );
};

const Modal = ({ channels, onChangeChannelType }) => (
  <div className="modal">
    {channels.map(channel => (
      <div key={channel.id}>
        <span>{channel.name}</span>
        <button onClick={() => onChangeChannelType(channel.id, 'public')}>Make Public</button>
      </div>
    ))}
  </div>
);

const Sidebar = ({ channels }) => (
  <div className="sidebar">
    {channels.map(channel => (
      <div key={channel.id}>{channel.name}</div>
    ))}
  </div>
);

export default ChannelComponent;
