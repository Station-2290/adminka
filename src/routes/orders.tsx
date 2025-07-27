import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileCard, MobileCardHeader, MobileCardRow } from '@/components/ui/mobile-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Eye, Edit, X, ShoppingCart, AlertCircle } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { components } from '@/__generated__/api/index';

type Order = components['schemas']['Order'];

export const Route = createFileRoute('/orders')({
  component: OrdersPage,
});

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: 'Ожидает',
    CONFIRMED: 'Подтвержден',
    PREPARING: 'Готовится',
    READY: 'Готов',
    COMPLETED: 'Выполнен',
    CANCELLED: 'Отменен',
  };
  return labels[status] || status;
}

function getStatusVariant(status: string) {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    PENDING: 'outline',
    CONFIRMED: 'secondary',
    PREPARING: 'default',
    READY: 'default',
    COMPLETED: 'secondary',
    CANCELLED: 'destructive',
  };
  return variants[status] || 'outline';
}

function OrdersPage() {
  useDocumentTitle({
    title: 'Заказы',
    description: 'Управление заказами клиентов - обработка, статусы и история заказов',
    keywords: 'заказы, клиенты, обработка, статусы, история'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  
  const statusValue = statusFilter === 'all' ? undefined : statusFilter as Order['status'];
  const { data: ordersResponse, isLoading, error } = useOrders(page, 50, statusValue);
  
  const orders = ordersResponse?.data || [];
  const meta = ordersResponse?.meta;

  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch = order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toString().includes(searchTerm);
    
    return matchesSearch;
  });

  const statusCounts = {
    total: orders.length,
    pending: orders.filter((o: Order) => o.status === 'PENDING').length,
    preparing: orders.filter((o: Order) => ['CONFIRMED', 'PREPARING'].includes(o.status)).length,
    ready: orders.filter((o: Order) => o.status === 'READY').length,
    completed: orders.filter((o: Order) => o.status === 'COMPLETED').length,
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ошибка загрузки заказов. Проверьте подключение к серверу.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Заказы</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Управление заказами клиентов
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего заказов
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">
              За сегодня
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              В ожидании
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">
              Требуют обработки
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              В работе
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.preparing}</div>
            <p className="text-xs text-muted-foreground">
              Готовятся
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Готовы
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.ready}</div>
            <p className="text-xs text-muted-foreground">
              К выдаче
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список заказов</CardTitle>
          <CardDescription>
            Обработка и управление заказами
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по номеру заказа, клиенту..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Фильтр по статусу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="PENDING">Ожидает</SelectItem>
                <SelectItem value="CONFIRMED">Подтвержден</SelectItem>
                <SelectItem value="PREPARING">Готовится</SelectItem>
                <SelectItem value="READY">Готов</SelectItem>
                <SelectItem value="COMPLETED">Выполнен</SelectItem>
                <SelectItem value="CANCELLED">Отменен</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:block border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер заказа</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Позиции</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Создан</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  filteredOrders.map((order: Order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">
                        {order.order_number || `#${order.id}`}
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">Гость</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          Нет позиций
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.total_amount} ₽
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.created_at ? new Date(order.created_at).toLocaleString('ru-RU') : 'Не указано'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                            <Button variant="outline" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredOrders.map((order: Order) => (
                <MobileCard key={order.id}>
                  <MobileCardHeader
                    title={
                      <div className="font-mono font-medium">
                        {order.order_number || `#${order.id}`}
                      </div>
                    }
                    subtitle={
                      order.created_at ? new Date(order.created_at).toLocaleString('ru-RU') : 'Не указано'
                    }
                    actions={
                      <Badge variant={getStatusVariant(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    }
                  />
                  <div className="space-y-2">
                    <MobileCardRow 
                      label="Клиент"
                      value={<span className="text-muted-foreground">Гость</span>}
                    />
                    <MobileCardRow 
                      label="Позиции"
                      value={
                        <div className="text-sm">
                          Нет позиций
                        </div>
                      }
                    />
                    <MobileCardRow 
                      label="Сумма"
                      value={<span className="font-medium">{order.total_amount} ₽</span>}
                    />
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Просмотр
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Изменить
                      </Button>
                      {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                        <Button variant="outline" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </MobileCard>
              ))
            )}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Заказы не найдены
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}