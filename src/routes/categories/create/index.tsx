import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useCreateCategory } from '@/hooks/useCategories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { components } from '@/__generated__/api/index';

type CreateCategoryDto = components['schemas']['CreateCategoryDto'];

export const Route = createFileRoute('/categories/create/')({
  component: CreateCategoryPage,
});

function CreateCategoryPage() {
  useDocumentTitle({
    title: 'Создать категорию',
    description: 'Создание новой категории товаров',
    keywords: 'создать, категория, новая'
  });

  const navigate = useNavigate();
  const createCategoryMutation = useCreateCategory();

  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: '',
    description: null,
    slug: '',
    is_active: true,
    display_order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CreateCategoryDto, value: any) => {
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
    if (!formData.slug || formData.slug === generateSlug(formData.name)) {
      handleInputChange('slug', generateSlug(value));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название обязательно';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug обязателен';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug может содержать только строчные буквы, цифры и дефисы';
    }

    if (formData.display_order < 0) {
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
      await createCategoryMutation.mutateAsync({
        body: formData
      });
      navigate({ to: '/categories' });
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/categories' })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Создать категорию</h1>
          <p className="text-muted-foreground">
            Добавление новой категории товаров
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о категории</CardTitle>
          <CardDescription>
            Заполните основную информацию о новой категории
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
                  value={formData.name}
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
                  value={formData.slug}
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
                  value={formData.display_order}
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
                disabled={createCategoryMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {createCategoryMutation.isPending ? 'Создание...' : 'Создать категорию'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}