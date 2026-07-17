import {
  HouseLineIcon,
  BrainIcon,
  ArticleNyTimesIcon,
  RobotIcon,
  ImageIcon,
  PaperPlaneTiltIcon,
  GitForkIcon,
  ChartPieSliceIcon,
  GearSixIcon
} from "@phosphor-icons/react"

const navigation = [
  {
    id: "overview",
    label: "Overview",
    path: "/labs/content-mastermind",
    icon: HouseLineIcon,
  },
  {
    id: "analysis",
    label: "Analysis",
    path: "/labs/content-mastermind/analysis",
    icon: BrainIcon,
  },
  {
    id: "content",
    label: "Content",
    path: "/labs/content-mastermind/content",
    icon: ArticleNyTimesIcon,
  },
  {
    id: "agents",
    label: "Agents",
    path: "/labs/content-mastermind/agents",
    icon: RobotIcon,
  },
  {
    id: "images",
    label: "Images",
    path: "/labs/content-mastermind/images",
    icon: ImageIcon,
  },
  {
    id: "publishing",
    label: "Publishing",
    path: "/labs/content-mastermind/publishing",
    icon: PaperPlaneTiltIcon,
  },
  {
    id: "workflows",
    label: "Workflows",
    path: "/labs/content-mastermind/workflows",
    icon: GitForkIcon,
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/labs/content-mastermind/analytics",
    icon: ChartPieSliceIcon,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/labs/content-mastermind/settings",
    icon: GearSixIcon,
  },
];

export default navigation;