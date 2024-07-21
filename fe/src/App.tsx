import { RouterProvider } from 'react-router-dom'
import router from './router'
import GlobalAntdThemeProvider from './context/GlobalThemeContext'
import GlobalComponentProvider from './context/GlobalComponentsContext'
import AuthContextProvider from './context/AuthContext'

const App = () => {
  return (
    <GlobalAntdThemeProvider>
      <GlobalComponentProvider>
        <AuthContextProvider>
          <RouterProvider router={router}></RouterProvider>
        </AuthContextProvider>
      </GlobalComponentProvider>
    </GlobalAntdThemeProvider>
  )
}

export default App
