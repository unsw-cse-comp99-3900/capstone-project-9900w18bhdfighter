import { RouterProvider } from 'react-router-dom'
import router from './router'
import GlobalAntdThemeProvider from './styles/GlobalThemeContext'

const App = () => {
  return (
    <GlobalAntdThemeProvider>
      <RouterProvider router={router}></RouterProvider>
    </GlobalAntdThemeProvider>
  )
}

export default App
