import { API_BASE_PATH } from './base';

const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return (window as any).spaceGetToken?.('uma-flash-cards') || null;
}


interface ApiResponse<T> {
    status: number;
    data: T;
    error?: string;
}



export async function apiRequest<T> (
    path: string,
    options?: RequestInit
): Promise<ApiResponse<T>>{
    try{
    const  token  = getAuthToken();
    const headers: Record<string, string> = {
        'Content-type': 'application/json',
        ...(options?.headers as Record<string, string> || {}),
    }
    
    if (token) {
        headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_PATH}${path}`,{
        ...options,
        headers,
    })
    const data = await response.json().catch(()=> ({ error: 'Unknown error '}));

    return {
        status: response.status,
        data: response.ok ? data : undefined as T,
        error: response.ok ? undefined : (data.error || `HTTP ${response.status}`),
    }
}
catch (error:any){
    console.error("------------catch error:::",error)
    return {
      data: null as any, // Or an empty version of T if applicable
      status: 500,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
}
}


export interface Deck {
    id: number,
    name: string,
    info: string,
    icon: string,
    card_count: string,
    created_at: string,
    updated_at: string,
    is_deleted: number,
} 


export interface Card {
    id: number,
    deck_id: number,
    front_text: string,
    back_text: string,

    voice_data: string, // Base64 string

    created_at: string,
    updated_at: string,
    is_deleted: number,
}



// ----- Decks API ----

export async function listDecks(): Promise<ApiResponse<Deck[]>> {
    return apiRequest<Deck[]>('/decks', { method: 'GET'});
}


export async function createDeck(data: { name: string; info?: string; icon?: string}):Promise<ApiResponse<Deck>> {
    return apiRequest<Deck>('/decks', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function updateDeck(data: { id?:number, name?: string; info?:string; icon?: string, card_count?: string}): Promise<ApiResponse<Deck>> {
    return apiRequest<Deck>(`/decks/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

export async function deleteDeck(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string}>(`/decks/${id}`, {method: 'DELETE'});
}



// ------ Cards API ---------

interface CardData {
    id?:number;
    front_text: string;
    back_text: string;
    voice_data?: string;
    deck_id: string;
    // fix me spelling _____
    is_deleted: boolean;
}



export async function listCards(deckId: number): Promise<ApiResponse<Card[]>> {
    return apiRequest<Card[]>(`/decks/${deckId}/cards`, { method: 'GET'});
}




export async function createCard(data:CardData): Promise<ApiResponse<Card>> {
    return apiRequest<Card>(`/decks/${data.deck_id}/cards`,{
        method: 'POST',
        body: JSON.stringify(data),
    })
}



export async function updateCard(data: CardData): Promise<ApiResponse<Card>> {
    return apiRequest<Card>(`/decks/${data.deck_id}/cards/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteCard(data:any): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/decks/${data.deckId}/cards/${data.cardId}`, { method: 'DELETE' });
}
