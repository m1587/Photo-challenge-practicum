import api from "../lib/axiosConfig";

export const fetchSendEmail = async (formData:any) => {
     const response = await api.post("Contact/send-email", formData);
    return response
}