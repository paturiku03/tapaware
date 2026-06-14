import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Droplets, Plus, Search } from 'lucide-react';
import API from '@/services/api';

const TdsReadings = () => {
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchReadings()
    }, [])

    const fetchReadings = async () => {
        try {
            const res = await API.get('/tds')
            setReadings(res.data)
        } catch (error) {
            console.log('Error fetching readings:', error)
        } finally {
            setLoading(false)
        }
    }

    const getTdsStatus = (value) => {
        if (value <= 300) return { label: 'Safe', color: 'text-green-700', bg: 'bg-green-100' }
        if (value <= 600) return { label: 'Moderate', color: 'text-yellow-700', bg: 'bg-yellow-100' }
        return { label: 'High', color: 'text-red-700', bg: 'bg-red-100' }
    }

    const filteredReadings = readings.filter(r => {
        const searchLower = searchTerm.toLowerCase()
        return (
            r.household_number?.toString().includes(searchLower) ||
            r.owner_name?.toLowerCase().includes(searchLower) ||
            r.purok?.toString().includes(searchLower) ||
            r.notes?.toLowerCase().includes(searchLower)
        )
    })

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading TDS readings...</p>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">TDS Readings</h1>
                        <p className="text-gray-500 mt-1">Total Dissolved Solids monitoring per household</p>
                    </div>
                    <Button
                        className="bg-blue-900 hover:bg-blue-700 text-white flex items-center gap-2"
                        onClick={() => navigate('/tds/add')}
                    >
                        <Plus size={16} />
                        Add Reading
                    </Button>
                </div>


                {/* Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Droplets size={20} className="text-blue-600" />
                                All TDS Readings ({filteredReadings.length})
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
                        {filteredReadings.length === 0 ? (
                            <div className="text-center py-12">
                                <Droplets size={48} className="text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No TDS readings recorded yet.</p>

                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        {['#', 'Household No.', 'Purok', 'Owner', 'TDS Value', 'Status', 'Notes', 'Recorded By', 'Date'].map(h => (
                                            <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReadings.map((r, index) => {
                                        const status = getTdsStatus(r.tds_value)
                                        return (
                                            <tr key={r.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                                                <td className="py-3 px-4 text-sm font-semibold">#{r.household_number}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">Purok {r.purok}</td>
                                                <td className="py-3 px-4 text-sm">{r.owner_name}</td>
                                                <td className="py-3 px-4 text-sm font-semibold">{r.tds_value} ppm</td>
                                                <td className="py-3 px-4">
                                                    <span className={`${status.bg} ${status.color} px-2 py-1 rounded-full text-xs font-semibold`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-500">{r.notes || '—'}</td>
                                                <td className="py-3 px-4 text-sm">{r.staff_name}</td>
                                                <td className="py-3 px-4 text-sm text-gray-500">
                                                    {new Date(r.recorded_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        )
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

export default TdsReadings;