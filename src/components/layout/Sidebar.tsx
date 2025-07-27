import { Link, useLocation } from '@tanstack/react-router';
import { 
  Coffee, 
  Home, 
  Key, 
  LogOut, 
  Package,
  Settings,
  ShoppingCart,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/shared/auth';

const navigation = [
  { name: 'Главная', href: '/', icon: Home },
  { name: 'Пользователи', href: '/users', icon: Users },
  { name: 'Категории', href: '/categories', icon: Coffee },
  { name: 'Продукты', href: '/products', icon: Package },
  { name: 'Заказы', href: '/orders', icon: ShoppingCart },
  { name: 'API ключи', href: '/api-keys', icon: Key },
  { name: 'Настройки', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center">
          ☕ Админ-панель
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Управление кофейней
        </p>
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                location.pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">
              {user?.username[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Выйти
        </Button>
      </div>
    </div>
  );
}