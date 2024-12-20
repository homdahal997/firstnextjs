import AdminConsole from '@/components/Dashboard/admindashboard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminConsole>{children}</AdminConsole>;
}