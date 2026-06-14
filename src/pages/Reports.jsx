import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Plus, Search } from 'lucide-react'
import { InputGroupAddon, InputGroup, InputGroupInput } from '@/components/ui/input-group'
import { useAuth } from '@/context/AuthContext'
import API from '@/services/api'

const Reports = () => {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        fetchReports()
    }, [user?.id])

    const fetchReports = async () => {
        try {
            let res;
            if (user?.role === 'resident') {
                // Residents see only their own reports
                res = await API.get(`/reports/household/${user?.household_id}`)
            } else {
                // Admin and Staff see all reports
                res = await API.get('/reports')
            }
            setReports(res.data || [])
        } catch (error) {
            console.log('Error fetching reports:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (reportId, newStatus) => {
        try {
            await API.put(`/reports/${reportId}/status`, { status: newStatus });
            fetchReports();
        }
        catch (error) {
            console.log('Error updating status:', error)

        }
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { color: 'text-yellow-700', bg: 'bg-yellow-100' }
            case 'investigating': return { color: 'text-blue-700', bg: 'bg-blue-100' }
            case 'resolved': return { color: 'text-green-700', bg: 'bg-green-100' }
            default: return { color: 'text-gray-700', bg: 'bg-gray-100' }
        }
    }

    const filteredReports = reports.filter(r => {
        const searchLower = searchTerm.toLowerCase()
        return (
            r.issue_type.toLowerCase().includes(searchLower) ||
            r.household_number?.toString().includes(searchLower) ||
            r.owner_name?.toLowerCase().includes(searchLower) ||
            r.description?.toLowerCase().includes(searchLower) ||
            r.purok?.toString().includes(searchLower)
        )
    })

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading reports...</p>
                </div>
            </Layout>
        )
    }

    const isResident = user?.role === 'resident'

    return (
        <Layout>
            <div>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                        <p className="text-gray-500 mt-1">
                            {isResident ? 'Your submitted reports' : 'Manage all reports'}
                        </p>
                    </div>
                    {isResident && (
                        <Button
                            className="bg-blue-900 hover:bg-blue-700 text-white flex items-center gap-2"
                            onClick={() => navigate('/reports/add')}
                        >
                            <Plus size={16} />
                            Submit Report
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Home size={20} className="text-blue-600" />
                                {isResident ? 'My Reports' : 'All Reports'} ({filteredReports.length})
                            </CardTitle>
                            <InputGroup className="max-w-xs">
                                <InputGroupInput
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <InputGroupAddon>
                                    <Search size={16} />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredReports.length === 0 ? (
                            <div className="text-center py-12">
                                <Home size={48} className="text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    {isResident ? 'You haven\'t submitted any reports yet.' : 'No reports found.'}
                                </p>
                                {isResident && (
                                    <Button
                                        onClick={() => navigate('/reports/add')}
                                        className="mt-4 bg-blue-900 hover:bg-blue-700"
                                    >
                                        Submit Your First Report
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        {isResident ? (
                                            ['#', 'Issue Type', 'Description', 'Date', 'Status'].map(h => (
                                                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                                    {h}
                                                </th>
                                            ))
                                        ) : (
                                            ['#', 'Household', 'Purok', 'Owner', 'Issue Type', 'Description', 'Reported by', 'Date', 'Status'].map(h => (
                                                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                                    {h}
                                                </th>
                                            ))
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.map((r, index) => {
                                        const statusStyle = getStatusStyle(r.status)

                                        if (isResident) {
                                            return (
                                                <tr key={r.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                                                    <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                                                    <td className="py-3 px-4 text-sm font-semibold capitalize">{r.issue_type}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-500">{r.description || '-'}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-500">
                                                        {new Date(r.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`${statusStyle.bg} ${statusStyle.color} px-2 py-1 rounded-full text-xs font-semibold capitalize`}>
                                                            {r.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        } else {
                                            return (
                                                <tr key={r.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                                                    <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                                                    <td className="py-3 px-4 text-sm font-semibold">#{r.household_number}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">Purok {r.purok}</td>
                                                    <td className="py-3 px-4 text-sm">{r.owner_name}</td>
                                                    <td className="py-3 px-4 text-sm capitalize">{r.issue_type}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-500">{r.description || '-'}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-500">{r.reported_by}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-500">
                                                        {new Date(r.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <select value={r.status}
                                                            onChange={(e) => handleStatusUpdate(r.id, e.target.value)}
                                                            className={`${statusStyle.bg} ${statusStyle.color} border-0 rounded-full px-2 py-1 text-xs font-semibold cursor-pointer focus:outline-none`}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="investigating">Investigating</option>
                                                            <option value="resolved">Resolved</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>

            </div>
        </Layout>
    )
}

export default Reports;