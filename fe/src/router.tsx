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
import GroupDetail from './pages/GroupDetail'
import AdminManagement from './pages/AdminManagement'
import ProjectDetail from './pages/ProjectDetail'
import MessagePage from './pages/MessagePage'
import MessageLanding from './pages/MessagePage/components/MessageLanding'
import { MessageMain } from './pages/MessagePage/components/MessageMain'

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
        element: <ProjectDetail />,
        path: `${route.PROJECTS}/:id`,
      },
      {
        element: <Teams />,
        path: route.TEAMS,
      },
      {
        element: <GroupDetail />,
        path: `${route.GROUPS}/:id`,
      },
      {
        element: <MessagePage />,
        children: [
          {
            element: <MessageLanding />,
            path: route.MESSAGE,
          },
          {
            element: <MessageMain />,
            path: `${route.MESSAGE}/:type/:receiverId`,
          },
          {
            element: <MessageMain />,
            path: `${route.MESSAGE}/group/:groupId`,
          },
        ],
      },

      {
        element: <GroupDetail />,
        path: `${route.GROUPDETAILS}/:id`,
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
