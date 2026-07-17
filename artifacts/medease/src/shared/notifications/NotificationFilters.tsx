import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Switch } from '@/shared/ui/switch';
import { cn } from '@/shared/lib/utils';

interface NotificationFiltersProps {
  category: string;
  priority: string;
  unreadOnly: boolean;
  onCategoryChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onUnreadOnlyChange: (value: boolean) => void;
  className?: string;
}

export function NotificationFilters({
  category,
  priority,
  unreadOnly,
  onCategoryChange,
  onPriorityChange,
  onUnreadOnlyChange,
  className,
}: NotificationFiltersProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-3', className)}>
      <div className="space-y-2">
        <Label htmlFor="notification-category">Category</Label>
        <Select
          value={category || 'all'}
          onValueChange={(v) => onCategoryChange(v === 'all' ? '' : v)}
        >
          <SelectTrigger id="notification-category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="clinical">Clinical</SelectItem>
            <SelectItem value="appointment">Appointments</SelectItem>
            <SelectItem value="transfer">Transfers</SelectItem>
            <SelectItem value="medication">Medication</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="administrative">Administrative</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notification-priority">Priority</Label>
        <Select
          value={priority || 'all'}
          onValueChange={(v) => onPriorityChange(v === 'all' ? '' : v)}
        >
          <SelectTrigger id="notification-priority">
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end gap-3 pb-2">
        <Switch
          id="notification-unread"
          checked={unreadOnly}
          onCheckedChange={onUnreadOnlyChange}
        />
        <Label htmlFor="notification-unread">Unread only</Label>
      </div>
    </div>
  );
}
