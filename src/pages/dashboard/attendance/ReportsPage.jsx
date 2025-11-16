// src/pages/AttendanceReportsPage.jsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";
import { AttendanceFilters } from "@/components/attendance/reports/Filters";
import { AttendanceReportDisplay } from "@/components/attendance/reports/AttendanceReportDisplay";

const AttendanceReportsPage = () => {
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 10,
  });
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Load filters from URL on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const obj = { page: 1, limit: 10 };

    for (const [k, v] of params.entries()) {
      if (["page", "limit", "userId"].includes(k)) {
        obj[k] = Number(v);
      } else if (k === "isRecurring") {
        obj[k] = v === "true";
      } else {
        obj[k] = v;
      }
    }
    setFilters(obj);
  }, []);

  const updateUrl = (newFilters) => {
    const sp = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        sp.set(k, String(v));
      }
    });
    const url = `${window.location.pathname}?${sp.toString()}`;
    window.history.replaceState(null, "", url);
  };

  const handleFiltersChange = (newF) => {
    const merged = { ...filters, ...newF, page: 1 };
    setFilters(merged);
    updateUrl(merged);
  };

  const handlePageChange = (newPage) => {
    const updated = { ...filters, page: newPage };
    setFilters(updated);
    updateUrl(updated);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    const defaultFilters = { page: 1, limit: 10 };
    setFilters(defaultFilters);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) =>
      !["page", "limit"].includes(key) &&
      value !== undefined &&
      value !== null &&
      value !== ""
  );

  const FiltersComp = () => (
    <AttendanceFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onReset={handleReset}
    />
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Attendance Reports
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive attendance tracking and analytics
            </p>
          </div>

          {/* Mobile filter button */}
          <div className="xl:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full sm:w-96 p-0 overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
                  <h2 className="font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <FiltersComp />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden xl:block xl:w-80 flex-shrink-0">
            <div className="sticky top-6">
              <FiltersComp />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <AttendanceReportDisplay
              params={filters}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportsPage;
