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
 * Componente LivroList - Lista de Livros com funcionalidade CRUD (Create, Read, Update, Delete).
 * Este componente permite adicionar, editar e remover livros de uma lista.
 */
function LivroList() {
  const [livros, setLivros] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [editId, setEditId] = useState(null);

  // Carregar os livros do backend na inicialização
  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtém o token do localStorage
  
    fetch('http://localhost:8080/api/livros', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Falha na autenticação');
        }
        return response.json();
      })
      .then(data => setLivros(data))
      .catch(error => console.error('Erro ao buscar livros:', error));
  }, []);
  

  // Função para salvar um novo livro ou atualizar um existente
  const handleSave = () => {
    const livro = { titulo, autor };
  
    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `http://localhost:8080/api/livros/${editId}`
      : 'http://localhost:8080/api/livros';
  
    const token = localStorage.getItem('token'); // Obtém o token do localStorage
  
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Adiciona o token no cabeçalho
      },
      body: JSON.stringify(livro),
    })
      .then(response => response.json())
      .then(data => {
        setLivros(prevLivros => {
          if (editId) {
            return prevLivros.map(livro =>
              livro.id === editId ? data : livro
            );
          } else {
            return [...prevLivros, data];
          }
        });
        setTitulo('');  // Limpa o título após salvar
        setAutor('');   // Limpa o autor após salvar
        setEditId(null); // Reseta o estado de edição
      })
      .catch(error => console.error('Erro ao salvar livro:', error));
  };

  // Função para editar um livro (preencher o formulário com os dados do livro selecionado)
  const handleEdit = (livro) => {
    setTitulo(livro.titulo);
    setAutor(livro.autor);
    setEditId(livro.id);
  };

// Função para excluir um livro da lista
const handleDelete = (id) => {
  const token = localStorage.getItem('token'); // Obtém o token do localStorage
  
  fetch(`http://localhost:8080/api/livros/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
    }
  })
    .then(() => {
      setLivros(livros.filter(livro => livro.id !== id));
    })
    .catch(error => console.error('Erro ao deletar livro:', error));
};

  return (
    <Container sx={{ paddingTop: '80px' }}>
      <h1>Lista de Livros</h1>
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Título"
          variant="outlined"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Autor"
          variant="outlined"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          {editId ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>
      <List>
        {livros.map(livro => (
          <ListItem key={livro.id} divider>
            <ListItemText primary={`${livro.titulo} - ${livro.autor}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(livro)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(livro.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default LivroList;
