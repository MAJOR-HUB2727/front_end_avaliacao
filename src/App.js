import React, { useState, useEffect } from 'react';
import './App.css';  // Estilos globais, se necessário
import api from './service/api'; // Importe a instância do Axios

function App() {
  const [clientes, setClientes] = useState([]);
  const [academias, setAcademias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Estado para armazenar dados do novo cliente
  const [novoCliente, setNovoCliente] = useState({
    cpf: '',
    nome: '',
    peso: '',
    altura: '',
    idade: '',
    estilo: '',
    academiaId: '',
  });

  // Função para carregar os dados dos clientes e academias
  useEffect(() => {
    // Requisição para obter os clientes
    api.get('/clientes')
      .then(response => setClientes(response.data))
      .catch(error => console.error('Erro ao buscar clientes:', error));

    // Requisição para obter as academias
    api.get('/academias')
      .then(response => setAcademias(response.data))
      .catch(error => console.error('Erro ao buscar academias:', error));
  }, []);

  // Função de filtro de pesquisa
  const buscarClientes = (e) => {
    setSearchTerm(e.target.value);
  };

  // Função para exibir clientes filtrados
  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para exibir o modal de cadastro
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // Função para atualizar os dados do novo cliente
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoCliente({ ...novoCliente, [name]: value });
  };

  // Função para adicionar um cliente
  const adicionarCliente = (e) => {
    e.preventDefault(); // Impede o comportamento padrão de envio do formulário
  
    // Validações básicas para garantir que todos os campos obrigatórios estão preenchidos
    const { cpf, nome, peso, altura, idade, estilo, academiaId } = novoCliente;
    if (!cpf || !nome || !peso || !altura || !idade || !estilo || !academiaId) {
      console.error('Preencha todos os campos obrigatórios.');
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
  
    // Envia os dados para a API usando Axios
    api.post('/clientes', novoCliente)
      .then(response => {
        console.log('Cliente adicionado com sucesso:', response.data);
        setClientes(prevClientes => [...prevClientes, response.data]); // Adiciona o novo cliente à lista de clientes
        toggleModal(); // Fecha o modal após o envio
        setNovoCliente({ // Limpa os campos após o envio
          cpf: '',
          nome: '',
          peso: '',
          altura: '',
          idade: '',
          estilo: '',
          academiaId: '',
        });
      })
      .catch(error => {
        console.error('Erro ao adicionar cliente:', error);
        alert('Erro ao adicionar cliente. Verifique os dados e tente novamente.');
      });
  };
  

  return (
    <div className="App">
      <h1>Body Builders</h1>
      <button onClick={toggleModal}>Adicionar</button>

      <div className="search-container">
        <input
          type="text"
          placeholder="Digite qualquer palavra para pesquisa"
          onChange={buscarClientes}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Academia</th>
            <th>CPF</th>
            <th>Nome</th>
            <th>Peso</th>
            <th>Altura</th>
            <th>Idade</th>
            <th>Estilo BodyBuilder</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredClientes.map((cliente, index) => (
            <tr key={index}>
              <td>{cliente.academia}</td>
              <td>{cliente.cpf}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.peso}</td>
              <td>{cliente.altura}</td>
              <td>{cliente.idade}</td>
              <td>{cliente.estilo}</td>
              <td><button onClick={() => alert(`Editando cliente ${cliente.nome}`)}>Editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de cadastro de cliente */}
      {modalVisible && (
        <div id="modal">
          <button onClick={toggleModal}>Fechar</button>
          <form onSubmit={adicionarCliente}>
            <div className="form-group">
              <label>CPF</label>
              <input
                type="text"
                name="cpf"
                value={novoCliente.cpf}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                value={novoCliente.nome}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Peso</label>
              <input
                type="number"
                name="peso"
                value={novoCliente.peso}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Altura</label>
              <input
                type="text"
                name="altura"
                value={novoCliente.altura}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Idade</label>
              <input
                type="number"
                name="idade"
                value={novoCliente.idade}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Estilo BodyBuilder</label>
              <select
                name="estilo"
                value={novoCliente.estilo}
                onChange={handleInputChange}
              >
                <option value="1">Monstrão</option>
                <option value="2">Frango</option>
                <option value="3">Chassi de Grilo</option>
                <option value="4">Esquelético</option>
              </select>
            </div>
            <div className="form-group">
              <label>Academias</label>
              <select
                name="academiaId"
                value={novoCliente.academiaId}
                onChange={handleInputChange}
              >
                {academias.map((academia, index) => (
                  <option key={index} value={academia.id}>{academia.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <input type="submit" value="Salvar" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
