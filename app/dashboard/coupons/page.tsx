"use client"

import { useState } from "react"
import { useCoupons, type Coupon } from "@/hooks/useCoupons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Pencil } from "lucide-react"
import { CouponDialog } from "@/components/coupon-dialog"
import { CopyButton } from "@/components/copy-button"

export default function CouponsPage() {
  const { data: couponsData, isLoading } = useCoupons()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedCoupon(null)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setSelectedCoupon(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Coupons
          </h2>
          <p className="text-muted-foreground">Gérez les coupons de parrainage</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Créer un Coupon
        </Button>
      </div>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Liste des Coupons</CardTitle>
              <CardDescription className="text-sm mt-1">
                Total : {couponsData?.count || 0} coupons
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : couponsData && couponsData.results.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                    <TableHead className="font-semibold text-muted-foreground h-12">ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Code</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Plateforme</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">App ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Créé le</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {couponsData.results.map((coupon, index) => (
                    <TableRow key={coupon.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {coupon.id}
                          <CopyButton value={coupon.id} />
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-semibold text-foreground">{coupon.code}</TableCell>
                      <TableCell className="text-foreground font-medium">
                        {coupon.bet_app_details?.name || coupon.bet_app}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {coupon.bet_app}
                          <CopyButton value={coupon.bet_app} />
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(coupon.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(coupon)}
                          className="h-8"
                        >
                          <Pencil className="mr-2 h-3 w-3" />
                          Modifier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Aucun coupon trouvé</div>
          )}
        </CardContent>
      </Card>

      <CouponDialog open={dialogOpen} onOpenChange={handleDialogClose} coupon={selectedCoupon} />
    </div>
  )
}

