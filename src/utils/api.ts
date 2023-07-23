
export const getParticipants  = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8000/api/participants/get/${id}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data.map((obj: any) => obj['user']);
  } catch (error) {
    console.error('Error getting data:', error);
  }
}
export const deleteParticipants  = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8000/api/participants/delete/${id}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data.map((obj: any) => obj['user']);
  } catch (error) {
    console.error('Error getting data:', error);
  }
};

export const addParticipant = async (id: number, address: string) => {
  try {
    const response = await fetch(`http://localhost:8000/api/participants/add/${id}/${address}`, {
      method: 'GET',
    });

  } catch (error) {
    console.error('Error submitting form:', error);
  }
}

export const getUsers = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/users/');
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

}

export const test = async () => {
  return;
  const response = await fetch('http://127.0.0.1:8000/api/riddle/10');
    const jsonData = await response.json();
    return jsonData.answer;
}
