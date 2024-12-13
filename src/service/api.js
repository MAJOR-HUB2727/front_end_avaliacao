import axios from 'axios';

// Cria uma instância do Axios para a configuração centralizada
const api = axios.create({
  baseURL: 'http://localhost:3000', // URL da sua API
  timeout: 5000, // Tempo de espera (5 segundos)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// Função para buscar os clientes
export const getClientes = async () => {
  try {
    const response = await api.get('/clientes'); // Altere para o endpoint correto
    return response.data; // Retorna os dados recebidos da API
  } catch (error) {
    // Log de erro no console
    console.error('Erro ao buscar os clientes:', error);

    // Tratamento do erro para retornar uma mensagem mais amigável
    if (error.response) {
      // A resposta foi recebida, mas o servidor retornou um código de erro
      throw new Error(`Erro na requisição: ${error.response.status} - ${error.response.data.message}`);
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta
      throw new Error('Erro na requisição: O servidor não respondeu.');
    } else {
      // Erro ao configurar a requisição
      throw new Error(`Erro desconhecido: ${error.message}`);
    }
  }
};
