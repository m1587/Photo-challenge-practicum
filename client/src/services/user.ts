import api from "../lib/axiosConfig";

export const fetchUserLogin = async (email: string, password: string) => {
     const userResponse = await api.post<{ token: string; user: any }>("User/login", {
        email: email,
        password: password,
      })
    return userResponse
}

export const fetchUserRegister = async (email: string, password: string,name:string) => {
     const userResponse  = await api.post("User", {
        email: email,
        password: password,
        name: name,
      })
    return userResponse
}
export const fetchPasswordResetRequest = async (email: string) => {
     const userResponse  = await api.post("PasswordReset/request", email, {
        headers: {
          "Content-Type": "application/json"
        }
      })
    return userResponse
}

export const fetchPasswordReset = async (token:string | null,email:string,password: string) => {
     const userResponse  =   await api.post("/PasswordReset/reset", {
        token,
        email,
        newPassword: password,
      })
    return userResponse
}