import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useCategory, useUpdateCategory } from '@/hooks/useCategories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { components } from '@/__generated__/api/index';

type UpdateCategoryDto = components['schemas']['UpdateCategoryDto'];

export const Route = createFileRoute('/categories/$id/edit/')({
  component: EditCategoryPage,
});

function EditCategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/categories/$id/edit/' });
  const categoryId = parseInt(id);

  const { data: category, isLoading, error } = useCategory(categoryId);
  const updateCategoryMutation = useUpdateCategory();

  useDocumentTitle({
    title: category ? `Редактировать ${category.name}` : 'Редактировать категорию',
    description: 'Редактирование категории товаров',
    keywords: 'редактировать, категория, изменить'
  });

  const [formData, setFormData] = useState<UpdateCategoryDto>({
    name: '',
    description: null,
    slug: '',
    is_active: true,
    display_order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalSlug, setOriginalSlug] = useState<string>('');

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        slug: category.slug,
        is_active: category.is_active,
        display_order: category.display_order,
      });
      setOriginalSlug(category.slug);
    }
  }, [category]);

  const handleInputChange = (field: keyof UpdateCategoryDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[а-я]/g, (char) => {
        const translit: Record<string, string> = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
          'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return translit[char] || char;
      })
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (value: string) => {
    handleInputChange('name', value);
    if (formData.slug === originalSlug || formData.slug === generateSlug(formData.name || '')) {
      handleInputChange('slug', generateSlug(value));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Название обязательно';
    }

    if (!formData.slug?.trim()) {
      newErrors.slug = 'Slug обязателен';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug может содержать только строчные буквы, цифры и дефисы';
    }

    if ((formData.display_order || 0) < 0) {
      newErrors.display_order = 'Порядок отображения не может быть отрицательным';
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
      await updateCategoryMutation.mutateAsync({
        params: { path: { id: categoryId } },
        body: formData
      });
      navigate({ to: '/categories' });
    } catch (error) {
      console.error('Failed to update category:', error);
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
          onClick={() => navigate({ to: '/categories' })}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          К категориям
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Редактировать категорию</h1>
        <p className="text-muted-foreground">
          Изменение информации о категории "{category?.name}"
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о категории</CardTitle>
          <CardDescription>
            Измените необходимые поля для обновления категории
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Название <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Горячие напитки"
                  value={formData.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  placeholder="hot-beverages"
                  value={formData.slug || ''}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className={errors.slug ? 'border-red-500' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  URL-дружественный идентификатор категории
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Кофе, чай и другие горячие напитки"
                value={typeof formData.description === 'string' ? formData.description : ''}
                onChange={(e) => handleInputChange('description', e.target.value || null)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_order">Порядок отображения</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.display_order || 0}
                  onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                  className={errors.display_order ? 'border-red-500' : ''}
                />
                {errors.display_order && (
                  <p className="text-sm text-red-500">{errors.display_order}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Чем меньше число, тем выше категория в списке
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_active">Статус</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active" className="font-normal">
                    {formData.is_active ? 'Активная' : 'Неактивная'}
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/categories' })}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={updateCategoryMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateCategoryMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}