import axios from 'axios';

export async function atualizarReceita(id, formData) {
  const response = await axios.put(`http://backend-pi-20-production.up.railway.app:8080/receitas/${id}/update`, formData, {
    headers: {
    },
  });

  return response.data;
}

export async function buscarReceita(id) {
    const response = await axios.get(`http://backend-pi-20-production.up.railway.app:8080/receitas/${id}`);
    return response.data;
}

export function deletarReceita(id) {
    axios.delete(`http://backend-pi-20-production.up.railway.app:8080/receitas/${id}`);
}
  
