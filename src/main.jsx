import React from 'react'
import ReactDOM from 'react-dom/client'
import { WrappedApp } from './App.jsx'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
    <WrappedApp />
    </DndProvider>
  </React.StrictMode>,
)
