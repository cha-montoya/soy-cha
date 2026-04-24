import { useState } from "react"

import HeaderLanding from "../../components/layout/HeaderLanding"
import FooterLanding from "../../components/layout/FooterLanding"

// ICONS
import {
  EnvelopeSimpleIcon,
  ClockIcon,
  DatabaseIcon,
  FileSqlIcon,
  SignOutIcon
} from "@phosphor-icons/react";

const projects = [
  {
    id: "kidzania",
    title: "Lifecycle Cumpleaños",
    category: "CRM · Automation",
  },
  {
    id: "upn",
    title: "Lead Automation",
    category: "Data · Integration",
  },
  {
    id: "christus",
    title: "Ecommerce Performance",
    category: "Revenue · Paid Media",
  },
];

const GrowthSystems = () => {
  const [activeProject, setActiveProject] = useState("kidzania");

  return (
    <>
      <HeaderLanding />

      <main>
        
        {/* Selector */}
        <section className="bg-slate-100 relative px-6 pt-16 md:pt-32 pb-16 md:pb-16">
          <div className="container mx-auto">
            <ProjectSelector
              projects={projects}
              activeProject={activeProject}
              setActiveProject={setActiveProject}
            />
          </div>
        </section>

        {/* Vista activa */}
        <section className="bg-slate-100 relative px-6 pb-16 md:pb-32">
          <div className="container mx-auto">
            <ProjectView projectId={activeProject} />
          </div>
        </section>
      </main>

      <FooterLanding />
    </>
  );
};

export default GrowthSystems;


/* =========================
  Project Selector
========================= */

const ProjectSelector = ({ projects, activeProject, setActiveProject }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {projects.map((p) => {
        const isActive = p.id === activeProject;

        return (
          <div
            key={p.id}
            onClick={() => setActiveProject(p.id)}
            className={`
              p-6 rounded-lg border cursor-pointer transition-all duration-300
              ${
                isActive
                  ? "bg-white border-main-color scale-[1.02]"
                  : "bg-slate-100 border-slate-200 hover:border-slate-300 text-neutral-700 hover:text-neutral-900"
              }
            `}
          >
            <p className="text-sm text-slate-400 font-sans">
              {p.category}
            </p>

            <h3 className="text-lg mt-2 font-black tracking-tight font-display">
              {p.title}
            </h3>
          </div>
        );
      })}
    </div>
  );
};


/* =========================
  Project View
========================= */

const ProjectView = ({ projectId }) => {
  if (projectId === "kidzania") return <KidzaniaProject />;
  if (projectId === "upn") return <Placeholder title="UPN - Lead Automation" />;
  if (projectId === "christus") return <Placeholder title="Christus - Ecommerce Performance" />;
  return null;
};


/* =========================
  KidZania Project
========================= */

const KidzaniaProject = () => {
  return (
    <div className="border-t border-slate-200 pt-4 animate-fade">

      {/* Header */}
      <div>
        <div className="h-16 w-40 flex items-center mb-4 justify-center">
          <img src="/projects/logos/logo-kidzania-dark.png" className="max-h-full max-w-full object-contain" />
        </div>

        <p className="text-sm text-slate-400 font-sans">
          KidZania · Journey Automation
        </p>

        <h2 className="text-4xl md:text-5xl mt-2 font-black tracking-tight font-display">
          Lifecycle Cumpleaños
        </h2>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl">
          Incrementar las reservaciones para fiestas de cumpleaños en los parques,
          mediante la implementación de un sistema de ciclo de vida de 90 días que
          involucraba a los padres a través de recordatorios oportunos, activadores
          basados ​​en la urgencia y segmentación del comportamiento.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
        <Metric label="Open Rate" value="52%" trend="up" />
        <Metric label="CTR" value="14%" trend="up" />
        <Metric label="Conversion" value="8.3%" trend="up" />
        <Metric label="CPA" value="-27%" trend="down" />
      </div>

      {/* Insight */}
      <p className="mt-12 text-slate-700 max-w-xl">
        Conversion peaked during the final 30-day window, where urgency-driven
        messaging outperformed early-stage engagement by 2.1x.
      </p>

      {/* Canvas */}
      <div className="justify-center">
        <JourneyCanvas />
      </div>
      

    </div>
  );
};


/* =========================
  Journey Canvas
========================= */
const JourneyCanvas = () => {
  const nodes = [
    {
      id: 1,
      label: "Trigger",
      description: "Birthday detected in CRM",
      icon: FileSqlIcon,
      type: "trigger",
    },
    {
      id: 2,
      label: "Email 90d",
      description: "Early awareness email",
      icon: EnvelopeSimpleIcon,
      type: "email",

      branch: [
        {
          id: "2a",
          label: "Opened",
          description: "User opened email",
          type: "success",
        },
        {
          id: "2b",
          label: "No Open",
          description: "Resend with new subject",
          type: "warning",
        },
      ],
    },
    {
      id: 3,
      label: "Wait",
      description: "Wait 30 days",
      icon: ClockIcon,
      type: "wait",
    },
    {
      id: 4,
      label: "Email 60d",
      description: "Reminder with benefits",
      icon: EnvelopeSimpleIcon,
      type: "email",
    },
    {
      id: 5,
      label: "Email 30d",
      description: "Urgency-driven message",
      icon: EnvelopeSimpleIcon,
      type: "email",
    },
    {
      id: 6,
      label: "Conversion",
      description: "Reservation completed",
      icon: SignOutIcon,
      type: "conversion",
    },
  ];

  return (
    <div className="mt-20 overflow-x-auto">
      <div className="flex items-center gap-6 min-w-max">

        {nodes.map((node, index) => (
          <div key={node.id} className="flex items-center">

            <JourneyNode node={node} />

            {index < nodes.length - 1 && (
              <div className="w-12 h-[1px] bg-slate-300 mx-2" />
            )}

          </div>
        ))}

      </div>
    </div>
  );
};


/* =========================
  Journey Node
========================= */
const JourneyNode = ({ node }) => {
  const Icon = node.icon;

  const styles = {
    trigger: "bg-slate-900 text-white border-slate-900",
    email: "bg-white border-slate-200",
    wait: "bg-slate-100 border-slate-300 text-slate-600",
    conversion: "bg-green-100 border-green-300 text-green-800",
  };

  const branchStyles = {
    success: "bg-green-100 text-green-700 border-green-300",
    warning: "bg-amber-100 text-amber-700 border-amber-300",
  };

  return (
    <div className="relative group flex flex-col items-center">

      {/* MAIN NODE */}
      <div className={`px-4 py-3 rounded-xl border shadow-sm text-sm font-medium flex items-center gap-2 ${styles[node.type]}`}>
        
        {Icon && <Icon size={16} weight="bold" />}

        <span>{node.label}</span>

      </div>.,

      {/* TOOLTIP */}
      <div className="absolute hidden group-hover:block top-full left-1/2 -translate-x-1/2 mt-3 w-48 p-3 bg-black text-white text-xs rounded-lg shadow-lg z-10">
        {node.description}
      </div>

      {/* BRANCHES */}
      {node.branch && (
        <div className="flex flex-col items-center mt-4 gap-3">

          {/* vertical connector */}
          <div className="w-[1px] h-6 bg-slate-300" />

          {node.branch.map((b) => (
            <div key={b.id} className="flex flex-col items-center">

              <div className={`px-3 py-2 text-xs rounded-lg border ${branchStyles[b.type]}`}>
                {b.label}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};


/* =========================
  Metric
========================= */

const Metric = ({ label, value, trend = "up" }) => {
  return (
    <div className="flex flex-col bg-white p-6 rounded-lg">
      
      <div className="flex items-center gap-2">
        <p className="text-3xl md:text-4xl font-black tracking-tight font-display">
          {value}
        </p>

        {trend === "up" && (
          <span className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-green-500" />
        )}

        {trend === "down" && (
          <span className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-500" />
        )}
      </div>

      <p className="text-sm text-slate-500 mt-2 font-sans">
        {label}
      </p>

    </div>
  );
};


/* =========================
  Placeholder
========================= */

const Placeholder = ({ title }) => {
  return (
    <div className="border-t border-slate-200 pt-16 animate-fade">
      <h2 className="text-3xl font-black tracking-tight font-display">
        {title}
      </h2>

      <div className="mt-10 h-64 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-500">
        Content coming next
      </div>
    </div>
  );
};