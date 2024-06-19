import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import NotFoundPage from './pages/NotFoundPage'
import LandingPage from './pages/LandingPage'

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
    element: <Layout />,

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
