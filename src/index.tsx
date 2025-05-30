import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouteObject, RouterProvider, createHashRouter } from 'react-router-dom'
import { Layout } from './layout'
import { Lazy } from 'aurad'
import './index.less'
import 'aurad/dist/style.css'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: Lazy(import('./views/home')),
      },
      {
        path: 'sandbox',
        element: Lazy(import('./views/sandbox'))
      }
    ],
  },
]

function App() {
  return (
    <RouterProvider
      future={{
        v7_startTransition: true,
      }}
      router={createHashRouter(routes, {
        future: {
          v7_relativeSplatPath: true,
        },
      })}
    />
  )
}

createRoot(document.getElementById('root')!).render(<App />)
