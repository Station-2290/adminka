import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { AlertCircle, ArrowLeft, Calendar, Coffee, Edit, Eye, Package, RefreshCw, Trash2 } from 'lucide-react';
import type { components } from '@/__generated__/api/index';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCategory, useDeleteCategory } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

type Product = components['schemas']['Product'];

export const Route = createFileRoute('/categories/$id/')({
  component: CategoryDetailPage,
});

function CategoryDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/categories/$id/' });
  const categoryId = parseInt(id);

  const { data: category, isLoading, error } = useCategory(categoryId);
  const { data: productsResponse } = useProducts(1, 100);
  const deleteCategoryMutation = useDeleteCategory();

  const categoryProducts = productsResponse?.data.filter(
    (product: Product) => product.category_id === categoryId
  );

  useDocumentTitle({
    title: category ? `${category.name} - Категория` : 'Детали категории',
    description: 'Подробная информация о категории',
    keywords: 'категория, детали, информация'
  });

  const handleDelete = async () => {
    if ((categoryProducts?.length ?? 0) > 0) {
      alert('Невозможно удалить категорию с товарами. Сначала переместите или удалите все товары из этой категории.');
      return;
    }

    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      await deleteCategoryMutation.mutateAsync({
        params: { path: { id: categoryId } }
      });
      navigate({ to: '/categories' });
    } catch (responseError) {
      console.error('Failed to delete category:', responseError);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/categories' })}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            К категориям
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ошибка загрузки категории. Проверьте подключение к серверу или правильность ID.
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

  if (!category) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/categories' })}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          К категориям
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {category.name}
          </h1>
          <p className="text-muted-foreground">
            Slug: {category.slug}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            className="flex-1 sm:flex-none"
            onClick={() => navigate({ to: `/categories/${categoryId}/edit` })}
          >
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1 sm:flex-none"
            onClick={handleDelete}
            disabled={deleteCategoryMutation.isPending || (categoryProducts?.length ?? 0) > 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteCategoryMutation.isPending ? 'Удаление...' : 'Удалить'}
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
                {typeof category.description === 'string' ? category.description : 'Описание отсутствует'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Порядок отображения</h3>
                <p className="text-lg">{category.display_order}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Статус</h3>
                <Badge variant={category.is_active ? 'default' : 'secondary'}>
                  {category.is_active ? 'Активная' : 'Неактивная'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics and dates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Статистика
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Количество товаров</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{categoryProducts?.length ?? 0}</span>
                  <Badge variant="outline">
                    {'product_count' in category ? (category.product_count as number) : 0} шт.
                  </Badge>
                </div>
              </div>

              {(categoryProducts?.length ?? 0) > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Активные товары</h3>
                  <p className="text-muted-foreground">
                    {categoryProducts?.filter((p: Product) => p.is_active).length} из {categoryProducts?.length ?? 0}
                  </p>
                </div>
              )}
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
                <h3 className="font-semibold mb-1">Создана</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(category.created_at).toLocaleString('ru-RU')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Обновлена
                </h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(category.updated_at).toLocaleString('ru-RU')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Products in this category */}
      {(categoryProducts?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Товары в категории
            </CardTitle>
            <CardDescription>
              Список всех товаров, относящихся к этой категории
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categoryProducts?.map((product: Product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'Активный' : 'Неактивный'}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate({ to: `/products/${product.id}` })}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}