import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Plus, Eye, Search } from 'lucide-react'
import { InputGroupAddon, InputGroup, InputGroupInput } from '@/components/ui/input-group'
import API from '@/services/api'

const AuditTrail = () => {
    const [auditTrails, setAuditTrails] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')


    useEffect(() => {
        fetchAuditTrails()
    }, [])

    const fetchAuditTrails = async () => {
        try {
            const res = await API.get('/admin/audit-trail')
            setAuditTrails(res.data)
        } catch (error) {
            console.log('Error fetching audit trails:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredAuditTrails = auditTrails.filter(trail => {
        const searchLower = searchTerm.toLowerCase()
        return (
            trail.user_name?.toLowerCase().includes(searchLower) ||
            trail.action?.toLowerCase().includes(searchLower) ||
            trail.details?.toLowerCase().includes(searchLower) ||
            trail.table_affected?.toLowerCase().includes(searchLower)
        )
    })

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading audit trails...</p>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div>


                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
                        <p className="text-gray-500 mt-1">View system audit logs</p>
                    </div>
                </div>


                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Home size={20} className="text-blue-600" />
                                Audit Trail ({filteredAuditTrails.length})
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
                        {filteredAuditTrails.length === 0 ? (
                            <div className="text-center py-12">
                                <Home size={48} className="text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No audit trails found.</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        {['#', 'User', 'Action', 'Table', 'Description', 'Timestamp'].map(h => (
                                            <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAuditTrails.map((trail, index) => (
                                        <tr key={trail.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                                            <td className="py-3 px-4 text-sm font-semibold">{trail.user_name}</td>
                                            <td className="py-3 px-4 text-sm">{trail.action}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{trail.table_affected}</td>
                                            <td className="py-3 px-4 text-sm">{trail.details}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
                                                {new Date(trail.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}


                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>

            </div>
        </Layout>
    )
}

export default AuditTrail;
