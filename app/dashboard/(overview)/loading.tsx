import { CardsSkeleton, RevenueChartSkeleton, LatestInvoicesSkeleton } from '@/app/ui/skeletons';

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <CardsSkeleton />
      <RevenueChartSkeleton />
      <LatestInvoicesSkeleton />
    </div>
  );
}
