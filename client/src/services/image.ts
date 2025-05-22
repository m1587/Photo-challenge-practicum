import api from "../lib/axiosConfig"

export const fetchImageName = async (token: string, fileName: string) => {
    const imageResponse = await api.get("Image/Name", {
        params: { imageName: fileName },
        headers: { Authorization: `Bearer ${token}` },
    })
    return imageResponse
}
export const fetchImageUpload = async (token: string) => {
    const imageResponse = await api.get("upload", {
        headers: { Authorization: `Bearer ${token}` },
      })
    return imageResponse
}
export const fetchPresignedUrl = async (token: string | null,fileName:string) => {
     const response = await api.get("Upload/presigned-url", {
        params: { fileName: fileName},
        headers: { Authorization: `Bearer ${token}` },
      });
    return response
}
export const fetchAddImage = async (token:string|null, imageData: any) => {
     await api.post("Image", imageData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
}
export const fetchVoteImage = async (token: string, imageId: string) => {
    const votesResponse = await api.get(`Vote/Count/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    return votesResponse
}

export const fetchAddVoteImage = async (token:string,userId: number, imageId: string) => {
    await api.post("Vote",
        {
            userId: userId,
            imageId: imageId,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    )
}