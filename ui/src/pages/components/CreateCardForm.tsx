import { useState, useEffect } from 'react';
import { VoiceRecorder } from './VoiceRecorder';
import { createCard, updateCard } from '../../lib/api';
import type { Card } from '../deck/DeckDetails';


export const CreateCardForm = (
    {
        card,
        deckId,
        closeModal,
        setNewData
    }: {
        card: Card,
        deckId: any,
        closeModal: () => void,
        setNewData: (data) => void
    }
) => {

    //upload : http://localhost:7777/zz/api/core/space/2/files/upload
    //file?path= : http://localhost:7777/zz/api/core/space/2/files?path=

    const [id, setId] = useState(null)
    const [frontText, setFrontText] = useState('');
    const [backText, setBackText] = useState('');
    const [currentVoice, setCurrentVoice] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recordFlag, setRecordFlag] = useState(false)
    const [recordStatus, setrecordStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    //------------------------------------
    const submitCard = async () => {

        if (frontText === "" || backText === "") {
            setError("Field still empty!!")
            setLoading(false)
            return;
        }
        setLoading(true)

        if (recordStatus === 'recording') {
            setIsSubmitting(true);
            setRecordFlag(true);
            return;
        }

        await executeSave(currentVoice);
    }

    useEffect(() => {
        if (isSubmitting && currentVoice !== '') {
            executeSave(currentVoice);
            setIsSubmitting(false);
        }
    }, [currentVoice, isSubmitting])

    useEffect(()=>{
        if(card?.id){
            setBackText(card.back_text);
            setFrontText(card.front_text);
            setId(card.id)
            setCurrentVoice(card.voice_data)
        }
    }, [card])


    const executeSave = async (voiceData: string) => {
        try {
            const tempHolder = {
                front_text: frontText,
                back_text: backText,
                voice_data: voiceData,
                is_deleted: false,
                deck_id: deckId,
                id:id,
            };

            let response = null;
            if(id){
                response = await updateCard(tempHolder);
                setNewData({
                    data:{
                        front_text:frontText,
                        back_text:backText,
                        id,
                        voice_data:voiceData
                    },
                    action:'updated'
                })
            }else{
                response = await createCard(tempHolder)
                setNewData({
                    data:{
                        front_text:frontText,
                        back_text:backText,
                        id:response.data.id,
                        voice_data:voiceData
                    },
                    action: 'created'
                })
            }
            if (response.status === 200){
                 closeModal()
            }else{ 
                setError(response?.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRecordFlag(false);
        }
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">Adding to Deck ID: {deckId}</p>
            <input
                className="w-full border p-2 rounded"
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                placeholder="Front (e.g. French)" />

            <input
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Back (e.g. English)" />

            <VoiceRecorder onAudioSerialized={(data) => setCurrentVoice(data)} recordFlag={recordFlag} setRecordStatus={setrecordStatus} />
            {error &&
                <div>
                    <p className="text-xs text-red-500">{error}</p>
                </div>
            }
            <button
                type="button"
                className="w-full bg-blue-600 text-white py-2 rounded"
                onClick={submitCard}>
                {loading ? 'Saving' : 'Save Card'}
            </button>
        </div>
    )
}