/**
 * Notification Settings Component
 * Allows users to configure notification preferences
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import type { NotificationPreferences, NotificationType, NotificationChannel, DigestFrequency } from '@/types/database';
import { useUpdateNotificationPreferences } from '@/hooks/useNotifications';
import { toast } from 'sonner';

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  userId: string;
}

const eventTypes: { value: NotificationType; label: string; description: string }[] = [
  { value: 'proposal', label: 'Proposals', description: 'New proposals, updates, and approvals' },
  { value: 'approval', label: 'Approvals', description: 'Items requiring your approval' },
  { value: 'deployment', label: 'Deployments', description: 'Deployment status and releases' },
  { value: 'invoice', label: 'Invoices', description: 'Invoice generation and payments' },
  { value: 'meeting', label: 'Meetings', description: 'Meeting reminders and updates' },
  { value: 'task', label: 'Tasks', description: 'Task assignments and updates' },
  { value: 'system', label: 'System', description: 'System alerts and maintenance' },
];

const channels: { value: NotificationChannel; label: string; description: string }[] = [
  { value: 'email', label: 'Email', description: 'Receive notifications via email' },
  { value: 'in_app', label: 'In-App', description: 'Show notifications in the application' },
  { value: 'slack', label: 'Slack', description: 'Send notifications to Slack' },
  { value: 'webhook', label: 'Webhook', description: 'Send notifications to custom webhook' },
  { value: 'sms', label: 'SMS', description: 'Send notifications via SMS' },
];

const digestFrequencies: { value: DigestFrequency; label: string }[] = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'never', label: 'Never' },
];

export function NotificationSettings({ preferences, userId }: NotificationSettingsProps) {
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);
  const updatePreferences = useUpdateNotificationPreferences();

  const handleChannelToggle = (channel: NotificationChannel, enabled: boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      [`${channel}_enabled`]: enabled
    }));
  };

  const handleEventPreferenceChange = (eventType: NotificationType, channel: NotificationChannel, enabled: boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      event_preferences: {
        ...prev.event_preferences,
        [eventType]: {
          ...prev.event_preferences[eventType],
          [channel]: enabled
        }
      }
    }));
  };

  const handleSave = async () => {
    try {
      await updatePreferences.mutateAsync({
        userId,
        preferences: localPreferences
      });
      toast.success('Notification preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update notification preferences');
    }
  };

  const hasChanges = JSON.stringify(localPreferences) !== JSON.stringify(preferences);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Settings</h2>
          <p className="text-muted-foreground">
            Configure how and when you receive notifications
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || updatePreferences.isPending}
          className="min-w-24"
        >
          {updatePreferences.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="channels" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="events">Event Types</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>
                Choose which channels you want to receive notifications through
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {channels.map((channel) => (
                <div key={channel.value} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">{channel.label}</Label>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  </div>
                  <Switch
                    checked={localPreferences[`${channel.value}_enabled` as keyof NotificationPreferences] as boolean}
                    onCheckedChange={(enabled) => handleChannelToggle(channel.value, enabled)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Channel-specific settings */}
          <Card>
            <CardHeader>
              <CardTitle>Channel Configuration</CardTitle>
              <CardDescription>
                Configure specific settings for each notification channel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {localPreferences.slack_enabled && (
                <div className="space-y-2">
                  <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                  <Input
                    id="slack-webhook"
                    placeholder="https://hooks.slack.com/services/..."
                    value={localPreferences.slack_webhook_url || ''}
                    onChange={(e) => setLocalPreferences(prev => ({
                      ...prev,
                      slack_webhook_url: e.target.value
                    }))}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="slack-channel">Slack Channel (optional)</Label>
                    <Input
                      id="slack-channel"
                      placeholder="#general"
                      value={localPreferences.slack_channel || ''}
                      onChange={(e) => setLocalPreferences(prev => ({
                        ...prev,
                        slack_channel: e.target.value
                      }))}
                    />
                  </div>
                </div>
              )}

              {localPreferences.webhook_enabled && (
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://your-webhook-endpoint.com/notifications"
                    value={localPreferences.webhook_url || ''}
                    onChange={(e) => setLocalPreferences(prev => ({
                      ...prev,
                      webhook_url: e.target.value
                    }))}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="webhook-headers">Custom Headers (JSON)</Label>
                    <Textarea
                      id="webhook-headers"
                      placeholder='{"Authorization": "Bearer token"}'
                      value={JSON.stringify(localPreferences.webhook_headers, null, 2)}
                      onChange={(e) => {
                        try {
                          const headers = JSON.parse(e.target.value);
                          setLocalPreferences(prev => ({
                            ...prev,
                            webhook_headers: headers
                          }));
                        } catch {
                          // Invalid JSON, ignore
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {localPreferences.sms_enabled && (
                <div className="space-y-2">
                  <Label htmlFor="sms-phone">Phone Number</Label>
                  <Input
                    id="sms-phone"
                    placeholder="+1234567890"
                    value={localPreferences.sms_phone_number || ''}
                    onChange={(e) => setLocalPreferences(prev => ({
                      ...prev,
                      sms_phone_number: e.target.value
                    }))}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Type Preferences</CardTitle>
              <CardDescription>
                Choose which events you want to receive notifications for on each channel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {eventTypes.map((eventType) => (
                <div key={eventType.value} className="space-y-4">
                  <div>
                    <h4 className="font-medium">{eventType.label}</h4>
                    <p className="text-sm text-muted-foreground">{eventType.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {channels.map((channel) => (
                      <div key={channel.value} className="flex items-center space-x-2">
                        <Switch
                          id={`${eventType.value}-${channel.value}`}
                          checked={
                            localPreferences.event_preferences[eventType.value]?.[channel.value] ?? false
                          }
                          onCheckedChange={(enabled) => 
                            handleEventPreferenceChange(eventType.value, channel.value, enabled)
                          }
                          disabled={!localPreferences[`${channel.value}_enabled` as keyof NotificationPreferences]}
                        />
                        <Label 
                          htmlFor={`${eventType.value}-${channel.value}`}
                          className={!localPreferences[`${channel.value}_enabled` as keyof NotificationPreferences] ? 'text-muted-foreground' : ''}
                        >
                          {channel.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure timing and frequency preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Quiet Hours Start</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={localPreferences.quiet_hours_start}
                    onChange={(e) => setLocalPreferences(prev => ({
                      ...prev,
                      quiet_hours_start: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">Quiet Hours End</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={localPreferences.quiet_hours_end}
                    onChange={(e) => setLocalPreferences(prev => ({
                      ...prev,
                      quiet_hours_end: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={localPreferences.timezone}
                  onChange={(e) => setLocalPreferences(prev => ({
                    ...prev,
                    timezone: e.target.value
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="digest-frequency">Digest Frequency</Label>
                <Select
                  value={localPreferences.digest_frequency}
                  onValueChange={(value: DigestFrequency) => setLocalPreferences(prev => ({
                    ...prev,
                    digest_frequency: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {digestFrequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
