import { RouterProvider } from 'react-router-dom'
import router from './router'
import GlobalAntdThemeProvider from './context/GlobalThemeContext'
import GlobalComponentProvider from './context/GlobalComponentsContext'
import AuthContextProvider from './context/AuthContext'
import GlobalConstantProvider from './context/GlobalConstantContext'

const App = () => {
  return (
    <GlobalAntdThemeProvider>
      <GlobalComponentProvider>
        <AuthContextProvider>
          <GlobalConstantProvider>
            <RouterProvider router={router}></RouterProvider>
          </GlobalConstantProvider>
        </AuthContextProvider>
      </GlobalComponentProvider>
    </GlobalAntdThemeProvider>
  )
}

export default App
