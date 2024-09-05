import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import React from 'react';
import UsuarioList from './UsuarioList';

// Mockando fetch API
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('renders UsuarioList component', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => [
      { id: 1, nome: 'Usuário A', email: 'usuarioa@example.com' },
      { id: 2, nome: 'Usuário B', email: 'usuariob@example.com' }
    ]
  });

  render(<UsuarioList />);
  
  // Verifica se o título da página está presente
  expect(screen.getByText('Lista de Usuários')).toBeInTheDocument();

  // Verifica se os usuários são carregados
  await waitFor(() => {
    expect(screen.getByText('Usuário A - usuarioa@example.com')).toBeInTheDocument();
    expect(screen.getByText('Usuário B - usuariob@example.com')).toBeInTheDocument();
  });
});

test('adds a new user', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => []
  });

  fetch.mockResolvedValueOnce({
    json: async () => ({ id: 3, nome: 'Usuário C', email: 'usuarioc@example.com' })
  });

  render(<UsuarioList />);
  
  // Adiciona um novo usuário
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Usuário C' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'usuarioc@example.com' } });
    fireEvent.click(screen.getByText('Salvar'));
  });
  
  // Verifica se o novo usuário foi adicionado
  await waitFor(() => {
    expect(screen.getByText('Usuário C - usuarioc@example.com')).toBeInTheDocument();
  });
});

test('edits an existing user', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => [
      { id: 1, nome: 'Usuário C', email: 'usuarioc@example.com' }
    ]
  });

  fetch.mockResolvedValueOnce({
    json: async () => ({ id: 1, nome: 'Usuário D', email: 'usuariod@example.com' })
  });

  render(<UsuarioList />);
  
  // Edita o usuário adicionado
  await act(async () => {
    await waitFor(() => fireEvent.click(screen.getByLabelText('edit'))); // Seleciona o botão de editar
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Usuário D' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'usuariod@example.com' } });
    fireEvent.click(screen.getByText('Atualizar'));
  });

  // Verifica se o usuário foi atualizado
  await waitFor(() => {
    expect(screen.getByText('Usuário D - usuariod@example.com')).toBeInTheDocument();
  });
});

test('deletes a user', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => [
      { id: 1, nome: 'Usuário C', email: 'usuarioc@example.com' }
    ]
  });

  fetch.mockResolvedValueOnce({
    json: async () => ({})
  });

  render(<UsuarioList />);
  
  // Exclui o usuário
  await act(async () => {
    await waitFor(() => fireEvent.click(screen.getByLabelText('delete')));
  });

  // Verifica se o usuário foi removido, aguardando a atualização do DOM
  await waitFor(() => {
    expect(screen.queryByText('Usuário C - usuarioc@example.com')).not.toBeInTheDocument();
  }, { timeout: 5000 });
});
