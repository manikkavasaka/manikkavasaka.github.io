import os
import json
import re
from openai import OpenAI
from dotenv import load_dotenv
from typing import Dict, List, Optional

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

class AIEngine:
    """
    Advanced AI Engine for:
    - Intent detection
    - Buying stage prediction
    - Lead scoring
    - Personalization generation
    - Retargeting strategies
    """

    # Intent templates
    INTENT_TEMPLATES = {
        "SEO": {
            "keywords": ["seo", "ranking", "google", "organic", "search", "keywords"],
            "headlines": [
                "Dominate Google Search Rankings",
                "Own Your Market with Organic Growth",
                "Rank #1 for Your Main Keywords"
            ],
            "ctas": ["Get Free SEO Audit", "Start Ranking", "See Our SEO Results"],
            "offers": ["Free Audit", "Free Strategy Call", "Free Competitor Analysis"]
        },
        "Paid Ads": {
            "keywords": ["ads", "ppc", "paid", "google ads", "facebook ads", "roi"],
            "headlines": [
                "Scale Your ROI with Precision PPC",
                "Turn Ad Spend into Revenue",
                "Stop Wasting Money on Ads"
            ],
            "ctas": ["Start Rapid Scaling", "Get Ad Audit", "Optimize My Spend"],
            "offers": ["Free Ad Audit", "ROAS Optimization", "Budget Strategy"]
        },
        "Web Design": {
            "keywords": ["website", "design", "web", "redesign", "landing page", "mobile"],
            "headlines": [
                "Convert Visitors into Loyal Customers",
                "High-Performance Web Design",
                "Your Website Should Be Your Best Salesman"
            ],
            "ctas": ["View Portfolio", "Get Design Audit", "Start Project"],
            "offers": ["Free Design Audit", "Portfolio Review", "Mobile Optimization"]
        },
        "Social Media": {
            "keywords": ["social", "instagram", "facebook", "tiktok", "linkedin", "engagement"],
            "headlines": [
                "Build a Community that Converts",
                "Social Media That Actually Sells",
                "Turn Followers into Customers"
            ],
            "ctas": ["Start Social Growth", "See Social Results", "Get Strategy"],
            "offers": ["Free Social Audit", "Content Strategy", "Growth Plan"]
        },
        "App Development": {
            "keywords": ["app", "android", "ios", "mobile app", "development", "apk"],
            "headlines": [
                "Build Apps Users Love",
                "Transform Your Idea into Reality",
                "Custom App Development"
            ],
            "ctas": ["Start App Project", "Get Demo", "Schedule Consultation"],
            "offers": ["Free Consultation", "Tech Assessment", "Development Plan"]
        }
    }

    @staticmethod
    async def analyze_intent(events: list, duration: int, scroll_depth: float) -> Dict:
        """
        Analyzes user behavior to determine intent, buying stage, and lead score.

        Scoring Logic:
        - Intent: Detected from page visits, clicks, keywords
        - Stage: Based on duration, scroll, engagement
        - Score: Combined with AI for final lead quality
        """

        # Fallback if no API
        if not os.getenv("OPENAI_API_KEY"):
            return AIEngine._fallback_analysis(events, duration, scroll_depth)

        # Extract signals
        event_summary = [f"{e['type']} on {e['path']}" for e in events[-20:]]
        pages_visited = list(set([e['path'] for e in events]))

        # Determine stage based on engagement
        stage = AIEngine._determine_stage(duration, scroll_depth, len(events))

        # Detect intent from patterns
        intent = AIEngine._detect_intent(event_summary, pages_visited)

        # Calculate lead score
        score = AIEngine._calculate_lead_score(
            duration, scroll_depth, len(events), stage, intent
        )

        prompt = f"""
        Analyze Digital Marketing Agency visitor behavior:

        Duration: {duration}s
        Scroll: {scroll_depth}%
        Pages: {", ".join(pages_visited)}
        Events: {", ".join(event_summary[:10])}
        Detected Intent: {intent}
        Detected Stage: {stage}

        Provide JSON with:
        1. Confirmed intent (SEO, Paid Ads, Web Design, Social Media, App Dev, General)
        2. Buying stage (Awareness, Consideration, Decision)
        3. Lead score (0-100)
        4. Best offer (Free Audit, Consultation, etc.)
        5. Recommended message

        Format:
        {{
            "intent": "...",
            "stage": "...",
            "score": 0,
            "offer": "...",
            "message": "..."
        }}
        """

        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an elite marketing AI analyst."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"AI Analysis Error: {e}")
            return AIEngine._fallback_analysis(events, duration, scroll_depth)

    @staticmethod
    def _fallback_analysis(events: list, duration: int, scroll_depth: float) -> Dict:
        """Fallback analysis without OpenAI"""
        stage = AIEngine._determine_stage(duration, scroll_depth, len(events))
        intent = AIEngine._detect_intent(
            [e['path'] for e in events[-10:]],
            list(set([e['path'] for e in events]))
        )
        score = AIEngine._calculate_lead_score(duration, scroll_depth, len(events), stage, intent)

        return {
            "intent": intent,
            "stage": stage,
            "score": score,
            "offer": "Free Consultation",
            "message": f"Interested in {intent}? Let's talk!"
        }

    @staticmethod
    def _determine_stage(duration: int, scroll_depth: float, event_count: int) -> str:
        """Determine buying stage from engagement metrics"""

        # Decision stage: 5+ min, 75%+ scroll, 10+ events
        if duration >= 300 and scroll_depth >= 75 and event_count >= 10:
            return "Decision"

        # Consideration: 2+ min, 50%+ scroll, 5+ events
        elif duration >= 120 and scroll_depth >= 50 and event_count >= 5:
            return "Consideration"

        # Awareness: Just exploring
        else:
            return "Awareness"

    @staticmethod
    def _detect_intent(events: List[str], pages: List[str]) -> str:
        """Detect user intent from page visits and events"""

        # Create searchable string
        search_text = " ".join(events + pages).lower()

        # Match against templates
        scores = {}
        for intent, config in AIEngine.INTENT_TEMPLATES.items():
            match_count = sum(search_text.count(kw) for kw in config["keywords"])
            scores[intent] = match_count

        # Return highest scoring intent
        best_intent = max(scores.items(), key=lambda x: x[1])[0] if scores else "General"
        return best_intent if max(scores.values()) > 0 else "General"

    @staticmethod
    def _calculate_lead_score(
        duration: int, scroll_depth: float, event_count: int, stage: str, intent: str
    ) -> int:
        """Calculate lead quality score (0-100)"""

        score = 0

        # Duration scoring
        if duration >= 300:
            score += 25
        elif duration >= 120:
            score += 15
        elif duration >= 60:
            score += 10

        # Scroll depth scoring
        if scroll_depth >= 75:
            score += 25
        elif scroll_depth >= 50:
            score += 15
        elif scroll_depth >= 25:
            score += 10

        # Event count scoring
        if event_count >= 10:
            score += 20
        elif event_count >= 5:
            score += 10
        elif event_count >= 2:
            score += 5

        # Stage scoring
        stage_scores = {"Decision": 20, "Consideration": 10, "Awareness": 0}
        score += stage_scores.get(stage, 0)

        # Intent specificity bonus
        if intent != "General":
            score += 10

        return min(score, 100)

    @staticmethod
    def should_trigger_lead_capture(
        duration: int, scroll_depth: float, event_count: int, stage: str
    ) -> bool:
        """Determine if lead capture popup should be shown"""

        # Show for decision or high-engagement consideration
        if stage == "Decision":
            return True

        # Or for high engagement
        if duration >= 120 and scroll_depth >= 60 and event_count >= 5:
            return True

        return False

    @staticmethod
    def get_personalization_payload(analysis: Dict) -> Dict:
        """Generate personalized content based on analysis"""

        intent = analysis.get("intent", "General")
        config = AIEngine.INTENT_TEMPLATES.get(intent, {})

        return {
            "headline": config.get("headlines", ["Scale Your Digital Presence"])[0],
            "subheading": f"Optimized for {intent}",
            "cta": config.get("ctas", ["Get Started"])[0],
            "offer": config.get("offers", ["Free Consultation"])[0],
            "intent": intent
        }

    @staticmethod
    def generate_headline(analysis: Dict) -> str:
        """Generate personalized headline"""
        intent = analysis.get("intent", "General")
        config = AIEngine.INTENT_TEMPLATES.get(intent, {})
        return config.get("headlines", ["Scale Your Digital Presence"])[0]

    @staticmethod
    def generate_subheading(analysis: Dict) -> str:
        """Generate personalized subheading"""
        stage = analysis.get("stage", "Awareness")
        intent = analysis.get("intent", "General")

        if stage == "Decision":
            return f"You're ready. Let's execute your {intent} strategy."
        elif stage == "Consideration":
            return f"Comparing options for {intent}? Here's what makes us different."
        else:
            return f"Explore how we can optimize your {intent}."

    @staticmethod
    def generate_cta(analysis: Dict) -> str:
        """Generate personalized CTA"""
        intent = analysis.get("intent", "General")
        config = AIEngine.INTENT_TEMPLATES.get(intent, {})
        stage = analysis.get("stage", "Awareness")

        ctas = config.get("ctas", ["Get Started"])

        if stage == "Decision":
            return ctas[0]  # Most direct CTA
        elif stage == "Consideration":
            return "Get Free Audit"
        else:
            return "Learn More"

    @staticmethod
    def rank_services(analysis: Dict) -> List[str]:
        """Rank recommended services by relevance"""
        intent = analysis.get("intent", "General")

        # Primary service
        services = [intent] if intent != "General" else ["SEO", "Paid Ads", "Web Design"]

        # Add complementary services
        if intent == "SEO":
            services.extend(["Paid Ads", "Web Design"])
        elif intent == "Paid Ads":
            services.extend(["Web Design", "Landing Pages"])
        elif intent == "Web Design":
            services.extend(["SEO", "Paid Ads"])

        return services[:3]

    @staticmethod
    def generate_retargeting_ads(leads: List[Dict]) -> Dict:
        """Generate retargeting ad copy for Facebook/Google"""

        intents = {}
        for lead in leads:
            intent = lead.get("intent", "General")
            intents[intent] = intents.get(intent, 0) + 1

        ads = {}
        for intent, count in intents.items():
            config = AIEngine.INTENT_TEMPLATES.get(intent, {})
            ads[intent] = {
                "headline": config.get("headlines", ["Scale Your Presence"])[0],
                "cta": config.get("ctas", ["Get Started"])[0],
                "audience_size": count,
                "suggested_bid": "high"  # For high-intent audiences
            }

        return ads
