--
-- PostgreSQL database dump
--

\restrict SjbocUUQcKcnXJ1aB4beH0bwG3y96x4vMYmsTDDRmdOQQ45wO0e3HcmduKiPW6R

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assessment_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_results (
    id text NOT NULL,
    user_id text NOT NULL,
    assessment_id text NOT NULL,
    answers jsonb DEFAULT '[]'::jsonb NOT NULL,
    score real NOT NULL,
    strengths jsonb DEFAULT '[]'::jsonb NOT NULL,
    blind_spots jsonb DEFAULT '[]'::jsonb NOT NULL,
    recommendations jsonb DEFAULT '[]'::jsonb NOT NULL,
    breakdown jsonb DEFAULT '[]'::jsonb NOT NULL,
    completed_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: assessments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessments (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    estimated_minutes integer DEFAULT 15 NOT NULL,
    questions jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: brand_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_profiles (
    id text NOT NULL,
    user_id text NOT NULL,
    desired_identity jsonb DEFAULT '[]'::jsonb NOT NULL,
    current_perceptions jsonb DEFAULT '[]'::jsonb NOT NULL,
    gap_areas jsonb DEFAULT '[]'::jsonb NOT NULL,
    strengths jsonb DEFAULT '[]'::jsonb NOT NULL,
    active_habit_ids jsonb DEFAULT '[]'::jsonb NOT NULL,
    brand_score real DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id text NOT NULL,
    user_id text NOT NULL,
    title text DEFAULT 'New Conversation'::text NOT NULL,
    module text DEFAULT 'coach'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: journey_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.journey_actions (
    id text NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type text NOT NULL,
    day integer NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp without time zone,
    reflection_text text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: journey_milestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.journey_milestones (
    id text NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    day_target integer NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id text NOT NULL,
    conversation_id text NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: onboarding_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.onboarding_profiles (
    id text NOT NULL,
    user_id text NOT NULL,
    role_type text NOT NULL,
    years_experience text NOT NULL,
    team_size text NOT NULL,
    industry text NOT NULL,
    biggest_challenge text NOT NULL,
    confidence_level integer NOT NULL,
    fear_areas jsonb DEFAULT '[]'::jsonb NOT NULL,
    desired_reputation jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: reflection_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reflection_responses (
    id text NOT NULL,
    user_id text NOT NULL,
    prompt_id text NOT NULL,
    answer text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: scenarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scenarios (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    situation text NOT NULL,
    category text NOT NULL,
    difficulty text DEFAULT 'intermediate'::text NOT NULL,
    estimated_minutes integer DEFAULT 10 NOT NULL,
    options jsonb DEFAULT '[]'::jsonb NOT NULL,
    tags jsonb DEFAULT '[]'::jsonb NOT NULL,
    is_premium boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    user_id text NOT NULL,
    token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: systems; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.systems (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    estimated_minutes integer DEFAULT 10 NOT NULL,
    steps jsonb DEFAULT '[]'::jsonb NOT NULL,
    key_principles jsonb DEFAULT '[]'::jsonb NOT NULL,
    scripts jsonb DEFAULT '[]'::jsonb NOT NULL,
    is_premium boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: user_scenario_completions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_scenario_completions (
    id text NOT NULL,
    user_id text NOT NULL,
    scenario_id text NOT NULL,
    selected_option_id text NOT NULL,
    score integer NOT NULL,
    completed_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: user_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_stats (
    id text NOT NULL,
    user_id text NOT NULL,
    streak_days integer DEFAULT 0 NOT NULL,
    last_checkin_date timestamp without time zone,
    total_coach_sessions integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    name text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    tier text DEFAULT 'free'::text NOT NULL,
    onboarding_completed boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Data for Name: assessment_results; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assessment_results (id, user_id, assessment_id, answers, score, strengths, blind_spots, recommendations, breakdown, completed_at) FROM stdin;
\.


--
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assessments (id, title, description, category, estimated_minutes, questions, created_at) FROM stdin;
b2687b33-61bb-4f3b-b3cd-1268b067a1c4	Management Readiness Assessment	Diagnose your current management capabilities across 5 key dimensions: self-awareness, communication, performance management, political intelligence, and team leadership.	management_readiness	12	[{"id": "q1", "text": "When a team member underperforms, your first instinct is to:", "type": "single", "options": [{"id": "q1a", "text": "Give them more time — maybe it's a temporary issue", "value": 2}, {"id": "q1b", "text": "Have a direct conversation within 48 hours naming exactly what you observed", "value": 5}, {"id": "q1c", "text": "Document it first, then decide if you need to say something", "value": 3}, {"id": "q1d", "text": "Talk to HR or your manager before approaching the team member", "value": 1}]}, {"id": "q2", "text": "How often do you proactively share bad news with your manager before they ask?", "type": "single", "options": [{"id": "q2a", "text": "Almost never — I prefer to solve problems before escalating", "value": 1}, {"id": "q2b", "text": "Sometimes — depends on how serious it is", "value": 3}, {"id": "q2c", "text": "Almost always — I operate on a 'no surprises' principle", "value": 5}, {"id": "q2d", "text": "I only share it if I'm asked directly", "value": 2}]}, {"id": "q3", "text": "In your last difficult feedback conversation, how specific were you about the behavior?", "type": "single", "options": [{"id": "q3a", "text": "I gave general feedback about attitude or performance", "value": 1}, {"id": "q3b", "text": "I mentioned a specific example but was vague about the impact", "value": 2}, {"id": "q3c", "text": "I named a specific behavior, gave a concrete example, and described the impact", "value": 5}, {"id": "q3d", "text": "I avoided the conversation entirely", "value": 0}]}, {"id": "q4", "text": "How well do you understand the political dynamics and power structures in your organization?", "type": "scale", "options": [{"id": "q4_1", "text": "1 - Not at all", "value": 1}, {"id": "q4_2", "text": "2", "value": 2}, {"id": "q4_3", "text": "3 - Somewhat", "value": 3}, {"id": "q4_4", "text": "4", "value": 4}, {"id": "q4_5", "text": "5 - Very well", "value": 5}]}, {"id": "q5", "text": "When you disagree with a decision made above you, you typically:", "type": "single", "options": [{"id": "q5a", "text": "Say nothing and comply", "value": 1}, {"id": "q5b", "text": "Express your disagreement in the meeting", "value": 4}, {"id": "q5c", "text": "Express concern privately to the decision maker, then commit to the decision once made", "value": 5}, {"id": "q5d", "text": "Complain about it to peers or your team", "value": 0}]}, {"id": "q6", "text": "How consistently do you run structured 1:1s with each of your direct reports?", "type": "single", "options": [{"id": "q6a", "text": "Rarely or never — I prefer ad hoc conversations", "value": 1}, {"id": "q6b", "text": "Occasionally — maybe once or twice a month if we have time", "value": 2}, {"id": "q6c", "text": "Weekly or bi-weekly with a consistent structure", "value": 5}, {"id": "q6d", "text": "We have them but they don't follow a structure", "value": 3}]}, {"id": "q7", "text": "To what degree do your team members know exactly what you expect from them in terms of quality and behavior?", "type": "scale", "options": [{"id": "q7_1", "text": "1 - Not at all clear", "value": 1}, {"id": "q7_2", "text": "2", "value": 2}, {"id": "q7_3", "text": "3 - Somewhat clear", "value": 3}, {"id": "q7_4", "text": "4", "value": 4}, {"id": "q7_5", "text": "5 - Crystal clear", "value": 5}]}, {"id": "q8", "text": "How often do you give your team members unsolicited developmental feedback (not tied to a performance review)?", "type": "single", "options": [{"id": "q8a", "text": "Almost never — I wait for formal review cycles", "value": 1}, {"id": "q8b", "text": "Only when there's a problem I have to address", "value": 2}, {"id": "q8c", "text": "Regularly — I see it as part of my weekly management job", "value": 5}, {"id": "q8d", "text": "Occasionally when it's clearly positive", "value": 3}]}]	2026-03-23 18:49:22.713218
604c19d4-f0b7-47dc-a6db-0ddacee01a90	Brand Equity Assessment	Measure the strength of your professional reputation — understanding how you are currently perceived versus how you intend to be perceived.	brand_equity	10	[{"id": "b1", "text": "If someone in your organization were asked to describe your management style to a new colleague, how confident are you that their description would match how you see yourself?", "type": "scale", "options": [{"id": "b1_1", "text": "1 - Very little alignment", "value": 1}, {"id": "b1_2", "text": "2", "value": 2}, {"id": "b1_3", "text": "3 - Somewhat aligned", "value": 3}, {"id": "b1_4", "text": "4", "value": 4}, {"id": "b1_5", "text": "5 - Very aligned", "value": 5}]}, {"id": "b2", "text": "How proactively do you manage your visibility with senior stakeholders outside your direct team?", "type": "single", "options": [{"id": "b2a", "text": "I don't — I let my work speak for itself", "value": 1}, {"id": "b2b", "text": "I do it occasionally when there's a big win", "value": 2}, {"id": "b2c", "text": "I have a consistent plan for managing key stakeholder relationships", "value": 5}, {"id": "b2d", "text": "I rely on my manager to communicate my contributions upward", "value": 2}]}, {"id": "b3", "text": "When you make a mistake or fail at something visible, you typically:", "type": "single", "options": [{"id": "b3a", "text": "Minimize it and move on quickly", "value": 1}, {"id": "b3b", "text": "Privately correct it and hope no one noticed", "value": 2}, {"id": "b3c", "text": "Own it directly, name what you learned, and communicate what you're doing differently", "value": 5}, {"id": "b3d", "text": "Explain what went wrong and who else was involved", "value": 2}]}, {"id": "b4", "text": "How clearly have you defined what you want your professional reputation to be?", "type": "scale", "options": [{"id": "b4_1", "text": "1 - Not defined at all", "value": 1}, {"id": "b4_2", "text": "2", "value": 2}, {"id": "b4_3", "text": "3 - Somewhat defined", "value": 3}, {"id": "b4_4", "text": "4", "value": 4}, {"id": "b4_5", "text": "5 - Clearly defined and actively building toward it", "value": 5}]}, {"id": "b5", "text": "How often do you deliver on commitments you make to peers, your manager, and your team?", "type": "scale", "options": [{"id": "b5_1", "text": "1 - Rarely", "value": 1}, {"id": "b5_2", "text": "2", "value": 2}, {"id": "b5_3", "text": "3 - Most of the time", "value": 3}, {"id": "b5_4", "text": "4", "value": 4}, {"id": "b5_5", "text": "5 - Almost always — I track my commitments", "value": 5}]}, {"id": "b6", "text": "When you walk into a meeting with senior leaders, how do you feel?", "type": "single", "options": [{"id": "b6a", "text": "Anxious — I worry about being caught out or questioned", "value": 1}, {"id": "b6b", "text": "Cautious — I tend to say less rather than more", "value": 2}, {"id": "b6c", "text": "Prepared — I know my material and I feel ready to contribute", "value": 4}, {"id": "b6d", "text": "Confident — I actively look for opportunities to contribute and be heard", "value": 5}]}]	2026-03-23 18:49:22.713218
1603cd41-b484-44e3-935d-6f2c86730f7c	Self-Awareness Score	Assess how accurately you understand your own strengths, blind spots, emotional triggers, and impact on others.	self_awareness	8	[{"id": "s1", "text": "Have you received consistent feedback (from multiple people) in the last 12 months that surprised you?", "type": "single", "options": [{"id": "s1a", "text": "No — feedback is usually consistent with how I see myself", "value": 5}, {"id": "s1b", "text": "Yes — and it made me realize there's a meaningful gap", "value": 3}, {"id": "s1c", "text": "I haven't received enough feedback to know", "value": 2}, {"id": "s1d", "text": "Yes, but I disagreed with it", "value": 1}]}, {"id": "s2", "text": "How accurately can you predict how others will react to your communication style?", "type": "scale", "options": [{"id": "s2_1", "text": "1 - I'm often surprised by reactions", "value": 1}, {"id": "s2_2", "text": "2", "value": 2}, {"id": "s2_3", "text": "3 - I'm right about half the time", "value": 3}, {"id": "s2_4", "text": "4", "value": 4}, {"id": "s2_5", "text": "5 - I read people and situations very accurately", "value": 5}]}, {"id": "s3", "text": "When you feel stressed or under pressure at work, what typically happens to your behavior?", "type": "single", "options": [{"id": "s3a", "text": "I become more controlling and less open to input", "value": 2}, {"id": "s3b", "text": "I withdraw and communicate less", "value": 2}, {"id": "s3c", "text": "I am aware of the pattern and actively manage it", "value": 5}, {"id": "s3d", "text": "I don't notice much change in my behavior", "value": 1}]}, {"id": "s4", "text": "Can you name 3 specific behaviors that other people find difficult about you — without rationalizing or minimizing them?", "type": "single", "options": [{"id": "s4a", "text": "No — I'm not aware of behaviors people find difficult", "value": 1}, {"id": "s4b", "text": "I can name one, maybe two", "value": 3}, {"id": "s4c", "text": "Yes, I can name three specific patterns", "value": 5}, {"id": "s4d", "text": "I know people have issues with me but I don't know what specifically", "value": 2}]}, {"id": "s5", "text": "How often do you actively seek out feedback from people who might have critical things to say about you?", "type": "scale", "options": [{"id": "s5_1", "text": "1 - Never or rarely", "value": 1}, {"id": "s5_2", "text": "2", "value": 2}, {"id": "s5_3", "text": "3 - Sometimes", "value": 3}, {"id": "s5_4", "text": "4", "value": 4}, {"id": "s5_5", "text": "5 - Regularly and intentionally", "value": 5}]}, {"id": "s6", "text": "How confident are you that your team would give you honest, candid feedback if asked?", "type": "scale", "options": [{"id": "s6_1", "text": "1 - They would not — they feel unsafe to do so", "value": 1}, {"id": "s6_2", "text": "2", "value": 2}, {"id": "s6_3", "text": "3 - Some would, some wouldn't", "value": 3}, {"id": "s6_4", "text": "4", "value": 4}, {"id": "s6_5", "text": "5 - Yes, I've built enough safety for honest feedback", "value": 5}]}]	2026-03-23 18:49:22.713218
\.


--
-- Data for Name: brand_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brand_profiles (id, user_id, desired_identity, current_perceptions, gap_areas, strengths, active_habit_ids, brand_score, updated_at) FROM stdin;
6d24d960-c6a4-4a7a-85d0-e62e68413bc8	92595a5c-5592-4417-b2a4-43e6387d8b5a	[]	[]	[]	[]	[]	0	2026-03-23 23:22:48.743267
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.conversations (id, user_id, title, module, created_at, updated_at) FROM stdin;
9477fae0-6e84-4cf0-9d35-583796d616fb	e6f98cd2-87a9-4be9-af65-3b73c083a029	Test	coach	2026-03-26 23:36:05.231224	2026-03-26 23:36:11.497
c72da562-0041-4a98-b65a-d60c253edb49	e3afd206-68bd-4a91-9e5b-ae29c7b7a78f	Test	coach	2026-03-26 23:37:39.535566	2026-03-26 23:37:57.053
\.


--
-- Data for Name: journey_actions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.journey_actions (id, user_id, title, description, type, day, is_completed, completed_at, reflection_text, created_at) FROM stdin;
a454821d-6073-4c33-8359-d7d86df54508	92595a5c-5592-4417-b2a4-43e6387d8b5a	Complete the Management Readiness Assessment	Understand where you stand today	assessment	1	f	\N	\N	2026-03-23 23:22:48.75203
38ec972f-4ad5-4fac-96dc-fc04b89a82a7	92595a5c-5592-4417-b2a4-43e6387d8b5a	Read: The 1:1 Meeting System	Master the most powerful tool in your management toolkit	system	2	f	\N	\N	2026-03-23 23:22:48.75203
d260fa44-d3d0-4dff-8031-c68841133254	92595a5c-5592-4417-b2a4-43e6387d8b5a	Navigate: The Underperforming Team Member	Practice handling your first difficult performance conversation	scenario	3	f	\N	\N	2026-03-23 23:22:48.75203
6dc08f3d-5d97-425f-afc9-c2f667b90783	92595a5c-5592-4417-b2a4-43e6387d8b5a	Reflect: What do people currently say about you?	Honest self-assessment of your current reputation	reflection	4	f	\N	\N	2026-03-23 23:22:48.75203
a56005b4-7416-41e9-b1b2-2cbcc17f0561	92595a5c-5592-4417-b2a4-43e6387d8b5a	Start your Brand Lab profile	Define the manager you intend to become	habit	5	f	\N	\N	2026-03-23 23:22:48.75203
3309888e-3730-49eb-9947-941a44ddb948	92595a5c-5592-4417-b2a4-43e6387d8b5a	Navigate: Your Boss Challenges You Publicly	Practice handling executive scrutiny with grace	scenario	6	f	\N	\N	2026-03-23 23:22:48.75203
f7bfff6b-9297-430b-97f3-676828b1a7b3	92595a5c-5592-4417-b2a4-43e6387d8b5a	Weekly Reflection	What have you learned this week? Where did you struggle?	reflection	7	f	\N	\N	2026-03-23 23:22:48.75203
\.


--
-- Data for Name: journey_milestones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.journey_milestones (id, user_id, title, description, day_target, is_completed, completed_at, created_at) FROM stdin;
cd2adb60-04d1-4c84-aacd-11c263acb5e1	92595a5c-5592-4417-b2a4-43e6387d8b5a	Build Your Foundation	Complete your first assessment and understand your baseline	7	f	\N	2026-03-23 23:22:48.747333
af9ada6b-47eb-42a3-90ee-46c7d573786f	92595a5c-5592-4417-b2a4-43e6387d8b5a	Strengthen Your Presence	Navigate 3 real-world scenarios and study 2 management systems	14	f	\N	2026-03-23 23:22:48.747333
e81919ac-a096-4249-a745-cbcbc1eaa5c2	92595a5c-5592-4417-b2a4-43e6387d8b5a	Handle Conflict Better	Learn conflict de-escalation and practice difficult conversations	21	f	\N	2026-03-23 23:22:48.747333
ee3fff16-8469-4bca-8f28-549f13ad3334	92595a5c-5592-4417-b2a4-43e6387d8b5a	Improve Executive Communication	Master upward management and meeting presence	28	f	\N	2026-03-23 23:22:48.747333
97b523e9-6b56-429b-92fe-b80ce4596f9b	92595a5c-5592-4417-b2a4-43e6387d8b5a	Become Trusted by Your Team	Build team trust habits and strengthen your workplace brand	30	f	\N	2026-03-23 23:22:48.747333
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.messages (id, conversation_id, role, content, created_at) FROM stdin;
21034b7d-5ec5-40b3-a23e-4eb573f0a706	9477fae0-6e84-4cf0-9d35-583796d616fb	user	Hello	2026-03-26 23:36:05.402674
af399dab-ae1e-4e41-8b65-328d40f4b051	9477fae0-6e84-4cf0-9d35-583796d616fb	assistant	**What’s actually happening here:**\nYou’re testing the waters. Either you’re not sure what to ask yet, or you’re checking whether you’ll get a real answer instead of generic fluff.\n\n**The hidden risk:**\nIf you stay vague, you’ll get generic advice. In real workplaces, vague = misalignment = wasted political capital.\n\n**What a standout manager would do:**\nFrame the situation like a mini-brief so we can solve the right problem fast:\n- Your role + level (manager? IC? director?)\n- The situation in 2–3 sentences\n- What you want (decision, script, strategy, stakeholder plan)\n- The constraint (time, politics, boss, headcount, performance)\n\n**What weak managers usually do wrong:**\n- Ask “any advice?” without context\n- Overshare emotion but not facts\n- Focus on fairness instead of outcomes and leverage\n\n**Suggested script:**\n“Here’s my situation: [role/team]. The issue: [one sentence]. Stakeholders: [names/roles]. What I need: [exact outcome]. Constraints: [politics/time/resources]. Can you give me a plan and the words to use?”\n\n**Brand impact:**\nThe way you frame problems signals your operating level. Crisp, outcome-based framing reads as senior.\n\n**Next step:**\nReply with: your role, the situation, and what outcome you want. Three lines is enough.	2026-03-26 23:36:11.49427
2f0d5b9f-b3bc-4664-a529-b07e9eca4209	c72da562-0041-4a98-b65a-d60c253edb49	user	Test message 1	2026-03-26 23:37:39.648121
1d01b485-9af6-4a10-9622-0003323e5f90	c72da562-0041-4a98-b65a-d60c253edb49	assistant	**What’s actually happening here:**  \nYou’re checking whether I follow the operating rules (structure, tone, specificity), not asking a workplace question yet.\n\n**The hidden risk:**  \nIf you use “test” prompts when you actually have a real situation, you’ll delay getting actionable advice—and you may stay vague out of habit, which is exactly how people get managed instead of managing.\n\n**What a standout manager would do:**  \nState the real scenario in 6–10 lines with the minimum facts needed to diagnose power, incentives, and constraints.\n\n**What weak managers usually do wrong:**  \nThey ask for “general advice,” omit who owns what, and avoid naming the actual friction (performance, politics, trust, or scope).\n\n**Suggested script:**  \n“Here’s the situation: [role/level], [team size], [who I report to]. The issue is [one sentence]. The impact is [metrics/reputation]. The key stakeholders are [names/roles] and they want [X]. Constraints: [time, budget, authority]. What I’ve tried: [1–3 bullets]. I need: [decision, message, plan].”\n\n**Brand impact:**  \nClear, direct framing signals executive maturity. Vague framing signals you’re not in control of the narrative.\n\n**Next step:**  \nSend your real scenario using the template above—include titles/levels and what outcome you want.	2026-03-26 23:37:45.856329
78ad2cb0-e286-4abd-b84a-4cf8d4a213e5	c72da562-0041-4a98-b65a-d60c253edb49	user	Test message 2	2026-03-26 23:37:45.905325
2ef98c36-a4dc-4cf6-b18d-31a63536dcee	c72da562-0041-4a98-b65a-d60c253edb49	assistant	**What’s actually happening here:**  \nYou’re running a second compliance check—seeing if I stay structured and don’t drift into fluff.\n\n**The hidden risk:**  \nIf you’re doing this in a real workplace context (e.g., “just testing the waters” with stakeholders), you risk being seen as noncommittal. People assign seriousness and competence based on how concretely you show up.\n\n**What a standout manager would do:**  \nMove from testing to a crisp ask. Provide: the decision you need, by when, and what you recommend.\n\n**What weak managers usually do wrong:**  \nThey keep “warming up,” share partial context, and force others to guess what help they want—burning political capital.\n\n**Suggested script:**  \n“I’m not looking for general thoughts. I need a recommendation on how to handle [situation] with [stakeholder] by [date]. My preferred outcome is [X]. My current plan is [Y]. Tell me what I’m missing and what you’d say.”\n\n**Brand impact:**  \nClarity and decisiveness make you easy to back. Tests and vagueness make you easy to ignore.\n\n**Next step:**  \nPost one real situation (even small) and include: your role/level, the stakeholder power map, and the exact outcome you want.	2026-03-26 23:37:51.727966
e0109835-59b7-4107-8362-3b045359b9b6	c72da562-0041-4a98-b65a-d60c253edb49	user	Test message 3	2026-03-26 23:37:51.769707
fb1720a0-4735-4866-a4f1-e06109100df1	c72da562-0041-4a98-b65a-d60c253edb49	assistant	**What’s actually happening here:**  \nYou’re confirming I can keep the same operating cadence under repetition. Still no workplace problem to solve.\n\n**The hidden risk:**  \nThree “tests” in a row is a pattern: avoidance disguised as preparation. In corporate life, that turns into overthinking, slow escalation, and letting other people set the agenda.\n\n**What a standout manager would do:**  \nPick one real situation and drive to an outcome: decision, message, or plan. If you don’t have one, we create one: “What’s the one conversation you’re dreading this week?”\n\n**What weak managers usually do wrong:**  \nThey keep the conversation abstract, ask for frameworks, and delay the hard part—naming the conflict and making a call.\n\n**Suggested script:**  \n“I’m going to be specific. The problem is [X]. The person/role creating friction is [Y]. The business impact is [Z]. I need to accomplish [outcome] without damaging [relationship/reputation]. Give me the cleanest approach and exact words.”\n\n**Brand impact:**  \nSpecificity signals leadership. Endless testing signals you’re not ready to operate at the next level.\n\n**Next step:**  \nAnswer these three bullets now:  \n1) What outcome do you want in the next 2 weeks?  \n2) Who can block it (titles/roles)?  \n3) What’s the awkward conversation you’re avoiding?	2026-03-26 23:37:57.050124
\.


--
-- Data for Name: onboarding_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.onboarding_profiles (id, user_id, role_type, years_experience, team_size, industry, biggest_challenge, confidence_level, fear_areas, desired_reputation, created_at) FROM stdin;
9c03aa84-4cad-4f00-95d5-6b9c2e235fe6	92595a5c-5592-4417-b2a4-43e6387d8b5a	first_time_manager	0-2	1-5	Tech	imposter_syndrome	4	[]	[]	2026-03-23 23:22:48.731753
\.


--
-- Data for Name: reflection_responses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reflection_responses (id, user_id, prompt_id, answer, created_at) FROM stdin;
\.


--
-- Data for Name: scenarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.scenarios (id, title, description, situation, category, difficulty, estimated_minutes, options, tags, is_premium, created_at, updated_at) FROM stdin;
36f10c3c-e325-44b2-98c2-7f93f908f0c3	Your Direct Report is Underperforming — But Everyone Loves Them	A beloved team member has missed three deadlines and their work quality has dropped. The team adores them. You need to address it.	Alex has been on your team for 18 months. Everyone loves Alex — warm, collaborative, always first to celebrate teammates. But over the past six weeks, Alex has missed three important deadlines, delivered work with notable errors, and seems disengaged in meetings.\n\nYour manager asks you in a 1:1: "How's Alex doing?" You know the performance issues exist, but you also know that addressing them will be politically sensitive given how popular Alex is. What do you do?	Managing Performance	intermediate	10	[{"id": "a", "text": "Tell your manager everything is fine. Handle it privately with Alex first before escalating.", "score": 20, "quality": "risky", "brandImpact": "Risk: Your manager will question your judgment and your transparency.", "explanation": "This response protects you short-term but creates a trust problem with your manager. If your manager discovers the performance issues independently, you will appear either unaware or dishonest. Neither is good for your credibility."}, {"id": "b", "text": "Tell your manager honestly that Alex is struggling, that you're aware of it, and that you have a plan to address it with a documented conversation this week.", "score": 100, "quality": "strong", "brandImpact": "Strength: You build trust as a manager who sees clearly and acts proactively.", "explanation": "This is the response of a credible, self-aware manager. You are honest, you demonstrate awareness, and you signal that you have a plan. Your manager trusts you because you are not hiding problems — you are managing them."}, {"id": "c", "text": "Deflect by praising Alex's cultural contributions and mention the performance issues briefly.", "score": 30, "quality": "weak", "brandImpact": "Risk: You signal that you lack the discipline to manage performance clearly.", "explanation": "This response signals that you prioritize popularity over performance — a critical failure for a manager. Your manager will notice that you're softening the reality. It also delays a problem that will only compound."}, {"id": "d", "text": "Be direct with your manager and also have an immediate corrective conversation with Alex using a documented performance improvement framework.", "score": 95, "quality": "strong", "brandImpact": "Strength: You build a reputation as a manager who is fair, clear, and operationally excellent.", "explanation": "Excellent. This response demonstrates both upward transparency and downward accountability. You are managing in both directions — which is exactly what standout managers do."}]	["performance", "difficult conversations", "credibility"]	f	2026-03-23 18:49:22.694398	2026-03-23 18:49:22.694398
708f030b-7240-43ab-a3c9-a67561349684	Your Boss Challenges Your Judgment in a Meeting	Your manager publicly questions a decision you made in front of the broader team and senior stakeholders.	You're presenting a project update in a cross-functional meeting with your manager and four senior stakeholders. Mid-presentation, your manager interrupts: "I actually don't think that approach was right. We should have gone in a different direction from the start."\n\nThe room goes quiet. Everyone is looking at you. Your manager is not wrong that the approach has challenges, but they hadn't raised these concerns privately before today. How do you respond?	Executive Pressure	advanced	12	[{"id": "a", "text": "Immediately agree with your manager and apologize to the room for the oversight.", "score": 15, "quality": "weak", "brandImpact": "Risk: You are seen as a manager without backbone. Stakeholders will discount your future recommendations.", "explanation": "Immediate capitulation signals that you lack confidence and judgment. While it avoids conflict in the moment, it damages your credibility with every stakeholder in the room. They now question whether your decisions can be trusted."}, {"id": "b", "text": "Calmly acknowledge the concern, thank your manager for raising it, and propose to discuss it in a follow-up session with more detail.", "score": 90, "quality": "strong", "brandImpact": "Strength: You signal calm confidence and political awareness. Stakeholders see someone who doesn't crack.", "explanation": "This response demonstrates composure and emotional control under pressure. You are not being defensive, and you are not capitulating. You are managing the moment intelligently by creating space for a proper discussion."}, {"id": "c", "text": "Defend your decision firmly with data, explaining why the approach was correct.", "score": 55, "quality": "acceptable", "brandImpact": "Neutral to risky: If your data is strong, it can work. If not, it backfires. The public setting makes this high-stakes.", "explanation": "Defending your position with evidence is legitimate, but in this setting it can escalate into a conflict that damages both your relationship with your manager and your optics with stakeholders. The strength of your data matters."}, {"id": "d", "text": "Visibly react — look frustrated or shocked — and then defend yourself.", "score": 5, "quality": "risky", "brandImpact": "Risk: You are branded as emotionally reactive. This follows you for months.", "explanation": "This is the worst possible response. A visible emotional reaction tells the entire room that you struggle with composure under pressure. Stakeholders and your manager will remember this. It undermines every other strength you have."}]	["executive presence", "conflict", "credibility"]	f	2026-03-23 18:49:22.694398	2026-03-23 18:49:22.694398
c9f260b8-69c6-4100-ae15-108f4b99cf77	A Peer Manager is Subtly Undermining You	A colleague at the same level keeps talking over you in meetings and takes credit for collaborative work.	Jordan, a peer manager in a neighboring function, has started a subtle campaign that is affecting your reputation. In leadership meetings, Jordan regularly talks over your points and reframes them as their own idea. After a joint project, Jordan sent an update to leadership that highlighted their team's contributions heavily while barely mentioning yours.\n\nThis isn't overt — it's subtle. But you feel it, and you suspect others notice it too. How do you handle this?	Peer Tension	advanced	15	[{"id": "a", "text": "Raise it directly with your manager and ask them to address it with Jordan.", "score": 25, "quality": "weak", "brandImpact": "Risk: You appear politically naive and unable to manage lateral relationships.", "explanation": "Escalating to your manager without attempting to address it directly first signals immaturity and makes you appear unable to handle peer conflict. Your manager will also wonder why you didn't handle it yourself."}, {"id": "b", "text": "Address it directly with Jordan in a private, one-on-one conversation — naming the specific behaviors calmly.", "score": 85, "quality": "strong", "brandImpact": "Strength: You build a reputation as someone who handles conflict directly and professionally.", "explanation": "This is the mature, confident response. A private conversation signals that you are capable of direct communication and that you are not threatened enough to escalate prematurely. How you frame it matters — stay specific and calm, not accusatory."}, {"id": "c", "text": "Start being more proactively visible — send your own updates to leadership, speak up first in meetings.", "score": 60, "quality": "acceptable", "brandImpact": "Neutral: Visibility matters, but it doesn't address the root dynamic.", "explanation": "Increasing your own visibility is smart and important, but it doesn't solve the Jordan problem. Used in isolation, it's incomplete. Combined with a direct conversation, it's effective."}, {"id": "d", "text": "Say nothing and hope it resolves itself.", "score": 10, "quality": "risky", "brandImpact": "Risk: You allow someone else to quietly shape your reputation in leadership meetings.", "explanation": "Inaction is a decision. Subtle undermining that goes unchallenged tends to escalate because it's working. Saying nothing also sends a signal to observers that you either don't notice or don't mind."}]	["politics", "peer dynamics", "influence"]	f	2026-03-23 18:49:22.694398	2026-03-23 18:49:22.694398
314da6d0-b275-4c5a-8215-f52ae983950d	A Team Member Keeps Bypassing You	One of your direct reports regularly goes directly to your manager instead of routing things through you.	Marcus, one of your direct reports, has started going directly to your manager, Sarah, with updates, ideas, and requests — bypassing you entirely. You've heard about it after the fact three times in the last month. Marcus is high-performing and ambitious. Sarah seems to enjoy the direct access.\n\nThis is creating an awkward dynamic and subtly undermining your authority as Marcus's manager. How do you handle it?	Managing Up and Down	intermediate	10	[{"id": "a", "text": "Tell Marcus that they need to stop going to Sarah and only communicate through you.", "score": 20, "quality": "weak", "brandImpact": "Risk: You appear insecure and controlling rather than confident.", "explanation": "A direct restriction like this can create resentment in a high performer and can backfire if Marcus has a good relationship with Sarah. It also looks defensive. A better approach addresses the root cause."}, {"id": "b", "text": "Have an honest conversation with Marcus about your expectations for how communication flows — frame it as helping them look good, not as a restriction.", "score": 90, "quality": "strong", "brandImpact": "Strength: You demonstrate the ability to manage performance through influence, not control.", "explanation": "This is the thoughtful response. High performers respond better when they understand the why. Frame it as: 'I want to make sure you get credit for your ideas, and the best way to ensure that is to route them through me so I can properly advocate for you.' This gets compliance while preserving the relationship."}, {"id": "c", "text": "Speak to Sarah and ask her to redirect Marcus back to you.", "score": 55, "quality": "acceptable", "brandImpact": "Neutral: Useful as a secondary step, not a primary one.", "explanation": "Looping in your manager is reasonable, but only if done diplomatically and after attempting to address it with Marcus first. Going to Sarah first can make you appear unable to manage your team directly."}, {"id": "d", "text": "Increase the quality and frequency of your own updates to Sarah so that Marcus's bypasses are less impactful.", "score": 65, "quality": "acceptable", "brandImpact": "Positive visibility, but incomplete as a standalone strategy.", "explanation": "Smart visibility management. But this doesn't solve the structural problem — it just mitigates it. A combination of this and the direct conversation with Marcus is the complete solution."}]	["authority", "team dynamics", "upward management"]	f	2026-03-23 18:49:22.694398	2026-03-23 18:49:22.694398
047693de-b02f-4714-ac09-8d7fc8368c21	You Inherited a Messy Team Culture	You've stepped into a manager role where the team has low morale, low trust, and a culture of blame.	You've just joined as manager of a 6-person team. Within your first two weeks, you observe: team members talk over each other in meetings, two people barely communicate, one senior person openly criticizes the company in front of the team, and almost no one has had a proper 1:1 in six months.\n\nYou have pressure from leadership to deliver results quickly, but you can see the culture is broken. What is your first move?	Team Culture	advanced	15	[{"id": "a", "text": "Address all the cultural issues immediately in a team meeting — set clear expectations for behavior.", "score": 25, "quality": "risky", "brandImpact": "Risk: You appear impulsive and unaware of how trust actually gets built.", "explanation": "Moving too fast in a broken culture often backfires. Team members who don't trust you yet will see this as performative or threatening. You haven't earned the relational capital to set sweeping expectations yet."}, {"id": "b", "text": "Start with individual 1:1 conversations — listen first, diagnose the root causes, then act.", "score": 95, "quality": "strong", "brandImpact": "Strength: You are seen as a thoughtful, strategic leader who builds before disrupting.", "explanation": "This is the disciplined response. Diagnosis before action. Individual 1:1s give you real information about what's driving the culture issues. They also begin building trust with each team member individually — the foundation of any cultural change."}, {"id": "c", "text": "Focus entirely on delivering results for the first 90 days, and defer culture concerns.", "score": 20, "quality": "weak", "brandImpact": "Risk: You miss the root cause of performance problems and will struggle to sustain results.", "explanation": "A false dichotomy. Culture and performance are not separate. A team with broken trust will not consistently deliver results — they will protect themselves at the expense of collaboration."}, {"id": "d", "text": "Identify the most vocal negative influence and address their behavior directly in week one.", "score": 30, "quality": "risky", "brandImpact": "Risk: You appear reactive and politically unaware before you've earned the room.", "explanation": "Moving on an individual before you understand the dynamics can make you an enemy of the team rather than a trusted leader. You might target the wrong person or misread the situation entirely without enough context."}]	["culture", "team dynamics", "leadership"]	t	2026-03-23 18:49:22.694398	2026-03-23 18:49:22.694398
6d8dbdba-1339-4d13-86c0-8d49ee202583	You're Seen as Too Nice — and It's Hurting Your Authority	Feedback from peers suggests your team doesn't take you seriously because you're too agreeable.	In your last 360 review, three different stakeholders flagged the same theme: "Sarah is extremely likable and supportive, but team members don't seem to take her direction as seriously as they should."\n\nYou recognize the feedback has merit. You've avoided conflict to preserve relationships, you've said yes when you meant no, and you've let deadlines slide without real consequence. How do you recalibrate without swinging to the other extreme?	Leadership Presence	intermediate	10	[{"id": "a", "text": "Start enforcing strict deadlines with consequences and adopt a more formal communication style.", "score": 25, "quality": "risky", "brandImpact": "Risk: You damage the relationships you built and confuse your team about who you actually are.", "explanation": "Overcorrecting creates whiplash. If your team has experienced you as warm and agreeable, a sudden shift to formal enforcement reads as inauthentic or punitive. They will resent it and it will not fix the root problem."}, {"id": "b", "text": "Schedule a direct conversation with your team where you acknowledge you want to be more intentional about holding standards — and be specific about what will change.", "score": 85, "quality": "strong", "brandImpact": "Strength: You demonstrate the self-awareness that separates standout managers from average ones.", "explanation": "Transparency with your team about your own evolution shows maturity. When done well, it builds trust rather than damaging it. You're signaling: I've heard the feedback, I take it seriously, and I'm changing — not as punishment but as growth."}, {"id": "c", "text": "Start saying no more often, in small moments — gradually shift your pattern of behavior over time.", "score": 80, "quality": "strong", "brandImpact": "Strength: Consistent behavior over time rebuilds credibility without creating conflict.", "explanation": "Gradual behavioral change is sustainable and less disruptive than dramatic shifts. The key is consistency — every no that you hold to trains your team that you mean what you say."}, {"id": "d", "text": "Do nothing — being liked is an asset and the feedback is overblown.", "score": 5, "quality": "risky", "brandImpact": "Risk: Your reputation stagnates and you eventually plateau as a leader.", "explanation": "Dismissing this pattern of feedback is a form of strategic blindness. Being liked is an asset, but being liked without being respected is a career limiter. The feedback is clear and consistent — it demands a response."}]	["authority", "credibility", "presence"]	f	2026-03-23 18:49:22.694398	2026-03-23 18:49:22.694398
f3c4157e-206d-4999-b72c-31d957852ec9	Respected for Effort but Not Seen as Strategic	You work harder than anyone but leadership sees you as a reliable executor, not a strategic thinker.	You've been told multiple times that you're "one of the hardest workers" and "incredibly reliable." But when a senior leadership role opened up, you were passed over for someone who — in your view — works less hard than you. In your debrief with your manager, the feedback was: "We need someone in that role who can think more strategically about the bigger picture."\n\nYou're confused and frustrated. You deliver. Why isn't it enough?	Career Growth	advanced	15	[{"id": "a", "text": "Work even harder and take on more projects to prove your value.", "score": 10, "quality": "weak", "brandImpact": "Risk: You deepen the gap between your perception and the profile leadership is looking for.", "explanation": "More of the same won't change how leadership perceives you. The problem isn't your work ethic — they already acknowledge it. Adding more volume reinforces the pattern that defines you as an executor, not a strategist."}, {"id": "b", "text": "Ask your manager specifically what 'thinking more strategically' looks like in practice — and request examples of someone they see as strategic.", "score": 95, "quality": "strong", "brandImpact": "Strength: You demonstrate the meta-skill of strategic feedback-seeking, which is itself a strategic behavior.", "explanation": "This is the most intelligent response. You can't fix a gap you don't fully understand. Strategic thinking is often poorly defined — getting concrete examples gives you real data to work with. It also signals self-awareness."}, {"id": "c", "text": "Start contributing more opinions and ideas in meetings, even when they are outside your direct area.", "score": 60, "quality": "acceptable", "brandImpact": "Neutral to positive: High upside if you pick your moments and say something genuinely insightful.", "explanation": "Increasing your strategic visibility is necessary, but quality matters more than quantity. Poorly timed or uninformed contributions can backfire. The goal is to demonstrate strategic thinking, not just to look like you're doing it."}, {"id": "d", "text": "Find a mentor senior to you who is seen as strategic and ask to learn how they approach problems.", "score": 85, "quality": "strong", "brandImpact": "Strength: You signal ambition, coachability, and long-term strategic intent.", "explanation": "This is an underrated but highly effective move. Strategic thinking is often modeled, not taught. A senior mentor gives you access to how strategic people actually think, not just what they communicate externally."}]	["strategy", "executive presence", "career"]	t	2026-03-23 18:49:22.694398	2026-03-23 18:49:22.694398
c033b586-cad5-4492-9b4a-2d91358ceb20	Employee Disengagement You Can See but Can't Pinpoint	A previously strong team member has gone quiet. They're still doing the work, but something is off.	Priya was one of your best team members — proactive, energetic, full of ideas. Over the past five weeks, she's stopped contributing in meetings, her email responses are minimal, and she seems to be going through the motions.\n\nShe hasn't said anything to you, and her work output is still technically acceptable. But you can sense something has shifted. You're worried about losing her. How do you approach this?	Employee Engagement	beginner	8	[{"id": "a", "text": "Wait and see if it resolves itself — sometimes people just have off weeks.", "score": 10, "quality": "weak", "brandImpact": "Risk: You lose a strong team member who needed to feel seen and didn't.", "explanation": "Disengagement is almost never self-resolving. Waiting signals to Priya that you either don't notice or don't care — both of which accelerate her disengagement. The window to re-engage is closing."}, {"id": "b", "text": "Schedule a 1:1 where you open by naming what you've noticed — specifically and without judgment — and create space for her to speak.", "score": 100, "quality": "strong", "brandImpact": "Strength: You build trust as a manager who pays attention and creates safety.", "explanation": "This is exactly right. Naming what you've observed — without assuming or accusing — opens a door that a generic check-in might not. 'I've noticed you've been a bit quieter lately and I wanted to check in' is specific, caring, and inviting."}, {"id": "c", "text": "Ask another team member to find out what's going on with Priya.", "score": 5, "quality": "risky", "brandImpact": "Risk: You are perceived as conflict-avoidant and lacking in emotional intelligence.", "explanation": "Outsourcing this to a colleague is a serious misstep. It signals that you lack the confidence to address it directly, and it can damage trust if Priya finds out — which she likely will."}, {"id": "d", "text": "Send Priya more challenging work and opportunities to re-ignite her engagement.", "score": 50, "quality": "acceptable", "brandImpact": "Neutral: May help or may completely miss the point. Lower risk than doing nothing.", "explanation": "This can work if the root cause of disengagement is under-challenge. But it can also backfire if the real issue is something else entirely — a relationship conflict, a personal situation, or frustration with the team. Diagnose first."}]	["engagement", "retention", "1-on-1s"]	f	2026-03-23 18:49:22.694398	2026-03-23 18:49:22.694398
3d164d7a-c302-4806-9037-8a5b44551ff1	Leadership Asks You to Project Confidence You Don't Feel	You've been asked to present on a topic where you don't feel certain, to an audience that expects certainty.	You've been asked to present the team's Q3 strategy to the executive leadership team in 72 hours. The strategy is still being refined, there are open questions you haven't resolved, and your manager has told you: "They want to see confidence and clarity."\n\nYou don't feel confident. The plan has real gaps. What is your approach?	Executive Communication	advanced	12	[{"id": "a", "text": "Project full confidence and present the strategy as complete and finalized, even where gaps exist.", "score": 10, "quality": "risky", "brandImpact": "High risk: A single credibility failure with senior leadership can take years to recover from.", "explanation": "Overstating certainty to a senior audience is one of the highest-risk moves you can make. Executive leaders are experienced at spotting gaps. If they discover the strategy has holes you didn't acknowledge, it destroys your credibility permanently."}, {"id": "b", "text": "Present what is decided with full confidence, and frame the open questions as 'areas we're actively resolving' with a clear timeline.", "score": 95, "quality": "strong", "brandImpact": "Strength: You build credibility as someone who is rigorous, honest, and strategically self-aware.", "explanation": "This is the masterful approach. Confidence does not mean certainty — it means owning your position clearly. You can be fully confident about what you know while being honest about what you're still working through. Senior leaders respect this honesty."}, {"id": "c", "text": "Ask your manager to present instead, explaining that you need more time to finalize the strategy.", "score": 15, "quality": "weak", "brandImpact": "Risk: You appear to lack executive readiness, which will limit your access to future opportunities.", "explanation": "Passing the opportunity signals lack of confidence in yourself — and signals to your manager that you struggle under pressure. Unless there's a genuine reason you cannot present, this is a missed development opportunity you'll regret."}, {"id": "d", "text": "Tell the executive team upfront that the strategy is still being developed and you have more questions than answers.", "score": 20, "quality": "weak", "brandImpact": "Risk: You signal unpreparedness and potentially shake confidence in your team's capacity to deliver.", "explanation": "Complete transparency about your uncertainty will undermine confidence in the team before you've even had a chance to demonstrate your thinking. There's a difference between being honest about open questions and broadcasting that you're not ready."}]	["executive presence", "communication", "confidence"]	t	2026-03-23 18:49:22.694398	2026-03-23 18:49:22.694398
3bc93b85-2533-475e-b289-6dc9a2f1bb7e	Giving Hard Feedback Without Losing Trust	A team member needs developmental feedback that will be difficult to hear. They are sensitive and have reacted poorly in the past.	David, a team member you genuinely respect, has a pattern of dominating conversations and not listening to others. It's affecting team dynamics and his stakeholder relationships. He's received this feedback before from a previous manager and reacted defensively.\n\nYou need to give him this feedback now, before his next performance review cycle. How do you approach the conversation?	Feedback	intermediate	10	[{"id": "a", "text": "Wait until the performance review to give the feedback — it will be more formal and less personal.", "score": 15, "quality": "weak", "brandImpact": "Risk: You appear conflict-avoidant, and David misses a development window.", "explanation": "Waiting months to give behavioral feedback deprives David of the opportunity to change before it formally affects his record. It also signals to David that you avoided a hard conversation — which erodes his trust in you as a coach."}, {"id": "b", "text": "Give the feedback in a 1:1 — be specific about the behavior, give a concrete example, and make clear the impact it's having. Separate the behavior from the person.", "score": 95, "quality": "strong", "brandImpact": "Strength: You build trust as a manager who gives real feedback, not just performance review summaries.", "explanation": "Specific, behavior-based feedback in a private setting is almost always the right approach. The key is: specific example, observable behavior, clear impact. 'In Tuesday's stakeholder call, I noticed you spoke over three people — the impact was that they stopped contributing.' This is hard to dismiss."}, {"id": "c", "text": "Give the feedback in a group setting so David can hear it from multiple voices.", "score": 5, "quality": "risky", "brandImpact": "Risk: David will not trust you, and other team members will note your judgment.", "explanation": "Public feedback on a sensitive topic is almost never the right call. It triggers defensiveness and shame. It also demonstrates a lack of emotional intelligence and will permanently damage your relationship with David."}, {"id": "d", "text": "Frame the feedback as a question — 'How do you think the conversation went?' — to allow David to self-diagnose.", "score": 55, "quality": "acceptable", "brandImpact": "Neutral: Can facilitate insight, but doesn't replace the direct conversation.", "explanation": "Using a reflective question can work if David has the self-awareness to arrive at the insight himself. But if he doesn't, you still have to give the feedback directly. This approach works best as a warm-up to direct feedback, not a replacement for it."}]	["feedback", "trust", "communication"]	f	2026-03-23 18:49:22.694398	2026-03-23 18:49:22.694398
dd24eb6c-a14e-4c1f-84e0-676710c2fb3a	Being Challenged in a Meeting By Someone More Senior	A VP publicly challenges your recommendation during a company-wide review.	You're presenting a budget recommendation to a company-wide leadership review. A VP you have limited relationship with says, in front of 40 people: "This recommendation doesn't make sense to me. What's the basis for this number?" Their tone is skeptical and the room is quiet.\n\nYou have solid reasoning behind the number. How do you respond?	Executive Presence	advanced	8	[{"id": "a", "text": "Immediately back down and suggest you'll revisit the number offline.", "score": 10, "quality": "weak", "brandImpact": "Risk: You appear to have low conviction in your own work under pressure.", "explanation": "Backing down without engaging the question signals that your recommendation wasn't well-reasoned — even if it was. The VP and everyone watching will now doubt whether your numbers can be trusted."}, {"id": "b", "text": "Stay calm, thank them for the question, and walk through your reasoning clearly and concisely.", "score": 95, "quality": "strong", "brandImpact": "Strength: You demonstrate executive composure and that your work stands up to scrutiny.", "explanation": "This is the executive-ready response. Thank the question — not the challenge, but the question. It signals composure. Then walk through your reasoning. If you're right, the room will see it. If you're wrong, the clear explanation will still show good-faith thinking."}, {"id": "c", "text": "Respond defensively — explain that you put a lot of work into this and are confident in it.", "score": 15, "quality": "risky", "brandImpact": "Risk: You appear reactive and unable to handle scrutiny without taking it personally.", "explanation": "Defensiveness signals insecurity. Referencing how hard you worked at this is irrelevant to whether the number is right. The VP doesn't care about effort — they care about soundness."}, {"id": "d", "text": "Ask the VP what specific aspect they want you to clarify, then address that directly.", "score": 90, "quality": "strong", "brandImpact": "Strength: You are seen as calm, smart, and efficient under pressure.", "explanation": "Excellent. Narrowing the question before answering it shows intelligence and precision. It prevents you from over-explaining and ensures you address exactly what the VP needs to know."}]	["executive presence", "confidence", "handling pressure"]	f	2026-03-23 18:49:22.694398	2026-03-23 18:49:22.694398
d4cbb58c-8b78-4b61-a08a-8dc0e7af13bf	Managing Optics After a Visible Mistake	A project you led went over budget and over time. Leadership is asking questions.	A project you managed for the past quarter came in 20% over budget and four weeks late. It wasn't your fault alone — there were vendor delays and shifting requirements — but you were the lead. Your manager is now being asked to explain what happened, and you've been asked to present a post-mortem to senior leadership.\n\nHow do you approach this post-mortem?	Reputation Management	intermediate	12	[{"id": "a", "text": "Provide a detailed explanation of all the external factors that contributed to the failure — clearly showing it wasn't primarily your fault.", "score": 20, "quality": "risky", "brandImpact": "Risk: You appear unable to own outcomes, which is a critical leadership weakness.", "explanation": "A post-mortem that focuses on blame — even toward legitimate external factors — reads as defensive and unaccountable. Senior leaders have seen this pattern many times and will discount your credibility."}, {"id": "b", "text": "Own the outcome, explain what you learned, present specific changes you will implement, and share what you would do differently.", "score": 100, "quality": "strong", "brandImpact": "Strength: Counterintuitively, how you handle failure often builds more trust than how you handle success.", "explanation": "This is the response of a high-integrity leader. You own the outcome without being a martyr. You demonstrate learning. You show a path forward. This is how credibility is rebuilt and often reinforced after a failure."}, {"id": "c", "text": "Minimize the issue — 'these things happen in complex projects.'", "score": 5, "quality": "weak", "brandImpact": "Risk: You appear unaccountable and strategically unaware of how this looks.", "explanation": "Minimizing a visible failure without addressing it substantively signals low accountability and low learning. Leadership will be left wondering whether you understand the magnitude of what happened."}, {"id": "d", "text": "Present a full forensic analysis of every decision made, proving each one was rational at the time.", "score": 60, "quality": "acceptable", "brandImpact": "Neutral: Smart and thorough, but potentially missing the emotional intelligence component.", "explanation": "Analytical rigor is valuable but can come across as over-explaining. The goal isn't to prove you were rational — it's to show you've learned and will operate differently. Focus on the forward-looking implications more than the backward-looking justification."}]	["accountability", "reputation", "recovery"]	t	2026-03-23 18:49:22.694398	2026-03-23 18:49:22.694398
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, user_id, token, expires_at, created_at) FROM stdin;
1516342a-3089-4d51-a954-db23a748a319	92595a5c-5592-4417-b2a4-43e6387d8b5a	4a22207d-7e91-46c5-b04d-9e4539a20a9e-f1b52ce8-5a92-44b0-af4b-c301b82f62b2	2026-04-22 23:12:40.568	2026-03-23 23:12:40.569512
eed84c67-d5f6-4e6a-a20c-09b8100d5709	92595a5c-5592-4417-b2a4-43e6387d8b5a	d1df6f97-d7c1-41bf-8a1f-a2a382f5aa24-53bc3c9a-42e3-48c5-9e8c-71b037f7d323	2026-04-22 23:12:51.281	2026-03-23 23:12:51.281736
63349967-ecf9-4615-9003-a51d32d5202a	92595a5c-5592-4417-b2a4-43e6387d8b5a	7b2069a3-2a17-46c6-b528-8da65fb1ee86-3a41ed02-b493-4da4-b204-ef666d37dca7	2026-04-22 23:16:25.227	2026-03-23 23:16:25.22779
4380a4ed-b9b7-419a-a642-1465b139bdb5	e6f98cd2-87a9-4be9-af65-3b73c083a029	8862421d-de68-4bd6-9fea-62583684555f-25d0b69e-2f82-45f9-b823-d0d48bbd2551	2026-04-22 23:17:23.23	2026-03-23 23:17:23.230882
715733ad-4ec5-42ee-a9d2-729abef243da	e6f98cd2-87a9-4be9-af65-3b73c083a029	f48d39b2-374d-4616-8fe8-0c9e89ac434f-8684c37d-35c5-4197-9a13-7a6bb29b968c	2026-04-22 23:17:38.569	2026-03-23 23:17:38.570024
42ae6ad9-0c52-45e4-a5a4-1a6204c75212	e6f98cd2-87a9-4be9-af65-3b73c083a029	93f6103f-f8b5-41d4-bb4f-451aca5897fc-362531b5-22f4-4223-902d-338ec8b56e4c	2026-04-22 23:18:33.781	2026-03-23 23:18:33.782336
94cbe680-1466-4702-9f00-dca391a10c45	5bd5dff1-79c8-46d8-85f8-a1b115c4429a	4a516193-91d7-4b21-8b6d-46af49c9c1c9-7b283253-0572-4f66-85d5-9555318d6b9c	2026-04-22 23:19:13.344	2026-03-23 23:19:13.345151
7bfbe824-ddd4-47ee-b078-90ff86cf93ee	5bd5dff1-79c8-46d8-85f8-a1b115c4429a	25f86e6a-b4cd-4534-975f-24a873cd8f45-10526a1d-d20d-4267-96fd-bf723a4331cc	2026-04-22 23:19:33.625	2026-03-23 23:19:33.626153
4e4bfc6d-2159-4f20-a217-0279b48a1360	92595a5c-5592-4417-b2a4-43e6387d8b5a	b0f25c32-39b1-486e-ac3f-feda2d637275-16447898-2b36-4c01-a5e2-5ef98f7afe35	2026-04-22 23:22:30.035	2026-03-23 23:22:30.036145
a61f412e-89d3-45a4-a9bf-223175864bb4	e6f98cd2-87a9-4be9-af65-3b73c083a029	4a80db50-3393-406a-990c-1cd48a513d44-fef0c04b-e699-4299-a0ed-ae46bad3eb53	2026-04-23 01:54:07.845	2026-03-24 01:54:07.847432
ebb1ac1b-80e1-4d08-8e0b-6eedcffaf04a	e6f98cd2-87a9-4be9-af65-3b73c083a029	32f88c4b-3893-46b0-87d4-b23746da66cf-f1c324ae-75e2-4905-8616-151e41e77dfd	2026-04-23 15:27:18.528	2026-03-24 15:27:18.529875
0d67ce11-f8d7-43cf-83a5-864b51d868bf	e6f98cd2-87a9-4be9-af65-3b73c083a029	925261dd-0001-4051-b1c8-6a4b931061f2-ad436add-3b47-4435-8377-10de3ad5050c	2026-04-23 23:05:05.783	2026-03-24 23:05:05.785293
6b335bb7-adb2-4f3d-b429-ca1ab4baf553	e6f98cd2-87a9-4be9-af65-3b73c083a029	f6ffb514-936e-4ce7-9783-f8257460e023-fe58f0c3-5338-4966-ad11-6b1bed4fbf9b	2026-04-24 01:44:37.897	2026-03-25 01:44:37.899284
88c46982-7ad2-4da7-b67a-05908608fbc2	e6f98cd2-87a9-4be9-af65-3b73c083a029	ab2afb16-abc3-480c-93b3-5e982fde5470-d86e8836-0358-436d-a85c-8d92944f411a	2026-04-24 01:48:32.067	2026-03-25 01:48:32.068552
1d0af174-f9fd-4330-aecf-188a28056be1	07554a54-eaa8-45c7-823a-1905cdc36b78	7a4f53f2-b542-4583-8af5-e8e845140d02-fea6cb9f-525a-46d5-9d13-c3752d01bfa1	2026-04-25 03:19:47.694	2026-03-26 03:19:47.69512
17cdaf01-f98c-4eeb-9586-e8b250d9bc40	e6f98cd2-87a9-4be9-af65-3b73c083a029	7d6bf7e9-6f19-4a97-920a-39d813975d2c-054b082d-3446-4548-9fd2-61276b5a6584	2026-04-25 03:20:28.296	2026-03-26 03:20:28.29743
6ed050c0-4a9a-4496-9af8-e04603373ee1	e6f98cd2-87a9-4be9-af65-3b73c083a029	f767e488-41f5-4b62-b1f1-9f6fba98d6ee-057c78f4-83ee-4600-becd-53f636aee1bf	2026-04-25 23:27:46.65	2026-03-26 23:27:46.652674
2caf9b60-ffb0-40c8-abf0-7363f493ace4	e6f98cd2-87a9-4be9-af65-3b73c083a029	958ce7f0-6a71-462f-9a41-07767795ccb2-da6d2565-e8dd-4516-983b-05b89c1f4c98	2026-04-25 23:27:51.568	2026-03-26 23:27:51.569601
80a66767-cafc-4c85-a9dc-175a05fb5bdd	2348a791-f098-4a64-8b5d-491c341b77a6	c87e316b-a43c-4f66-8126-db1108c9a65d-5af9b695-01c0-42a3-b93d-42b923555bd7	2026-04-25 23:28:00.498	2026-03-26 23:28:00.499296
bad52a0f-bd6b-4d2b-8a5a-f9eb3698f47a	e6f98cd2-87a9-4be9-af65-3b73c083a029	e387f78b-8615-4d9c-a5f4-0741f6a1e1e0-1e4542fa-d3b4-4861-a72b-192c77e00b03	2026-04-25 23:36:05.137	2026-03-26 23:36:05.138192
4c920f46-5cf0-44a6-b84e-93b8a660d4e3	e3afd206-68bd-4a91-9e5b-ae29c7b7a78f	0f17b17a-d088-425d-81cf-61114fbf3c69-cefc87b3-82d3-4334-8066-49a80c50a9da	2026-04-25 23:37:39.474	2026-03-26 23:37:39.474663
1562810c-84eb-4580-85c7-cbb0d24a8e9c	e6f98cd2-87a9-4be9-af65-3b73c083a029	6a00ef37-cff0-4dbc-a44a-75b86f2b4cda-0c75a647-b6ea-4df3-bf76-7a560e983217	2026-04-26 00:11:00.559	2026-03-27 00:11:00.561119
ce73aa46-7dab-4177-9ab8-8db53a5d4bb7	27ce531c-d878-42a5-b428-67133a0dcdd0	de87c2e4-4b13-48e6-855b-631dd7ecd94d-be812ee4-336c-4bd0-9cc0-b2dac32145ea	2026-04-26 00:11:00.96	2026-03-27 00:11:00.960678
\.


--
-- Data for Name: systems; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.systems (id, title, description, category, estimated_minutes, steps, key_principles, scripts, is_premium, created_at, updated_at) FROM stdin;
12100e59-2dac-49f1-84a5-bb3f5375f51f	The High-Impact 1:1 Meeting System	A repeatable structure for running 1:1s that build trust, surface problems early, and drive consistent team performance.	One-on-Ones	8	[{"order": 1, "title": "Open with a personal check-in (5 min)", "description": "Start with something human. 'How are you actually doing?' gives your team member permission to share what's really happening before getting to work."}, {"order": 2, "title": "Their agenda first (15 min)", "description": "Ask: 'What's on your mind this week?' or 'What's most important for us to cover today?' This signals the meeting is for them."}, {"order": 3, "title": "Progress and blockers (10 min)", "description": "Review where they are on key priorities. Ask what's blocking them — and ask specifically, 'What can I do to unblock that?'"}, {"order": 4, "title": "Development and growth (5 min)", "description": "At least twice a month: 'What are you trying to get better at? How can I support that?' This builds loyalty and retention."}, {"order": 5, "title": "Close with a clear next step (5 min)", "description": "End every 1:1 by summarizing what was committed to and by whom. 'So by next week, you're going to X and I'm going to Y.'"}]	["The 1:1 is for your team member — not for your status updates", "Create psychological safety before you create accountability", "Listen more than you speak — your job is to ask, not tell", "Consistency beats intensity — a weekly 30-minute 1:1 beats a monthly 2-hour meeting"]	[{"text": "Before we get into priorities — how are you actually doing this week? Anything outside of work that's affecting your focus?", "tone": "Opening"}, {"text": "On [project] — what's the single thing that's most slowing you down right now? And is there anything I can do in the next 48 hours to change that?", "tone": "Blockers"}, {"text": "I've noticed you've been leading more of the stakeholder calls recently. How do you feel like that's going? What do you think is working and what do you want to get sharper on?", "tone": "Development"}, {"text": "So to recap: you're going to [X] by [date], and I'm going to remove [blocker] by [date]. Does that sound right? Anything else you need from me before we close?", "tone": "Closing"}]	f	2026-03-23 18:49:22.706787	2026-03-23 18:49:22.706787
7ea2b1f3-cdcf-4836-8d81-e22f824296cd	The Feedback Conversation Framework	A practical system for delivering developmental and corrective feedback that lands without creating defensiveness.	Feedback	10	[{"order": 1, "title": "Set the container", "description": "Request a private 1:1. Say: 'I want to share some feedback that I think will help you. Can we find 20 minutes today?'"}, {"order": 2, "title": "Name the specific behavior", "description": "Start with a specific, observable action: 'In [meeting] on [date], I noticed [specific behavior].' Avoid generalizations like 'you always' or 'you never.'"}, {"order": 3, "title": "Describe the impact", "description": "Explain the consequence of the behavior: 'The impact of that was [X] — specifically, it [caused Y / signaled Z to stakeholders / affected the team in this way]."}, {"order": 4, "title": "Invite their perspective", "description": "Ask: 'What was going on for you in that moment?' This shows you care about their experience and may reveal context you didn't have."}, {"order": 5, "title": "Set a clear expectation", "description": "Be explicit about what different looks like: 'Going forward, what I need to see is [specific behavior].' Don't leave this ambiguous."}, {"order": 6, "title": "Agree on follow-up", "description": "Close with a specific check-in: 'Let's revisit this in two weeks in our 1:1 and see how it's going.'"}]	["Feedback delayed is feedback denied — address it within 48 hours", "Separate the behavior from the person — attack the pattern, not the identity", "Be specific about observable behavior, not interpretation or intent", "Follow up — feedback without accountability isn't coaching, it's venting"]	[{"text": "I want to give you some feedback that I think will be useful for your growth. I'm sharing it because I want you to be successful here — not because I'm frustrated. Can I share what I've observed?", "tone": "Opening"}, {"text": "In [the team meeting on Tuesday], I noticed that when [Maria] was speaking, you [interrupted her three times and redirected the conversation back to your point]. That's the specific pattern I want to talk about.", "tone": "Behavior"}, {"text": "The impact of that moment was that [Maria stopped contributing for the rest of the meeting]. I also noticed [two other team members exchange a look]. The perception it creates — even unintentionally — is one of dominance rather than collaboration.", "tone": "Impact"}, {"text": "What I need to see going forward is [you waiting until someone finishes speaking before responding, and occasionally building on their point before adding your own]. That small shift will significantly change how you're perceived.", "tone": "Expectation"}]	f	2026-03-23 18:49:22.706787	2026-03-23 18:49:22.706787
545148a4-745b-46f8-aea8-05a054561f9e	The Delegation Decision System	A simple framework for deciding what to delegate, how to delegate it, and how to maintain visibility without micromanaging.	Delegation	8	[{"order": 1, "title": "Assess the task", "description": "Ask: Can someone on my team do this at 80% of my quality? If yes, delegate. The 20% difference is almost never worth the time you save."}, {"order": 2, "title": "Match the person to the task", "description": "Consider: Who has the capacity? Who needs this for their development? Who would find it meaningful?"}, {"order": 3, "title": "Brief with clarity", "description": "Share the outcome, not the method. 'What I need is [X result] by [date]. How you get there is up to you. Here are the constraints: [Y and Z].'"}, {"order": 4, "title": "Set check-in moments in advance", "description": "Before you walk away: 'Let's check in on [Wednesday] to see where you are. If you hit a blocker before then, come to me immediately.' This avoids both abandonment and micromanagement."}, {"order": 5, "title": "Give credit publicly", "description": "When the work is done, attribute it to your team member in stakeholder communications. This builds trust and drives ownership."}]	["If you're doing work someone on your team can do, you're not managing — you're executing", "Delegation is not abdication — you own the outcome, they own the execution", "Match the task to the team member's development level, not just their current skill set", "Brief clearly, check in strategically, don't check in reactively"]	[{"text": "I think this project would be a great opportunity for you to build your [stakeholder management / analysis / communication] skills. Here's what success looks like: [clear outcome]. I'll check in with you on [date]. What do you need from me to get started?", "tone": "Diplomatic"}, {"text": "I need you to own [project] from kickoff to delivery. The outcome I need is [X] by [date]. Come to me with blockers only, not status updates — I'll check in on [Wednesday]. This is yours to deliver.", "tone": "Firm"}, {"text": "I know you're already busy, and I want to be direct with you: this is a priority I need you to take on. I've cleared some of your backlog to make room for it. What concerns do you have that I should know about before we proceed?", "tone": "Empathetic"}]	f	2026-03-23 18:49:22.706787	2026-03-23 18:49:22.706787
9c5ce159-4a21-442e-881a-a4f2ca762322	The Upward Management Playbook	How to manage your relationship with your manager to build trust, gain autonomy, and navigate organizational politics.	Upward Management	10	[{"order": 1, "title": "Know your manager's priorities", "description": "Ask directly: 'What are the two or three things that would make the biggest difference to you this quarter?' Build everything around those."}, {"order": 2, "title": "Manage the information flow", "description": "Keep your manager appropriately informed. Not everything — but never blindside them. Determine your cadence: weekly summaries, bi-weekly 1:1s, or an agreed update format."}, {"order": 3, "title": "Surface problems early with proposed solutions", "description": "When something goes wrong, bring it to your manager with: 'Here's the situation, here's my proposed response, here's what I need from you.' Never bring a problem without at least one solution."}, {"order": 4, "title": "Ask for feedback proactively", "description": "Don't wait for performance reviews. Ask your manager quarterly: 'On a scale of 1-10, how am I doing? What would move it from a [X] to a [X+2]?'"}, {"order": 5, "title": "Make your manager look good", "description": "Your manager's success is your success. Ask yourself: how can I make my manager's job easier this week? Act on it."}]	["Your manager is your most important stakeholder relationship — treat it that way", "No surprises is the golden rule — bad news early is always better than bad news late", "Understand what your manager is measured on — then make sure your work serves that", "Come with solutions, not just problems — recommendations, not reports"]	[{"text": "I want to make sure I'm focused on the right things. What are the one or two areas where you think I'm having the most impact — and where do you see the biggest opportunity for me to improve?", "tone": "Diplomatic"}, {"text": "I want to flag something that's developing: [situation]. It's not critical yet, but I wanted you to know about it early. My plan is [action]. I don't need anything from you right now, but wanted you informed.", "tone": "Firm"}, {"text": "Quick update on [project]: we're [on track/facing a specific delay]. The one thing I need from you is [specific ask]. I'll have [deliverable] to you by [date].", "tone": "Executive Ready"}]	f	2026-03-23 18:49:22.706787	2026-03-23 18:49:22.706787
03042af3-8cc5-436d-8fa6-939d49a6a353	The Conflict De-escalation Framework	How to de-escalate team conflict and interpersonal tension without taking sides or creating new problems.	Conflict	12	[{"order": 1, "title": "Speak to each person separately first", "description": "Never mediate a conflict cold. Meet with each person privately. Let them vent. Ask: 'What do you need from this situation to feel like it's resolved?' Listen more than you speak."}, {"order": 2, "title": "Identify the root cause", "description": "Is this about a process gap, a role overlap, a communication failure, or a genuine interpersonal problem? Your intervention depends entirely on the diagnosis."}, {"order": 3, "title": "Establish shared stakes", "description": "Before bringing them together, remind both parties what they share — a common goal, a shared outcome, a commitment to the team. Remind them they are on the same side."}, {"order": 4, "title": "Facilitate a structured joint conversation", "description": "Set the norms: 'We're here to solve the problem, not to relitigate the conflict. Each of you will have the floor without interruption. Then we'll agree on a path forward.'"}, {"order": 5, "title": "Agree on a behavioral contract", "description": "End with explicit commitments: 'So [Person A] is going to [X] and [Person B] is going to [Y]. I'll check in with each of you in one week to see how it's going.'"}]	["Conflict is data — it signals something structural or interpersonal that needs addressing", "Your job is not to pick a side — your job is to restore function", "The public conflict is almost never the real conflict — diagnose what's underneath", "Resolution requires both parties to feel heard before they can hear each other"]	[{"text": "I can see this situation is frustrating, and I want you to know I'm taking it seriously. Tell me everything — what happened, how it made you feel, and what you need for this to feel resolved. I'm not here to judge, I'm here to understand.", "tone": "Empathetic"}, {"text": "I need to be direct with both of you: the current dynamic is affecting the team's performance and it has to change. I'm not here to find out who's right — I'm here to get us to a place where we can work effectively together. Both of you have a role to play in that.", "tone": "Firm"}, {"text": "I want to create a space where we can have an honest conversation about what's been happening — without judgment, and with the goal of moving forward. I'd ask that we stay focused on what we need going forward, rather than re-litigating the past.", "tone": "Diplomatically Careful"}]	t	2026-03-23 18:49:22.706787	2026-03-23 18:49:22.706787
f2ebd6c3-285a-418d-b0a2-a92f76a0db78	The Performance Correction System	A structured approach to correcting underperformance before it reaches the formal review process.	Performance Management	12	[{"order": 1, "title": "Diagnose before you prescribe", "description": "Before having the conversation, ask yourself: Is this a skill gap, a motivation gap, or a clarity gap? The intervention is completely different for each."}, {"order": 2, "title": "Have the conversation within 48 hours of the triggering event", "description": "Delayed performance conversations lose specificity and appear less credible. Address it while it's fresh."}, {"order": 3, "title": "Be specific and behavioral", "description": "Name the exact behavior or outcome. Not 'your work quality is declining' — instead 'in the last three deliverables [X, Y, Z], the following errors were present: [A, B, C].'"}, {"order": 4, "title": "Set a clear standard with a timeline", "description": "Say explicitly: 'What I need to see by [date] is [specific, measurable outcome]. This is the bar.' Don't be ambiguous about what success looks like."}, {"order": 5, "title": "Offer support and remove excuses", "description": "Ask: 'What do you need from me to hit this? What's getting in your way?' Then actually remove those blockers — so the only variable left is the team member's choice."}, {"order": 6, "title": "Document the conversation", "description": "After the conversation, send a brief written summary: 'As discussed today, here is what we agreed on...' This creates a paper trail and reinforces the commitment."}]	["The goal of performance correction is change, not punishment", "Document everything — informal correction without documentation creates legal and HR risk", "Clarity is kindness — vague feedback is not feedback, it is avoidance", "Performance correction conversations are difficult but not doing them is more damaging"]	[{"text": "I need to give you some important feedback today. The [deliverable/behavior] we discussed [in context] did not meet the standard I need. Specifically: [example]. This isn't the first time, and I want to be clear that it needs to change.", "tone": "Direct"}, {"text": "I want to have a candid conversation because I believe you can do better than what I've been seeing. I'm not here to criticize — I'm here because I want you to succeed and right now, there's a gap between where you are and where you need to be.", "tone": "Empathetic"}, {"text": "I'm going to be direct with you: the [specific behavior/outcome] is not acceptable and it needs to change, starting now. Here's exactly what success looks like from my perspective over the next 30 days...", "tone": "Firm"}]	t	2026-03-23 18:49:22.706787	2026-03-23 18:49:22.706787
06bb2a88-c69b-4e31-b1bb-28d58a830c3d	The Brand Equity Building System	A proactive, intentional approach to building your professional reputation inside and outside your organization.	Brand Building	10	[{"order": 1, "title": "Define your intended brand", "description": "Write down: How do you want people to describe you professionally when you're not in the room? Be specific — not 'respected and competent' but 'calm under pressure, clear communicator, trusted to execute.'"}, {"order": 2, "title": "Audit your current behaviors", "description": "For one week, note after every meeting and interaction: what signal did I just send? Was it consistent with my intended brand?"}, {"order": 3, "title": "Identify your gap", "description": "Where is your behavior inconsistent with your intended brand? Common gaps: avoiding difficult conversations when you want to be seen as direct; over-explaining when you want to be seen as decisive."}, {"order": 4, "title": "Commit to three brand-building habits", "description": "Choose three specific behaviors that directly reinforce your intended brand. Practice them consistently for 30 days. Track them."}, {"order": 5, "title": "Manage your strategic visibility", "description": "Who in your organization needs to know about your contributions? Create a simple plan: quarterly stakeholder updates, contributions in key meetings, and one external visibility move per quarter."}]	["Your brand is built in the moments when no one is watching — and confirmed when they are", "Consistency is the only currency — your reputation is the average of your behaviors over time", "Other people's perception of you is based on the signals you send, not the intentions you have", "Strategic visibility is not self-promotion — it is making your contribution legible"]	[{"text": "Hi [Name] — wanted to share a quick update on [project/work area]. [Two-sentence summary of accomplishment and impact]. This wouldn't have been possible without [team/colleague credit]. Happy to share more detail if it would be useful.", "tone": "Stakeholder Update"}, {"text": "In [meeting], I wanted to flag something I've been thinking about strategically: [specific insight or recommendation]. I've done some initial thinking on [X] and believe [clear position]. I'd welcome your reaction.", "tone": "Executive Visibility"}]	f	2026-03-23 18:49:22.706787	2026-03-23 18:49:22.706787
f815ce82-02fb-47f3-9860-0070cf1271ec	The Decision Hygiene Framework	A mental model for making better decisions faster, documenting your thinking, and maintaining credibility under uncertainty.	Decision Making	8	[{"order": 1, "title": "Define the actual decision", "description": "Before deciding anything, write down exactly what decision needs to be made. Ambiguous framing leads to ambiguous decisions. 'Should we launch in Q3 or Q4?' is a better frame than 'What should we do about the launch?'"}, {"order": 2, "title": "Name your options", "description": "List at least three options, including 'do nothing' and the option you initially dismissed. Expanding the option set forces better thinking."}, {"order": 3, "title": "Identify the key trade-off", "description": "Most decisions come down to one core trade-off. Name it explicitly: 'The core trade-off here is speed vs. quality.' This sharpens the decision."}, {"order": 4, "title": "Decide and document", "description": "Write a one-paragraph decision memo: What we decided, why, what we're trading off, and who was consulted. This serves as a reference if the decision is questioned later."}, {"order": 5, "title": "Define a review trigger", "description": "For significant decisions: 'We will revisit this decision if [specific condition] changes.' This prevents decision paralysis and builds in intellectual humility."}]	["Good decisions are not defined by good outcomes — they are defined by good process", "Document your reasoning, not just your conclusion — you need to be able to defend how you decided", "Disagree and commit — once a decision is made, execute as if it were your own", "Speed of decision matters — a good decision made now beats a perfect decision made too late"]	[{"text": "We made a decision on [X]. The choice was [A vs. B]. We went with [A] because [specific reason]. The trade-off we accepted is [trade-off]. If [condition] changes, we would revisit. [Name] was consulted. The decision owner is [me/name].", "tone": "Executive Ready"}, {"text": "I want to walk the team through how we got to this decision so everyone understands the thinking, not just the outcome. [Walk through the options, the trade-off, and the rationale.] I'm open to feedback on the process, though the decision has been made.", "tone": "Diplomatic"}]	f	2026-03-23 18:49:22.706787	2026-03-23 18:49:22.706787
f9713c99-92e4-4424-9fc1-047690df1380	The Team Trust Architecture	How to build psychological safety and high-trust team dynamics that drive retention, performance, and loyalty.	Team Culture	10	[{"order": 1, "title": "Model the vulnerability you want to see", "description": "Share a mistake you made, acknowledge uncertainty, or ask for feedback in a team setting. This gives your team permission to do the same."}, {"order": 2, "title": "React to bad news correctly", "description": "When someone brings you a problem, your first response is the test. Respond with curiosity, not blame. 'Tell me more about what happened' builds more trust than any speech you can give."}, {"order": 3, "title": "Reward candor, not agreement", "description": "When someone disagrees with you in a meeting, thank them for it. Explicitly. 'That's a good challenge — tell me more about your concern.' This teaches the team that disagreement is safe."}, {"order": 4, "title": "Be consistent, predictable, and fair", "description": "Your team is always watching how you treat people. Inconsistent treatment — even when the reasons are valid — destroys trust faster than almost anything else."}, {"order": 5, "title": "Follow through on every commitment", "description": "Every time you say you will do something and don't, trust erodes. Build systems to ensure you keep your commitments to your team."}]	["Trust is built in small moments, not grand gestures", "Psychological safety is not permissiveness — it is the belief that speaking up is safe", "Your reactions to mistakes and bad news set the tone for how much truth you will hear", "Fairness is perceived, not just practiced — perception management is part of the job"]	[{"text": "I want to be transparent with the team about something: I made a judgment call on [X] that I would do differently in hindsight. Here's what I learned from it. I'm sharing this because I want us to be a team where it's safe to be honest about mistakes — including mine.", "tone": "Vulnerability Model"}, {"text": "I appreciate you pushing back on that. It's exactly the kind of thinking I want from this team. Tell me more — what specifically concerns you about this approach?", "tone": "Rewarding Candor"}]	t	2026-03-23 18:49:22.706787	2026-03-23 18:49:22.706787
683a4919-498b-4cfe-a3b0-de6a7780eb75	The Executive Communication Template	A proven structure for communicating with senior leadership in a way that signals strategic thinking and command presence.	Executive Communication	8	[{"order": 1, "title": "Lead with the bottom line (BLUF)", "description": "Start with your conclusion or recommendation. 'My recommendation is [X]. Here's why.' Never make an executive reverse-engineer your thinking to find the point."}, {"order": 2, "title": "Provide the briefest necessary context", "description": "Assume your audience is intelligent but not current on the details. Two or three sentences of relevant context is usually all that's needed."}, {"order": 3, "title": "State the trade-offs", "description": "Show that you've considered the other options and understand the cost of your recommendation. 'The alternative was [Y], but we rejected it because [Z].'"}, {"order": 4, "title": "Make a specific ask", "description": "End with clarity: 'I need your approval on [X]' or 'I'm sharing this as an FYI — no action needed.' Never end without being explicit about what you need from the recipient."}]	["Lead with the conclusion — executives don't have time to wait for your buildup", "Every communication should answer: 'So what does this mean for us?' before it is asked", "Brevity signals confidence — if you can't say it in 3 sentences, you don't know it well enough", "Distinguish between 'FYI' communications and 'I need your input' communications — never blur these"]	[{"text": "Subject: Decision Needed — [Topic]\\n\\nBottom line: I recommend [specific recommendation].\\n\\nContext: [2-3 sentence background]\\n\\nRationale: [2-3 key reasons]\\n\\nAlternative considered: [Option Y] — rejected because [reason]\\n\\nI need your sign-off by [date]. Let me know if you want to discuss.", "tone": "Executive Email"}, {"text": "I have a quick update on [topic] — I'll keep this to two minutes. The short answer is [conclusion]. The key reason is [1-2 points]. The one thing I need from you is [specific ask]. Any questions?", "tone": "Verbal Briefing"}]	f	2026-03-23 18:49:22.706787	2026-03-23 18:49:22.706787
\.


--
-- Data for Name: user_scenario_completions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_scenario_completions (id, user_id, scenario_id, selected_option_id, score, completed_at) FROM stdin;
\.


--
-- Data for Name: user_stats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_stats (id, user_id, streak_days, last_checkin_date, total_coach_sessions, created_at, updated_at) FROM stdin;
c186da84-10b3-466a-9d29-456550ce3a94	92595a5c-5592-4417-b2a4-43e6387d8b5a	0	\N	0	2026-03-23 23:12:40.561006	2026-03-23 23:12:40.561006
0f308c20-86cb-4579-9715-ba87159139a4	5bd5dff1-79c8-46d8-85f8-a1b115c4429a	0	\N	0	2026-03-23 23:19:13.341831	2026-03-23 23:19:13.341831
f834e7f7-3198-4466-9152-970a0db575c1	07554a54-eaa8-45c7-823a-1905cdc36b78	0	\N	0	2026-03-26 03:19:47.686143	2026-03-26 03:19:47.686143
8c152fd0-9a66-4b35-a0e2-afd5e1b37efa	2348a791-f098-4a64-8b5d-491c341b77a6	0	\N	0	2026-03-26 23:28:00.491931	2026-03-26 23:28:00.491931
02a37b0c-c320-47fb-9e43-ec40ea29f436	e6f98cd2-87a9-4be9-af65-3b73c083a029	0	\N	1	2026-03-23 18:49:22.685257	2026-03-26 23:36:11.501
7c69ec3e-9a13-488d-9860-7a5c756949f0	e3afd206-68bd-4a91-9e5b-ae29c7b7a78f	0	\N	3	2026-03-26 23:37:39.471755	2026-03-26 23:37:57.057
076e5503-4abe-4bf4-bf7c-b3cea2653d38	27ce531c-d878-42a5-b428-67133a0dcdd0	0	\N	0	2026-03-27 00:11:00.951586	2026-03-27 00:11:00.951586
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password_hash, name, role, tier, onboarding_completed, created_at, updated_at) FROM stdin;
e6f98cd2-87a9-4be9-af65-3b73c083a029	admin@standoutmanager.com	$2b$10$8rLNTMkdlc4nhInxyirjze0kXErSLLq117ynRLnKPdAkDNA/iloLC	Admin	admin	premium	t	2026-03-23 18:49:22.649893	2026-03-23 18:49:22.649893
5bd5dff1-79c8-46d8-85f8-a1b115c4429a	kwame@provisionenergy.ca	$2b$10$dGLjMMsW2x2lYWiHkPw.1upzp35saA1eq8r0BCcrwD8kPisUjNQHS	Kwame	user	free	f	2026-03-23 23:19:13.338459	2026-03-23 23:19:13.338459
92595a5c-5592-4417-b2a4-43e6387d8b5a	kwameobour86@gmail.com	$2b$10$gSl1ebVjbqMWNa.8ZxUT1uMoZc3Pw52at/e/BPTrcZ32QfdtF2Ouy	Kwame Obour-Agyeman	user	free	t	2026-03-23 23:12:40.528615	2026-03-23 23:22:48.736
07554a54-eaa8-45c7-823a-1905cdc36b78	test_onboard_9@test.com	$2b$10$oAHsUYtAIjg8NZQ7ItfyDe7bbT/T7EYq0Wevuqx2i0geM6gTbb7ku	Test Onboard	user	free	f	2026-03-26 03:19:47.484335	2026-03-26 03:19:47.484335
2348a791-f098-4a64-8b5d-491c341b77a6	testupgrade@test.com	$2b$10$kIUq3FdNcB5rPXxXT.yqYeZUGKQ8XaLWNTrGLHoqfN8eMVIj1uRCW	Test User	user	premium	f	2026-03-26 23:28:00.48783	2026-03-26 23:28:00.674
e3afd206-68bd-4a91-9e5b-ae29c7b7a78f	freetiertest2@test.com	$2b$10$AeezyghQgOK9/9YP48ZqNeE0/dFIGONvGrPSnWanNi7ozT8xLRnpC	Free Tester	user	free	f	2026-03-26 23:37:39.441193	2026-03-26 23:37:39.441193
27ce531c-d878-42a5-b428-67133a0dcdd0	freetestlock@test.com	$2b$10$.93g.pZ2cJ3NeDOZL9K9bO67uNbKQxDJ23isxqAZPd8wjMFrxq5iG	Free Lock Test	user	free	f	2026-03-27 00:11:00.940234	2026-03-27 00:11:00.940234
\.


--
-- Name: assessment_results assessment_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_results
    ADD CONSTRAINT assessment_results_pkey PRIMARY KEY (id);


--
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- Name: brand_profiles brand_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_profiles
    ADD CONSTRAINT brand_profiles_pkey PRIMARY KEY (id);


--
-- Name: brand_profiles brand_profiles_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_profiles
    ADD CONSTRAINT brand_profiles_user_id_unique UNIQUE (user_id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: journey_actions journey_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_actions
    ADD CONSTRAINT journey_actions_pkey PRIMARY KEY (id);


--
-- Name: journey_milestones journey_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_milestones
    ADD CONSTRAINT journey_milestones_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: onboarding_profiles onboarding_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.onboarding_profiles
    ADD CONSTRAINT onboarding_profiles_pkey PRIMARY KEY (id);


--
-- Name: reflection_responses reflection_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reflection_responses
    ADD CONSTRAINT reflection_responses_pkey PRIMARY KEY (id);


--
-- Name: scenarios scenarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scenarios
    ADD CONSTRAINT scenarios_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_token_unique UNIQUE (token);


--
-- Name: systems systems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.systems
    ADD CONSTRAINT systems_pkey PRIMARY KEY (id);


--
-- Name: user_scenario_completions user_scenario_completions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_scenario_completions
    ADD CONSTRAINT user_scenario_completions_pkey PRIMARY KEY (id);


--
-- Name: user_stats user_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_pkey PRIMARY KEY (id);


--
-- Name: user_stats user_stats_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_user_id_unique UNIQUE (user_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: assessment_results assessment_results_assessment_id_assessments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_results
    ADD CONSTRAINT assessment_results_assessment_id_assessments_id_fk FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON DELETE CASCADE;


--
-- Name: assessment_results assessment_results_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_results
    ADD CONSTRAINT assessment_results_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: brand_profiles brand_profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_profiles
    ADD CONSTRAINT brand_profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: conversations conversations_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: journey_actions journey_actions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_actions
    ADD CONSTRAINT journey_actions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: journey_milestones journey_milestones_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_milestones
    ADD CONSTRAINT journey_milestones_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_conversation_id_conversations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_conversations_id_fk FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: onboarding_profiles onboarding_profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.onboarding_profiles
    ADD CONSTRAINT onboarding_profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reflection_responses reflection_responses_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reflection_responses
    ADD CONSTRAINT reflection_responses_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_scenario_completions user_scenario_completions_scenario_id_scenarios_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_scenario_completions
    ADD CONSTRAINT user_scenario_completions_scenario_id_scenarios_id_fk FOREIGN KEY (scenario_id) REFERENCES public.scenarios(id) ON DELETE CASCADE;


--
-- Name: user_scenario_completions user_scenario_completions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_scenario_completions
    ADD CONSTRAINT user_scenario_completions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_stats user_stats_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict SjbocUUQcKcnXJ1aB4beH0bwG3y96x4vMYmsTDDRmdOQQ45wO0e3HcmduKiPW6R

