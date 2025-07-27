import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { AlertCircle, ArrowLeft, Calendar, Edit, Package, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDeleteProduct, useProduct } from '@/hooks/useProducts';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export const Route = createFileRoute('/products/$id/')({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/products/$id/' });
  const productId = parseInt(id);

  const { data: product, isLoading, error } = useProduct(productId);
  const deleteProductMutation = useDeleteProduct();

  useDocumentTitle({
    title: product ? `${product.name} - Продукт` : 'Детали продукта',
    description: 'Подробная информация о продукте',
    keywords: 'продукт, детали, информация'
  });

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить этот продукт?')) {
      return;
    }

    try {
      await deleteProductMutation.mutateAsync({
        params: { path: { id: productId } }
      });
      navigate({ to: '/products' });
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

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
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/products' })}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            К продуктам
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ошибка загрузки продукта. Проверьте подключение к серверу или правильность ID.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/products' })}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          К продуктам
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {product.name}
            {product.is_promoted && (
              <Badge variant="outline" className="text-orange-600">
                Акция
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            SKU: {product.sku}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            className="flex-1 sm:flex-none"
            onClick={() => navigate({ to: `/products/${productId}/edit` })}
          >
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1 sm:flex-none"
            onClick={handleDelete}
            disabled={deleteProductMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteProductMutation.isPending ? 'Удаление...' : 'Удалить'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Описание</h3>
              <p className="text-muted-foreground">
                {product.description || 'Описание отсутствует'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Цена</h3>
                <p className="text-2xl font-bold">{product.price} ₽</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Объем</h3>
                <p className="text-lg">
                  {typeof product.volume_ml === 'number' ? `${product.volume_ml} мл` : 'Не указан'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Категория</h3>
                <p className="text-muted-foreground">
                  ID категории: {product.category_id}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Изображение</h3>
                <p className="text-muted-foreground">
                  {product.image_url ? 'Загружено' : 'Не загружено'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock and status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Наличие и статус
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Остаток на складе</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{product.stock} шт.</span>
                  {getStockBadge(product.stock)}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Статус</h3>
                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                  {product.is_active ? 'Активный' : 'Неактивный'}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Акция</h3>
                <Badge variant={product.is_promoted ? 'default' : 'outline'}>
                  {product.is_promoted ? 'В акции' : 'Обычная цена'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Даты
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold mb-1">Создан</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(product.created_at).toLocaleString('ru-RU')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Обновлен
                </h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(product.updated_at).toLocaleString('ru-RU')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}