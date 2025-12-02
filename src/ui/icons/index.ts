// Icon wrapper component
export type { IconProps, IconVariants, IconWeight } from './icon';
export { Icon, iconVariants } from './icon';

// Brand logos for social authentication
export * from './brand-logos';

// Re-export commonly used icons for convenience
// Import directly from @phosphor-icons/react for tree-shaking
export {
  ArrowLeft,
  ArrowRight,
  // Communication
  Bell,
  Calendar,
  Camera,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Chat,
  Check,
  CheckCircle,
  CircleNotch,
  Clock,
  Copy,
  DotsThree,
  DotsThreeVertical,
  Download,
  Envelope,
  Eye,
  EyeSlash,
  // Files & Documents
  File,
  FileText,
  Folder,
  FolderOpen,
  Gear,
  Globe,
  // Misc
  Heart,
  // Navigation
  House,
  // Media
  Image,
  // Status & Feedback
  Info,
  Link,
  LinkBreak,
  List,
  Lock,
  LockOpen,
  MagnifyingGlass,
  MapPin,
  Minus,
  Moon,
  Pause,
  Pencil,
  Phone,
  Play,
  // Actions
  Plus,
  Question,
  Share,
  SignIn,
  SignOut,
  Spinner,
  Star,
  Sun,
  Trash,
  Upload,
  // User & Account
  User,
  UserCircle,
  Users,
  Warning,
  WarningCircle,
  X,
  XCircle,
} from '@phosphor-icons/react';

// Re-export Phosphor types for TypeScript usage
export type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
