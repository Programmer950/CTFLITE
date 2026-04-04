--
-- PostgreSQL database dump
--

\restrict 7EPZq8vBRKSghR7FVKkMuxoyFfxuQA1MPg7asuDNv1jMX5Osc3C0JXLB4WK7ARY

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1



--
-- Name: challenges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.challenges (
    id integer NOT NULL,
    event_id integer,
    title text NOT NULL,
    description text,
    points integer NOT NULL,
    flag_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_dynamic boolean DEFAULT false,
    category text,
    difficulty text,
    CONSTRAINT difficulty_check CHECK ((difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text])))
);


ALTER TABLE public.challenges OWNER TO postgres;

--
-- Name: challenges_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.challenges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.challenges_id_seq OWNER TO postgres;

--
-- Name: challenges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.challenges_id_seq OWNED BY public.challenges.id;


--
-- Name: config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.config (
    key text NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.config OWNER TO postgres;

INSERT INTO config (key, value) VALUES ('max_users', '100');
INSERT INTO config (key, value) VALUES ('team_size_limit', '5');
INSERT INTO config (key, value) VALUES ('mode', 'team');

--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    name text NOT NULL,
    mode text,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    CONSTRAINT events_mode_check CHECK ((mode = ANY (ARRAY['individual'::text, 'team'::text])))
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participants (
    id integer NOT NULL,
    type text NOT NULL,
    user_id integer,
    team_id integer,
    CONSTRAINT participants_type_check CHECK ((type = ANY (ARRAY['user'::text, 'team'::text])))
);


ALTER TABLE public.participants OWNER TO postgres;

--
-- Name: participants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.participants_id_seq OWNER TO postgres;

--
-- Name: participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.participants_id_seq OWNED BY public.participants.id;


--
-- Name: submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.submissions (
    id integer NOT NULL,
    participant_id integer,
    challenge_id integer,
    is_correct boolean NOT NULL,
    submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.submissions OWNER TO postgres;

--
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.submissions_id_seq OWNER TO postgres;

--
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.submissions_id_seq OWNED BY public.submissions.id;


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_members (
    user_id integer NOT NULL,
    team_id integer NOT NULL,
    role text DEFAULT 'member'::text
);


ALTER TABLE public.team_members OWNER TO postgres;

--
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teams_id_seq OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_admin boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: challenges id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges ALTER COLUMN id SET DEFAULT nextval('public.challenges_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: participants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants ALTER COLUMN id SET DEFAULT nextval('public.participants_id_seq'::regclass);


--
-- Name: submissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions ALTER COLUMN id SET DEFAULT nextval('public.submissions_id_seq'::regclass);


--
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);


--
-- Name: config config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.config
    ADD CONSTRAINT config_pkey PRIMARY KEY (key);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: participants participants_team_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_team_id_key UNIQUE (team_id);


--
-- Name: participants participants_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_user_id_key UNIQUE (user_id);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (user_id, team_id);


--
-- Name: teams teams_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_name_key UNIQUE (name);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: team_members unique_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT unique_user UNIQUE (user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_submissions_challenge; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_submissions_challenge ON public.submissions USING btree (challenge_id);


--
-- Name: idx_submissions_participant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_submissions_participant ON public.submissions USING btree (participant_id);


--
-- Name: unique_correct_submission; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_correct_submission ON public.submissions USING btree (participant_id, challenge_id) WHERE (is_correct = true);


--
-- Name: challenges challenges_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_participant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: team_members team_members_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: team_members team_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 7EPZq8vBRKSghR7FVKkMuxoyFfxuQA1MPg7asuDNv1jMX5Osc3C0JXLB4WK7ARY

