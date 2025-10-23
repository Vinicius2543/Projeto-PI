import axios from 'axios';

export async function salvarReceita(formData) {
  const response = await axios.post('http://backend-pi-20-production.up.railway.app:8080/receitas/save', formData, {
    headers: {
    },
  });

  return response.data;
}
