import axios from 'axios';

export async function salvarReceita(formData) {
  const response = await axios.post('https://backend-pi-20-production.up.railway.app/receitas/save', formData, {
    headers: {
    },
  });

  return response.data;
}
