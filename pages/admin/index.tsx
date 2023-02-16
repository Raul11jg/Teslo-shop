import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layouts';
import { SummaryTile } from '../../components/admin/SummaryTile';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined, CategoryOutlined } from '@mui/icons-material';
import { Grid } from '@mui/material';
import useSWR from 'swr';
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000,
  });

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!error && !data) {
    return <></>;
  }

  if (error) {
    console.log(error);
    return <>Error al cargar la información</>;
  }

  const { numberOfOrders, paidOrders, notPaidOrders, numberOfClients, numberOfProducts, productsWithNoInventory, lowInventory } = data!;

  return (
    <AdminLayout title="Dashboard" subtitle="Estadísticas generales" icon={<DashboardOutlined />}>
      <Grid container spacing={2}>
        <SummaryTile title={numberOfOrders} subtitle="Órdenes totales" icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />} />
        <SummaryTile title={paidOrders} subtitle="Órdenes pagadas" icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />} />
        <SummaryTile title={notPaidOrders} subtitle="Órdenes pendientes" icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />} />
        <SummaryTile title={numberOfClients} subtitle="Clientes" icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />} />
        <SummaryTile title={numberOfProducts} subtitle="Productos" icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />} />
        <SummaryTile title={productsWithNoInventory} subtitle="Productos sin existencias" icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />} />
        <SummaryTile title={lowInventory} subtitle="Bajo inventario" icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />} />
        <SummaryTile title={refreshIn} subtitle="Actualización en:" icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />} />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
