//#Snack 1
// Crea un type alias Person per rappresentare una persona generica.
// Il tipo deve includere le seguenti proprietà
// id: numero identificativo, non modificabile
// name: nome completo, stringa non modificabile
// birth_year: anno di nascita, numero
// death_year: anno di morte, numero opzionale
// biography: breve biografia, stringa
// image: URL dell'immagine, stringa

type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};


//#Snack 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:
// most_famous_movies: una tuple di 3 stringhe
// awards: una stringa
// nationality: una stringa tra un insieme definito di valori.
// Le nazionalità accettate sono: American, British, Australian, Israeli-American, 
// South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

type ActressNatioonality = 
|'American' 
| 'British' 
| 'Australian' 
| 'Israeli-American' 
| 'South African' 
| 'French' 
| 'Indian' 
| 'Israeli' 
| 'Spanish' 
| 'South Korean' 
| 'Chinese';

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality: ActressNatioonality;
};


//#Snack 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:
// GET /actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.
// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.
function isActress(dati: any): dati is Actress {
  return (
    typeof dati === 'object' && dati !== null &&                     //dati is object
    "id" in dati && typeof dati.id === 'number' &&                           //id is number
    "name" in dati && typeof dati.name === 'string' &&                       //name is string
    "birth_year" in dati && typeof dati.birth_year === 'number' &&           //birth_year is number
    "death_year" in dati && typeof dati.death_year === 'number'  &&          //death_year is number or undefined
    "biography" in dati && typeof dati.biography === 'string' &&             //biography is string
    "image" in dati && typeof dati.image === 'string' &&                     //image is string
    "most_famous_movies" in dati &&                                          //most_famous_movies is array of 3 strings
    dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every(m => typeof m === 'string') &&
    "awards" in dati && typeof dati.awards === 'string' &&                   //awards is string
    "nationalaity" in dati && typeof dati.nationality === 'string'           //nationality is string
  );
}

async function getActress(id: number): Promise<Actress | null> {                //ritorna una Promise che risolve in Actress o null
  try{
    const response = await fetch(`https://api.example.com/actresses/${id}`);    //chiamata API
    const dati : unknown = await response.json();                               //dati di tipo unknown
    if(!isActress(dati)){                                                       //se dati non è di tipo Actress
      throw new Error('Dati non conformi al tipo Actress');
    };
    return dati;
  }catch (error) {
    if(error instanceof Error){                                                //se è un errore di tipo Error
      console.error(`Errore nella chiamata API: ${error.message}`);            //stampa il messaggio di errore
    } else {
      console.error('Errore sconosciuto:', error);
    }
    return null;
  };
};


//#Snack 4
// Crea una funzione getAllActresses che chiama:
// GET /actresses
// La funzione deve restituire un array di oggetti Actress.
// Può essere anche un array vuoto.

 function isActressArray(dati: any): dati is Actress[] {                      //funzione per verificare se dati è di tipo Actress[]
  return (
    dati instanceof Array && dati.every(isActress)                           //dati is array e ogni elemento è di tipo Actress
  );
};

async function getAllActresses(): Promise<Actress[]> {                        //ritorna una Promise che risolve in Actress[]
  try{
    const response = await fetch(`https://api.example.com/actresses`);       //chiamata API                        
    if(!response.ok){                                                        //se dati non è di tipo Actress[]
      throw new Error('Dati non conformi al tipo Actress[]');                //lancia errore
    };
    const dati : unknown = await response.json();                            //dati di tipo unknown
    if(!(dati instanceof Array)){                                            //se dati non è un array
      throw new Error('Dati non conformi al tipo array!');                   //lancia errore
    };
  }catch (error) {
    if(error instanceof Error){                                              //se è un errore di tipo Error
      console.error(`Errore nella chiamata API: ${error.message}`);          //stampa il messaggio di errore
    } else {
      console.error('Errore sconosciuto:', error);
    }
    return [];                                                              //ritorna array vuoto in caso di errore
  };
};