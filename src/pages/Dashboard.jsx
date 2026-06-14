import { useAuth } from '@/context/AuthContext'
import AdminDashboard from './AdminDashboard'
import ResidentDashboard from './ResidentDashboard'
import StaffDashboard from './StaffDashboard'

const Dashboard = () => {
    const { user } = useAuth()

    if (!user) {
        return null
    }

    switch (user.role) {
        case 'admin':
            return <AdminDashboard />
        case 'resident':
            return <ResidentDashboard />
        case 'staff':
            return <StaffDashboard />
        default:
            return <ResidentDashboard />
    }
}

export default Dashboard