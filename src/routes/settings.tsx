import { createFileRoute } from '@tanstack/react-router';
import { RefreshCw, Save, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  useDocumentTitle({
    title: 'Настройки',
    description: 'Настройки системы и конфигурация админ-панели',
    keywords: 'настройки, конфигурация, система'
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">
          Конфигурация системы и параметры приложения
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Общие настройки
            </CardTitle>
            <CardDescription>
              Основные параметры работы системы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Название компании</Label>
              <Input 
                id="company-name" 
                placeholder="Моя кофейня"
                defaultValue="Coffee Shop" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-address">Адрес</Label>
              <Textarea 
                id="company-address" 
                placeholder="Введите адрес кофейни"
                defaultValue="ул. Примерная, д. 123, Москва"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Телефон</Label>
              <Input 
                id="contact-phone" 
                placeholder="+7 (xxx) xxx-xx-xx"
                defaultValue="+7 (495) 123-45-67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input 
                id="contact-email" 
                type="email"
                placeholder="info@coffee.ru"
                defaultValue="info@coffee.ru"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Режим работы</Label>
                <p className="text-sm text-muted-foreground">
                  Отображать статус работы заведения
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="work-hours">Часы работы</Label>
              <Input 
                id="work-hours" 
                placeholder="ПН-ВС: 8:00-22:00"
                defaultValue="ПН-ВС: 8:00-22:00"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Системные параметры</CardTitle>
            <CardDescription>
              Настройки интерфейса и поведения системы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Язык интерфейса</Label>
              <Select defaultValue="ru">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите язык" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Часовой пояс</Label>
              <Select defaultValue="europe/moscow">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите часовой пояс" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe/moscow">Europe/Moscow (MSK)</SelectItem>
                  <SelectItem value="europe/london">Europe/London (GMT)</SelectItem>
                  <SelectItem value="america/new_york">America/New_York (EST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Валюта</Label>
              <Select defaultValue="rub">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите валюту" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rub">Российский рубль (₽)</SelectItem>
                  <SelectItem value="usd">Доллар США ($)</SelectItem>
                  <SelectItem value="eur">Евро (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Темная тема</Label>
                <p className="text-sm text-muted-foreground">
                  Включить темное оформление интерфейса
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Автосохранение</Label>
                <p className="text-sm text-muted-foreground">
                  Автоматически сохранять изменения
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Уведомления</Label>
                <p className="text-sm text-muted-foreground">
                  Получать уведомления о новых заказах
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Настройки заказов</CardTitle>
            <CardDescription>
              Параметры обработки и управления заказами
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order-timeout">Время на подготовку (мин)</Label>
              <Input 
                id="order-timeout" 
                type="number"
                placeholder="15"
                defaultValue="15"
              />
              <p className="text-sm text-muted-foreground">
                Среднее время приготовления заказа
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-orders">Макс. заказов в час</Label>
              <Input 
                id="max-orders" 
                type="number"
                placeholder="50"
                defaultValue="50"
              />
              <p className="text-sm text-muted-foreground">
                Ограничение по количеству заказов
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Автоподтверждение</Label>
                <p className="text-sm text-muted-foreground">
                  Автоматически подтверждать новые заказы
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Проверка остатков</Label>
                <p className="text-sm text-muted-foreground">
                  Блокировать заказы при нехватке товара
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="low-stock">Уведомление об остатках</Label>
              <Input 
                id="low-stock" 
                type="number"
                placeholder="10"
                defaultValue="10"
              />
              <p className="text-sm text-muted-foreground">
                Предупреждать, когда товара меньше указанного количества
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Безопасность</CardTitle>
            <CardDescription>
              Настройки безопасности и доступа к системе
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Время сессии (мин)</Label>
              <Input 
                id="session-timeout" 
                type="number"
                placeholder="30"
                defaultValue="30"
              />
              <p className="text-sm text-muted-foreground">
                Автоматический выход при неактивности
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-attempts">Попыток входа</Label>
              <Input 
                id="max-attempts" 
                type="number"
                placeholder="3"
                defaultValue="3"
              />
              <p className="text-sm text-muted-foreground">
                Максимальное количество неудачных попыток входа
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Двухфакторная аутентификация</Label>
                <p className="text-sm text-muted-foreground">
                  Дополнительная защита аккаунта
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Журнал действий</Label>
                <p className="text-sm text-muted-foreground">
                  Сохранять историю действий пользователей
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Сбросить все API ключи
              </Button>
              <p className="text-sm text-muted-foreground">
                Отзовет все существующие API ключи
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Отменить
        </Button>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Сохранить настройки
        </Button>
      </div>
    </div>
  );
}