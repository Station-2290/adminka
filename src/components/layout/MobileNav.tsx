import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  Coffee,
  Settings,
  Key,
  Menu
} from 'lucide-react';

const navigation = [
  { name: 'Главная', href: '/dashboard', icon: Home },
  { name: 'Пользователи', href: '/users', icon: Users },
  { name: 'Категории', href: '/categories', icon: Coffee },
  { name: 'Продукты', href: '/products', icon: Package },
  { name: 'Заказы', href: '/orders', icon: ShoppingCart },
  { name: 'API ключи', href: '/api-keys', icon: Key },
  { name: 'Настройки', href: '/settings', icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col h-full p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Навигационное меню</SheetTitle>
          <SheetDescription>
            Меню навигации для управления кофейней
          </SheetDescription>
        </SheetHeader>
        
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <Link
            to="/dashboard"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <span className="font-bold text-xl">☕ Админ-панель</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <ScrollArea className="flex-1 px-4">
          <div className="flex flex-col space-y-1 py-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
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
          </div>
        </ScrollArea>

      </SheetContent>
    </Sheet>
  );
}