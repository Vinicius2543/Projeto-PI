import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarReceita, atualizarReceita, deletarReceita } from '../services/recipeEditService';
import styles from '../styles/recipeForm.module.css';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useTheme } from '../context/ThemeContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function RecipeEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [receita, setReceita] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepMethod, setPrepMethod] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [category, setCategory] = useState('');
  const [recipeType, setRecipeType] = useState('');
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState(['']);

  useEffect(() => {
    async function carregarReceita() {
      try {
        const dados = await buscarReceita(id);
        setReceita(dados);
        setTitle(dados.nome || '');
        setDescription(dados.descricao || '');
        setPrepMethod(dados.modoPreparo || '');
        setPrepTime(dados.tempoPreparo || '');
        setCategory(dados.categoria || '');
        setRecipeType(dados.tipo || '');
        setIngredients(dados.ingredientes ? dados.ingredientes.split(', ') : ['']);
        setImage(dados.imagemUrl || null);
      } catch {
        toast.error('Erro ao carregar receita');
        navigate('/');
      }
    }
    carregarReceita();
  }, [id, navigate]);

  const handleAddIngredient = () => setIngredients([...ingredients, '']);
  const handleRemoveIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };
  const handleRecipeTypeChange = (e) => setRecipeType(e.target.value);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };
  const handleBack = () => navigate('/');

  const handleDeleteRecipe = () => {
    if (!receita?.id) return;
    confirmAlert({
      title: 'Remover receita',
      message: 'Tem certeza que deseja deletar esta receita?',
      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            try {
              await deletarReceita(receita.id);
              toast.success('Receita deletada com sucesso!');
              setTimeout(() => {
                navigate('/');
                window.location.reload();
              }, 2000);
            } catch {
              toast.error('Erro ao deletar receita');
            }
          }
        },
        { label: 'Cancelar', onClick: () => {} }
      ]
    });
  };

  const handleSubmit = async () => {
    const receitaAtualizada = {
      id: receita.id,
      nome: title,
      ingredientes: ingredients.join(', '),
      descricao: description,
      modoPreparo: prepMethod,
      tempoPreparo: parseInt(prepTime, 10),
      categoria: category,
      tipo: recipeType,
      imagemUrl: receita.imagemUrl
    };

    const formData = new FormData();
    formData.append('recipe', new Blob([JSON.stringify(receitaAtualizada)], { type: 'application/json' }));
    if (imageFile) formData.append('image', imageFile);

    try {
      await atualizarReceita(receita.id, formData);
      toast.success('Receita atualizada com sucesso!');
      navigate('/');
    } catch {
      toast.error('Erro ao atualizar receita!');
    }
  };

  // ---------------- PDF ----------------
  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(title, 10, 20);

    let yOffset = 30;

    // Adiciona imagem
    if (image) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = typeof image === 'string' && !image.startsWith('blob') ? `https://backend-pi-20-production.up.railway.app${image}` : image;
        await new Promise((resolve) => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = 180;
            const pdfHeight = (img.height * pdfWidth) / img.width;
            doc.addImage(imgData, 'PNG', 15, yOffset, pdfWidth, pdfHeight);
            yOffset += pdfHeight + 10;
            resolve();
          };
        });
      } catch (e) {
        console.error('Erro ao adicionar imagem ao PDF', e);
      }
    }

    // Ingredientes
    doc.setFontSize(16);
    doc.text('Ingredientes:', 10, yOffset);
    yOffset += 8;
    ingredients.forEach((ing) => {
      doc.setFontSize(14);
      doc.text(`- ${ing}`, 12, yOffset);
      yOffset += 6;
    });
    yOffset += 5;

    // Modo de preparo
    doc.setFontSize(16);
    doc.text('Modo de Preparo:', 10, yOffset);
    yOffset += 8;
    doc.setFontSize(14);
    const splitPrep = doc.splitTextToSize(prepMethod, 180);
    doc.text(splitPrep, 12, yOffset);
    yOffset += splitPrep.length * 6 + 5;

    doc.text(`Categoria: ${category}`, 10, yOffset);
    yOffset += 6;
    doc.text(`Tipo: ${recipeType}`, 10, yOffset);
    yOffset += 6;
    doc.text(`Tempo de Preparo: ${prepTime} min`, 10, yOffset);

    doc.save(`${title}.pdf`);
  };

  // ---------------- JSX ----------------
  return (
    <div className={`${styles.recipeContainer} ${dark ? styles.recipeContainerDark : ''}`}>
      <h1>Editar Receita</h1>

      <div className={styles.formRow}>
        <div className={styles.leftColumn}>
          <div className={styles.inputWrapper}>
            <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className={dark ? styles.inputDark : ''} />
          </div>
          <div className={styles.inputWrapperDescription}>
            <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} className={dark ? styles.inputDark : ''} />
          </div>
          <div className={styles.inputWrapper}>
            <input type="number" placeholder="Tempo de Preparo (min)" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} className={dark ? styles.inputDark : ''} />
          </div>
          <div className={styles.inputWrapper}>
            <input type="text" placeholder="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} className={dark ? styles.inputDark : ''} />
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.recipeTypeLabel}>Tipo de Receita</label>
            <div className={styles.radioGroup}>
              <label><input type="radio" value="própria" checked={recipeType === 'própria'} onChange={handleRecipeTypeChange} /> Própria</label>
              <label><input type="radio" value="tradicional" checked={recipeType === 'tradicional'} onChange={handleRecipeTypeChange} /> Tradicional</label>
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.imageUploadContainer}>
            <div className={styles.imagePreviewWrapper}>
              {image && <img src={typeof image === 'string' && !image.startsWith('blob') ? `https://backend-pi-20-production.up.railway.app${image}` : image} alt="Preview" className={styles.imagePreview} />}
            </div>
            <input className={styles.inputWrapper} type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>
      </div>

      {/* Ingredientes */}
      <h2>Ingredientes</h2>
      {ingredients.map((ingredient, index) => (
        <div key={index} className={styles.ingredientRow}>
          <input type="text" placeholder="Ingrediente" value={ingredient} onChange={(e) => handleIngredientChange(index, e.target.value)} className={dark ? styles.inputDark : ''} />
          <button type="button" className={styles.removeButton} onClick={() => handleRemoveIngredient(index)}><FaTrash /></button>
        </div>
      ))}
      <button type="button" className={styles.addButton} onClick={handleAddIngredient}><FaPlus /> Adicionar Ingrediente</button>

      {/* Preparo */}
      <h2>Modo de Preparo</h2>
      <div className={styles.inputWrapperPrepareMode}>
        <input type="text" placeholder="Digite aqui o modo de preparo" value={prepMethod} onChange={(e) => setPrepMethod(e.target.value)} className={dark ? styles.inputDark : ''} />
      </div>

      {/* Botões */}
      <div className={styles.buttonContainer}>
        <button className={dark ? styles.backButtonDark : styles.backButton} onClick={handleBack}>Voltar</button>
        <button className={styles.submitButton} type="button" onClick={handleSubmit}>Salvar Alterações</button>
        <button className={styles.submitButton} type="button" onClick={generatePDF}>Gerar PDF</button>
        <button className={styles.deleteButton} type="button" onClick={handleDeleteRecipe}><FaTrash /></button>
      </div>
    </div>
  );
}

export default RecipeEditForm;
