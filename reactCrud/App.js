import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:3000/api/data')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  };

  const addData = () => {
    axios.post('http://localhost:3000/api/data', { name, description })
      .then(response => {
        console.log(response.data);
        fetchData();
        setName('');
        setDescription('');
      })
      .catch(error => console.error(error));
  };

  const updateData = (id, newData) => {
    axios.put(`http://localhost:3000/api/data/${id}`, newData, { timeout: 5000 })
      .then(response => {
        console.log('Full Axios Response:', response);
        fetchData();
        setEditingId(null);
      })
      .catch(error => {
        console.error('Full Axios Error:', error);
      });
  };

  const deleteData = (id) => {
    console.log(`Deleting data with id: ${id}`);
    axios.delete(`http://localhost:3000/api/data/${id}`)
      .then(response => {
        console.log(response.data);
        fetchData();
      })
      .catch(error => console.error(error));
  };

  const startEditing = (item) => {
    setName(item.name);
    setDescription(item.description);
    setEditingId(item.id);
  };

  return (
    <View>
      <Text>Data List:</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
            <Button title="Edit" onPress={() => startEditing(item)} />
            <Button title="Delete" onPress={() => deleteData(item.id)} />
          </View>
        )}
      />
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={text => setDescription(text)}
      />
      
      {editingId ? (
        <Button title="Update" onPress={() => updateData(editingId, { name, description })} />
      ) : (
        <Button title="Add Data" onPress={addData} />
      )}
    </View>
  );
};

export default App;
