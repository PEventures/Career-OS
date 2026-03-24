export const ASSESSMENT_ID = "management-readiness-v1";

export type GapLevel = "early" | "developing" | "capable" | "strong";

export type Option = { id: string; text: string; weight: number };
export type Question = { id: string; text: string; context?: string; options: Option[] };
export type Dimension = {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  questions: Question[];
  gapContext: string;
  resources: Array<{ label: string; href: string; type: "playbook" | "scenario" | "coach" | "assess" }>;
};

export const GAP_LEVELS: Record<GapLevel, { label: string; short: string; color: string; bg: string; border: string; description: string }> = {
  early: {
    label: "Foundational Gap",
    short: "Early Stage",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    description: "This is an area requiring deliberate, structured development. Start here.",
  },
  developing: {
    label: "Developing",
    short: "In Progress",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    description: "You have the beginnings here but gaps in execution are costing you credibility.",
  },
  capable: {
    label: "Capable",
    short: "Functional",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    description: "You're getting this right most of the time. Strategic sharpening will separate you.",
  },
  strong: {
    label: "Demonstrated Strength",
    short: "Strong",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    description: "This is a genuine asset. Protect it and deploy it visibly.",
  },
};

export function weightToLevel(avg: number): GapLevel {
  if (avg >= 3.26) return "strong";
  if (avg >= 2.51) return "capable";
  if (avg >= 1.76) return "developing";
  return "early";
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "competence",
    label: "Competence",
    description: "Executing the core work of management: performance, delegation, developing people.",
    icon: "🎯",
    color: "text-blue-400",
    gapContext: "Competence gaps signal that you need structured frameworks, not just experience. The good news: these are learnable skills.",
    resources: [
      { label: "The Performance Conversation System", href: "/systems", type: "playbook" },
      { label: "Underperforming Employee Scenario", href: "/scenarios", type: "scenario" },
      { label: "Build a Team Development Plan", href: "/coach", type: "coach" },
    ],
    questions: [
      {
        id: "comp-1",
        text: "A team member's work has been below expectations for three consecutive weeks. What do you do?",
        context: "Choose the response that most closely matches your actual behavior — not the ideal.",
        options: [
          { id: "comp-1-a", text: "Give it more time — they probably have something personal going on and will self-correct.", weight: 1 },
          { id: "comp-1-b", text: "Mention it casually in the next 1:1 without making it feel formal or serious.", weight: 2 },
          { id: "comp-1-c", text: "Schedule a direct conversation, name the issue clearly, and set expectations going forward.", weight: 3 },
          { id: "comp-1-d", text: "Document specific examples, hold a structured conversation, and agree on a measurable improvement plan with a review date.", weight: 4 },
        ],
      },
      {
        id: "comp-2",
        text: "Your team has six competing priorities this week and limited capacity. How do you decide what gets done?",
        options: [
          { id: "comp-2-a", text: "Let the team sort it out — they have the context to know what's most urgent.", weight: 1 },
          { id: "comp-2-b", text: "Tackle the loudest problem first and work down from there.", weight: 2 },
          { id: "comp-2-c", text: "Review what's most urgent, make a call, and communicate the reasoning to the team.", weight: 3 },
          { id: "comp-2-d", text: "Map impact vs. effort, align with key stakeholders on trade-offs, and communicate the prioritization with clear rationale.", weight: 4 },
        ],
      },
      {
        id: "comp-3",
        text: "You want to develop a strong team member for bigger responsibilities. What does that look like in practice?",
        options: [
          { id: "comp-3-a", text: "Give them more work and see how they handle the extra load.", weight: 1 },
          { id: "comp-3-b", text: "Tell them you see potential in them and encourage them to take initiative.", weight: 2 },
          { id: "comp-3-c", text: "Have a development conversation to understand their goals and assign stretch projects.", weight: 3 },
          { id: "comp-3-d", text: "Co-create a development plan with clear milestones, provide coaching on stretch assignments, and advocate for their visibility with leadership.", weight: 4 },
        ],
      },
    ],
  },
  {
    id: "confidence",
    label: "Confidence",
    description: "Backing your own judgment under pressure, owning mistakes, and advocating upward without crumbling.",
    icon: "💪",
    color: "text-amber-400",
    gapContext: "Confidence gaps often look like over-deference or avoidance. They erode your perceived leadership readiness faster than almost anything else.",
    resources: [
      { label: "Radical Upward Management", href: "/systems", type: "playbook" },
      { label: "Boss Challenges Your Judgment", href: "/scenarios", type: "scenario" },
      { label: "Practicing Disagreeing Upward", href: "/coach", type: "coach" },
    ],
    questions: [
      {
        id: "conf-1",
        text: "You make a call that turns out to be wrong. A team member points this out directly in a group setting. How do you respond?",
        options: [
          { id: "conf-1-a", text: "Defend the original reasoning to preserve authority in front of the team.", weight: 1 },
          { id: "conf-1-b", text: "Acknowledge it briefly, feel embarrassed, and move the conversation on quickly.", weight: 2 },
          { id: "conf-1-c", text: "Acknowledge it clearly, thank them for raising it, and correct course.", weight: 3 },
          { id: "conf-1-d", text: "Acknowledge it directly, explain what I missed, thank them publicly, and use the moment to model that intellectual honesty is valued.", weight: 4 },
        ],
      },
      {
        id: "conf-2",
        text: "A senior leader questions your approach to a project in front of other stakeholders. What do you do?",
        options: [
          { id: "conf-2-a", text: "Back down immediately and defer to their view to avoid conflict.", weight: 1 },
          { id: "conf-2-b", text: "Get flustered but manage to explain myself minimally before moving on.", weight: 2 },
          { id: "conf-2-c", text: "Calmly explain my reasoning and invite their perspective.", weight: 3 },
          { id: "conf-2-d", text: "Acknowledge their concern, present my logic clearly with evidence, and offer to discuss further — without caving unless they have genuinely new information.", weight: 4 },
        ],
      },
      {
        id: "conf-3",
        text: "You disagree with a significant decision made by someone above you. What do you do?",
        options: [
          { id: "conf-3-a", text: "Implement it without saying anything — it's not my call to make.", weight: 1 },
          { id: "conf-3-b", text: "Complain to peers about it but don't raise it with the decision-maker.", weight: 2 },
          { id: "conf-3-c", text: "Raise it privately with the decision-maker once, share my perspective, and then let it go.", weight: 3 },
          { id: "conf-3-d", text: "Request a conversation, prepare my case with supporting evidence, advocate for the better path — then commit fully once a final decision is made.", weight: 4 },
        ],
      },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    description: "Delivering hard messages, giving effective feedback, and managing conflict between people.",
    icon: "🗣️",
    color: "text-purple-400",
    gapContext: "Communication gaps show up as vagueness, avoidance, or over-softening. The most common mistake: prioritizing being liked over being understood.",
    resources: [
      { label: "The Feedback Protocol", href: "/systems", type: "playbook" },
      { label: "Team Conflict Scenario", href: "/scenarios", type: "scenario" },
      { label: "Rehearse a Difficult Conversation", href: "/coach", type: "coach" },
    ],
    questions: [
      {
        id: "comm-1",
        text: "You need to communicate a change the team won't like. How do you approach it?",
        options: [
          { id: "comm-1-a", text: "Send an email or Slack message — avoids the awkward real-time conversation.", weight: 1 },
          { id: "comm-1-b", text: "Announce it in a team meeting and field questions as they come.", weight: 2 },
          { id: "comm-1-c", text: "Give context for why it's happening, acknowledge the impact, and let people react.", weight: 3 },
          { id: "comm-1-d", text: "Prepare the key messages, anticipate objections, acknowledge the difficulty honestly, give people space to react, and connect the change to a clear rationale.", weight: 4 },
        ],
      },
      {
        id: "comm-2",
        text: "When you give feedback to a team member, what does it typically look like?",
        options: [
          { id: "comm-2-a", text: "I cushion it — a compliment, then the feedback, then another positive to soften the landing.", weight: 1 },
          { id: "comm-2-b", text: "I tell them what's not working and what I want to see instead.", weight: 2 },
          { id: "comm-2-c", text: "I describe specific behavior, explain the impact, and agree on what to do differently.", weight: 3 },
          { id: "comm-2-d", text: "I use specific observable examples, explain the business or team impact, invite their perspective, and agree on a clear path forward with a follow-up checkpoint.", weight: 4 },
        ],
      },
      {
        id: "comm-3",
        text: "Two team members are in visible conflict and it's starting to affect team performance. What do you do?",
        options: [
          { id: "comm-3-a", text: "Wait for it to resolve itself — adults should be able to sort things out.", weight: 1 },
          { id: "comm-3-b", text: "Speak to each of them separately and hope they figure it out between themselves.", weight: 2 },
          { id: "comm-3-c", text: "Address it directly with both parties and set clear expectations for professional behavior.", weight: 3 },
          { id: "comm-3-d", text: "Meet each person individually first to understand their perspective, then facilitate a direct conversation focused on the work and shared goals — not personalities.", weight: 4 },
        ],
      },
    ],
  },
  {
    id: "presence",
    label: "Presence",
    description: "Commanding attention and trust in rooms where you may not have authority.",
    icon: "⚡",
    color: "text-yellow-400",
    gapContext: "Presence gaps mean people aren't yet feeling your gravity. Technical credibility alone doesn't create it — you have to build it deliberately.",
    resources: [
      { label: "The Executive Presence System", href: "/systems", type: "playbook" },
      { label: "Being Challenged Publicly", href: "/scenarios", type: "scenario" },
      { label: "Defining Your Leadership Identity", href: "/coach", type: "coach" },
    ],
    questions: [
      {
        id: "pres-1",
        text: "In a meeting with senior leaders, someone talks over you or dismisses your point mid-sentence. What do you do?",
        options: [
          { id: "pres-1-a", text: "Let it go — creating tension with senior leaders isn't worth it.", weight: 1 },
          { id: "pres-1-b", text: "Repeat the point more loudly once there's a pause in conversation.", weight: 2 },
          { id: "pres-1-c", text: "Calmly return to my point when an opening appears.", weight: 3 },
          { id: "pres-1-d", text: "Use clear language to re-anchor: \"I want to come back to what I raised\" — and do it without apology or over-explanation.", weight: 4 },
        ],
      },
      {
        id: "pres-2",
        text: "A senior leader asks you to describe your leadership approach. What do you say?",
        options: [
          { id: "pres-2-a", text: "I'm still figuring out my approach — I tend to go with the situation.", weight: 1 },
          { id: "pres-2-b", text: "I talk about being collaborative and supportive of my team.", weight: 2 },
          { id: "pres-2-c", text: "I describe 2–3 specific principles I lead by with a concrete example of each.", weight: 3 },
          { id: "pres-2-d", text: "I give a clear, distinctive articulation of my philosophy, grounded in the specific context I'm in, backed by evidence of how it shows up in outcomes.", weight: 4 },
        ],
      },
      {
        id: "pres-3",
        text: "You're in a room where you have no positional authority but need to get people aligned. How do you show up?",
        options: [
          { id: "pres-3-a", text: "I wait to be called on or recognized before contributing anything.", weight: 1 },
          { id: "pres-3-b", text: "I observe the dynamics first before risking sharing a perspective.", weight: 2 },
          { id: "pres-3-c", text: "I come prepared, share relevant thinking, and connect with the right people before and after.", weight: 3 },
          { id: "pres-3-d", text: "I build informal authority through the quality of my thinking — I position myself as a resource, come with a clear point of view, and create gravity through substance rather than title.", weight: 4 },
        ],
      },
    ],
  },
  {
    id: "engagement",
    label: "Engagement",
    description: "Actively motivating, retaining, and developing the people on your team.",
    icon: "🔥",
    color: "text-orange-400",
    gapContext: "Engagement gaps mean your team is showing up for the paycheck, not for you. This is fixable — but it requires specific deliberate action, not just good intentions.",
    resources: [
      { label: "The 1:1 Operating System", href: "/systems", type: "playbook" },
      { label: "Team Morale Crisis Scenario", href: "/scenarios", type: "scenario" },
      { label: "Rebuilding Team Energy", href: "/coach", type: "coach" },
    ],
    questions: [
      {
        id: "eng-1",
        text: "A top performer suddenly seems disengaged — less initiative, quieter in meetings, doing just enough. What do you do?",
        options: [
          { id: "eng-1-a", text: "Give them space and assume it's a temporary phase.", weight: 1 },
          { id: "eng-1-b", text: "Check in casually to see if they're doing okay without making it a formal thing.", weight: 2 },
          { id: "eng-1-c", text: "Schedule a specific 1:1 to understand what's shifted and what they need.", weight: 3 },
          { id: "eng-1-d", text: "Have a direct conversation about what I've observed specifically, ask what's changed, and co-create what would reinvigorate them — treating their disengagement as important information.", weight: 4 },
        ],
      },
      {
        id: "eng-2",
        text: "How do you typically recognize your team's contributions?",
        options: [
          { id: "eng-2-a", text: "Good work should be its own reward — I don't over-praise people for doing their job.", weight: 1 },
          { id: "eng-2-b", text: "I say thanks or give a shoutout when I notice something genuinely good.", weight: 2 },
          { id: "eng-2-c", text: "I give specific, timely recognition both privately and in team settings when it's earned.", weight: 3 },
          { id: "eng-2-d", text: "I tailor recognition to what matters to each person, make it specific, create visibility with senior stakeholders, and connect it explicitly to their growth narrative.", weight: 4 },
        ],
      },
      {
        id: "eng-3",
        text: "The team has been through a hard quarter — high pressure, missed targets, long hours. Morale is low. What do you do?",
        options: [
          { id: "eng-3-a", text: "Focus on the next challenge — dwelling on what happened doesn't help anyone.", weight: 1 },
          { id: "eng-3-b", text: "Send an encouraging message acknowledging the effort and hard work.", weight: 2 },
          { id: "eng-3-c", text: "Have a team conversation, acknowledge what happened honestly, and articulate why you believe in the path forward.", weight: 3 },
          { id: "eng-3-d", text: "Create space for the team to be heard first, acknowledge the difficulty with specificity, help them process and extract the learning, then re-engage around what's next — in that order.", weight: 4 },
        ],
      },
    ],
  },
  {
    id: "proactive",
    label: "Proactive vs. Reactive",
    description: "Anticipating problems before they escalate and shaping events rather than responding to them.",
    icon: "🔭",
    color: "text-cyan-400",
    gapContext: "Reactive leaders are perpetually firefighting. Proactive leaders create the conditions where fires rarely start. This is one of the clearest markers of management readiness.",
    resources: [
      { label: "Upward Management System", href: "/systems", type: "playbook" },
      { label: "Project at Risk Scenario", href: "/scenarios", type: "scenario" },
      { label: "Building Your Proactive Operating System", href: "/coach", type: "coach" },
    ],
    questions: [
      {
        id: "pro-1",
        text: "A project is at risk — you have an early hunch things are heading off track but no hard evidence yet. What do you do?",
        options: [
          { id: "pro-1-a", text: "Wait until there's something concrete to raise before acting on a hunch.", weight: 1 },
          { id: "pro-1-b", text: "Monitor more closely and take action if the signals get stronger.", weight: 2 },
          { id: "pro-1-c", text: "Name the concern to the team and request an honest status check.", weight: 3 },
          { id: "pro-1-d", text: "Surface the early signals explicitly, probe for the underlying risks, and initiate a mitigation conversation before it becomes visible to stakeholders.", weight: 4 },
        ],
      },
      {
        id: "pro-2",
        text: "How do you keep your manager informed about your team's progress and status?",
        options: [
          { id: "pro-2-a", text: "I update them when they ask or when something significant happens.", weight: 1 },
          { id: "pro-2-b", text: "I send periodic updates when I remember or when things feel important enough.", weight: 2 },
          { id: "pro-2-c", text: "I provide consistent, structured updates on progress, risks, and key decisions.", weight: 3 },
          { id: "pro-2-d", text: "I manage upward deliberately — I give them what they need to confidently sponsor my work, anticipate their questions, and frame updates in terms of business impact, not activity.", weight: 4 },
        ],
      },
      {
        id: "pro-3",
        text: "Your team is consistently hitting targets, but no one is growing, stretching, or building new capabilities. What do you do?",
        options: [
          { id: "pro-3-a", text: "Hitting targets is the job. If they want more challenge, they should ask for it.", weight: 1 },
          { id: "pro-3-b", text: "Mention in a 1:1 that people should think about where they want to grow.", weight: 2 },
          { id: "pro-3-c", text: "Identify specific development opportunities and bring them to each team member individually.", weight: 3 },
          { id: "pro-3-d", text: "Diagnose where the stagnation is coming from, build growth into the actual work, and create visible momentum that makes development feel urgent and relevant — not optional.", weight: 4 },
        ],
      },
    ],
  },
  {
    id: "political_awareness",
    label: "Political Awareness",
    description: "Reading the informal power map, understanding how decisions really get made, and navigating accordingly.",
    icon: "♟️",
    color: "text-pink-400",
    gapContext: "Political naivety is expensive. Most career setbacks aren't caused by poor performance — they're caused by misreading the room, the dynamics, or who actually holds the keys.",
    resources: [
      { label: "The Influence Without Authority Playbook", href: "/systems", type: "playbook" },
      { label: "Excluded From a Key Meeting", href: "/scenarios", type: "scenario" },
      { label: "Mapping Your Political Landscape", href: "/coach", type: "coach" },
    ],
    questions: [
      {
        id: "pol-1",
        text: "When you think about who the real influencers are in your organization — the people who actually move decisions — how well do you know who they are?",
        options: [
          { id: "pol-1-a", text: "I mostly go by the org chart — titles usually track with influence.", weight: 1 },
          { id: "pol-1-b", text: "I have a general sense of who carries weight but haven't mapped it deliberately.", weight: 2 },
          { id: "pol-1-c", text: "I've identified the key informal influencers and understand how they relate to decisions.", weight: 3 },
          { id: "pol-1-d", text: "I maintain an active, continuously updated map of formal and informal power — including who shapes opinion, who blocks decisions, and who my work needs to be visible to.", weight: 4 },
        ],
      },
      {
        id: "pol-2",
        text: "You need stakeholder buy-in for a new initiative before you can move. What's your approach?",
        options: [
          { id: "pol-2-a", text: "Present it in a group meeting and gauge whether people support it.", weight: 1 },
          { id: "pol-2-b", text: "Email the key stakeholders explaining the plan and asking for their support.", weight: 2 },
          { id: "pol-2-c", text: "Have individual conversations with key people before the group meeting to understand objections and build alignment.", weight: 3 },
          { id: "pol-2-d", text: "Map stakeholder interest and influence first, do pre-work to understand concerns, build support with key sponsors early, and frame the proposal in terms of their priorities — not mine.", weight: 4 },
        ],
      },
      {
        id: "pol-3",
        text: "You find out you've been excluded from a meeting that directly affects your team. How do you interpret and respond?",
        options: [
          { id: "pol-3-a", text: "Assume it was an oversight and not read into it.", weight: 1 },
          { id: "pol-3-b", text: "Mention it to a trusted colleague to get a sense of whether it's significant.", weight: 2 },
          { id: "pol-3-c", text: "Go directly to the organizer to understand why and make my case to be included.", weight: 3 },
          { id: "pol-3-d", text: "Treat it as a signal — diagnose whether it reflects a visibility or credibility gap, address the root cause, and take deliberate steps to be at the table for future high-stakes conversations.", weight: 4 },
        ],
      },
    ],
  },
  {
    id: "stakeholder_awareness",
    label: "Stakeholder Awareness",
    description: "Knowing whose support you need, managing those relationships deliberately, and reading stakeholder skepticism early.",
    icon: "🔑",
    color: "text-green-400",
    gapContext: "Stakeholder blindness means your best work goes unrecognized or unsupported. The people who hold the keys to your success need to know you, trust you, and actively back your work.",
    resources: [
      { label: "Radical Upward Management", href: "/systems", type: "playbook" },
      { label: "Stakeholder Conflict Escalation", href: "/scenarios", type: "scenario" },
      { label: "Stakeholder Strategy Session", href: "/coach", type: "coach" },
    ],
    questions: [
      {
        id: "stak-1",
        text: "How would you describe the quality of your relationships with the stakeholders most critical to your team's success?",
        options: [
          { id: "stak-1-a", text: "I interact with them mainly when there's a task or problem that requires it.", weight: 1 },
          { id: "stak-1-b", text: "We have a working relationship but it's mostly transactional.", weight: 2 },
          { id: "stak-1-c", text: "I invest in these relationships deliberately — I understand their priorities and try to align with them.", weight: 3 },
          { id: "stak-1-d", text: "I have strategic, trust-based relationships where I understand their goals deeply, offer value before I need something, and am seen as a reliable partner — not just a resource.", weight: 4 },
        ],
      },
      {
        id: "stak-2",
        text: "Before launching something new that will impact other teams or functions, how do you prepare?",
        options: [
          { id: "stak-2-a", text: "Finalize the plan, then share it with affected parties when it's ready.", weight: 1 },
          { id: "stak-2-b", text: "Loop in people who might have concerns near the end of planning — before announcement.", weight: 2 },
          { id: "stak-2-c", text: "Identify who will be impacted early and bring them into the process to shape the plan.", weight: 3 },
          { id: "stak-2-d", text: "Map stakeholder impact before planning begins, involve high-risk stakeholders in scoping, and build alignment as part of the process — not as an afterthought before launch.", weight: 4 },
        ],
      },
      {
        id: "stak-3",
        text: "You hear through the grapevine that a senior stakeholder is skeptical about your team's direction. What do you do?",
        options: [
          { id: "stak-3-a", text: "Assume it's second-hand noise and let your results speak for themselves.", weight: 1 },
          { id: "stak-3-b", text: "Wait to see if they raise it directly — if they're skeptical, they should say so.", weight: 2 },
          { id: "stak-3-c", text: "Proactively request a meeting to understand their concerns and share my thinking.", weight: 3 },
          { id: "stak-3-d", text: "Surface it immediately and treat the skepticism as valuable data — request a conversation, come prepared with context, listen to the underlying concern, and use it to adjust how I'm positioning the work.", weight: 4 },
        ],
      },
    ],
  },
];

export type DimensionResult = {
  id: string;
  label: string;
  icon: string;
  color: string;
  avgWeight: number;
  level: GapLevel;
  answers: Array<{ questionId: string; optionId: string; weight: number }>;
};

export function computeGapAnalysis(
  answers: Record<string, string>
): DimensionResult[] {
  return DIMENSIONS.map((dim) => {
    const dimAnswers = dim.questions.map((q) => {
      const optionId = answers[q.id];
      const option = q.options.find((o) => o.id === optionId);
      return { questionId: q.id, optionId: optionId || "", weight: option?.weight || 0 };
    });
    const answered = dimAnswers.filter((a) => a.weight > 0);
    const avg = answered.length > 0
      ? answered.reduce((sum, a) => sum + a.weight, 0) / answered.length
      : 0;
    return {
      id: dim.id,
      label: dim.label,
      icon: dim.icon,
      color: dim.color,
      avgWeight: avg,
      level: weightToLevel(avg),
      answers: dimAnswers,
    };
  });
}

export const ALL_QUESTIONS = DIMENSIONS.flatMap((d) => d.questions);
export const TOTAL_QUESTIONS = ALL_QUESTIONS.length;
