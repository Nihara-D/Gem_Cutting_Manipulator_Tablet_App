"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { GemPattern } from "@/lib/gem-patterns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FacetParametersTableProps {
  pattern: GemPattern
  currentFacet?: number
}

export function FacetParametersTable({ pattern, currentFacet }: FacetParametersTableProps) {
  const sortedFacets = [...pattern.facets].sort((a, b) => a.order - b.order)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-foreground">
          <span>Facet Parameters</span>
          <Badge variant="secondary" className="font-mono">
            {pattern.facets.length} Facets
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Angle</TableHead>
                <TableHead className="text-right">Rotation</TableHead>
                <TableHead className="text-right">Depth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFacets.map((facet, index) => (
                <TableRow
                  key={facet.id}
                  className={`${index === currentFacet ? "bg-primary/20 border-l-4 border-l-primary" : ""}`}
                >
                  <TableCell className="font-medium">
                    <Badge variant={index === currentFacet ? "default" : "outline"}>{facet.order}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{facet.name}</TableCell>
                  <TableCell className="text-right font-mono text-foreground">{facet.angle}°</TableCell>
                  <TableCell className="text-right font-mono text-foreground">{facet.rotation}°</TableCell>
                  <TableCell className="text-right font-mono text-foreground">{facet.depth}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
