import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { ConnectorDashboard } from '../components/connectors/ConnectorDashboard';

const AdminConnectors: React.FC = () => {
    return (
        <AdminLayout>
            <ConnectorDashboard />
        </AdminLayout>
    );
};

export default AdminConnectors;
