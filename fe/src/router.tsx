import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import route from './constant/route'
import { useAuthContext } from './context/AuthContext'
import { useGlobalComponentsContext } from './context/GlobalComponentsContext'
import AdminManagement from './pages/AdminManagement'
import AllocationDetail from './pages/AllocationDetail'
import AssessmentDetail from './pages/AssessmentPage'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Dashboard from './pages/Dashboard'
import GroupDetail from './pages/GroupDetail'
import LandingPage from './pages/LandingPage'
import MessagePage from './pages/MessagePage'
import MessageLanding from './pages/MessagePage/components/MessageLanding'
import { MessageMain } from './pages/MessagePage/components/MessageMain'
import NotFoundPage from './pages/NotFoundPage'
import Profile from './pages/Profile'
import ProjectDetail from './pages/ProjectDetail'
import Projects from './pages/Projects'
import Teams from './pages/Teams'
// if user is not logged in, redirect to login page
const RouterGuard = ({ children }: { children: JSX.Element }) => {
  const { msg } = useGlobalComponentsContext()
  const { haveLoggedIn } = useAuthContext()

  if (!haveLoggedIn()) {
    msg.err('You have not logged in yet. Please login first.')
    return <Navigate to={route.LOGIN} replace={true} />
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
        element: <Profile />,
        path: `${route.PROFILE}/:id`,
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
        ],
      },
      {
        element: <AllocationDetail />,
        path: `${route.ALLOCATION}/:id`,
      },

      {
        element: <AdminManagement />,
        path: route.ADMIN,
      },
      {
        element: <AssessmentDetail />,
        path: `${route.ASSESSMENT}/:id`,
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
