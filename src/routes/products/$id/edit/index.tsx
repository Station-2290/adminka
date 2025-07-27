import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { components } from '@/__generated__/api/index';

type UpdateProductDto = components['schemas']['UpdateProductDto'];
type Category = components['schemas']['Category'];

export const Route = createFileRoute('/products/$id/edit/')({
  component: EditProductPage,
});

function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/products/$id/edit/' });
  const productId = parseInt(id);

  const { data: product, isLoading, error } = useProduct(productId);
  const updateProductMutation = useUpdateProduct();
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories(1, 100);

  const categories = categoriesResponse?.data || [];

  useDocumentTitle({
    title: product ? `Редактировать ${product.name}` : 'Редактировать продукт',
    description: 'Редактирование продукта',
    keywords: 'редактировать, продукт, изменить'
  });

  const [formData, setFormData] = useState<UpdateProductDto>({
    name: '',
    description: '',
    price: 0,
    is_active: true,
    volume_ml: null,
    is_promoted: false,
    sku: '',
    stock: 0,
    image_url: null,
    category_id: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        is_active: product.is_active,
        volume_ml: product.volume_ml,
        is_promoted: product.is_promoted,
        sku: product.sku,
        stock: product.stock,
        image_url: product.image_url,
        category_id: product.category_id,
      });
    }
  }, [product]);

  const handleInputChange = (field: keyof UpdateProductDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.name !== undefined && !formData.name.trim()) {
      newErrors.name = 'Название обязательно';
    }

    if (formData.description !== undefined && !formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }

    if (formData.price !== undefined && formData.price <= 0) {
      newErrors.price = 'Цена должна быть больше 0';
    }

    if (formData.sku !== undefined && !formData.sku.trim()) {
      newErrors.sku = 'SKU обязателен';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Остаток не может быть отрицательным';
    }

    if (formData.category_id !== undefined && (!formData.category_id || formData.category_id === 0)) {
      newErrors.category_id = 'Выберите категорию';
    }

    if (formData.volume_ml !== null && formData.volume_ml !== undefined && formData.volume_ml <= 0) {
      newErrors.volume_ml = 'Объем должен быть больше 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateProductMutation.mutateAsync({
        params: { path: { id: productId } },
        body: formData
      });
      navigate({ to: '/products' });
    } catch (error) {
      console.error('Failed to update product:', error);
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

  if (isLoading || categoriesLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Редактировать продукт</h1>
        <p className="text-muted-foreground">
          Изменение информации о продукте "{product?.name}"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
            <CardDescription>
              Измените основные данные о продукте
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Название <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Капучино"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">
                  SKU <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sku"
                  placeholder="COF-CAP-001"
                  value={formData.sku || ''}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className={errors.sku ? 'border-red-500' : ''}
                />
                {errors.sku && (
                  <p className="text-sm text-red-500">{errors.sku}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Уникальный код товара
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Описание <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Классический итальянский кофе с молочной пеной"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Категория <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={(formData.category_id || 0).toString()} 
                  onValueChange={(value) => handleInputChange('category_id', parseInt(value))}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: Category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && (
                  <p className="text-sm text-red-500">{errors.category_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Изображение</Label>
                <Input
                  id="image_url"
                  type="url"
                  placeholder="https://example.com/cappuccino.jpg"
                  value={typeof formData.image_url === 'string' ? formData.image_url : ''}
                  onChange={(e) => handleInputChange('image_url', e.target.value || null)}
                />
                <p className="text-xs text-muted-foreground">
                  URL изображения продукта
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Цена и наличие</CardTitle>
            <CardDescription>
              Измените цену, объем и количество товара
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Цена (₽) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="250"
                  value={formData.price || 0}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume_ml">Объем (мл)</Label>
                <Input
                  id="volume_ml"
                  type="number"
                  min="0"
                  placeholder="350"
                  value={typeof formData.volume_ml === 'number' ? formData.volume_ml : ''}
                  onChange={(e) => handleInputChange('volume_ml', e.target.value ? parseInt(e.target.value) : null)}
                  className={errors.volume_ml ? 'border-red-500' : ''}
                />
                {errors.volume_ml && (
                  <p className="text-sm text-red-500">{errors.volume_ml}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Для напитков
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">
                  Остаток (шт.) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="100"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                  className={errors.stock ? 'border-red-500' : ''}
                />
                {errors.stock && (
                  <p className="text-sm text-red-500">{errors.stock}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Дополнительные настройки</CardTitle>
            <CardDescription>
              Статус продукта и промо-акции
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Активный продукт</Label>
                <p className="text-sm text-muted-foreground">
                  Продукт будет отображаться в каталоге
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_promoted">В акции</Label>
                <p className="text-sm text-muted-foreground">
                  Продукт будет отмечен специальным значком
                </p>
              </div>
              <Switch
                id="is_promoted"
                checked={formData.is_promoted}
                onCheckedChange={(checked) => handleInputChange('is_promoted', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/products' })}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={updateProductMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateProductMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </div>
      </form>
    </div>
  );
}