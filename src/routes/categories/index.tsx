import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, Coffee, Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
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
import { useCategories } from '@/hooks/useCategories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

type Category = components['schemas']['Category'];

export const Route = createFileRoute('/categories/')({
  component: CategoriesPage,
});


function CategoriesPage() {
  useDocumentTitle({
    title: 'Категории',
    description: 'Управление категориями товаров - структура каталога и организация продуктов',
    keywords: 'категории, структура, каталог, организация'
  });

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: categoriesResponse, isLoading, error } = useCategories(1, 100);
  
  const categories = categoriesResponse?.data || [];

  const filteredCategories = categories.filter((category: Category) => {
    const description = typeof category.description === 'string' ? category.description : '';
    return (
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedCategories = [...filteredCategories].sort((a: Category, b: Category) => a.display_order - b.display_order);

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ошибка загрузки категорий. Проверьте подключение к серверу.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className='w-full'>
          <h1 className="text-3xl font-bold">Категории</h1>
          <p className="text-muted-foreground">
            Управление категориями продуктов
          </p>
        </div>
        <Button 
          className='w-full sm:w-auto sm:self-auto'
        >
          <Link to="/categories/create" className='flex items-center'>
            <Plus className="h-4 w-4 mr-2" />
            Добавить категорию
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего категорий
            </CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{categories.length}</div>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-20 mt-1" />
            ) : (
              <p className="text-xs text-muted-foreground">
                {categories.filter((c: Category) => c.is_active).length} активных
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              С продуктами
            </CardTitle>
            <Coffee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {categories.filter((c: Category) => ('product_count' in c ? (c.product_count as number) : 0) > 0).length}
              </div>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-20 mt-1" />
            ) : (
              <p className="text-xs text-muted-foreground">
                Непустые категории
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Общее количество товаров
            </CardTitle>
            <Coffee className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {categories.reduce((sum: number, c: Category) => sum + ('product_count' in c ? (c.product_count as number) : 0), 0)}
              </div>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-20 mt-1" />
            ) : (
              <p className="text-xs text-muted-foreground">
                Во всех категориях
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список категорий</CardTitle>
          <CardDescription>
            Управление категориями и их порядком отображения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию, slug или описанию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="hidden md:block border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Порядок</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Продукты</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата создания</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  sortedCategories.map((category: Category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{category.display_order}</span>
                          <div className="flex flex-col space-y-1">
                            <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-muted-foreground">
                          {typeof category.description === 'string' ? category.description : '—'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {'product_count' in category ? (category.product_count as number) : 0} шт.
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.is_active ? 'default' : 'secondary'}>
                          {category.is_active ? 'Активная' : 'Неактивная'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {category.created_at ? new Date(category.created_at).toLocaleDateString('ru-RU') : 'Не указано'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate({ to: `/categories/${category.id}` })}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate({ to: `/categories/${category.id}/edit` })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
              sortedCategories.map((category: Category) => (
                <MobileCard key={category.id}>
                  <MobileCardHeader
                    title={<div className="font-medium">{category.name}</div>}
                    subtitle={category.slug}
                    actions={
                      <Badge variant={category.is_active ? 'default' : 'secondary'}>
                        {category.is_active ? 'Активная' : 'Неактивная'}
                      </Badge>
                    }
                  />
                  <div className="space-y-2">
                    <MobileCardRow 
                      label="Описание"
                      value={typeof category.description === 'string' ? category.description : '—'}
                    />
                    <MobileCardRow 
                      label="Продукты"
                      value={
                        <Badge variant="outline">
                          {'product_count' in category ? (category.product_count as number) : 0} шт.
                        </Badge>
                      }
                    />
                    <MobileCardRow 
                      label="Порядок"
                      value={category.display_order}
                    />
                    <MobileCardRow 
                      label="Создана"
                      value={category.created_at ? new Date(category.created_at).toLocaleDateString('ru-RU') : 'Не указано'}
                    />
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        Вверх
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ArrowDown className="h-4 w-4 mr-1" />
                        Вниз
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate({ to: `/categories/${category.id}` })}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate({ to: `/categories/${category.id}/edit` })}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </MobileCard>
              ))
            )}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Категории не найдены
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}