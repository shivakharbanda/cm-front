import { useState } from 'react'
import { Plus, Trash2, Globe, Smartphone, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { RoutingRule, RuleType, RoutingRuleCreate } from '@/types/bio'

interface SmartRoutingSectionProps {
  rules: RoutingRule[]
  onAddRule: (rule: RoutingRuleCreate) => void
  onUpdateRule: (ruleId: string, active: boolean) => void
  onDeleteRule: (ruleId: string) => void
}

const RULE_TYPE_OPTIONS: { value: RuleType; label: string; icon: React.ElementType }[] = [
  { value: 'country', label: 'Country', icon: Globe },
  { value: 'device', label: 'Device', icon: Smartphone },
  { value: 'time', label: 'Time', icon: Clock },
]

const COUNTRY_OPTIONS = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'JP', name: 'Japan' },
]

const DEVICE_OPTIONS = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'tablet', label: 'Tablet' },
]

export function SmartRoutingSection({
  rules,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
}: SmartRoutingSectionProps) {
  const [isOpen, setIsOpen] = useState(rules.length > 0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRule, setNewRule] = useState<{
    rule_type: RuleType
    destination_url: string
    config: Record<string, unknown>
  }>({
    rule_type: 'country',
    destination_url: '',
    config: {},
  })

  const handleAddRule = () => {
    if (!newRule.destination_url.trim()) return

    onAddRule({
      rule_type: newRule.rule_type,
      destination_url: newRule.destination_url,
      rule_config: newRule.config,
    })

    setNewRule({
      rule_type: 'country',
      destination_url: '',
      config: {},
    })
    setShowAddForm(false)
  }

  const getRuleIcon = (type: RuleType) => {
    const option = RULE_TYPE_OPTIONS.find((o) => o.value === type)
    const Icon = option?.icon || Globe
    return <Icon className="h-4 w-4" />
  }

  const getRuleDescription = (rule: RoutingRule): string => {
    switch (rule.rule_type) {
      case 'country': {
        const codes = (rule.rule_config.countries as string[]) || []
        const names = codes
          .map((c) => COUNTRY_OPTIONS.find((o) => o.code === c)?.name || c)
          .slice(0, 2)
        if (codes.length > 2) {
          return `${names.join(', ')} +${codes.length - 2} more`
        }
        return names.join(', ') || 'No countries selected'
      }
      case 'device': {
        const device = rule.rule_config.device as string
        return DEVICE_OPTIONS.find((d) => d.value === device)?.label || device || 'Any device'
      }
      case 'time': {
        const start = rule.rule_config.start_hour as number
        const end = rule.rule_config.end_hour as number
        if (start !== undefined && end !== undefined) {
          return `${start}:00 - ${end}:00`
        }
        return 'Any time'
      }
      default:
        return 'Custom rule'
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
          <span className="flex items-center gap-2 font-medium">
            Smart Routing
            {rules.length > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {rules.length} {rules.length === 1 ? 'rule' : 'rules'}
              </span>
            )}
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Route visitors to different URLs based on their location, device, or time.
        </p>

        {/* Existing Rules */}
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
          >
            <div className="flex-shrink-0 p-2 bg-background rounded">
              {getRuleIcon(rule.rule_type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium capitalize">{rule.rule_type}</p>
              <p className="text-xs text-muted-foreground truncate">
                {getRuleDescription(rule)} &rarr; {rule.destination_url}
              </p>
            </div>
            <Switch
              checked={rule.is_active}
              onCheckedChange={(checked) => onUpdateRule(rule.id, checked)}
              aria-label={rule.is_active ? 'Disable rule' : 'Enable rule'}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteRule(rule.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {/* Add New Rule Form */}
        {showAddForm ? (
          <div className="space-y-3 p-3 border rounded-lg">
            <div className="space-y-2">
              <Label>Rule Type</Label>
              <Select
                value={newRule.rule_type}
                onValueChange={(value: RuleType) =>
                  setNewRule((prev) => ({ ...prev, rule_type: value, config: {} }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RULE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country Config */}
            {newRule.rule_type === 'country' && (
              <div className="space-y-2">
                <Label>Countries</Label>
                <Select
                  value={(newRule.config.countries as string[])?.[0] || ''}
                  onValueChange={(value) =>
                    setNewRule((prev) => ({
                      ...prev,
                      config: { ...prev.config, countries: [value] },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_OPTIONS.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Device Config */}
            {newRule.rule_type === 'device' && (
              <div className="space-y-2">
                <Label>Device Type</Label>
                <Select
                  value={(newRule.config.device as string) || ''}
                  onValueChange={(value) =>
                    setNewRule((prev) => ({
                      ...prev,
                      config: { ...prev.config, device: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEVICE_OPTIONS.map((device) => (
                      <SelectItem key={device.value} value={device.value}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Time Config */}
            {newRule.rule_type === 'time' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Start Hour</Label>
                  <Select
                    value={String(newRule.config.start_hour ?? '')}
                    onValueChange={(value) =>
                      setNewRule((prev) => ({
                        ...prev,
                        config: { ...prev.config, start_hour: parseInt(value) },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {i.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>End Hour</Label>
                  <Select
                    value={String(newRule.config.end_hour ?? '')}
                    onValueChange={(value) =>
                      setNewRule((prev) => ({
                        ...prev,
                        config: { ...prev.config, end_hour: parseInt(value) },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {i.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Destination URL</Label>
              <Input
                placeholder="https://example.com/special-offer"
                value={newRule.destination_url}
                onChange={(e) =>
                  setNewRule((prev) => ({ ...prev, destination_url: e.target.value }))
                }
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddRule}>
                Add Rule
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Routing Rule
          </Button>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
