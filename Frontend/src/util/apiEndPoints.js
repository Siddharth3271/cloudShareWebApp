const BASE_URL="http://localhost:8081/api/v1.0";

export const apiEndPoints={
    FETCH_FILES:`${BASE_URL}/files/my`,
    TOGGLE_FILE:(id)=>`${BASE_URL}/files/${id}/toggle-public`,
    DOWNLOAD_FILE:(id)=>`${BASE_URL}/files/download/${id}`,
    DELETE_FILE:(id)=>`${BASE_URL}/files/${id}`,
    
}

