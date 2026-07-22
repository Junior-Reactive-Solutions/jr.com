import React from 'react';
import {
  // Services & concepts
  BrainCircuit, Code2, Workflow, BarChart3, Cloud, Sparkles, GraduationCap,
  BookOpen, LayoutDashboard, LineChart, TrendingUp,
  // Actions & UI
  Search, Mail, FileText, ClipboardList, Rocket, Printer, Target, Settings,
  MessageSquare, Lock, Phone, MapPin, Clock, Calendar, Smartphone, Monitor,
  Tablet, Flame, Lightbulb, Banknote, Gem, Wallet, Globe, Image as ImageIcon,
  FolderOpen, Bot, Newspaper, PenLine, Handshake, Trophy, Sprout, Telescope,
  // People & org
  User, Users, Building2,
  // States & feedback
  Inbox, CheckCircle2, Check, XCircle, X, AlertTriangle, HelpCircle, Hand,
  Smile, Zap, Plus, Pencil, Trash2, Eye, Send, ExternalLink, ArrowRight,
  ArrowLeft, RefreshCw, Star,
} from 'lucide-react';

/**
 * Icon — renders a Lucide SVG icon by semantic name.
 *
 * Props:
 *  - name      (required) semantic icon name, see ICONS map below
 *  - size      xs | sm | md | lg | xl   (default md)
 *  - color     primary | secondary | accent | success | error | warning |
 *              white | muted | current  (default current — inherits text color)
 *  - ariaLabel accessible label; when set the icon is exposed as role="img",
 *              otherwise it is hidden from assistive tech (decorative)
 *  - className extra classes
 *  - strokeWidth  line weight (default 2)
 */

// Semantic name -> Lucide component. Backwards-compatible names (service-ai,
// action-email, state-user, ...) are kept alongside shorter aliases.
const ICONS = {
  // ── Services ──
  'service-ai': BrainCircuit,        ai: BrainCircuit,        brain: BrainCircuit,
  'service-dev': Code2,              dev: Code2,              code: Code2,
  'service-automation': Workflow,    automation: Workflow,    workflow: Workflow,
  'service-analytics': BarChart3,    analytics: BarChart3,    chart: BarChart3,
  cloud: Cloud,
  predictive: Sparkles,              sparkles: Sparkles,
  training: GraduationCap,           graduation: GraduationCap,
  courses: BookOpen,                 book: BookOpen,
  bi: LayoutDashboard,               dashboard: LayoutDashboard,
  'line-chart': LineChart,           trending: TrendingUp,

  // ── Actions & UI ──
  'action-search': Search,           search: Search,
  'action-email': Mail,              email: Mail,             mail: Mail,
  'action-document': FileText,       document: FileText,      file: FileText,
  notes: ClipboardList,              list: ClipboardList,
  'action-rocket': Rocket,           rocket: Rocket,
  print: Printer,
  'ui-target': Target,               target: Target,
  'ui-settings': Settings,           settings: Settings,      gear: Settings,
  'ui-messages': MessageSquare,      messages: MessageSquare, message: MessageSquare,
  'ui-lock': Lock,                   lock: Lock,
  phone: Phone,
  location: MapPin,                  pin: MapPin,
  time: Clock,                       clock: Clock,
  calendar: Calendar,
  mobile: Smartphone,                smartphone: Smartphone,
  desktop: Monitor,                  monitor: Monitor,
  tablet: Tablet,
  fire: Flame,                       urgent: Flame,           flame: Flame,
  idea: Lightbulb,                   bulb: Lightbulb,
  money: Banknote,                   price: Banknote,
  gem: Gem,                          diamond: Gem,            premium: Gem,
  wallet: Wallet,
  globe: Globe,                      world: Globe,
  image: ImageIcon,                  picture: ImageIcon,
  files: FolderOpen,                 folder: FolderOpen,
  bot: Bot,
  newspaper: Newspaper,              blog: Newspaper,
  author: PenLine,                   pen: PenLine,            write: PenLine,
  partnership: Handshake,            handshake: Handshake,
  award: Trophy,                     trophy: Trophy,
  growth: Sprout,                    sprout: Sprout,
  telescope: Telescope,

  // ── People & org ──
  'state-user': User,                user: User,
  'state-team': Users,               team: Users,             users: Users,
  company: Building2,                building: Building2,

  // ── States & feedback ──
  'state-empty': Inbox,              empty: Inbox,            inbox: Inbox,
  success: CheckCircle2,             'check-circle': CheckCircle2,
  check: Check,
  error: XCircle,                    'x-circle': XCircle,
  close: X,                          x: X,
  warning: AlertTriangle,            alert: AlertTriangle,
  faq: HelpCircle,                   question: HelpCircle,    help: HelpCircle,
  wave: Hand,                        hand: Hand,
  smile: Smile,
  zap: Zap,                          bolt: Zap,               fast: Zap,
  plus: Plus,                        add: Plus,
  edit: Pencil,                      pencil: Pencil,
  trash: Trash2,                     delete: Trash2,
  eye: Eye,
  send: Send,
  external: ExternalLink,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,        back: ArrowLeft,
  refresh: RefreshCw,             retry: RefreshCw,
  star: Star,
};

// Legacy emoji values (e.g. service icons stored in the database) resolve to a
// semantic name so existing/admin-created data keeps rendering a real icon.
const EMOJI_ALIASES = {
  '⚡': 'zap', '🧠': 'ai', '📚': 'courses', '🔧': 'settings', '🌍': 'globe',
  '🌎': 'globe', '💡': 'idea', '🤝': 'partnership', '🏆': 'award', '🌱': 'growth',
  '👤': 'user', '👥': 'team', '🏢': 'company', '🏛': 'company', '⚙': 'settings',
  '⚙️': 'settings', '📊': 'analytics', '📈': 'trending', '💻': 'dev', '🔥': 'fire',
  '📅': 'calendar', '🗓': 'calendar', '🗓️': 'calendar', '🔭': 'telescope',
  '💵': 'money', '💰': 'money', '💎': 'gem', '📝': 'document', '📋': 'notes',
  '🎓': 'training', '🔮': 'predictive', '🚀': 'rocket', '🎯': 'target',
  '✓': 'check', '✔': 'check', '✅': 'success', '❌': 'error', '✕': 'close',
  '✖': 'close', '⚠': 'warning', '⚠️': 'warning', '✨': 'sparkles', '🖨': 'print',
  '📞': 'phone', '✉': 'email', '✉️': 'email', '📧': 'email', '📬': 'email',
  '📭': 'empty', '📍': 'location', '🕒': 'time', '✍': 'author', '✍️': 'author',
  '📰': 'blog', '🖼': 'image', '🖼️': 'image', '🗂': 'files', '🗂️': 'files',
  '📱': 'mobile', '📲': 'mobile', '🖥': 'desktop', '🖥️': 'desktop', '☁': 'cloud',
  '☁️': 'cloud', '😊': 'smile', '👋': 'wave', '🤔': 'question', '❓': 'faq',
  '🤖': 'bot', '📄': 'document', '🔍': 'search',
};

const SIZES = { xs: 16, sm: 24, md: 32, lg: 48, xl: 64 };

const COLORS = {
  primary:   '#5269c3',
  secondary: '#1c265e',
  accent:    '#90a0da',
  success:   '#10b981',
  error:     '#ef4444',
  warning:   '#f59e0b',
  white:     '#ffffff',
  muted:     '#9ca3af',
  current:   'currentColor',
};

const Icon = ({
  name,
  size = 'md',
  color = 'current',
  className = '',
  ariaLabel = '',
  strokeWidth = 2,
  ...props
}) => {
  const LucideIcon = ICONS[name] || ICONS[EMOJI_ALIASES[name]];
  if (!LucideIcon) {
    if (import.meta.env.DEV) {
      console.warn(`Icon: unknown name "${name}"`);
    }
    return null;
  }

  const px = SIZES[size] || SIZES.md;
  const colorValue = COLORS[color] || color || 'currentColor';

  return (
    <LucideIcon
      size={px}
      color={colorValue}
      strokeWidth={strokeWidth}
      className={['icon', className].filter(Boolean).join(' ')}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel || undefined}
      aria-hidden={ariaLabel ? undefined : true}
      focusable="false"
      {...props}
    />
  );
};

export default Icon;
