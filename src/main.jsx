import React from 'react'
import ReactDOM from 'react-dom/client'
import { WrappedApp } from './App.jsx'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from 'react-dnd-touch-backend'; //?
import './index.css'

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0; //?

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <DndProvider backend={HTML5Backend}> */}
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
    <WrappedApp />
    </DndProvider>
  </React.StrictMode>,
)
