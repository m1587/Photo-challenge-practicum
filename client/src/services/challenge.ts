import api from "../lib/axiosConfig"

export const fetchPreviousChallenges = async () => {
    const response = await api.get("Challenge/previous-challenges")
    return response.data
  }