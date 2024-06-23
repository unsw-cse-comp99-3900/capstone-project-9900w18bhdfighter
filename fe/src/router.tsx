import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import NotFoundPage from './pages/NotFoundPage'
import LandingPage from './pages/LandingPage'
import { useGlobalComponentsContext } from './context/GlobalComponentsContext'
import { useAuthContext } from './context/AuthContext'

// if user is not logged in, redirect to login page
const RouterGuard = ({ children }: { children: JSX.Element }) => {
  const { msg } = useGlobalComponentsContext()
  const { haveLoggedIn } = useAuthContext()
  if (!haveLoggedIn()) {
    msg.err('You have not logged in yet. Please login first.')
    return <Login />
  }
  return children
}

const routerConfig = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },

  {
    path: '/',
    element: <LandingPage />,
    children: [],
  },
  {
    element: (
      <RouterGuard>
        <Layout />
      </RouterGuard>
    ),

    children: [
      {
        element: 'Dashboard',
        path: '/dashboard',
      },
    ],
  },
  {
    element: <NotFoundPage />,
    path: '*',
  },
]

const router = createBrowserRouter(routerConfig)

export default router
