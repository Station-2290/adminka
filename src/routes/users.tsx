import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AlertCircle, Edit, Plus, Search, Trash2 } from 'lucide-react';
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
import { useUsers } from '@/hooks/useUsers';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

type User = components['schemas']['User'];

export const Route = createFileRoute('/users')({
  component: UsersPage,
});

function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    ADMIN: 'Администратор',
    MANAGER: 'Менеджер',
    EMPLOYEE: 'Сотрудник',
    CUSTOMER: 'Клиент',
  };
  return labels[role] || role;
}

function getRoleVariant(role: string) {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    ADMIN: 'destructive',
    MANAGER: 'default',
    EMPLOYEE: 'secondary',
    CUSTOMER: 'outline',
  };
  return variants[role] || 'outline';
}

function UsersPage() {
  useDocumentTitle({
    title: 'Пользователи',
    description: 'Управление пользователями системы - просмотр, редактирование и администрирование учетных записей',
    keywords: 'пользователи, управление, администрирование, учетные записи'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [page] = useState(1);
  
  const { data: usersResponse, isLoading, error } = useUsers(page, 20);
  
  const users = usersResponse?.data || [];
  
  const filteredUsers = users.filter((user: User) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ошибка загрузки пользователей. Проверьте подключение к серверу.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Пользователи</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Управление пользователями системы
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Добавить пользователя
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">Список пользователей</CardTitle>
          <CardDescription>
            {isLoading ? 'Загрузка...' : `Всего пользователей: ${users.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по email или имени пользователя..."
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
                        <TableHead>ID</TableHead>
                        <TableHead>Имя пользователя</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Дата создания</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
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
                      <Skeleton className="h-5 w-32 mb-2" />
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
                      <TableHead>ID</TableHead>
                      <TableHead>Имя пользователя</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Дата создания</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user: User) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleVariant(user.role)}>
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'default' : 'secondary'}>
                            {user.is_active ? 'Активный' : 'Неактивный'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('ru-RU')}
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
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden">
                {filteredUsers.map((user: User) => (
                  <MobileCard key={user.id}>
                    <MobileCardHeader
                      title={user.username}
                      subtitle={user.email}
                      actions={
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      }
                    />
                    <MobileCardRow
                      label="ID"
                      value={user.id}
                    />
                    <MobileCardRow
                      label="Роль"
                      value={
                        <Badge variant={getRoleVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      }
                    />
                    <MobileCardRow
                      label="Статус"
                      value={
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Активный' : 'Неактивный'}
                        </Badge>
                      }
                    />
                    <MobileCardRow
                      label="Создан"
                      value={new Date(user.created_at).toLocaleDateString('ru-RU')}
                    />
                  </MobileCard>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Пользователи не найдены
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}