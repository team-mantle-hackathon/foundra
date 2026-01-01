import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUploadIPFS = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const metadata = JSON.stringify({
        name: `License-${file.name}-${Date.now()}`,
      });
      formData.append("pinataMetadata", metadata);

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${import.meta.env.VITE_JWT_IPFS}`,
          }
        }
      );

      return `ipfs://${res.data.IpfsHash}`;
    },
    onError: (error) => {
      console.error("Pinata Upload Error:", error);
    }
  });
};