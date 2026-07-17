import {
  Archive,
  Check,
  ExternalLink,
  Eye,
  Pin,
  PinOff,
  Trash2,
} from 'lucide-react';

import type { MedNotification } from '@/services/notifications/notification.types';
import { Button } from '@/shared/ui/button';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

interface NotificationActionsProps {
  notification: MedNotification;
  onMarkRead?: (id: string) => void;
  onMarkUnread?: (id: string) => void;
  onArchive?: (id: string) => void;
  onPin?: (id: string, pinned: boolean) => void;
  onDismiss?: (id: string) => void;
  onOpen?: (notification: MedNotification) => void;
  compact?: boolean;
}

/** Permission-aware notification actions — render inside menus or inline. */
export function NotificationActions({
  notification,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onPin,
  onDismiss,
  onOpen,
  compact,
}: NotificationActionsProps) {
  if (compact) {
    return (
      <>
        {notification.target?.href ? (
          <DropdownMenuItem onClick={() => onOpen?.(notification)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </DropdownMenuItem>
        ) : null}
        {!notification.read ? (
          <DropdownMenuItem onClick={() => onMarkRead?.(notification.id)}>
            <Check className="mr-2 h-4 w-4" />
            Mark read
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onMarkUnread?.(notification.id)}>
            <Eye className="mr-2 h-4 w-4" />
            Mark unread
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => onPin?.(notification.id, !notification.pinned)}
        >
          {notification.pinned ? (
            <>
              <PinOff className="mr-2 h-4 w-4" />
              Unpin
            </>
          ) : (
            <>
              <Pin className="mr-2 h-4 w-4" />
              Pin
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onArchive?.(notification.id)}>
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </DropdownMenuItem>
        {notification.priority !== 'critical' ? (
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => onDismiss?.(notification.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Dismiss
          </DropdownMenuItem>
        ) : null}
      </>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {notification.target?.href ? (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onOpen?.(notification)}
        >
          Open
        </Button>
      ) : null}
      {!notification.read ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onMarkRead?.(notification.id)}
        >
          Mark read
        </Button>
      ) : null}
    </div>
  );
}
