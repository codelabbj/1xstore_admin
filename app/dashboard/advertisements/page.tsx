"use client"

import { useState } from "react"
import { useAdvertisements } from "@/hooks/useAdvertisements"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus } from "lucide-react"
import { AdvertisementDialog } from "@/components/advertisement-dialog"
import Image from "next/image"

export default function AdvertisementsPage() {
  const { data: advertisements, isLoading } = useAdvertisements()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Publicités
          </h2>
          <p className="text-muted-foreground">Gérez les publicités de la plateforme</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer une Publicité
        </Button>
      </div>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Liste des Publicités</CardTitle>
              <CardDescription className="text-sm mt-1">
                Total : {advertisements?.length || 0} publicités
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : advertisements && advertisements.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                    <TableHead className="font-semibold text-muted-foreground h-12">ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Image</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Statut</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Créé le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advertisements.map((ad, index) => (
                    <TableRow key={ad.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                      <TableCell className="font-medium text-foreground">{ad.id}</TableCell>
                      <TableCell>
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                          <Image
                            src={ad.image}
                            alt={`Publicité ${ad.id}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ad.enable ? "default" : "secondary"} className="font-medium">
                          {ad.enable ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {ad.created_at
                          ? new Date(ad.created_at).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Aucune publicité trouvée</div>
          )}
        </CardContent>
      </Card>

      <AdvertisementDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

