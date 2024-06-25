import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import NotFoundPage from './pages/NotFoundPage'
import LandingPage from './pages/LandingPage'
import { useGlobalComponentsContext } from './context/GlobalComponentsContext'
import { useAuthContext } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import route from './constant/route'
import Projects from './pages/Projects'
import Teams from './pages/Teams'
import AdminManagement from './pages/AdminManagement'

// if user is not logged in, redirect to login page
const RouterGuard = ({ children }: { children: JSX.Element }) => {
  const { msg } = useGlobalComponentsContext()
  const { haveLoggedIn } = useAuthContext()
  console.log(1123)

  if (!haveLoggedIn()) {
    console.log(123)

    msg.err('You have not logged in yet. Please login first.')
    return <Login />
  }
  return children
}

const routerConfig = [
  {
    path: route.LOGIN,
    element: <Login />,
  },
  {
    path: route.SIGNUP,
    element: <SignUp />,
  },

  {
    path: route.ROOT,
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
        element: <Dashboard />,
        path: route.DASHBOARD,
      },
      {
        element: <Profile />,
        path: route.PROFILE,
      },
      {
        element: <Projects />,
        path: route.PROJECTS,
      },
      {
        element: <Teams />,
        path: route.TEAMS,
      },
      {
        element: <AdminManagement />,
        path: route.ADMIN,
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
