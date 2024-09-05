import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import React from 'react';
import LivroList from './LivroList';

// Mockando fetch API
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('renders LivroList component', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => [
      { id: 1, titulo: 'Livro A', autor: 'Autor A' },
      { id: 2, titulo: 'Livro B', autor: 'Autor B' }
    ]
  });

  render(<LivroList />);
  
  // Verifica se o título da página está presente
  expect(screen.getByText('Lista de Livros')).toBeInTheDocument();

  // Verifica se os livros são carregados
  await waitFor(() => {
    expect(screen.getByText('Livro A - Autor A')).toBeInTheDocument();
    expect(screen.getByText('Livro B - Autor B')).toBeInTheDocument();
  });
});

test('adds a new book', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => []
  });

  fetch.mockResolvedValueOnce({
    json: async () => ({ id: 3, titulo: 'Livro C', autor: 'Autor C' })
  });

  render(<LivroList />);
  
  // Adiciona um novo livro
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Livro C' } });
    fireEvent.change(screen.getByLabelText('Autor'), { target: { value: 'Autor C' } });
    fireEvent.click(screen.getByText('Salvar'));
  });
  
  // Verifica se o novo livro foi adicionado
  await waitFor(() => {
    expect(screen.getByText('Livro C - Autor C')).toBeInTheDocument();
  });
});

test('edits an existing book', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => [
      { id: 1, titulo: 'Livro C', autor: 'Autor C' }
    ]
  });

  fetch.mockResolvedValueOnce({
    json: async () => ({ id: 1, titulo: 'Livro D', autor: 'Autor D' })
  });

  render(<LivroList />);
  
  // Edita o livro adicionado
  await act(async () => {
    await waitFor(() => fireEvent.click(screen.getByLabelText('edit'))); // Seleciona o botão de editar
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Livro D' } });
    fireEvent.change(screen.getByLabelText('Autor'), { target: { value: 'Autor D' } });
    fireEvent.click(screen.getByText('Atualizar'));
  });

  
  // Verifica se o livro foi atualizado
  await waitFor(() => {
    expect(screen.getByText('Livro D - Autor D')).toBeInTheDocument();
  });
});

test('deletes a book', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => [
      { id: 1, titulo: 'Livro C', autor: 'Autor C' }
    ]
  });

  fetch.mockResolvedValueOnce({
    json: async () => ({})
  });

  render(<LivroList />);
  
  // Exclui o livro
  await act(async () => {
    await waitFor(() => fireEvent.click(screen.getByLabelText('delete')));
  });


  // Verifica se o livro foi removido, aguardando a atualização do DOM
  await waitFor(() => {
    expect(screen.queryByText('Livro C - Autor C')).not.toBeInTheDocument();
  }, { timeout: 5000 });
});
