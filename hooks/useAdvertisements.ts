"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export interface Advertisement {
  id: number
  image: string
  enable: boolean
  created_at?: string
  updated_at?: string
}

export interface AdvertisementInput {
  image: File | string
  enable: boolean
}

export function useAdvertisements() {
  return useQuery({
    queryKey: ["advertisements"],
    queryFn: async () => {
      const res = await api.get<Advertisement[]>("/mobcash/ann")
      return res.data
    },
  })
}

export function useCreateAdvertisement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AdvertisementInput) => {
      const formData = new FormData()
      
      if (data.image instanceof File) {
        formData.append("image", data.image)
      } else {
        formData.append("image", data.image)
      }
      
      formData.append("enable", data.enable.toString())

      const res = await api.post<Advertisement>("/mobcash/ann", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return res.data
    },
    onSuccess: () => {
      toast.success("Publicité créée avec succès!")
      queryClient.invalidateQueries({ queryKey: ["advertisements"] })
    },
  })
}

