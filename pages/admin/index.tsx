import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined, CategoryOutlined } from '@mui/icons-material';
import React from 'react';
import { AdminLayout } from '../../components/layouts';
import { SummaryTile } from '../../components/admin/SummaryTile';
import { Grid } from '@mui/material';

const DashboardPage = () => {
  return (
    <AdminLayout title="Dashboard" subtitle="Estadísticas generales" icon={<DashboardOutlined />}>
      <Grid container spacing={2}>
        <SummaryTile title="1" subtitle="Órdenes totales" icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />} />
        <SummaryTile title="2" subtitle="Órdenes pagadas" icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />} />
        <SummaryTile title="3" subtitle="Órdenes pendientes" icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />} />
        <SummaryTile title="4" subtitle="Clientes" icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />} />
        <SummaryTile title="5" subtitle="Productos" icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />} />
        <SummaryTile title="6" subtitle="Productos sin existencias" icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />} />
        <SummaryTile title="7" subtitle="Bajo inventario" icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />} />
        <SummaryTile title="8" subtitle="Actualización en:" icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />} />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
