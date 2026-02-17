import { useState } from 'react';
import { IconPicker } from './IconPicker';
import { deleteDeck, updateDeck } from '../../lib/api';



export const EditDeckForm = ({ 
  initialName, 
  initialIcon, 
  id,
  card_count,
  closeModal,
  setNewData
}: { 
  initialName: string, 
  initialIcon: string, 
  id: number,
  card_count: string,
  closeModal:()=> void,
  setNewData: (data)=>void,
}) => {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const submitDeck = async () => {
    setLoading(true);
    if(name === initialName &&  icon === initialIcon){
      setError("make a change first!")
      setLoading(false);
      return;
    }
    try {
      const response = await updateDeck({id, name, icon})
      if (response.error){
        setError(response?.error)
        return;
      }
      if(response.status === 200){
        setNewData((prev)=>{
          const temp = prev.map(item=>{
            if (item.id === id){
              return {...item, name, icon, card_count}
            }
            return item
          })
          return temp;
        })
        closeModal()
      }
    }catch(err){
      setError(err)
      console.error("Error while submit: ", err)
    }finally{
      setLoading(false)
    }
  }

  const onDeleteDeck = async ()=>{
        setLoading(true);
        try{
          if(!id) {
            setError("No Id found!")
            return
          }
           const response = await deleteDeck(id)
           if (response.error){
            setError(response.error)
            return;
           }
           if (response.status === 200){
              alert("Deck deleted successfully!")
              setNewData(prev => prev.filter(item => item.id !== id))
              closeModal();
           }
        }catch(err){
          setError(err)
          console.error("Error while submit:", err)
        }finally {
          setLoading(false);
        }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deck Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
          className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Update Icon</label>
        <IconPicker 
          selected={icon} 
          onSelect={(value)=>{
              setIcon(value);
              setError('')
            }}/>
      </div>

       {error && 
          <div>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        }

      <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={submitDeck}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          {loading ? "Saving":"Save Changes"}
        </button>
        
        <button
          onClick={() => {
            if (window.confirm("Are you sure? This will delete all cards in this deck.")) {
              onDeleteDeck();
            }
          }}
          className="w-full bg-red-50 text-red-600 py-2 rounded-xl font-medium hover:bg-red-100 transition-all"
        >
          Delete Deck
        </button>
      </div>
    </div>
  );
};