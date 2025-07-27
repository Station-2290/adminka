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
import { Search, Plus, Copy, Edit, Trash2, Key, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { components } from '@/__generated__/api/index';

type ApiKey = components['schemas']['ApiKeyResponseDto'];

export const Route = createFileRoute('/api-keys')({
  component: ApiKeysPage,
});


function ApiKeysPage() {
  useDocumentTitle({
    title: 'API ключи',
    description: 'Управление ключами доступа к API - создание, отзыв и мониторинг доступа',
    keywords: 'API ключи, доступ, безопасность, мониторинг'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());
  const { data: apiKeysResponse, isLoading, error } = useApiKeys();
  
  const apiKeys = apiKeysResponse?.data || [];

  const filteredApiKeys = apiKeys.filter((apiKey: ApiKey) =>
    apiKey.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apiKey.key?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ошибка загрузки API ключей. Проверьте подключение к серверу.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const toggleKeyVisibility = (id: number) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(id)) {
      newVisibleKeys.delete(id);
    } else {
      newVisibleKeys.add(id);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '...' + key.substring(key.length - 8);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // В реальном приложении здесь должно быть уведомление
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">API ключи</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Управление ключами доступа к API
          </p>
        </div>
        <Button className="w-full sm:w-auto sm:self-auto">
          <Plus className="h-4 w-4 mr-2" />
          Создать API ключ
        </Button>
      </div>

      <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription>
          API ключи предоставляют доступ к системе. Храните их в безопасности и не делитесь ими с третьими лицами.
          При компрометации ключа немедленно отзовите его и создайте новый.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего ключей
            </CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{apiKeys.length}</div>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-20 mt-1" />
            ) : (
              <p className="text-xs text-muted-foreground">
                {apiKeys.filter((k: ApiKey) => k.is_active !== false).length} активных
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Истекающие
            </CardTitle>
            <Key className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                0
              </div>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-20 mt-1" />
            ) : (
              <p className="text-xs text-muted-foreground">
                Требуют обновления
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Недавно использованные
            </CardTitle>
            <Key className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                0
              </div>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-20 mt-1" />
            ) : (
              <p className="text-xs text-muted-foreground">
                За последний день
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список API ключей</CardTitle>
          <CardDescription>
            Управление ключами доступа и их правами
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или ключу..."
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
                  <TableHead>Название</TableHead>
                  <TableHead>Ключ</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Истекает</TableHead>
                  <TableHead>Последнее использование</TableHead>
                  <TableHead>Создан</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  filteredApiKeys.map((apiKey: ApiKey) => (
                    <TableRow key={apiKey.id || 0}>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {visibleKeys.has(apiKey.id || 0) ? apiKey.key : maskKey(apiKey.key || '')}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id || 0)}
                          >
                            {visibleKeys.has(apiKey.id || 0) ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key || '')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={apiKey.is_active !== false ? 'default' : 'secondary'}>
                          {apiKey.is_active !== false ? 'Активный' : 'Неактивный'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">Без ограничений</span>
                      </TableCell>
                      <TableCell>
                        {apiKey.last_used_at && typeof apiKey.last_used_at === 'string' ? (
                          new Date(apiKey.last_used_at).toLocaleString('ru-RU')
                        ) : (
                          <span className="text-muted-foreground">Не использовался</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {apiKey.created_at ? new Date(apiKey.created_at).toLocaleDateString('ru-RU') : 'Не указано'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm">
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
              filteredApiKeys.map((apiKey: ApiKey) => (
                <MobileCard key={apiKey.id || 0}>
                  <MobileCardHeader
                    title={<div className="font-medium">{apiKey.name}</div>}
                    subtitle={
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {visibleKeys.has(apiKey.id || 0) ? apiKey.key : maskKey(apiKey.key || '')}
                      </code>
                    }
                    actions={
                      <Badge variant={apiKey.is_active !== false ? 'default' : 'secondary'}>
                        {apiKey.is_active !== false ? 'Активный' : 'Неактивный'}
                      </Badge>
                    }
                  />
                  <div className="space-y-2">
                    <MobileCardRow 
                      label="Истекает"
                      value={<span className="text-muted-foreground">Без ограничений</span>}
                    />
                    <MobileCardRow 
                      label="Последнее использование"
                      value={
                        apiKey.last_used_at && typeof apiKey.last_used_at === 'string' ? (
                          new Date(apiKey.last_used_at).toLocaleString('ru-RU')
                        ) : (
                          <span className="text-muted-foreground">Не использовался</span>
                        )
                      }
                    />
                    <MobileCardRow 
                      label="Создан"
                      value={apiKey.created_at ? new Date(apiKey.created_at).toLocaleDateString('ru-RU') : 'Не указано'}
                    />
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => toggleKeyVisibility(apiKey.id || 0)}
                      >
                        {visibleKeys.has(apiKey.id || 0) ? (
                          <><EyeOff className="h-4 w-4 mr-1" />Скрыть</>
                        ) : (
                          <><Eye className="h-4 w-4 mr-1" />Показать</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => copyToClipboard(apiKey.key || '')}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Копировать
                      </Button>
                      <Button variant="outline" size="sm">
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

          {filteredApiKeys.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              API ключи не найдены
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}