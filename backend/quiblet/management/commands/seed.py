import uuid
import random
from typing import Any

from django.core.management.base import BaseCommand

from quiblet.models import Quiblet, Quib, Comment, CommentVote, QuibVote


# ──────────────────────────────────────────────
# Hardcoded user pool – these must already exist
# in the auth service; the seed only references
# their UUIDs.
# ──────────────────────────────────────────────
USERS = {
    "liamtech": uuid.UUID("e9c8d605-b61e-48cb-afd5-60b141b71ec6"),
    "noahbuilds": uuid.UUID("1a927bd4-f986-49d4-a036-9f6f690c5070"),
    "mayacodes": uuid.UUID("20c8006f-af50-4551-a1e7-9db8f10121e2"),
    "sofiascripts": uuid.UUID("bb74af32-2bbe-421e-8cfe-4f94e8f124a5"),
    "alexdev": uuid.UUID("e9c8d605-b61e-48cb-afd5-60b141b71ec6"),
}

USER_IDS = list(USERS.values())


class Command(BaseCommand):
    help = "Seeds the database with realistic quiblets, quibs, and comments."

    # ──────────────────────────────────────────
    # Quiblets
    # ──────────────────────────────────────────
    QUIBLETS_DATA = [
        {
            "name": "programming",
            "description": "Everything about code, frameworks, and architecture.",
            "title": "Programming & CS",
        },
        {
            "name": "gaming",
            "description": "Discuss your favorite games, consoles, and indie gems.",
            "title": "The Gaming Hub",
        },
        {
            "name": "philosophy",
            "description": "Deep thoughts, ethics, and existential questions.",
            "title": "Philosophy Corner",
        },
    ]

    # ──────────────────────────────────────────
    # Quibs (posts)
    # Each entry has a quiblet index, the poster
    # username, HTML content, and per-post
    # comments with realistic replies.
    # ──────────────────────────────────────────
    QUIBS_DATA: list[dict[str, Any]] = [
        # ── Programming ──────────────────────
        {
            "quiblet_idx": 0,
            "poster": "liamtech",
            "title": "Why Rust is the future of systems programming",
            "content": (
                "<h2>The Case for Rust</h2>"
                "<p>Rust has been the <b>most loved</b> language on the Stack Overflow survey for years, and for good reason. "
                "It solves the age-old problem of <b>memory safety</b> without the overhead of a garbage collector.</p>"
                "<h2>Key Benefits</h2>"
                "<ul>"
                "<li><b>Fearless Concurrency</b> — no more data races.</li>"
                "<li><b>Zero-cost Abstractions</b> — high-level feel, low-level performance.</li>"
                "<li><b>Cargo</b> — miles ahead of many other package managers.</li>"
                "</ul>"
                "<p>Is it time to start rewriting our C++ legacy codebases? Let's discuss.</p>"
            ),
            "comments": [
                {
                    "commenter": "noahbuilds",
                    "content": "I've been migrating a networking daemon from C to Rust over the past month and the borrow checker alone has caught at least four bugs that our old test suite missed. The learning curve is real but absolutely worth it.",
                    "reply": {
                        "commenter": "liamtech",
                        "content": "That's awesome to hear. Did you use any FFI to bridge the old C code during the migration, or did you go for a full rewrite?",
                    },
                },
                {
                    "commenter": "mayacodes",
                    "content": "Honest question — for a small REST API does Rust really make sense over something like Go? The compile times alone feel like a productivity hit for rapid iteration.",
                },
                {
                    "commenter": "sofiascripts",
                    "content": "The ecosystem is getting better every month. Between axum, tokio, and serde the web story is almost there. Still wish the async trait story was smoother though.",
                },
            ],
        },
        {
            "quiblet_idx": 0,
            "poster": "mayacodes",
            "title": "Must-have VS Code extensions for 2026",
            "content": (
                "<p>If you aren't using these extensions, are you even coding?</p>"
                "<ol>"
                "<li><b>Error Lens</b> — highlights errors inline so you don't have to hover.</li>"
                "<li><b>Peacock</b> — color-code your workspace to differentiate between windows.</li>"
                "<li><b>GitLens</b> — supercharge your Git workflow.</li>"
                "<li><b>Prettier / ESLint</b> — standardize your formatting.</li>"
                "</ol>"
                "<p><i>Pro tip: Use a custom font like Fira Code for those sweet ligatures!</i></p>"
            ),
            "comments": [
                {
                    "commenter": "noahbuilds",
                    "content": "Error Lens is a game-changer. I used to waste so much time hovering over red squigglies. One extension I'd add is **Thunder Client** — it's basically Postman inside VS Code.",
                    "reply": {
                        "commenter": "mayacodes",
                        "content": "Oh I tried Thunder Client last week! It's surprisingly polished. I might drop Postman entirely.",
                    },
                },
                {
                    "commenter": "sofiascripts",
                    "content": "Peacock is underrated. When you have three VS Code windows open for a monorepo it saves your sanity.",
                },
                {
                    "commenter": "liamtech",
                    "content": "No love for Vim keybindings? Once you go modal you never go back.",
                },
            ],
        },
        {
            "quiblet_idx": 0,
            "poster": "noahbuilds",
            "title": "Async/Await: It's not as scary as it looks",
            "content": (
                "<p>Async programming is often seen as a dark art, but once you understand the <b>Event Loop</b>, everything clicks.</p>"
                '<p><i>"The event loop is like a waiter. It takes your order, tells the kitchen, and moves to the next table instead of waiting by the stove."</i></p>'
                "<p>The key insight is that <b>await</b> doesn't block the thread — it yields control back to the loop so other tasks can run in the meantime.</p>"
                "<p>Once that mental model clicks, writing concurrent I/O-bound code becomes almost intuitive.</p>"
            ),
            "comments": [
                {
                    "commenter": "liamtech",
                    "content": "The waiter analogy is the best one I've seen. I usually explain it with a kitchen metaphor too but yours is cleaner.",
                    "reply": {
                        "commenter": "noahbuilds",
                        "content": "Thanks! I stole it from a PyCon talk years ago and it's stuck with me ever since.",
                    },
                },
                {
                    "commenter": "mayacodes",
                    "content": "I still trip up on the difference between concurrency and parallelism. Async gives you concurrency on a single thread, right? You need multiprocessing for true parallelism?",
                },
                {
                    "commenter": "sofiascripts",
                    "content": "For anyone reading this, be careful with async in Django — most of the ORM is still sync under the hood. You need `sync_to_async` or channels for real async views.",
                },
            ],
        },
        {
            "quiblet_idx": 0,
            "poster": "sofiascripts",
            "title": "The rise of HTMX: Are SPAs dying?",
            "content": (
                "<p>HTMX is taking the world by storm. It allows you to access AJAX, CSS transitions, WebSockets and Server-Sent Events directly in HTML using attributes.</p>"
                "<h2>Why it matters</h2>"
                "<ul>"
                "<li><b>Less JavaScript</b> — you don't always need 2 MB of React to toggle a dropdown.</li>"
                "<li><b>Locality of Behavior</b> — keep your logic where your HTML is.</li>"
                "</ul>"
                "<p>Is the industry swinging back to server-side rendering? I think so, and HTMX is leading the charge.</p>"
            ),
            "comments": [
                {
                    "commenter": "liamtech",
                    "content": "I used HTMX on a side project last month and it was refreshing. But for anything with complex client-side state — drag-and-drop, real-time collab — I'd still reach for React or Svelte.",
                    "reply": {
                        "commenter": "sofiascripts",
                        "content": "Totally fair. HTMX shines on content-heavy CRUD apps. For rich interactivity you still need a proper framework.",
                    },
                },
                {
                    "commenter": "noahbuilds",
                    "content": "SPAs aren't dying, they're just being used where they actually make sense. The industry over-applied them and now there's a correction.",
                },
                {
                    "commenter": "mayacodes",
                    "content": "The biggest win for me is that HTMX works beautifully with Django templates. No separate API layer, no serializers for simple pages. Just render HTML on the server and swap it in.",
                },
            ],
        },
        # ── Gaming ───────────────────────────
        {
            "quiblet_idx": 1,
            "poster": "noahbuilds",
            "title": "Elden Ring: Shadow of the Erdtree impressions",
            "content": (
                "<h2>Return to the Lands Between</h2>"
                "<p>I've spent 20 hours in the DLC and I'm still blown away. FromSoftware has done it again. "
                "The verticality of the map is <b>insane</b>.</p>"
                "<h2>The Good</h2>"
                "<ul>"
                "<li>New weapon types are incredible <i>(Backhand Blades!)</i></li>"
                "<li>The atmosphere is peak FromSoft.</li>"
                "<li>Bosses are challenging but fair <s>(mostly)</s>.</li>"
                "</ul>"
                "<h2>The Bad</h2>"
                "<ul>"
                "<li>Performance on some consoles is still a bit jittery.</li>"
                "</ul>"
                "<p><i>Has anyone found the secret path to the Abyssal Woods?</i></p>"
            ),
            "comments": [
                {
                    "commenter": "liamtech",
                    "content": "The Abyssal Woods entrance is through the coffin ride after the Putrescent Knight fight in the Stone Coffin Fissure. Easy to miss if you don't explore that area thoroughly.",
                    "reply": {
                        "commenter": "noahbuilds",
                        "content": "Wait WHAT. I ran past that coffin like three times. Heading back in tonight, thanks!",
                    },
                },
                {
                    "commenter": "sofiascripts",
                    "content": "25 hours in and I'm still in the first major area. I keep getting distracted exploring every ruin and catacomb. This DLC is massive.",
                },
                {
                    "commenter": "mayacodes",
                    "content": "The Backhand Blades are the most fun I've had with a weapon in any Souls game. The moveset feels like you're playing a character action game.",
                },
            ],
        },
        {
            "quiblet_idx": 1,
            "poster": "mayacodes",
            "title": "Indie games are carrying the industry right now",
            "content": (
                "<p>While AAA studios are playing it safe with sequels and microtransactions, indie devs are innovating.</p>"
                "<ul>"
                "<li><b>Balatro</b> — who knew a poker roguelike could be this addictive?</li>"
                "<li><b>Animal Well</b> — a masterclass in atmosphere and discovery.</li>"
                "<li><b>Hades II</b> — somehow improving on perfection.</li>"
                "</ul>"
                "<p>Support your local indie dev!</p>"
            ),
            "comments": [
                {
                    "commenter": "noahbuilds",
                    "content": 'Balatro consumed my entire weekend. I told myself "one more run" about fourteen times. The way jokers synergize is just *chef\'s kiss*.',
                    "reply": {
                        "commenter": "mayacodes",
                        "content": "The Hologram + Blueprint combo is absurd. I had a run where every hand was scoring 10 million chips by ante 6.",
                    },
                },
                {
                    "commenter": "liamtech",
                    "content": "Don't sleep on **Caves of Qud** either. It's technically been in early access forever but the 1.0 release is shaping up to be one of the deepest RPGs ever made.",
                },
                {
                    "commenter": "sofiascripts",
                    "content": "Animal Well blew my mind. No hand-holding, no quest markers, just pure exploration. I spent an hour staring at a wall before realizing there was a hidden passage.",
                },
            ],
        },
        {
            "quiblet_idx": 1,
            "poster": "liamtech",
            "title": "Is cloud gaming finally viable?",
            "content": (
                "<p>I tried <b>GeForce Now</b> on a 100 Mbps fiber connection and honestly — I couldn't tell the difference from local hardware.</p>"
                "<h2>Points to consider</h2>"
                "<ol>"
                "<li><b>Latency</b> — still the biggest hurdle, but it's improving fast.</li>"
                "<li><b>Ownership</b> — if the service dies, do you lose the game?</li>"
                "<li><b>Subscription fatigue</b> — yet another monthly bill.</li>"
                "</ol>"
                "<p>Are you ready to sell your GPU?</p>"
            ),
            "comments": [
                {
                    "commenter": "noahbuilds",
                    "content": "Tried it for single-player games and it's great. But for competitive shooters the extra 20-30 ms of latency is noticeable. I'll keep my GPU for now.",
                    "reply": {
                        "commenter": "liamtech",
                        "content": "Yeah that's fair. For competitive stuff every millisecond counts. For my Stardew Valley addiction though? Cloud is perfect.",
                    },
                },
                {
                    "commenter": "sofiascripts",
                    "content": "The ownership question is the dealbreaker for me. I like knowing my library is mine. Steam's offline mode means I can play even if the internet goes down.",
                },
                {
                    "commenter": "mayacodes",
                    "content": "I live in a rural area with 20 Mbps DSL. Cloud gaming is a non-starter for me. Until infrastructure catches up everywhere, it's still a luxury.",
                },
            ],
        },
        # ── Philosophy ───────────────────────
        {
            "quiblet_idx": 2,
            "poster": "sofiascripts",
            "title": "The Trolley Problem in the age of Autonomous Vehicles",
            "content": (
                "<p>The classic ethical dilemma is no longer just for textbooks. As we program self-driving cars, we are essentially <b>codifying morality</b>.</p>"
                "<ol>"
                "<li>Should the car protect the driver at all costs?</li>"
                "<li>Should it minimize the total number of casualties?</li>"
                "<li>What if the choice is between a pet and a person?</li>"
                "</ol>"
                "<p><b>We are the architects of silicon ethics.</b></p>"
            ),
            "comments": [
                {
                    "commenter": "noahbuilds",
                    "content": "The uncomfortable truth is that these cars will statistically save far more lives than they take, even with imperfect ethics. The real trolley problem is choosing *not* to deploy them.",
                    "reply": {
                        "commenter": "sofiascripts",
                        "content": "That's a compelling utilitarian argument. But the families of the statistical few who *are* harmed won't see it that way. There's a difference between a human error and a design decision.",
                    },
                },
                {
                    "commenter": "liamtech",
                    "content": "From a legal standpoint this is a nightmare. If the algorithm chooses to swerve into a wall to avoid pedestrians, who's liable — the car owner, the manufacturer, or the ML engineer who trained the model?",
                },
                {
                    "commenter": "mayacodes",
                    "content": "I think the trolley framing itself is misleading. Real self-driving systems don't make binary choices — they're constantly optimizing trajectories. The ethical question is more about how we define the optimization function.",
                },
            ],
        },
        {
            "quiblet_idx": 2,
            "poster": "liamtech",
            "title": "Stoicism for the Modern Developer",
            "content": (
                '<p><i>"You have power over your mind — not outside events. Realize this, and you will find strength."</i> — Marcus Aurelius</p>'
                "<h2>Applied to software engineering</h2>"
                "<ul>"
                "<li><b>Externals</b> — stakeholder changes, legacy bugs, server outages.</li>"
                "<li><b>Internals</b> — your reaction, your code quality, your focus.</li>"
                "</ul>"
                "<p>Next time a production server goes down at 2 AM, try a stoic breath before reaching for the keyboard.</p>"
            ),
            "comments": [
                {
                    "commenter": "mayacodes",
                    "content": "I started reading Meditations last year and it genuinely changed how I handle on-call rotations. Instead of panicking when a PagerDuty alert fires, I take a breath and triage calmly. Sounds simple but it works.",
                    "reply": {
                        "commenter": "liamtech",
                        "content": "Exactly. The Stoics weren't about suppressing emotions — they were about not letting emotions drive your decisions. Triage first, feel later.",
                    },
                },
                {
                    "commenter": "noahbuilds",
                    "content": "There's also the Stoic concept of *amor fati* — love of fate. That legacy codebase you inherited? It's your opportunity to practice patience and craftsmanship. Reframe the obstacle as the way.",
                },
                {
                    "commenter": "sofiascripts",
                    "content": "Pairing this with deep work practices has been incredible for my productivity. Block distractions, accept what you can't control, and focus entirely on the task at hand.",
                },
            ],
        },
        {
            "quiblet_idx": 2,
            "poster": "noahbuilds",
            "title": "What is Quibble? A philosophical take",
            "content": (
                "<p>Is Quibble just another social platform? Or is it a digital manifestation of the <i>agora</i> — the ancient public forum?</p>"
                "<p>In a world of short-form content and vanishing thoughts, we need a place for <b>deep conversation</b>. "
                "A place where the discussion survives the scroll.</p>"
                "<p>What does it mean to truly be a member of a digital community? Is it lurking? Posting? Or something deeper?</p>"
            ),
            "comments": [
                {
                    "commenter": "sofiascripts",
                    "content": "I think the answer is somewhere between posting and listening. A good community member doesn't just broadcast — they engage thoughtfully with what others share. Quibble's threading model encourages that.",
                    "reply": {
                        "commenter": "noahbuilds",
                        "content": "Well said. The threaded comments are the key differentiator. It's not just a feed — it's a conversation tree. Ideas can branch and evolve.",
                    },
                },
                {
                    "commenter": "liamtech",
                    "content": "Every platform starts with idealism and ends with growth hacking. I hope Quibble stays focused on quality over engagement metrics. The moment you optimize for time-on-site, you lose the soul.",
                },
                {
                    "commenter": "mayacodes",
                    "content": "The agora metaphor is perfect. In Athens the agora was both marketplace and debate hall. Quibble could be both — a place to share projects *and* argue about whether tabs or spaces matter.",
                },
            ],
        },
    ]

    # ──────────────────────────────────────────
    # Main handler
    # ──────────────────────────────────────────
    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")

        # ── 1. Create Quiblets ────────────────
        quiblets = []
        for data in self.QUIBLETS_DATA:
            quiblet, created = Quiblet.objects.get_or_create(
                name=data["name"],
                defaults={
                    "description": data["description"],
                    "title": data["title"],
                    "nsfw": False,
                },
            )
            quiblets.append(quiblet)
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"Created quiblet: q/{quiblet.name}")
                )
                # First user becomes moderator, others join as members
                mod_id = USERS["liamtech"]
                quiblet.members.create(member_id=mod_id, is_moderator=True)
                for username, uid in USERS.items():
                    if uid != mod_id:
                        quiblet.members.create(member_id=uid)
            else:
                self.stdout.write(f"Quiblet q/{quiblet.name} already exists.")

        # ── 2. Create Quibs ───────────────────
        created_quibs = []
        for data in self.QUIBS_DATA:
            quiblet = quiblets[data["quiblet_idx"]]
            poster_id = USERS[data["poster"]]

            quib = Quib.objects.create(
                quiblet=quiblet,
                poster_id=poster_id,
                title=data["title"],
                content=data["content"],
                status=Quib.Status.APPROVED,
                is_published=True,
            )
            created_quibs.append((quib, data))
            self.stdout.write(f'  Created quib: "{quib.title}" by {data["poster"]}')

        # ── 3. Create Comments & Replies ──────
        for quib, data in created_quibs:
            for c in data["comments"]:
                commenter_id = USERS[c["commenter"]]

                # Top-level comment
                comment = Comment.objects.create_child(
                    parent=None,
                    quib=quib,
                    commenter_id=commenter_id,
                    content=c["content"],
                )
                # Auto-upvote own comment
                CommentVote.objects.create(
                    comment=comment, voter_id=commenter_id, value=1
                )

                # Reply (if present)
                if "reply" in c:
                    r = c["reply"]
                    reply_id = USERS[r["commenter"]]
                    reply = Comment.objects.create_child(
                        parent=comment,
                        quib=quib,
                        commenter_id=reply_id,
                        content=r["content"],
                    )
                    CommentVote.objects.create(
                        comment=reply, voter_id=reply_id, value=1
                    )

            # ── 4. Quib votes ─────────────────
            # Simulate organic voting: each user has a chance to vote
            for uid in set(USER_IDS):
                if random.random() > 0.25:
                    QuibVote.objects.create(
                        quib=quib,
                        voter_id=uid,
                        value=random.choice([1, 1, 1, -1]),  # skew towards upvotes
                    )

        self.stdout.write(self.style.SUCCESS("\nDatabase seeded successfully!"))
