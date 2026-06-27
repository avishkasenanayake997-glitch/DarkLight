import { useState, useEffect } from 'react';
import { reportAPI } from '../../api';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#C9A96E', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export default function ReportsPage() {
  const [bookingsData, setBookingsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [bookingsRes, revenueRes, packagesRes, growthRes] = await Promise.all([
        reportAPI.getBookingsChart(),
        reportAPI.getRevenueChart(),
        reportAPI.getPopularPackages(),
        reportAPI.getCustomerGrowth(),
      ]);

      setBookingsData(bookingsRes.data.chartData || []);
      setRevenueData(revenueRes.data.chartData || []);
      setPackagesData(packagesRes.data.data || []);
      setGrowthData(growthRes.data.chartData || []);
    } catch {
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 className="font-display">Analytics Reports</h2>
        <p style={{ color: 'var(--white-40)', fontSize: '0.85rem' }}>Track studio growth, evaluate popular photography packages, and monitor revenues.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Bookings Chart */}
        <div className="card-glass" style={{ padding: '24px', height: '360px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Bookings per Month</h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--dark-border)" />
                <XAxis dataKey="month" stroke="var(--white-40)" />
                <YAxis stroke="var(--white-40)" />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid var(--dark-border)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="approved" fill="var(--approved)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="var(--completed)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="var(--pending)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card-glass" style={{ padding: '24px', height: '360px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Revenue Stream (LKR)</h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--approved)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--approved)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--dark-border)" />
                <XAxis dataKey="month" stroke="var(--white-40)" />
                <YAxis stroke="var(--white-40)" />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid var(--dark-border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--approved)" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Packages */}
        <div className="card-glass" style={{ padding: '24px', height: '360px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Popular Package Selection</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {packagesData.length === 0 ? (
              <span style={{ color: 'var(--white-40)' }}>No data available</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={packagesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {packagesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Customer Growth */}
        <div className="card-glass" style={{ padding: '24px', height: '360px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Client Database Growth</h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--dark-border)" />
                <XAxis dataKey="month" stroke="var(--white-40)" />
                <YAxis stroke="var(--white-40)" />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid var(--dark-border)', borderRadius: '8px' }} />
                <Bar dataKey="customers" fill="var(--gold)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
