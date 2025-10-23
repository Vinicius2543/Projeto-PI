import axios from 'axios';

export async function atualizarReceita(id, formData) {
  const response = await axios.put(`https://backend-pi-20-production.up.railway.app/receitas/${id}/update`, formData, {
    headers: {
    },
  });

  return response.data;
}

export async function buscarReceita(id) {
    const response = await axios.get(`https://backend-pi-20-production.up.railway.app/receitas/${id}`);
    return response.data;
}

export function deletarReceita(id) {
    axios.delete(`https://backend-pi-20-production.up.railway.app/receitas/${id}`);
}
  
