import { API } from "../utils/apiFunctions";

export async function getQuizzesByUserId(userId) {
    const response = await API.get("api/quizzes/getByUserId?userId=" + userId);
    return response.data;
};

export async function getAllQuizzes(userId) {
    const response = await API.get("api/quizzes/getAll?userId=" + userId);
    return response.data;
};

export async function getQuizzesInRooms(roomId){
    const response = await API.get("api/rooms/getQuizzes?roomId=" + roomId);
    return response.data;
}


export async function updateQuizzesInRoom(data) {
    const response = await API.put("api/rooms/update", data);
    return response.data;
}

export async function getQuizzesByCategory(category) {
    const response = await API.get("api/quizzes/getByCategory?category=" + category);
    return response.data;
}




export async function createQuiz(data) {
    const response = await API.post("api/quizzes/create", data);
    return response.data;
}

export async function updateQuiz(quizId, data) {
    const response = await API.put(`api/quizzes/update/${quizId}`, data);   
    return response.data;
}


export async function generateQuizzes(prompt){
    const response = await API.post("api/quizzes/generate", {prompt});
    return response.data;
}


export async function generateQuizzesByPDF(pdf){
    const response = await API.post("api/quizzes/generate-quizzes-by-pdf",pdf);
    return response.data;
}

export async function saveQuestionsToQuiz(){
    
}   