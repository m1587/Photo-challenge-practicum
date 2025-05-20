import api from "../lib/axiosConfig"

export const fetchPreviousChallenges = async () => {
    const response = await api.get("Challenge/previous-challenges")
    return response
  }
  
export const fetchActiveChallengeId = async (token: string|null) => {
    const response = await api.get("Challenge/active-challenge", {
        headers: { Authorization: `Bearer ${token}` },
    })
    return response
}

export const fetchIsUploaded = async (token: string|null,userId:number,challengeId:number) => {
   const response = await api.get("Challenge/check-uploaded", {
        params: {
          userId:userId,
          challengeId: challengeId, // השתמש במזהה של האתגר הנוכחי
        },
        headers: { Authorization: `Bearer ${token}` },
      })
    return response
}