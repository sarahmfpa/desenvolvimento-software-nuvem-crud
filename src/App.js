import React, { useState, useEffect } from 'react';
import './App.css';
import Parse from "parse/dist/parse.min.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import banner from './assets/banner.jpg'

//Back4App
const app_id = process.env.REACT_APP_PARSE_APP_ID;
const host_url = process.env.REACT_APP_PARSE_HOST_URL;
const javascript_key = process.env.REACT_APP_PARSE_JAVASCRIPT_KEY;
Parse.initialize(app_id, javascript_key);
Parse.serverURL = host_url;

function App() {
  //STATES
  const [makes, setMakes] = useState([]);
  const [newMakeId, setNewMakeId] = useState('');
  const [newMakeName, setNewMakeName] = useState('');
  const [newMakeBrand, setNewMakeBrand] = useState('');
  const [newMakeColor, setNewMakeColor] = useState('');
  const [newMakeCategory, setNewMakeCategory] = useState('');
  const [display, setDisplay] = useState(false)

  //READ
  const fetchAllMakes = async () => {
    try {
      const query = new Parse.Query("makes")
      const allMakes = await query.find()
      setMakes(allMakes)
    } catch (error) {
      console.error('Erro na requisição:', error)
    }
  };

  //CREATE
  const createMake = async () => {
    let Makes = new Parse.Object('makes')
    Makes.set('name', newMakeName)
    Makes.set('color', newMakeColor)
    Makes.set('category', newMakeCategory)
    Makes.set('brand', newMakeBrand)
    try {
      await Makes.save()
      fetchAllMakes()
    } catch (error) { 
      alert('Erro na criação:', error)
    };
  }

  //UPDATE
  const updateMake = async function (makeId) {
    let Makes = new Parse.Object('makes');
    Makes.set('objectId', makeId);
    Makes.set('name', newMakeName)
    Makes.set('color', newMakeColor)
    Makes.set('category', newMakeCategory)
    Makes.set('brand', newMakeBrand)
    try {
      await Makes.save();
    } catch (error) {
      alert('Erro na atualização:', error)
    };
  };

  //DELETE
  const deleteMake = async function (makeId) {
    const Makes = new Parse.Object('makes');
    Makes.set('objectId', makeId);
    try {
      await Makes.destroy();
      fetchAllMakes();
    } catch (error) {
      alert('Erro ao apagar:', error)
    };
  };

  //LIMPEZA DE CAMPOS
  const clearFields = () => {
    setNewMakeId('')
    setNewMakeName('')
    setNewMakeColor('')
    setNewMakeBrand('')
    setNewMakeCategory('')
  }

  //EDIT FORM
  const editForm = (item) => {
    setNewMakeId(item.id)
    setNewMakeName(item.get('name'))
    setNewMakeColor(item.get('color'))
    setNewMakeBrand(item.get('brand'))
    setNewMakeCategory(item.get('category'))
  }

  useEffect(() => {
    fetchAllMakes();
  }, []);

  return (
    <div className="app-container">
      <header>
        <div className="banner">
          <img src={banner} alt="Banner" />
        </div>
        <h1>Makes</h1>
      </header>
      <main>
        {display && 
          <form onSubmit={(e) => {
            if(newMakeId){
              updateMake(newMakeId)
              e.preventDefault();
              clearFields()
              setDisplay(false)
            }else{
              createMake()
              e.preventDefault();
              clearFields()
              setDisplay(false)
            } 
          }}>
            <input required type="text" placeholder="Nome" value={newMakeName} onChange={(e) => setNewMakeName(e.target.value)} />
            <input required type="text" placeholder="Marca" value={newMakeBrand} onChange={(e) => setNewMakeBrand(e.target.value)} />
            <input required type="text" placeholder="Cor" value={newMakeColor} onChange={(e) => setNewMakeColor(e.target.value)} />
            <input required type="text" placeholder="Categoria" value={newMakeCategory} onChange={(e) => setNewMakeCategory(e.target.value)} />
            <div className="button-group">
              <button type="button" onClick={() => setDisplay(false)}>Cancelar</button>
              <button type="submit">Salvar</button>
            </div>
          </form>
        }

        {!display &&
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Marca</th>
                <th>Cor</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {makes.map(make => (
                <tr key={make.id}>
                  <td>{make.get('name')}</td>
                  <td>{make.get('brand')}</td>
                  <td>{make.get('color')}</td>
                  <td>{make.get('category')}</td>
                  <td>
                    <div className="action-buttons">
                      <button className='edit-button' alt="Editar" onClick={() => [setDisplay(true), editForm(make)]}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className='delete-button' alt="Apagar" onClick={() => deleteMake(make.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </main>

      {/* Botão Flutuante para criação de novo item */}
      <button className="fab" onClick={() => setDisplay(!display)}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}

export default App;
