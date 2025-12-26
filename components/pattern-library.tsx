"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GEM_PATTERNS, type GemPattern } from "@/lib/gem-patterns"
import { Search, Gem, Clock, Layers, Filter } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PatternLibraryProps {
  onSelectPattern: (pattern: GemPattern) => void
  selectedPattern?: GemPattern
}

export function PatternLibrary({ onSelectPattern, selectedPattern }: PatternLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")

  const filteredPatterns = GEM_PATTERNS.filter((pattern) => {
    const matchesSearch =
      pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.gemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDifficulty = difficultyFilter === "all" || pattern.difficulty === difficultyFilter

    return matchesSearch && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: GemPattern["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-red-500"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Gem className="w-5 h-5" />
            Pattern Library
          </CardTitle>
          <Badge variant="secondary" className="font-mono">
            {GEM_PATTERNS.length} Patterns
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-foreground"
          />
        </div>

        {/* Difficulty Filter */}
        <Tabs value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Medium</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Pattern Cards */}
        <ScrollArea className="h-[600px]">
          <div className="space-y-3">
            {filteredPatterns.map((pattern) => (
              <Card
                key={pattern.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedPattern?.id === pattern.id ? "border-primary border-2 bg-primary/5" : ""
                }`}
                onClick={() => onSelectPattern(pattern)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{pattern.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{pattern.gemType}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getDifficultyColor(pattern.difficulty)}`} />
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{pattern.description}</p>

                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span className="font-mono">{pattern.facets.length} facets</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono">{pattern.estimatedTime} min</span>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs">
                      {pattern.difficulty}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {filteredPatterns.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No patterns found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
