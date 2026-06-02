"use client";

import { useState } from "react";
import Image from "next/image";

const NAVY = "#0a1a2f";
const GREEN = "#94e561";

// ─── Install steps ────────────────────────────────────────────────────────────

const installSteps = [
  {
    number: "01",
    title: "Download the toolbar file",
    description:
      "Click the button below to download the Isio tlbr.ppam file. Save it somewhere easy to find — your Downloads folder is fine for now.",
    note: null,
    image: null,
    download: true,
  },
  {
    number: "02",
    title: "Move the file to a permanent location",
    description:
      "Before installing, move the Isio tlbr.ppam file from your Downloads folder to somewhere permanent — for example, a folder on your desktop or in your Documents.",
    note: "Important: Once installed, the .ppam file must not be renamed or moved. If it moves, PowerPoint will lose track of it and the toolbar will stop working.",
    image: null,
  },
  {
    number: "03",
    title: "Open PowerPoint Add-ins",
    description:
      "Open PowerPoint. Click File in the top-left, then scroll down and click Options at the bottom of the left-hand menu.",
    note: null,
    image: "/isio/step-file-menu.png",
    imageAlt: "PowerPoint File menu with Options at the bottom",
    imageWidth: 170,
    imageHeight: 658,
  },
  {
    number: "04",
    title: "Navigate to Add-ins",
    description:
      "In the PowerPoint Options window, click Add-ins in the left-hand list. At the very bottom of the window, click the dropdown and select PowerPoint Add-ins, then click Go.",
    note: null,
    image: "/isio/step-addins-options.png",
    imageAlt: "PowerPoint Options window showing Add-ins section",
    imageWidth: 820,
    imageHeight: 673,
  },
  {
    number: "05",
    title: "Add the toolbar file",
    description:
      "In the Add-ins window that opens, click Add New. Navigate to the folder where you saved the Isio tlbr.ppam file. Click on it to select it, then click Open.",
    note: null,
    image: "/isio/step-addins-dialog.png",
    imageAlt: "Add-ins dialog with Add New button",
    imageWidth: 386,
    imageHeight: 354,
  },
  {
    number: "06",
    title: "Enable Macros",
    description:
      "PowerPoint will show a security notice. Click Enable Macros to proceed. This is expected — the toolbar uses macros to run its tools.",
    note: "If you see a warning about the file not being from a trusted source, that is normal. The toolbar is safe to use — it was built specifically for your team.",
    image: "/isio/step-enable-macros.png",
    imageAlt: "PowerPoint security notice with Enable Macros button",
    imageWidth: 369,
    imageHeight: 281,
  },
  {
    number: "07",
    title: "Confirm it is active",
    description:
      "Back in the Add-ins list, you should now see Isio tlbr listed. Make sure the checkbox next to it is ticked. Click Close.",
    note: "The Isio tlbr tab will now appear in your PowerPoint ribbon at the top of the screen. You're ready to go.",
    image: null,
  },
];

// ─── Toolbar sections ─────────────────────────────────────────────────────────

const toolbarSections = [
  {
    id: "templates",
    label: "Templates",
    icon: "⬜",
    description: "Open your Isio-branded slide templates directly from the toolbar.",
    tools: [
      { name: "Widescreen", desc: "Opens the Widescreen template — use this when the presentation will be shown on a screen." },
      { name: "A4 Landscape", desc: "Opens the A4 Landscape template — use for documents that will be printed on A4 paper." },
      { name: "US Letter", desc: "Opens the US Letter template — use for documents printed in the US." },
    ],
    note: "These buttons will be configured with your Isio templates once the full build is complete.",
  },
  {
    id: "text",
    label: "Text",
    icon: "T",
    description: "Format text boxes and control margins and line spacing with precision.",
    tools: [
      { name: "Margin 0.0", desc: "Sets the internal text margin of selected shapes to 0.0 cm on all sides." },
      { name: "Margin 0.1", desc: "Sets the internal text margin to 0.1 cm on all sides." },
      { name: "Margin 0.2", desc: "Sets the internal text margin to 0.2 cm on all sides." },
      { name: "Custom Margin", desc: "Opens a dialog where you can enter a specific margin value in cm, and choose which sides to apply it to." },
      { name: "Line Space After 6pt", desc: "Sets the paragraph spacing after to 6pt — good for most body text." },
      { name: "Line Space After 1pt", desc: "Sets the paragraph spacing after to 1pt — useful when tighter spacing is needed." },
      { name: "Merge Text Boxes", desc: "Combines multiple selected text boxes into a single text box." },
      { name: "Split Text Boxes", desc: "Splits a text box into separate text boxes — one per paragraph." },
      { name: "Toggle Wrap Text", desc: "Switches selected text boxes between wrapping text and not wrapping." },
      { name: "Toggle Resize", desc: "Switches between 'Do not autofit' and 'Resize shape to fit text' for selected shapes." },
    ],
    note: null,
  },
  {
    id: "object",
    label: "Object",
    icon: "◻",
    description: "Control colours, alignment, sizing, spacing, and layering for any selected shape or object.",
    groups: [
      {
        label: "Colour",
        tools: [
          { name: "Fill Colour", desc: "Change the fill colour of the selected object." },
          { name: "Outline Colour", desc: "Change the outline colour of the selected object." },
          { name: "No Fill", desc: "Remove the fill from the selected shape entirely." },
          { name: "No Outline", desc: "Remove the outline from the selected shape entirely." },
          { name: "Font Colour", desc: "Change the text colour of selected text or shape." },
        ],
      },
      {
        label: "Select",
        tools: [
          { name: "Select Same Fill", desc: "Selects all objects on the slide that share the same fill colour as the selected object." },
          { name: "Select Same Outline", desc: "Selects all objects with the same outline colour." },
          { name: "Select Same Width", desc: "Selects all objects with the same width." },
          { name: "Select Same Height", desc: "Selects all objects with the same height." },
        ],
      },
      {
        label: "Position",
        tools: [
          { name: "Swap Positions", desc: "Swaps the positions of two selected objects." },
          { name: "Copy Position", desc: "Copies the X/Y position of the selected object." },
          { name: "Paste Position", desc: "Applies the copied position to another selected object." },
        ],
      },
      {
        label: "Align",
        tools: [
          { name: "Align Left / Right / Top / Bottom", desc: "Aligns all selected objects to the left, right, top, or bottom of the first object selected." },
          { name: "Align Centre / Middle", desc: "Aligns objects to the horizontal centre or vertical middle of the first object selected." },
          { name: "Distribute Horizontally / Vertically", desc: "Spreads objects evenly across the slide horizontally or vertically." },
        ],
      },
      {
        label: "Size",
        tools: [
          { name: "Same Width", desc: "Resizes all selected objects to match the width of the first object selected." },
          { name: "Same Height", desc: "Resizes all selected objects to match the height of the first object selected." },
          { name: "Same Width & Height", desc: "Resizes all selected objects to match both the width and height of the first object selected." },
          { name: "Unrotate", desc: "Resets the rotation of selected shapes to 0°, swapping width and height as needed while keeping the position." },
        ],
      },
      {
        label: "Space",
        tools: [
          { name: "Touch Top / Bottom / Left / Right", desc: "Moves selected objects so they sit flush against the top, bottom, left, or right edge of the first object selected." },
          { name: "Right Space Adjustment", desc: "Stacks selected objects side by side with a custom gap (in cm) between them, keeping the first object in place." },
          { name: "Bottom Space Adjustment", desc: "Stacks selected objects vertically with a custom gap, keeping the first object in place." },
        ],
      },
      {
        label: "Arrange",
        tools: [
          { name: "Flip Horizontal / Vertical", desc: "Flips the selected object horizontally or vertically." },
          { name: "Rotate Left / Right 90°", desc: "Rotates the selected object 90 degrees left or right." },
          { name: "Send to Back / Backward", desc: "Moves the selected object behind all others, or one step back." },
          { name: "Bring to Front / Forward", desc: "Brings the selected object in front of all others, or one step forward." },
        ],
      },
    ],
    note: "For the Align, Size, and Space tools — always select the reference object first (the one you want others to match), then hold Shift and select the remaining objects.",
  },
  {
    id: "table",
    label: "Table",
    icon: "⊞",
    description: "Format and manage tables consistently across your presentation.",
    tools: [
      { name: "Format Table", desc: "Applies Isio brand formatting to selected tables. This will be configured to your exact brand guidelines." },
      { name: "Table Text Formatter", desc: "Formats the text inside a selected table — opens a dialog to set a custom font size." },
      { name: "Copy Column Widths", desc: "Copies the column widths from the selected table to memory." },
      { name: "Apply Column Widths", desc: "Applies the stored column widths to any other selected tables — great for keeping tables consistent." },
      { name: "Table Margin (0.15cm)", desc: "Sets 0.15 cm internal margins on all cells in selected tables." },
      { name: "Custom Table Margin", desc: "Opens a dialog to set a specific margin for selected table cells." },
      { name: "Copy Table Margin", desc: "Copies the margin settings from a selected table." },
      { name: "Paste Table Margin", desc: "Applies the copied margin settings to another selected table." },
    ],
    note: null,
  },
  {
    id: "graph",
    label: "Graph",
    icon: "📊",
    description: "Format and manage charts in your presentation.",
    tools: [
      { name: "Format Graph", desc: "Applies brand formatting to selected charts. This will be configured to your Isio colour palette." },
      { name: "Chart Text Formatter", desc: "Formats text in selected charts — opens a dialog to choose a custom font size." },
      { name: "Find Embedded Graphs", desc: "Scans the file and lists all charts that are embedded (not linked) — useful for auditing file size." },
      { name: "Unembed Graph", desc: "Converts the selected embedded chart to an unlinked image to reduce file size." },
      { name: "Copy Graph Link", desc: "Shows and copies the file path of a selected linked chart." },
    ],
    note: null,
  },
  {
    id: "document",
    label: "Document",
    icon: "📄",
    description: "Clean up and manage your presentation file.",
    tools: [
      { name: "Insert Note", desc: "Inserts a formatted note shape on the current slide." },
      { name: "Set UK English", desc: "Sets the language of the entire document to UK English for spell-check." },
      { name: "Set US English", desc: "Sets the language of the entire document to US English." },
      { name: "Set Document Title", desc: "Sets the document's metadata title to match the file name." },
      { name: "Delete Comments", desc: "Removes all comments from every slide in the presentation." },
      { name: "Remove Slide Notes", desc: "Deletes all notes from every slide in the presentation." },
      { name: "Find Large Images", desc: "Scans the file and lists all images — useful for identifying files that may be making the presentation slow." },
      { name: "Find Embedded Spreadsheets", desc: "Finds all Excel spreadsheets that are embedded into the presentation." },
      { name: "Break Table", desc: "Converts all cells in a selected table into individual text boxes." },
      { name: "Page Status → Ready for Design", desc: "Marks the slide as ready for the design team to work on (adds a visual indicator)." },
      { name: "Page Status → Still Being Worked On", desc: "Marks the slide as still in progress." },
      { name: "Page Status → Complete", desc: "Marks the slide as finished." },
    ],
    note: null,
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function StepCard({ step, isLast }: { step: typeof installSteps[0]; isLast: boolean }) {
  return (
    <div className="relative flex gap-6 md:gap-10">
      {/* Number + connector line */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 z-10"
          style={{ background: NAVY, color: GREEN, fontFamily: '"General Sans", sans-serif' }}
        >
          {step.number}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 mt-2" style={{ background: "#e5e7eb", minHeight: 40 }} />
        )}
      </div>

      {/* Content */}
      <div className="pb-10 flex-1 min-w-0">
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: NAVY, fontFamily: '"General Sans", sans-serif' }}
        >
          {step.title}
        </h3>
        <p className="text-gray-800 text-base leading-relaxed mb-3">{step.description}</p>

        {step.note && (
          <div
            className="rounded-xl px-4 py-3 text-base mb-4"
            style={{ background: "rgba(148,229,97,0.12)", borderLeft: `3px solid ${GREEN}` }}
          >
            <span className="font-semibold" style={{ color: NAVY }}>Note: </span>
            <span className="text-gray-700">{step.note}</span>
          </div>
        )}

        {step.download && (
          <a
            href="/isio/isio-tlbr-demo.ppam"
            download="Isio tlbr.ppam"
            className="inline-flex items-center gap-2 mt-4 px-5 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: NAVY, color: GREEN }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v9M4.5 6.5L8 10l3.5-3.5M2 13h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download Isio tlbr.ppam
          </a>
        )}

        {step.image && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 shadow-sm inline-block max-w-full">
            <Image
              src={step.image}
              alt={step.imageAlt || ""}
              width={step.imageWidth}
              height={step.imageHeight}
              className="max-w-full h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTab({
  section,
  isActive,
  onClick,
}: {
  section: typeof toolbarSections[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap"
      style={
        isActive
          ? { background: NAVY, color: GREEN, fontFamily: '"General Sans", sans-serif' }
          : { background: "#f3f4f6", color: "#4b5563", fontFamily: '"General Sans", sans-serif' }
      }
    >
      {section.label}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IsioPage() {
  const [activeSection, setActiveSection] = useState("templates");

  const currentSection = toolbarSections.find((s) => s.id === activeSection)!;

  return (
    <main className="min-h-screen font-normal" style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}>

      {/* Hero */}
      <div
        className="px-8 py-16 md:py-24"
        style={{ background: NAVY }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: GREEN }}>
            Isio · Powered by tlbr.io
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Your PowerPoint toolbar guide
          </h1>
          <p className="text-white/80 text-lg max-w-xl">
            Everything you need to install and use the Isio tlbr — your custom PowerPoint add-in for building faster, more consistent presentations.
          </p>
        </div>
      </div>

      {/* Nav anchors */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-8 h-14 flex items-center gap-8">
          <a
            href="#install"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: NAVY }}
          >
            How to install
          </a>
          <a
            href="#use"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: NAVY }}
          >
            How to use
          </a>
          <a
            href="#uninstall"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: NAVY }}
          >
            Uninstall
          </a>
          <a
            href="mailto:jayvin@tlbr.io"
            className="ml-auto text-sm font-medium px-4 py-1.5 rounded-full text-white transition-opacity hover:opacity-80"
            style={{ background: NAVY }}
          >
            Get help
          </a>
        </div>
      </div>

      {/* ── Intro ── */}
      <div className="border-b border-gray-100" style={{ background: "#fafafa" }}>
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-16">

          <p className="text-base font-semibold mb-3 uppercase tracking-widest" style={{ color: GREEN }}>
            Welcome to your demo
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight" style={{ color: NAVY }}>
            See what a bespoke PowerPoint<br className="hidden md:block" /> toolbar can do for your team
          </h2>
          <p className="text-gray-700 text-base leading-relaxed max-w-2xl mb-10">
            This demo gives you a working taste of the Isio tlbr. Once installed, you have <span className="font-semibold" style={{ color: NAVY }}>two weeks to explore it freely</span> — no limitations, no paywalls. After that, just get in touch and we&apos;ll take it from there.
          </p>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-4">

            <div className="rounded-2xl p-6 border border-gray-200 bg-white">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4"
                style={{ background: "rgba(148,229,97,0.15)" }}
              >
                🧰
              </div>
              <h3 className="font-semibold mb-2 text-base" style={{ color: NAVY }}>
                Generic tools, ready to go
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                This demo includes a full set of formatting tools — margin controls, alignment, sizing, table and chart utilities — that work out of the box for any presentation.
              </p>
            </div>

            <div className="rounded-2xl p-6 border border-gray-200 bg-white">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4"
                style={{ background: "rgba(148,229,97,0.15)" }}
              >
                🎨
              </div>
              <h3 className="font-semibold mb-2 text-base" style={{ color: NAVY }}>
                Bespoke tools are where it gets powerful
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The real power comes from tools built around your brand — one-click table formatting, branded chart styles, and graph layouts that match your exact guidelines.
              </p>
            </div>

            <div className="rounded-2xl p-6 border border-gray-200 bg-white">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4"
                style={{ background: "rgba(148,229,97,0.15)" }}
              >
                ⚡
              </div>
              <h3 className="font-semibold mb-2 text-base" style={{ color: NAVY }}>
                Your elements, one click away
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We can add your icons, images, and frequently used graphics directly into the toolbar — so anyone on the team can build on-brand slides without hunting through folders.
              </p>
            </div>

          </div>

          {/* Demo expiry notice */}
          <div
            className="mt-8 rounded-2xl px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 justify-between"
            style={{ background: NAVY }}
          >
            <div>
              <p className="text-white font-semibold text-base">Your demo is active for 14 days from first use</p>
              <p className="text-white/60 text-sm mt-0.5">
                The clock starts the first time you click a button — not when you install it.
              </p>
            </div>
            <a
              href="mailto:jayvin@tlbr.io"
              className="shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-85 text-center"
              style={{ background: GREEN, color: NAVY }}
            >
              Talk to us about the full version
            </a>
          </div>

        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 space-y-24">

        {/* ── Section 1: Install ── */}
        <section id="install">
          <div className="mb-12">
            <span
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: GREEN }}
            >
              Section 01
            </span>
            <h2
              className="text-3xl font-bold mt-2"
              style={{ color: NAVY }}
            >
              How to install the toolbar
            </h2>
            <p className="text-gray-700 mt-3 max-w-2xl text-base">
              Download the file below and follow these steps to get it running in PowerPoint. This takes about 3 minutes and only needs to be done once.
            </p>
          </div>

          <div>
            {installSteps.map((step, i) => (
              <StepCard
                key={step.number}
                step={step}
                isLast={i === installSteps.length - 1}
              />
            ))}
          </div>

          {/* Troubleshooting callout */}
          <div
            className="mt-8 rounded-2xl p-6 border"
            style={{ background: "#f8fafc", borderColor: "#e5e7eb" }}
          >
            <h4 className="font-semibold mb-3 text-base" style={{ color: NAVY }}>
              Don&apos;t see the Isio tlbr tab after installing?
            </h4>
            <ul className="text-base text-gray-700 space-y-2 list-disc list-inside">
              <li>Make sure the .ppam file hasn&apos;t been moved or renamed since you installed it.</li>
              <li>Go back to File → Options → Add-ins → PowerPoint Add-ins → Go and check the Isio tlbr box is ticked.</li>
              <li>If it asks you to locate the file again, navigate to wherever you saved the .ppam file and re-select it.</li>
              <li>If the problem persists, email <a href="mailto:jayvin@tlbr.io" className="underline" style={{ color: NAVY }}>jayvin@tlbr.io</a>.</li>
            </ul>
          </div>
        </section>

        {/* ── Section 2: Use ── */}
        <section id="use">
          <div className="mb-12">
            <span
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: GREEN }}
            >
              Section 02
            </span>
            <h2
              className="text-3xl font-bold mt-2"
              style={{ color: NAVY }}
            >
              How to use the toolbar
            </h2>
            <p className="text-gray-700 mt-3 max-w-2xl text-base">
              The Isio tlbr tab sits in your PowerPoint ribbon and is split into 6 sections. Click a section below to explore what each tool does.
            </p>
          </div>

          {/* Section tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {toolbarSections.map((section) => (
              <SectionTab
                key={section.id}
                section={section}
                isActive={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              />
            ))}
          </div>

          {/* Section content */}
          <div
            key={currentSection.id}
            className="rounded-3xl border border-gray-100 p-8 shadow-sm bg-white"
          >
            <div className="mb-6">
              <h3
                className="text-xl font-bold"
                style={{ color: NAVY }}
              >
                {currentSection.label}
              </h3>
              <p className="text-gray-700 mt-1 text-base">{currentSection.description}</p>
            </div>

            {/* Grouped tools (Object section) */}
            {"groups" in currentSection && currentSection.groups ? (
              <div className="space-y-6">
                {currentSection.groups.map((group) => (
                  <div key={group.label}>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-3"
                      style={{ color: GREEN }}
                    >
                      {group.label}
                    </p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {group.tools.map((tool) => (
                        <div
                          key={tool.name}
                          className="flex gap-3 p-3 rounded-xl bg-gray-50"
                        >
                          <div
                            className="w-1.5 rounded-full shrink-0 mt-1"
                            style={{ background: GREEN, minHeight: 16 }}
                          />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: NAVY }}>{tool.name}</p>
                            <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{tool.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-2">
                {(currentSection.tools || []).map((tool) => (
                  <div
                    key={tool.name}
                    className="flex gap-3 p-3 rounded-xl bg-gray-50"
                  >
                    <div
                      className="w-1.5 rounded-full shrink-0 mt-1"
                      style={{ background: GREEN, minHeight: 16 }}
                    />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: NAVY }}>{tool.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tool.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentSection.note && (
              <div
                className="mt-6 rounded-xl px-4 py-3 text-sm"
                style={{ background: "rgba(148,229,97,0.12)", borderLeft: `3px solid ${GREEN}` }}
              >
                <span className="font-semibold" style={{ color: NAVY }}>Tip: </span>
                <span className="text-gray-700">{currentSection.note}</span>
              </div>
            )}
          </div>
        </section>

        {/* ── Section 3: Uninstall ── */}
        <section id="uninstall">
          <div className="mb-10">
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: GREEN }}>
              Section 03
            </span>
            <h2 className="text-3xl font-bold mt-2" style={{ color: NAVY }}>
              How to uninstall the toolbar
            </h2>
            <p className="text-gray-700 mt-3 max-w-2xl text-base">
              If you need to remove the toolbar, follow these steps. It takes less than a minute.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            {[
              {
                n: "01",
                title: "Open PowerPoint Add-ins",
                body: "In PowerPoint, click File → Options. In the left-hand list, click Add-ins. At the bottom of the window, set the dropdown to PowerPoint Add-ins and click Go.",
              },
              {
                n: "02",
                title: "Select the Isio tlbr",
                body: "In the Add-ins window, click on Isio tlbr in the list to highlight it.",
              },
              {
                n: "03",
                title: "Remove it",
                body: "Click Remove, then click Close. The Isio tlbr tab will disappear from your PowerPoint ribbon immediately.",
              },
              {
                n: "04",
                title: "Delete the file (optional)",
                body: "If you want to fully remove it from your computer, navigate to the folder where you originally saved the Isio tlbr.ppam file and delete it.",
              },
            ].map((step, i, arr) => (
              <div
                key={step.n}
                className={`flex gap-5 px-8 py-6 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                  style={{ background: "rgba(148,229,97,0.15)", color: NAVY }}
                >
                  {step.n}
                </div>
                <div>
                  <p className="font-semibold text-base mb-1" style={{ color: NAVY }}>{step.title}</p>
                  <p className="text-gray-700 text-base leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <div
          className="rounded-3xl p-10 text-center"
          style={{ background: NAVY }}
        >
          <h3 className="text-2xl font-bold text-white mb-3">Need help or have questions?</h3>
          <p className="text-white/60 mb-6 text-sm max-w-md mx-auto">
            Reach out and the tlbr.io team will get back to you quickly.
          </p>
          <a
            href="mailto:jayvin@tlbr.io"
            className="inline-block px-8 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: GREEN, color: NAVY }}
          >
            Email jayvin@tlbr.io
          </a>
        </div>

      </div>
    </main>
  );
}
