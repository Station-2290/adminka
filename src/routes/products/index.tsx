import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { AlertCircle, Edit, Eye, Package, Plus, Search, Trash2 } from 'lucide-react';
import type { components } from '@/__generated__/api/index';
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
import { useProducts } from '@/hooks/useProducts';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

type Product = components['schemas']['Product'];

export const Route = createFileRoute('/products/')({
  component: ProductsPage,
});


function ProductsPage() {
  useDocumentTitle({
    title: 'Продукты',
    description: 'Управление товарами кофейни - каталог продуктов, цены, наличие и категории',
    keywords: 'продукты, товары, каталог, цены, наличие'
  });

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page] = useState(1);
  
  const { data: productsResponse, isLoading, error } = useProducts(page, 50);
  
  const products = productsResponse?.data || [];
  
  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Нет в наличии</Badge>;
    } else if (stock < 10) {
      return <Badge variant="secondary">Мало</Badge>;
    } else if (stock < 50) {
      return <Badge variant="outline">Средне</Badge>;
    } else {
      return <Badge variant="default">В наличии</Badge>;
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ошибка загрузки продуктов. Проверьте подключение к серверу.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Продукты</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Управление каталогом продуктов
          </p>
        </div>
        <Button className="w-full sm:w-auto" asChild>
          <Link to="/products/create" className='flex items-center'>
            <Plus className="h-4 w-4 mr-2" />
            Добавить продукт
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего продуктов
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : products.length}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? 'Загрузка...' : `${products.filter((p: Product) => p.is_active).length} активных`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              В акции
            </CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : products.filter((p: Product) => p.is_promoted).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Продукты в акции
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Заканчиваются
            </CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : products.filter((p: Product) => p.stock < 10).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Товаров мало в наличии
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">Каталог продуктов</CardTitle>
          <CardDescription>
            {isLoading ? 'Загрузка...' : 'Управление товарами и их наличием'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию, SKU или категории..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {/* Desktop skeleton */}
              <div className="hidden md:block">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Категория</TableHead>
                        <TableHead>Цена</TableHead>
                        <TableHead>Объем</TableHead>
                        <TableHead>Остаток</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Mobile skeleton */}
              <div className="md:hidden space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>Объем</TableHead>
                      <TableHead>Остаток</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product: Product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {product.name}
                              {product.is_promoted && (
                                <Badge variant="outline" className="text-orange-600">
                                  Акция
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {product.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{product.sku}</TableCell>
                        <TableCell>—</TableCell>
                        <TableCell>{product.price} ₽</TableCell>
                        <TableCell>
                          {typeof product.volume_ml === 'number' ? `${product.volume_ml} мл` : '—'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{product.stock} шт.</span>
                            {getStockBadge(product.stock)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.is_active ? 'default' : 'secondary'}>
                            {product.is_active ? 'Активный' : 'Неактивный'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate({ to: `/products/${product.id}` })}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate({ to: `/products/${product.id}/edit` })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden">
                {filteredProducts.map((product: Product) => (
                  <MobileCard key={product.id}>
                    <MobileCardHeader
                      title={
                        <div className="flex items-center gap-2">
                          {product.name}
                          {product.is_promoted && (
                            <Badge variant="outline" className="text-orange-600">
                              Акция
                            </Badge>
                          )}
                        </div>
                      }
                      subtitle={product.description}
                      actions={
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate({ to: `/products/${product.id}` })}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate({ to: `/products/${product.id}/edit` })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      }
                    />
                    <MobileCardRow label="SKU" value={product.sku} />
                    <MobileCardRow label="Категория" value="—" />
                    <MobileCardRow label="Цена" value={`${product.price} ₽`} />
                    <MobileCardRow 
                      label="Объем" 
                      value={typeof product.volume_ml === 'number' ? `${product.volume_ml} мл` : '—'} 
                    />
                    <MobileCardRow
                      label="Остаток"
                      value={
                        <div className="flex items-center gap-2">
                          <span>{product.stock} шт.</span>
                          {getStockBadge(product.stock)}
                        </div>
                      }
                    />
                    <MobileCardRow
                      label="Статус"
                      value={
                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                          {product.is_active ? 'Активный' : 'Неактивный'}
                        </Badge>
                      }
                    />
                  </MobileCard>
                ))}
              </div>

              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
              {filteredProducts.length === 0 && !isLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  Продукты не найдены
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}