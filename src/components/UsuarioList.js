import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from 'react';

/**
 * Componente UsuarioList - Lista de Usuários com funcionalidade CRUD (Create, Read, Update, Delete).
 * Este componente permite adicionar, editar e remover usuários de uma lista.
 * Ele utiliza dados do backend, com integração via API.
 */
function UsuarioList() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState(null);

  // Carregar os usuários do backend na inicialização
  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtém o token do localStorage
  
    fetch('http://localhost:8080/api/usuarios', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
      }
    })
      .then(response => response.json())
      .then(data => setUsuarios(data))
      .catch(error => console.error('Erro ao buscar usuários:', error));
  }, []);

  // Função para salvar um novo usuário ou atualizar um existente
  const handleSave = () => {
    const usuario = { nome, email };
    const token = localStorage.getItem('token'); // Obtém o token do localStorage
  
    if (editId) {
      // Atualizar um usuário existente
      fetch(`http://localhost:8080/api/usuarios/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
        },
        body: JSON.stringify(usuario),
      })
        .then(response => response.json())
        .then(updatedUsuario => {
          setUsuarios(usuarios.map(usuario => usuario.id === editId ? updatedUsuario : usuario));
          setEditId(null);
          setNome('');
          setEmail('');
        })
        .catch(error => console.error('Erro ao atualizar usuário:', error));
    } else {
      // Criar um novo usuário
      fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
        },
        body: JSON.stringify(usuario),
      })
        .then(response => response.json())
        .then(newUsuario => {
          setUsuarios([...usuarios, newUsuario]);
          setNome('');
          setEmail('');
        })
        .catch(error => console.error('Erro ao salvar usuário:', error));
    }
  };

  // Função para editar um usuário (preencher o formulário com os dados do usuário selecionado)
  const handleEdit = (usuario) => {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setEditId(usuario.id);
  };

  // Função para excluir um usuário da lista
  const handleDelete = (id) => {
    const token = localStorage.getItem('token'); // Obtém o token do localStorage
  
    fetch(`http://localhost:8080/api/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
      }
    })
      .then(() => {
        setUsuarios(usuarios.filter(usuario => usuario.id !== id));
      })
      .catch(error => console.error('Erro ao excluir usuário:', error));
  };

  return (
    <Container sx={{ paddingTop: '80px' }}>
      <h1>Lista de Usuários</h1>
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Nome"
          variant="outlined"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          {editId ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>
      <List>
        {usuarios.map(usuario => (
          <ListItem key={usuario.id} divider>
            <ListItemText primary={`${usuario.nome} - ${usuario.email}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(usuario)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(usuario.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default UsuarioList;
