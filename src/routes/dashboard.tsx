import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, ShoppingCart, Coffee } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useCategories } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { components } from '@/__generated__/api/index';

type User = components['schemas']['User'];
type Product = components['schemas']['Product'];
type Order = components['schemas']['Order'];
type Category = components['schemas']['Category'];

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  useDocumentTitle({
    title: 'Главная',
    description: 'Панель управления кофейни - обзор статистики, заказов и ключевых показателей',
    keywords: 'панель управления, статистика, обзор, заказы, продукты, пользователи'
  });

  const { data: usersResponse, isLoading: usersLoading } = useUsers(1, 100);
  const { data: productsResponse, isLoading: productsLoading } = useProducts(1, 100);
  const { data: ordersResponse, isLoading: ordersLoading } = useOrders(1, 100);
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories(1, 100);

  const users = usersResponse?.data || [];
  const products = productsResponse?.data || [];
  const orders = ordersResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  const stats = [
    {
      title: 'Пользователи',
      value: usersLoading ? '...' : users?.length?.toString(),
      description: usersLoading ? 'Загрузка...' : `${users?.filter((u: User) => u.is_active).length} активных`,
      icon: Users,
      color: 'text-blue-600',
      loading: usersLoading,
    },
    {
      title: 'Продукты',
      value: productsLoading ? '...' : products.length?.toString(),
      description: productsLoading ? 'Загрузка...' : `${products.filter((p: Product) => p.is_active).length} в наличии`,
      icon: Package,
      color: 'text-green-600',
      loading: productsLoading,
    },
    {
      title: 'Заказы',
      value: ordersLoading ? '...' : orders.length.toString(),
      description: ordersLoading ? 'Загрузка...' : 'За сегодня',
      icon: ShoppingCart,
      color: 'text-orange-600',
      loading: ordersLoading,
    },
    {
      title: 'Категории',
      value: categoriesLoading ? '...' : categories.length.toString(),
      description: categoriesLoading ? 'Загрузка...' : `${categories.filter((c: Category) => c.is_active).length} активных`,
      icon: Coffee,
      color: 'text-purple-600',
      loading: categoriesLoading,
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Добро пожаловать в систему управления кофейней
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Последние заказы</CardTitle>
            <CardDescription>
              Недавние заказы в системе
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <div className="text-right space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order: Order, i: number) => (
                  <div key={order.id || i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm md:text-base">{order.order_number || `Заказ #${1000 + i}`}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Клиент {i + 1}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm md:text-base">
                        {order.total_amount} ₽
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {order.status || 'В работе'}
                      </p>
                    </div>
                  </div>
                )) || 
                // Fallback mock data if no orders
                [1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm md:text-base">Заказ #{1000 + i}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Клиент {i}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm md:text-base">{(Math.random() * 1000 + 500).toFixed(0)} ₽</p>
                      <p className="text-xs md:text-sm text-muted-foreground">В работе</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Популярные продукты</CardTitle>
            <CardDescription>
              Самые заказываемые позиции
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((product: Product, i: number) => (
                  <div key={product.id || i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm md:text-base">{product.name}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Остаток: {product.stock} шт.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm md:text-base">{product.price} ₽</p>
                    </div>
                  </div>
                )) ||
                // Fallback mock data if no products
                ['Капучино', 'Американо', 'Латте', 'Эспрессо', 'Мокко'].map((product, i) => (
                  <div key={product} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm md:text-base">{product}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Продано: {50 - i * 8} шт.</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm md:text-base">{(Math.random() * 200 + 150).toFixed(0)} ₽</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}