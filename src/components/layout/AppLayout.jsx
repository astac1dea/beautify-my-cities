import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'

// Everything inside this layout needs an account.
export default function AppLayout() {
  const { isAuthed } = useAuth()
  if (!isAuthed) return <Navigate to="/login" replace />

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1, minWidth: 0, minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  )
}
