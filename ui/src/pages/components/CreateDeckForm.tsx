import { useState } from 'react';
import { IconPicker } from './IconPicker';
import { createDeck } from '../../lib/api';


export const CreateDeckForm = (
  {
    closeModal, setNewData}:{
    closeModal: ()=>void,
    setNewData: (data)=>void}
  ) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState('book');
  const [error, setError] = useState('');


  const submitDeck = async () => {
      setLoading(true)
        if(name === "" || icon === ""){
          setError("Field still empty!!");
          setLoading(false)
          return;
        }
        try{
          const response = await createDeck({name, icon})
          if (response.error){
            setError(response?.error)
            return;
          }
          if (response.status === 200){
            setNewData((prev)=>[...prev, {id:response.data.id, name:name, icon:icon, card_count:'0'}])
            closeModal()
          }
        }catch(err){
            setError(err)
            console.error("Error in submit: ", err)
        }finally{
          setLoading(false)
        }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Deck Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. Spanish Basics"
          autoFocus
        />
      </div>
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Icon</label>
        <IconPicker selected={icon} onSelect={setIcon} />
      </div>

      {error && 
      <div>
        <p className="text-xs text-red-500">{error}</p>
      </div>}

      <button
        onClick={() => submitDeck()}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
       {loading ? "Saving" : "Save Deck" }
      </button>
    </div>
  );
};

