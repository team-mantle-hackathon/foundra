import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Proposal = {
  id: string
  name: string
  developer: string
  amount: string
  status: "pending" | "approved" | "rejected"
  riskScore: number
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "PRJ-001",
    name: "Green Residence Phase 1",
    developer: "PT Maju Jaya",
    amount: "$250,000",
    status: "pending",
    riskScore: 32,
  },
  {
    id: "PRJ-002",
    name: "Urban Living Apartment",
    developer: "CV Properti Kita",
    amount: "$400,000",
    status: "pending",
    riskScore: 58,
  },
]

export default function VerifierDashboard() {
  const [selected, setSelected] = useState<Proposal | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-8 py-6">
          <h1 className="text-2xl font-semibold">Verifier Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Review & approve real-world asset proposals
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Developer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>AI Risk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {MOCK_PROPOSALS.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.developer}</TableCell>
                  <TableCell>{p.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={p.riskScore < 40 ? "secondary" : "destructive"}
                    >
                      {p.riskScore}/100
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => setSelected(p)}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Proposal Review</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="grid grid-cols-2 gap-6 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Project</p>
                <p className="font-medium">{selected.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Developer</p>
                <p className="font-medium">{selected.developer}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Funding Request</p>
                <p className="font-medium">{selected.amount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Risk Score</p>
                <p className="font-medium">{selected.riskScore}/100</p>
              </div>

              <div className="col-span-2 rounded-lg bg-muted p-4">
                <p className="text-sm font-medium mb-2">AI Summary</p>
                <p className="text-sm text-muted-foreground">
                  Cashflow projection stable. Legal documents present.
                  Moderate market risk due to location saturation.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button variant="destructive">Reject</Button>
            <Button>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
