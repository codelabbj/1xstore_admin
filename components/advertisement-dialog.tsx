"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useCreateAdvertisement, type AdvertisementInput } from "@/hooks/useAdvertisements"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

interface AdvertisementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdvertisementDialog({ open, onOpenChange }: AdvertisementDialogProps) {
  const createAdvertisement = useCreateAdvertisement()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [enable, setEnable] = useState(true)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner un fichier image")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 5MB")
        return
      }

      setSelectedFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      alert("Veuillez sélectionner une image")
      return
    }

    const formData: AdvertisementInput = {
      image: selectedFile,
      enable,
    }

    createAdvertisement.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false)
        setSelectedFile(null)
        setPreviewUrl(null)
        setEnable(true)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      },
    })
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedFile(null)
      setPreviewUrl(null)
      setEnable(true)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer une Publicité</DialogTitle>
          <DialogDescription>Ajoutez une nouvelle publicité avec une image</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image *</Label>
            <div className="space-y-4">
              {previewUrl ? (
                <div className="relative w-full h-64 border-2 border-dashed border-border rounded-lg overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Cliquez pour télécharger ou glissez-déposez une image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formats acceptés: JPG, PNG, GIF (max 5MB)
                  </p>
                </div>
              )}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={createAdvertisement.isPending}
                  className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed w-full text-sm text-foreground border border-input rounded-md px-3 py-2 bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="enable">Activer la publicité</Label>
            <Switch
              id="enable"
              checked={enable}
              onCheckedChange={setEnable}
              disabled={createAdvertisement.isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
              disabled={createAdvertisement.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createAdvertisement.isPending || !selectedFile}>
              {createAdvertisement.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer la Publicité"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

