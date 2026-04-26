import Hero from "./Home/Hero";
import Categories from "./Home/Categories";
import ChallengeList from "./Home/ChallengesList";
import ScoreboardPreview from "./Home/ScoreboardPreview";
import ActivityFeed from "./Home/ActivityFeed";
import CTA from "./Home/CTA";
import Features from "./Home/Features";
import Stats from "./Home/Stats";
import RuleBox from "../widgets/RuleBox.jsx";
import RulesHeader from "../widgets/RulesHeader";

export const componentMap = {
    hero: Hero,
    stats: Stats,
    categories: Categories,
    challenge_list: ChallengeList,
    scoreboard_preview: ScoreboardPreview,
    activity_feed: ActivityFeed,
    cta: CTA,
    features: Features,
    rules_header: RulesHeader,
    rule_box: RuleBox
};