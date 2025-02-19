import React from 'react'
import DashboardProvider from './provider'

function DashboardLayout({ children }) {
    return (
        <div suppressContentEditableWarning>
            <DashboardProvider>
                {children}
            </DashboardProvider>
        </div>
    )
}

export default DashboardLayout