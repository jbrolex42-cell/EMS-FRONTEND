import DashboardLayout from './DashboardLayout';
export default function AdminLayout({ children, title }) {
  return <DashboardLayout title={title}>{children}</DashboardLayout>;
}
