import HeroMetrics from '../components/dashboard/HeroMetrics';
import QuickActions from '../components/dashboard/QuickActions';
import RecentLogs from '../components/dashboard/RecentLogs';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <HeroMetrics />
      <QuickActions />
      <RecentLogs />
    </div>
  );
}
