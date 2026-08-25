"use client";

import { useState } from "react";
import { JobFilters as JobFiltersType } from "@/lib/types/job";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { Search, X } from "lucide-react";

interface JobFiltersProps {
  filters: JobFiltersType;
  onFilterChange: (filters: Partial<JobFiltersType>) => void;
  technicians?: any[];
}

export function JobFilters({
  filters,
  onFilterChange,
  technicians,
}: JobFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onFilterChange({ search: searchTerm });
  };

  const clearFilters = () => {
    setSearchTerm("");
    onFilterChange({
      status: undefined,
      technician: undefined,
      dateRange: undefined,
      search: undefined,
      page: 1,
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="flex gap-2">
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="w-[150px]">
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                onFilterChange({ status: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[180px]">
            <Select
              value={filters.technician || "all"}
              onValueChange={(value) =>
                onFilterChange({
                  technician: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technicians</SelectItem>
                {technicians?.map((tech) => (
                  <SelectItem key={tech._id} value={tech._id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Input
              type="date"
              value={filters.dateRange?.start || ""}
              onChange={(e) => {
                const start = e.target.value;
                const end = filters.dateRange?.end || "";
                if (start) {
                  onFilterChange({
                    dateRange: { start, end },
                  });
                } else {
                  onFilterChange({
                    dateRange: undefined,
                  });
                }
              }}
              className="w-[140px]"
              placeholder="Start Date"
            />
            <Input
              type="date"
              value={filters.dateRange?.end || ""}
              onChange={(e) => {
                const end = e.target.value;
                const start = filters.dateRange?.start || "";
                if (end) {
                  onFilterChange({
                    dateRange: { start, end },
                  });
                } else {
                  onFilterChange({
                    dateRange: undefined,
                  });
                }
              }}
              className="w-[140px]"
              placeholder="End Date"
            />
          </div>

          {(filters.status ||
            filters.technician ||
            filters.dateRange ||
            filters.search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
